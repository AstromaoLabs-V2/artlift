import os
from rest_framework import viewsets, generics, permissions
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.generics import RetrieveAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from rest_framework.parsers import MultiPartParser, FormParser
import uuid
import mimetypes

from supabase import create_client, Client

from .models import Artist, Follow, Like, User, APIKey, Artwork, Comment
from .serializers import ArtistSerializer, CommentCreateSerializer, CommentSerializer, FollowerSerializer, FollowingSerializer, LikeSerializer, UserSerializer, APIKeySerializer, ArtworkSerializer
from .permissions import HasAPIKey

#views for APIKeys. feel free to ask me. -kai
class APIKeyCreate(APIView): #this is for API i'm testing this first -kai
    # permission_classes = [IsAdminUser]
    authentication_classes = []
    permission_classes = [HasAPIKey]

    def post(self, request):
        serializer = APIKeySerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class APIKeyList(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        keys = APIKey.objects.all()
        serializer = APIKeySerializer(keys, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class APIKeyDetail(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, key):
        try: 
            api_key = APIKey.objects.get(key=key)
            serializer = APIKeySerializer(api_key)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except APIKey.DoesNotExist:
            return Response({"error": "API key not found"}, status=status.HTTP_404_NOT_FOUND)
        
    def delete(self, request, key):
        try:
            api_key = APIKey.objects.get(key=key)
            return Response({"message": "API key deleted"}, status=status.HTTP_204_NO_CONTENT)
        except APIKey.DoesNotExist:
            return Response({"error": "API key not found"}, status=status.HTTP_404_NOT_FOUND)

class UserListCreateView(generics.ListCreateAPIView):
    permission_classes = [AllowAny]

    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(UserSerializer(user).data, status=201)
        return Response(serializer.errors, status=400)

class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        user = get_object_or_404(User, pk=pk)
        serializer = UserSerializer(user)
        return Response(serializer.data)
    
    def patch(self, request, pk):
        user = get_object_or_404(User, pk=pk)
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            user = serializer.save()
            return Response(UserSerializer(user).data)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        user = get_object_or_404(User, pk=pk)
        user.delete()
        return Response(status=204)
        
class ArtistListView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        artists = Artist.objects.all()
        return Response(ArtistSerializer(artists, many=True).data)
    
class ArtistCreateView(APIView):

    permission_classes = [IsAuthenticated]  

    def post(self, request):
        img_file = request.FILES.get("file")
        bg_file = request.FILES.get("file2")
        
        user=request.user

        if hasattr(user, "artist"):
            return Response({"detail": "Artist profile already exists."}, status=status.HTTP_400_BAD_REQUEST)

        img_url = upload_to_supabase(img_file) if img_file else ""
        bg_url = upload_to_supabase(bg_file) if bg_file else ""

        artist = Artist.objects.create(
            user = user,
            img = img_url,
            bg = bg_url
        )

        serializer = ArtistSerializer(artist)
        return Response(serializer.data, status=201)


class ArtistDetailView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        artist = get_object_or_404(Artist, pk=pk)
        return Response(ArtistSerializer(artist).data)
    
    def patch(self, request, pk):
        artist = get_object_or_404(Artist, pk=pk)

        img_file = request.FILES.get('img')
        bg_file = request.FILES.get('bg')

        data = request.data.copy()

        if img_file:
            data['img'] = upload_to_supabase(img_file)

        if bg_file:
            data['bg'] = upload_to_supabase(bg_file)

        serializer = ArtistSerializer(artist, data=data, partial=True)
     

        # serializer = ArtistSerializer(artist, data=request.data, partial=True)
        
        if serializer.is_valid():
            artist = serializer.save()
    
            artist.save()
            return Response(ArtistSerializer(artist).data, status=200)
        return Response(serializer.errors, status=400)
    
    def delete(self, request, pk):
        artist = get_object_or_404(Artist, pk=pk)
        artist.delete()
        return Response(status=204)
    
class ArtworkListView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    # permission_classes = [IsAuthenticated]
    permission_classes = [AllowAny]

    def get(self, request):
        qs = Artwork.objects.filter(is_active=True)
        return Response(ArtworkSerializer(qs, many=True).data)

    def post(self, request):
        file = request.FILES.get("file")  
        title = request.data.get("title")
        size = request.data.get("size", "") 
        if not file or not title:
            return Response({"error": "Title and file are required"}, status=400)

        artist, _ = Artist.objects.get_or_create(user=request.user)

        img_url = upload_to_supabase(file) 

        artwork = Artwork.objects.create(
            artist=artist,
            title=title,
            size=size,
            img=img_url
        )

        serializer = ArtworkSerializer(artwork)
        return Response(serializer.data, status=201)


class ArtworkDetailView(APIView):
    # permission_classes = [HasAPIKey]

    def get(self, request, pk):
        artwork = get_object_or_404(Artwork, pk=pk)
        return Response(ArtworkSerializer(artwork).data)
    
    def patch(self, request, pk):
        artwork = get_object_or_404(Artwork, pk=pk)

        if artwork.artist != request.user and not request.user.is_staff:
            return Response({"detail": "Forbidden"}, status=403)

        serializer = ArtworkSerializer(artwork, request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        
        return Response(serializer.errors, status=400)
    
    def delete(self, request, pk):
        artwork = get_object_or_404(Artwork, pk=pk)

        if artwork.artist != request.user and not request.user.is_staff:
            return Response({"detail": "Forbidden"}, status=403)

        artwork.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class DiscoverView(APIView):

    permission_classes = [AllowAny]
    def get(self, request):
        artists = list(
            Artist.objects.select_related("user")
            .order_by('?')[:10]
            .values('id', 'user__username', 'img'))
        
        artworks = list(
            Artwork.objects
            .select_related("artist")
            .order_by('?')[:10]
            .values('id', 'title', 'img', "artist__user__username")
        )

        return Response({
            "artists" : artists,
            "artworks" : artworks
        })
    
#this supabase for the DB conn -kai
supabase: Client = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))

def upload_to_supabase(file):
    filename = f"{uuid.uuid4()}.{file.name.split('.')[-1]}"
    content_type, _ = mimetypes.guess_type(filename)

    supabase.storage.from_("artworks").upload(
        path=filename,
        file=file.read(),
        file_options={"content-type": content_type},
    )
    #i forgot to make it media for  general rather than artworks folder HAHA

    public_url = supabase.storage.from_("artworks").get_public_url(filename)
    return public_url

class UserFollowersView(APIView):

    def get(self, request, pk):
        followers = Follow.objects.filter(
            following_id=pk
        ).select_related("follower")

        serializer = FollowerSerializer(followers, many=True)
        return Response(serializer.data)

class UserFollowingView(APIView):

    def get(self, request, pk):
        following = Follow.objects.filter(
            follower_id=pk
        ).select_related("following")

        serializer = FollowingSerializer(following, many=True)
        return Response(serializer.data)

class FollowView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        follower = request.user
        following_id = request.data.get("user_id")

        if not following_id:
            return Response({"error": "user_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        if str(follower.id) == str(following_id):
            return Response({"error": "Cannot follow yourself"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            following = User.objects.get(id=following_id)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        
        follow, created = Follow.objects.get_or_create(follower=follower, following=following)

        if not created:
            return Response({"message": "Already following"}, status=status.HTTP_200_OK)

        return Response({"message": f"You are now following {following.username}"}, status=status.HTTP_201_CREATED)
    
    def delete(self, request):
        follower = request.user
        following_id = request.data.get("user_id")

        if not following_id:
            return Response({"error": "user_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            following = User.objects.get(id=following_id)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        try:
            follow = Follow.objects.get(follower=follower, following=following)
            follow.delete()
            return Response({"message": f"You unfollowed {following.username}"}, status=status.HTTP_200_OK)
        except Follow.DoesNotExist:
            return Response({"message": "You are not following this user"}, status=status.HTTP_400_BAD_REQUEST)
        
class LikesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        artwork = Artwork.objects.get(pk=pk)
        likes = Like.objects.filter(artwork=artwork).select_related('user', 'artwork')

        serializer = LikeSerializer(likes, many=True, context={'request': request, 'artwork': artwork})
        user_liked = likes.filter(user=request.user).exists()
        likes_count = likes.count()
        # return Response(serializer.data)
        
        return Response({
            "logged_in_user": {
                "id": request.user.id,
                "username": request.user.username,
                "email": request.user.email
            },
            "likes": serializer.data,
            "user_liked": user_liked,
            "likes_count": likes_count,
        })

class LikeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        artwork_id = request.data.get('artwork_id')  

        if not artwork_id:
            return Response({"error": "artwork_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            artwork = Artwork.objects.get(pk=artwork_id)
        except Artwork.DoesNotExist:
            return Response({"error": "Artwork not found"}, status=404)

        # this is unlike testing. took too much time here HAHA -kai
        like, created = Like.objects.get_or_create(user=user, artwork=artwork)
        if not created:
            like.delete()
            return Response({"message": f"You unliked {artwork.title}"}, status=200)

        return Response({"message": f"You liked {artwork.title}"}, status=201)

class ArtworkCommentList(APIView):
    permission_classes = [AllowAny]

    def get(self, request, artwork_id):
        comments = Comment.objects.filter(
            artwork_id=artwork_id,
            parent__isnull=True
        ).order_by("-created_at")

        return Response(CommentSerializer(comments, many=True).data)

class ArtworkCommentCreate(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, artwork_id):
        artwork = get_object_or_404(Artwork, pk=artwork_id)

        serializer = CommentCreateSerializer(data=request.data)
        if serializer.is_valid():
            comment = serializer.save(
                user=request.user,
                artwork=artwork
            )
            return Response(CommentSerializer(comment).data, status=201)

        return Response(serializer.errors, status=400)
    
class CommentDelete(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        comment = get_object_or_404(Comment, pk=pk)

        if comment.user != request.user and not request.user.is_staff:
            return Response({"detail": "Forbidden"}, status=403)

        comment.delete()
        return Response(status=204)
    
class CommentReplyCreate(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, comment_id):
        parent = get_object_or_404(Comment, pk=comment_id)

        serializer = CommentCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(
                user = request.user,
                artwork = parent.artwork,
                parent = parent,
            )
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

