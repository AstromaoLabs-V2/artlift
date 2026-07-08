from rest_framework.test import APITestCase, APIClient
from django.contrib.auth import get_user_model
from artlift.models import Artwork, Like

User = get_user_model()

class LikeAPITest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="kai2", password="Hehe123@")
        self.other_user = User.objects.create_user(username="sota2", password="Hehe123@")

        # signals.py already auto-creates an Artist via post_save when a User is
        # created, so update it here rather than creating a second, colliding one.
        self.artist = self.other_user.artist
        self.artist.first_name = "Sota"
        self.artist.last_name = "Test"
        self.artist.accept_commisions = True
        self.artist.is_verified = True
        self.artist.save()

        self.artwork = Artwork.objects.create(
            title="test art",
            size="500x500",
            img="http://example.com",
            artist=self.artist
        )

        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_like_artwork(self):
        response = self.client.post("/like/", {"artwork_id": self.artwork.id}, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Like.objects.count(), 1)

    def test_like_twice(self):
        self.client.post("/like/", {"artwork_id": self.artwork.id}, format="json")
        response = self.client.post("/like/", {"artwork_id": self.artwork.id}, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Like.objects.count(), 0)

    def test_unlike_artwork(self):
        self.client.post("/like/", {"artwork_id": self.artwork.id}, format="json")
        response = self.client.post("/like/", {"artwork_id": self.artwork.id}, format="json")
        self.assertEqual(Like.objects.count(), 0)

    def test_like_requires_auth(self):
        self.client.force_authenticate(user=None) 
        response = self.client.post("/like/", {"artwork_id": self.artwork.id}, format="json")
        self.assertEqual(response.status_code, 401)  

#i got bored then tried this test just to make sure. i passed this test. -kai