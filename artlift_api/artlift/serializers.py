from rest_framework import serializers
from django.contrib.auth import get_user_model

from .models import User, Artist, Artwork, APIKey, ArtworkDetails, Follow, Like, Comment

class APIKeySerializer(serializers.ModelSerializer):
    class Meta:
        model = APIKey
        fields = '__all__'
        
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, min_length=8)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User(**validated_data)
        if password:
            user.set_password(password)
        user.save()
        return user
    
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance

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
    likes_count = serializers.SerializerMethodField()

    class Meta:
       model  = Artwork
       fields = [
            'id',
            'artist',
            'title',
            'size',
            'img',
            'description',
            'is_popular',
            'is_active',
            'details',
            'likes_count',  
        ]
    
    def get_likes_count(self, obj):
        return obj.likes.count()

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
    

class LikeSerializer(serializers.ModelSerializer):
    user_last_name = serializers.SerializerMethodField()
    artwork_title = serializers.SerializerMethodField()

    class Meta:
        model = Like
        fields = ['id','user', 'user_last_name', 'artwork','artwork_title', 'created_at']
        read_only_fields = ('user', 'artwork')

    def get_user_last_name(self, obj):
        return obj.user.username
    
    def get_artwork_title(self, obj):
        return obj.artwork.title

class CommentSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    replies = serializers.SerializerMethodField()
    user_img = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ["id", "user", "user_img", "text", "created_at", "replies", "parent"]

    def get_replies(self, obj):
        qs = obj.replies.all().order_by("created_at")
        return CommentSerializer(qs, many=True).data
    
    def get_user_img(self, obj):
        return obj.user.artist.img


class CommentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ["text", "parent"]
