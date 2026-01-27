from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User, Artist

@receiver(post_save, sender=User)
def create_artist_profile(sender, instance, created, **kwargs):
    if created:
        Artist.objects.create(
            user=instance,
            img="",
            bg=""
        )