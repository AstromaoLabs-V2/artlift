from rest_framework import viewsets, permissions, generics
from .models import User
from .serializers import UserSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-joined_date')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save()


#this is for create and read
class UserListCreateView(generics.ListAPIView):
    queryset = User.objects.all().order_by("-joined_date")
    serializer_class = UserSerializer
#this is for read, update and delete
class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer