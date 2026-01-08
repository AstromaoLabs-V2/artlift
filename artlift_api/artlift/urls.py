from rest_framework_simplejwt.views import TokenObtainPairView

from django.urls import path
from .views import ArtistDetailView, ArtistListView, UserDetailView, UserListCreateView, APIKeyCreate, APIKeyList, APIKeyDetail, ArtworkListView, ArtworkDetailView

urlpatterns = [
    path("keys/", APIKeyList.as_view(), name="key-list"),
    path("keys/create/", APIKeyCreate.as_view(), name="key-create"),
    path("keys/<str:key>/", APIKeyDetail.as_view, name="key-detail"),

    path("login/", TokenObtainPairView.as_view(), name="login"),
    path("users/", UserListCreateView.as_view(), name="users"),
    path("users/<int:pk>/", UserDetailView.as_view(), name="user-detail"),
    
    path("artists/", ArtistListView.as_view(), name="artist-list"),
    path("artist/<int:pk>/", ArtistDetailView.as_view(), name="artist-detail"),

    path("artworks/", ArtworkListView.as_view(), name="artwork-list"),
    path("artworks/<int:pk>/", ArtworkDetailView.as_view(), name="artwork-detail"),

]


#verify user
