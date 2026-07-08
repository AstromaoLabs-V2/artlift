from rest_framework.test import APITestCase, APIClient
from django.contrib.auth import get_user_model
from artlift.models import Follow

User = get_user_model()

class FollowAPITest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="kai", password="Hehe123@")
        self.other_user = User.objects.create_user(username="sota", password="Hehe123@")

        # signals.py already auto-creates an Artist via post_save when a User is
        # created, so update it here rather than creating a second, colliding one.
        self.artist = self.other_user.artist
        self.artist.first_name = "Sota"
        self.artist.last_name = "Test"
        self.artist.accept_commisions = True
        self.artist.is_verified = True
        self.artist.save()

        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_follow(self):
        # FollowView takes the artist to follow via the URL pk, using
        # request.user to look up the follower's own Artist profile.
        response = self.client.post(f"/artist/{self.artist.id}/follow/", format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Follow.objects.count(), 1)