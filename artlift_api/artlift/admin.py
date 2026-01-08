from django.contrib import admin
from .models import User, APIKey

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username','email')

@admin.register(APIKey)
class APIKeyAdmin(admin.ModelAdmin):
    list_display = ('id','name','key','revoked','created_at')
    readonly_fields = ('key','created_at')