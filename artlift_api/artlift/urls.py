from rest_framework_simplejwt.views import TokenObtainPairView

from django.urls import path
from .views import ArtistDetailView, ArtistListView, FollowView, LikeView, LikesView, UserDetailView, UserFollowersView, UserFollowingView, UserListCreateView, APIKeyCreate, APIKeyList, APIKeyDetail, ArtworkListView, ArtworkDetailView, DiscoverView

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
    path("artwork/<int:pk>/", ArtworkDetailView.as_view(), name="artwork-detail"),

    path("discover/", DiscoverView.as_view(), name="discover"),

    #follow urls -kai
    path("user/<int:pk>/followers/",UserFollowersView.as_view(), name="followers"),
    path("user/<int:pk>/following/",UserFollowingView.as_view(), name="following"),
    path("follow/", FollowView.as_view(), name="follow"),

    #like
    path("artwork/<int:pk>/likes", LikesView.as_view(), name="likes"),
    path("like/", LikeView.as_view(), name="like"),

]


#verify user
