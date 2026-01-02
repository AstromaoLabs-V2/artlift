import secrets
from django.db import models

# Create your models here.
class APIKey(models.Model):
    name = models.CharField(max_length=100),
    key = models.CharField(max_length=64, unique=True, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    revoked = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if not self.key:
            self.key = secrets.token_hex(32)  # 64 hex chars
        return super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({'revoked' if self.revoked else 'active'})"

class User(models.Model):
    userID = models.AutoField(primary_key=True)
    username = models.CharField(max_length=25, unique=True),
    name = models.CharField(max_length=100),
    email = models.EmailField(unique=True),
    img = models.URLField(blank=True, null=True),
    accept_commisions = models.BooleanField(default=False),
    joined_date = models.DateTimeField(auto_now_add=True)

    def __self__(self):
        return self.username

# class Artwork(models.Model):
#     title = models.CharField(225),
