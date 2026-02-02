import secrets
import uuid
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
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        unique=True
    )
    joined_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.username

class Artist(models.Model): 
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        unique=True
    )
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

    def __str__(self):
         return f"{self.user.username} - Artist"

class Artwork(models.Model):
    artist = models.ForeignKey(Artist, related_name="artworks", on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    size = models.CharField(max_length=255)
    img = models.URLField()
    description = models.TextField(blank=True)
    is_popular = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)
    # price = models.BigIntegerField

    def __str__(self):
        return self.title
    
class ArtworkDetails(models.Model):
    artwork = models.OneToOneField(Artwork, on_delete=models.CASCADE, related_name="details")
    about = models.TextField(blank=True)
    mood = models.CharField(max_length=255, blank=True)
    medium = models.CharField(max_length=255, blank=True)
    subject = models.CharField(max_length=255, blank=True)
    art_styles = models.CharField(max_length=255, blank=True)
    year_created = models.IntegerField(blank=True)
    
    def __str__(self):
        return self.subject
    

class Follow(models.Model):
    follower = models.ForeignKey(Artist, on_delete=models.CASCADE, related_name="following")
    following = models.ForeignKey(Artist, on_delete=models.CASCADE, related_name="followers")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("follower", "following") #this is a test i've read this from django meta options

    def __str__(self): 
        return f"{self.follower.username} → {self.following.username}"
    
# class ArtistFollow(models.Model):
#     follower = models.ForeignKey(User, on_delete=models.CASCADE, related_name='followed_artists')
#     artist = models.ForeignKey(Artist, on_delete=models.CASCADE, related_name='followers')
#     created_at = models.DateTimeField(auto_now_add=True)

#     class Meta:
#         unique_together = ('follower', 'artist')
#         ordering = ['-created_at']

#     def __str__(self):
#         return f"{self.follower.username} follows {self.artist.name}"

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
    
    
