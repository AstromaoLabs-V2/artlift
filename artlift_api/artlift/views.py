from rest_framework import viewsets, generics, permissions
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.generics import RetrieveAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

from .models import Artist, User, APIKey, Artwork
from .serializers import ArtistSerializer, UserSerializer, APIKeySerializer, ArtworkSerializer
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


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-joined_date')
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save()


# This is for create and read
class UserListCreateView(generics.ListCreateAPIView):
    queryset = User.objects.all().order_by("-joined_date")
    serializer_class = UserSerializer
    # permission_classes = [IsAuthenticated] //can be switched here
    # authentication_classes = [JWTAuthentication]
    permission_classes = [HasAPIKey]

    # def get(self, request):
    #     return Response({"status": "ok"})


# This is for read, update and delete
class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

class ArtistListView(APIView):

    permission_classes = [HasAPIKey]

    def get(self, request):
        artists = Artist.objects.all()
        return Response(ArtistSerializer(artists, many=True).data)

class ArtistDetailView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        artist = get_object_or_404(Artist, pk=pk)
        return Response(ArtistSerializer(artist).data)
    
class ArtworkListView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    # permission_classes = [HasAPIKey]
    def get(self, request):
        qs = Artwork.objects.filter(is_active=True)
        return Response(ArtworkSerializer(qs, many=True).data)

    def post(self, request):
        print("USER:", request.user)
        print("TYPE:", type(request.user))
        artist, _ = Artist.objects.get_or_create(user=request.user)

        serializer = ArtworkSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(artist=artist)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
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
