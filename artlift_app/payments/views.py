from django.conf import settings
from django.db import connection
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action, api_view
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.shortcuts import render
from django.http import HttpResponse
import stripe

from artlift_app.payments.models import Order, Payment, Refund
from artlift_app.payments.serializers import CheckoutSessionSerializer, OrderSerializer

stripe.api_key = settings.STRIPE_SECRET_KEY

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['post'])
    def create_checkout_session(self, request):
        serializer = CheckoutSessionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        artwork_id = serializer.validated_data['artwork_id']
        success_url = serializer.validated_data.get('success_url', f"{settings.FRONTEND_URL}/success")
        cancel_url = serializer.validated_data.get('cancel_url', f"{settings.FRONTEND_URL}/cancel")

        with connection.cursor() as cursor:
            cursor.execute("""
                           SELECT id, title, price, currency, artist_id, img
                           FROM artworks 
                           WHERE id = %s and is_active = TRUE AND is_sold = FALSE
                           """, [str(artwork_id)])
            artwork = cursor.fetchone()
        
        if not artwork:
            return Response({
                'error': 'Artwork not found or not active.'
            }, status=404)
        
        artwork_data = {
            'id': artwork[0],
            'title': artwork[1],
            'price': float(artwork[2]),
            'currency': artwork[3],
            'artist_id': artwork[4],
            'img': artwork[5]
        }

        try:
            checkout_session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[{
                    'price_data':{
                    'currency': artwork_data['currency'].lower(),
                    'unit_amount': int(artwork_data['price'] * 100),
                    'product_data': {
                        'name': artwork_data['title'],
                        'images': [artwork_data['img']] if artwork_data['img'] else [],
                    },
                    },
                    'quantity': 1,
                }],
                mode='payment',
                success_url=success_url + '?session_id={CHECKOUT_SESSION_ID}',
                cancel_url=cancel_url,
                metadata={
                    'artwork_id': str(artwork_id),
                    'artist_id': str(artwork_data['artist_id']),
                    'user_id': str(request.user.id),
                },
            )

            order = Order.objects.create(
                user=request.user,
                artist_id=artwork_data['artist_id'],
                artwork_id=artwork_id,
                total_amount=artwork_data['price'],
                currency=artwork_data['currency'],
                status='pending',
                stripe_checkout_session_id=checkout_session.id,
            )

            return Response({
                'sessionId' : checkout_session.id,
                'url': checkout_session.url,
                'order_id': str(order.id)
            })
        
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=404)
    
    @action(detail=True, method=['post'])
    def refund(self, request , pk=None):
        order = self.get_object()

        if order.status not in ['completed']:
            return Response(
                {
                    'error': 'Only completed orders can be refunded'
                }, status=400
            )
        
        try:
            payment = order.payments.filter(status='succeeded').first()
            if not payment:
                return Response(
                    {
                        'error': 'No successful payment found.'
                    }, status=400
                )
            
            refun = stripe.Refund.create(
                payment_intent=payment.stripe_payment_intent_id, reason=request.data.get('reason', 'requested_by_customer')
            )

            Refund.objects.create(
                order=order,
                payment=payment,
                stripe_refund_id=refund.id,
                amount=order.total_amount, 
                currency = order.currency,
                reason = request.data.get('reason', ''),
                status='pending'
            )

            order.status = 'refunded'
            order.save()
            
            return Response({'status': 'refund initiated'})
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=400
            )
@csrf_exempt
@require_http_methods(["POST"])
def stripe_webhook(request):
    payload = request.body
    sig_header  = request.META.get('HTTP_STRIPE_SIGNATURE')

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
    except ValueError as e:
        return HttpResponse(status=400)
    except stripe.error.SignatureVerificationError as e:
        return HttpResponse(status=400)

    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        handle_checkout_session_completed(session)
    elif event['type'] == 'payment_intent.succeeded':
        payment_intent = event['data']['object']
        handle_payment_intent_succeeded(payment_intent)
    
    elif event['type'] == 'payment_intent.payment_failed':
        payment_intent = event['data']['object']
        handle_payment_intent_failed(payment_intent)
    
    elif event['type'] == 'charge.refunded':
        charge = event['data']['object']
        handle_charge_refunded(charge)
    
    return HttpResponse(status=200)

def handle_checkout_session_completed(session):
    try:
        order = Order.objects.create(stripe_checkout_session_id=session.id)

        order.stripe_payment_intent_id = session.payment_intent

        # if session.get('shipping_details'):
        #     shipping = session['shipping_details']
        #     order.shipping_name = shipping.get('name', '')
        #     order.shipping_address_line1 = shipping['address'].get('line1', '')
        #     order.shipping_address_line2 = shipping['address'].get('line2', '')
        #     order.shipping_city = shipping['address'].get('city', '')
        #     order.shipping_state = shipping['address'].get('state', '')
        #     order.shipping_postal_code = shipping['address'].get('postal_code', '')
        #     order.shipping_country = shipping['address'].get('country', '')
        
        if session.get('customer_details'):
            order.shipping_email = session['customer_details'].get('email', '')
        
        order.status = 'processing'
        order.save()
        
        with connection.cursor() as cursor:
            cursor.execute("""
                UPDATE artworks 
                SET is_sold = TRUE, is_active = FALSE
                WHERE id = %s
            """, [str(order.artwork_id)])
        
    except Order.DoesNotExist:
        print(f"Order not found for session {session.id}")

def handle_payment_intent_succeeded(payment_intent):
    try:
        order = Order.objects.get(stripe_payment_intent_id=payment_intent.id)

        payment_method = payment_intent.get('charges', {}).get('data', [{}])[0].get('payment_more_details', {})
        card = payment_method.get('card', {})

        Payment.objects.create(
            order=order,
            stripe_payment_intent_id=payment_intent.id,
            amount=payment_intent.amount / 100,  
            currency=payment_intent.currency.upper(),
            status='succeeded',
            payment_method_type=payment_method.get('type', ''),
            card_last4=card.get('last4', ''),
            card_brand=card.get('brand', ''),
        )

        order.status='completed'
        order.save()

    except Order.DoesNotExist:
        print(f"Order not found for payment intent {payment_intent.id}")

def handle_payment_intent_failed(payment_intent):
    try:
        order = Order.objects.get(stripe_payment_intent_id=payment_intent.id)
        order.status = 'cancelled'
        order.save()
    except Order.DoesNotExist:
        print(f"Order not found for payment intent {payment_intent.id}")

def handle_charge_refunded(charge):
    payment_intent_id = charge.get('payment_intent')
    try:
        order = Order.objects.get(stripe_payment_intent_id=payment_intent_id)
        refund = order.refunds.filter(status='pending').first()
        if refund:
            refund.status = 'succeeded'
            refund.save()
        
        with connection.cursor() as cursor:
            cursor.execute("""
                UPDATE artworks 
                SET is_sold = FALSE, is_available = TRUE
                WHERE id = %s
            """, [str(order.artwork_id)])
            
    except Order.DoesNotExist:
        print(f"Order not found for payment intent {payment_intent_id}")


