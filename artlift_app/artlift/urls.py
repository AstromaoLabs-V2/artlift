

from django.urls import path
from .views import ArtistDetailView, ArtistListView, ArtworkCommentCreate, ArtworkCommentList, CommentDelete, CommentReplyCreate, CurrentArtistView, FollowStatusView, FollowView,LikeView, LikesView, UserDetailView, ArtistFollowersView, ArtistFollowingView, UserListCreateView, APIKeyCreate, APIKeyList, APIKeyDetail, ArtistCreateView, ArtworkListView, ArtworkDetailView, DiscoverView, LoginView, LogoutView, AddToCartView, CartListView, CurrentUserView
from rest_framework_simplejwt.views import TokenVerifyView

urlpatterns = [
    path("keys/", APIKeyList.as_view(), name="key-list"),
    path("keys/create/", APIKeyCreate.as_view(), name="key-create"),
    path("keys/<str:key>/", APIKeyDetail.as_view, name="key-detail"),

    # path("login/", TokenObtainPairView.as_view(), name="login"),
    path("signup/", UserListCreateView.as_view(), name="users"),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("auth/verify/", TokenVerifyView.as_view()),
    
    # path("users/", UserListCreateView.as_view(), name="users"), #made this to signup -kai
    path("users/<uuid:pk>/", UserDetailView.as_view(), name="user-detail"),
    path("current_user/", CurrentUserView.as_view(), name="current-user"),
    path('artist/me/', CurrentArtistView.as_view(), name='current-artist'), 
    
    path("artists/", ArtistListView.as_view(), name="artist-list"),
    path("artist/create/", ArtistCreateView.as_view(), name="artist-create"),
    path("artist/<uuid:pk>/", ArtistDetailView.as_view(), name="artist-detail"),

    path("artworks/", ArtworkListView.as_view(), name="artwork-list"),
    path("artwork/<int:pk>/", ArtworkDetailView.as_view(), name="artwork-detail"), #here you will get artwork details also methods: GET specific artwork by id, edit, delete 

    path("discover/", DiscoverView.as_view(), name="discover"),

    #follow urls -kai
    path("artist/<uuid:pk>/followers/",ArtistFollowersView.as_view(), name="followers"),
    path("artist/<uuid:pk>/following/",ArtistFollowingView.as_view(), name="following"),
    path("artist/<uuid:pk>/follow/", FollowView.as_view(), name="user-follow"),
    path("artist/<uuid:pk>/follow-status/", FollowStatusView.as_view(), name="follow-status"),
    

    #like
    path("artwork/<int:pk>/likes", LikesView.as_view(), name="likes"),
    path("like/", LikeView.as_view(), name="like"),

    #comment tring to work this
    path("artwork/<int:artwork_id>/comments/", ArtworkCommentList.as_view()),
    path("artwork/<int:artwork_id>/comments/create/", ArtworkCommentCreate.as_view()),
    path("comments/<int:pk>/delete/", CommentDelete.as_view()),
    path("comments/<int:comment_id>/reply/", CommentReplyCreate.as_view()),

    path("cart/add/", AddToCartView.as_view(), name="add-cart"),
    path("cart/", CartListView.as_view(), name="cart"),

    
]


#verify user
