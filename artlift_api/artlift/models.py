import secrets
from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class APIKey(models.Model):
    name = models.CharField(max_length=100)
    key = models.CharField(max_length=64, unique=True, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    revoked = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if not self.key:
            self.key = secrets.token_hex(32)  
        return super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({'revoked' if self.revoked else 'active'})"

class User(AbstractUser):
    joined_date = models.DateTimeField(auto_now_add=True)

    def __self__(self):
        return self.username

class Artist(models.Model): 
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="artist")
    last_name = models.CharField(max_length=255)
    first_name = models.CharField(max_length=255)
    address = models.CharField(blank=True, max_length=255)
    about = models.TextField(blank=True)
    img = models.URLField(blank=True)
    bg = models.URLField(blank=True)
    accept_commisions = models.BooleanField(default=True)
    website_URL = models.TextField(blank=True)
    social_links = models.TextField(blank=True)
    is_verified = models.BooleanField(default=False)

    def __self__(self):
         return f"{self.user.username} - Artist"

class Artwork(models.Model):
    artist = models.ForeignKey(Artist, related_name="artworks", on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    size = models.CharField(max_length=255)
    img = models.URLField()
    description = models.TextField(blank=True)
    is_popular = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)

    def __self__(self):
        return self.title
    
class ArtworkDetails(models.Model):
    artwork = models.OneToOneField(Artwork, on_delete=models.CASCADE, related_name="details")
    about = models.TextField(blank=True)
    mood = models.CharField(max_length=255, blank=True)
    medium = models.CharField(max_length=255, blank=True)
    subject = models.CharField(max_length=255, blank=True)
    art_styles = models.CharField(max_length=255, blank=True)
    year_created = models.IntegerField(blank=True)
    
    def __self__(self):
        return self.subject
    

class Follow(models.Model):
    follower = models.ForeignKey(User, on_delete=models.CASCADE, related_name="following")
    following = models.ForeignKey(User, on_delete=models.CASCADE, related_name="followers")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("follower", "following") #this is a test i've read this from django meta options

    def __str__(self): 
        return f"{self.followers} → {self.following}"

class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE) 
    artwork = models.ForeignKey(Artwork, on_delete=models.CASCADE,related_name='likes')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "artwork") 


class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    artwork = models.ForeignKey(Artwork, on_delete=models.CASCADE, related_name="comments")
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    # this is for threaded reply. i'll try this before the comment like -kai
    parent = models.ForeignKey(
        "self",
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name="replies"
    )

    def __str__(self):
        return f"{self.user} commented on {self.artwork}"
    
class CartItem(models.Model):
    buyer = models.ForeignKey(User, on_delete=models.CASCADE, related_name="cart_items")
    artwork = models.ForeignKey(Artwork, on_delete=models.CASCADE)
    quantity = models.PositiveBigIntegerField(default=1)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('buyer', 'artwork')

    def __str__(self):
        return f"{self.buyer.username} - {self.artwork.title}"
    
    
class Order(models.Model):
    stripe_session_id = models.CharField(max_length=255) #i'll try USD first as currency as in documentation
    buyer = models.ForeignKey(User, on_delete=models.CASCADE)
    artwork = models.ForeignKey(Artwork, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    artist_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    platform_fee = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True) #i don't know how to estimate for this but i've seen like this from upwork.-kai
    status = models.CharField(max_length=50, choices=[
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
        ('canceled', 'Canceled')
    ],
    default='pending'
    ) #will be fixed status for the mean time -kai
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order {self.id} - {self.buyer.username}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    artwork = models.ForeignKey(Artwork, on_delete=models.SET_NULL, null=True)
    artist = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="sold_items")
    price = models.DecimalField(max_digits=10, decimal_places=2) 
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.artwork.title} (x{self.quantity})"