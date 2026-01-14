from rest_framework import serializers
from django.contrib.auth.models import User

from .models import Artist, Artwork, APIKey, ArtworkDetails, Follow

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

class ArtworkDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArtworkDetails
        fields = '__all__'

class ArtworkSerializer(serializers.ModelSerializer):
    artist = ArtistSerializer(read_only = True)
    img = serializers.URLField(read_only=True)
    details = ArtworkDetailsSerializer(read_only=True)

    class Meta:
       model  = Artwork
       fields = '__all__'

class FollowerSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()

    class Meta  :
        model = Follow
        fields = ['user', 'created_at']

    def get_user(self, obj):
        return {
            "id": obj.follower.id,
            "username": obj.follower.username
        }

class FollowingSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()

    class Meta  :
        model = Follow
        fields = ['user', 'created_at']

    def get_user(self, obj):
        return {
            "id": obj.following.id,
            "username": obj.following.username
        }