from rest_framework import serializers
from django.contrib.auth.models import User

from .models import Artist, Artwork, APIKey

class APIKeySerializer(serializers.ModelSerializer):
    class Meta:
        model = APIKey
        fields = '__all__'
        
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class ArtistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Artist
        fields = '__all__'
        read_only_fields = ("artist",)

class ArtworkSerializer(serializers.ModelSerializer):
    artist = ArtistSerializer(read_only = True)

    class Meta:
       model  = Artwork
       fields = '__all__'