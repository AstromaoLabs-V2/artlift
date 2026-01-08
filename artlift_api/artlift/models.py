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
    accept_commisions = models.BooleanField(True)
    website_URL = models.TextField(blank=True)
    social_links = models.TextField(blank=True)
    is_verified = models.BooleanField(False)

    def __self__(self):
        return self.last_name

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