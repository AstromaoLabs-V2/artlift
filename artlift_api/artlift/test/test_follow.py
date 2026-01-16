from rest_framework.test import APITestCase, APIClient
from django.contrib.auth import get_user_model
from artlift.models import Artist, Follow

User = get_user_model()

class FollowAPITest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="kai", password="Hehe123@")
        self.other_user = User.objects.create_user(username="sota", password="Hehe123@")

        self.artist = Artist.objects.create(
            user=self.other_user,
            first_name="Sota",
            last_name="Test",
            accept_commisions=True,
            is_verified = True
        )

        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_follow(self):
        response = self.client.post("follow/", {"user_id": self.user.id}, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Follow.objects.count(), 1)