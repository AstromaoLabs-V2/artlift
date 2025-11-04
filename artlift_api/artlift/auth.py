from rest_framework import authentication, exceptions
from .models import APIKey

class ApiKeyAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        api_key = request.header.get('X-API-KEY') or request.META.get('X-API-KEY')
        if not api_key:
            return None
        
        try:
            key_obj = APIKey.objects.get(key=api_key, revoked=False)
        except APIKey.DoesNotExist:
            raise exceptions.AuthenticationFailed('Invalid or revoked API Key')
        
        from django.contrib.auth.models import AnonymousUser
        user = AnonymousUser()
        return (user, key_obj)