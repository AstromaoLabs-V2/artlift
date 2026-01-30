import uuid
from django.db import models

from artlift.models import Artwork, User

class Order(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')

    artist_id = models.ForeignKey(User, on_delete=models.CASCADE)
    artwork_id = models.ForeignKey(Artwork, on_delete=models.CASCADE)

    status = models.CharField(max_length=50, choices=[
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
        ('canceled', 'Canceled')
    ],
    default='pending'
    ) #will be fixed status for the mean time -kai
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD')

    # artist_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    # platform_fee = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True) #i don't know how to estimate for this but i've seen like this from upwork.-kai

    # i added shipping information but not needed yet
    # shipping_name = models.CharField(max_length=255, blank=True)
    # shipping_email = models.EmailField(blank=True)
    # shipping_address_line1 = models.TextField(blank=True)
    # shipping_address_line2 = models.TextField(blank=True)
    # shipping_city = models.CharField(max_length=255, blank=True)
    # shipping_state = models.CharField(max_length=255, blank=True)
    # shipping_postal_code = models.CharField(max_length=50, blank=True)
    # shipping_country = models.CharField(max_length=2, blank=True)

    stripe_payment_intent_id = models.CharField(max_length=255, unique=True, null=True, blank=True)
    stripe_checkout_session_id = models.CharField(max_length=255, unique=True, null=True, blank=True)
    
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'orders'
        ordering = ['-created_at']
        managed = False

    def __str__(self):
         return f"Order {self.id} - ${self.total_amount}"

class Payment(models.Model):
    STATUS_CHOICES = [
        ('requires_payment_method', 'Requires Payment Method'),
        ('requires_confirmation', 'Requires Confirmation'),
        ('processing', 'Processing'),
        ('succeeded', 'Succeeded'),
        ('canceled', 'Canceled'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='payments')

     # this will be payment details idk yet just follwing the docs
    stripe_payment_intent_id = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD')
    status = models.CharField(max_length=50, choices=STATUS_CHOICES)
    payment_method_type = models.CharField(max_length=50, blank=True)

    # card details
    card_last4 = models.CharField(max_length=4, blank=True)
    card_brand = models.CharField(max_length=50, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'payments'
        managed = False

    def __str__(self):
        return f"Payment {self.stripe_payment_intent_id} - {self.status}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    artwork = models.ForeignKey(Artwork, on_delete=models.SET_NULL, null=True)
    artist = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="sold_items")
    price = models.DecimalField(max_digits=10, decimal_places=2) 
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.artwork.title} (x{self.quantity})"

class Refund(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('succeeded', 'Succeeded'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='refunds')
    payment = models.ForeignKey(Payment, on_delete=models.CASCADE, related_name='refunds')
    
    stripe_refund_id = models.CharField(max_length=255, unique=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD')
    reason = models.CharField(max_length=255, blank=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES)
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'refunds'
        managed = False

    def __str__(self):
        return f"Refund {self.stripe_refund_id}"

# class Messages(models.Model):
#     id = models.UUIDField(primary_key=True)
#     sender_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
#     content = models.TextField()
#     attachment_url = models.TextField(blank=True, null=True)
#     created_at = models.DateTimeField(blank=True, null=True)

#     class Meta:
#         db_table = 'messages'