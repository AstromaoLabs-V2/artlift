from datetime import timezone

from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from django.utils.timesince import timesince
from django.utils import timezone

from .models import CartItem, User, Artist, Artwork, APIKey, ArtworkDetails, Follow, Like, Comment

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

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        username = data.get("username")
        password = data.get("password")

        if username and password:
            user = authenticate(username=username, password=password)
            if not user:
                raise serializers.ValidationError("Invalid credentials")
            data["user"] = user
            return data
        else:
            raise serializers.ValidationError("Must include username and password")
        
class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()

    def validate(self, attrs):
        self.token = attrs['refresh']
        return attrs

    def save(self, **kwargs):
        try:
            RefreshToken(self.token).blacklist()
        except TokenError:
            raise serializers.ValidationError("Invalid token or token already blacklisted")
        
class ArtistSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="user.email", read_only=True) 
    user_id = serializers.UUIDField(source="user.id", read_only=True) 
    followers_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()
    joined_date = serializers.DateTimeField(format="%B %Y",source="user.joined_date", read_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = Artist
        fields =  [
            "id",
            "email",          
            "first_name",
            "last_name",
            "address",
            "about",
            "img",
            "bg",
            "accept_commisions",
            "website_URL",
            "social_links",
            "is_verified",
            "followers_count",
            "following_count",
            "joined_date",
            "user_id",
            "user"
        ]
        read_only_fields = ("artist",)
    
    def get_followers_count(self, obj):
         return obj.followers.count()
    
    def get_following_count(self, obj):
         return obj.following.count()

class ArtworkDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArtworkDetails
        fields = '__all__'

class ArtworkSerializer(serializers.ModelSerializer):
    artist = ArtistSerializer(read_only = True)
    img = serializers.URLField(read_only=True)
    details = ArtworkDetailsSerializer(read_only=True)
    likes_count = serializers.SerializerMethodField()
    user_id = serializers.UUIDField(source="user.id", read_only=True) 
    # is_followed_by_current_user = serializers.SerializerMethodField()
    

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
            'user_id',
            # 'is_followed_by_current_user', 
        ]
    
    def get_likes_count(self, obj):
        return obj.likes.count()
    
    # def get_is_followed_by_current_user(self, obj):
    #     request = self.context.get("request")

    #     return Follow.objects.filter(
    #         follower=request.user,
    #         following=obj.user
    #     ).exists()
class BriefArtworkSerializer(serializers.ModelSerializer):
    artist_id = serializers.UUIDField(source="artist.id", read_only=True)
    artist_username = serializers.CharField(source="artist.user.username", read_only=True)
    img = serializers.URLField(read_only=True)
    likes_count = serializers.SerializerMethodField()

    class Meta:
        model = Artwork
        fields = [
            "id",
            "artist_id",
            "artist_username",
            "title",
            "img",
            "likes_count",
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
    created_at_relative = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ["id", "user", "user_img", "text", "created_at", "replies", "parent", "created_at_relative",]

    def get_replies(self, obj):
        qs = obj.replies.all().order_by("created_at")
        return CommentSerializer(qs, many=True).data
    
    def get_user_img(self, obj):
        return obj.user.artist.img
    
    def get_created_at_relative(self, obj):
        now = timezone.now()
        delta = now - obj.created_at

        seconds = int(delta.total_seconds())
        minutes = seconds // 60
        hours = minutes // 60
        days = hours // 24
        months = days // 30
        years = days // 365

        if seconds < 60:
            return f"{seconds}s ago"
        elif minutes < 60:
            return f"{minutes}m ago"
        elif hours < 24:
            return f"{hours}h ago"
        elif days < 30:
            return f"{days}d ago"
        elif months < 12:
            return f"{months}mo ago"
        else:
            return f"{years}y ago"


class CommentCreateSerializer(serializers.ModelSerializer):
    user_img = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields =  ['id', 'text', 'artwork', 'parent', 'user_img' ]
        read_only_fields = ['id', 'user', 'artwork', 'parent']

    def get_user_img(self, obj):
        return obj.user.artist.img
    
    

class CartSerializer(serializers.ModelSerializer):
    # buyer = serializers.HiddenField(default=serializers.CurrentUserDefault())
    username = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ['id', 'buyer', 'username', 'artwork', 'quantity']
    
    def get_username(self, obj):
        return obj.buyer.username

