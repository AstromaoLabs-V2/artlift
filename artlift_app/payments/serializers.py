from rest_framework import serializers

from artlift_app.payments.models import Order, Payment, Refund


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = "__all__" #try all first

class PaymentSerializer(serializers.Serializer):
    class Meta:
        model = Payment
        fields = ['id', 'stripe_payment_intent_id', 'amount', 'currency', 
                  'status', 'payment_method_type', 'card_last4', 'card_brand', 
                  'created_at']
        
class RefundSerializer(serializers.ModelSerializer):
    class Meta:
        model = Refund
        fields = ['id', 'stripe_refund_id', 'amount', 'currency', 
                  'reason', 'status', 'created_at']

class OrderSerializer(serializers.ModelSerializer):
    payments = PaymentSerializer(many=True, read_only=True)
    refunds = RefundSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'artist_id', 'artwork_id', 'status', 
                  'total_amount', 'currency', 'stripe_payment_intent_id', 
                  'stripe_checkout_session_id', 'notes', 'payments', 'refunds',
                  'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']

class CheckoutSessionSerializer(serializers.Serializer):
    artwork_id = serializers.UUIDField()
    success_url = serializers.URLField(required=False)
    cancel_url = serializers.URLField(required=False)