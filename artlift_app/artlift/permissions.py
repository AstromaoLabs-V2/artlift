from rest_framework.permissions import BasePermission
from rest_framework.exceptions import APIException
from django.core.exceptions import ValidationError

from .models import APIKey


class InvalidAPIKey(APIException):
    status_code = 403
    default_detail = "The provided API key has an invalid format."
    default_code = "invalid_api_key_format"


class InactiveAPIKey(APIException):
    status_code = 403
    default_detail = "The provided API key is invalid or inactive."
    default_code = "invalid_or_inactive_api_key"


class HasAPIKey(BasePermission):
    def has_permission(self, request, view):
        api_key = request.headers.get("X-API-KEY")

        print(f"Received API Key: {api_key}")

        if not api_key:
            raise InactiveAPIKey()

        try:
            APIKey.objects.get(key=api_key, revoked=False)
            return True
        except ValidationError:
            raise InvalidAPIKey()
        except APIKey.DoesNotExist:
            raise InactiveAPIKey()
