from rest_framework.test import APITestCase, APIClient
from django.contrib.auth import get_user_model

User = get_user_model()


class LoginAPITest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="loginuser", password="Hehe123@")
        self.client = APIClient()

    def test_login_with_correct_credentials_succeeds(self):
        # Goes through the real authenticate() call (unlike force_authenticate,
        # which bypasses it) -- this is what actually exercises the django-axes
        # backend chain and would have hit AxesBackendRequestParameterRequired.
        response = self.client.post(
            "/login/",
            {"username": "loginuser", "password": "Hehe123@"},
            format="json",
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_login_with_wrong_password_returns_400_not_crash(self):
        response = self.client.post(
            "/login/",
            {"username": "loginuser", "password": "wrong-password"},
            format="json",
        )
        self.assertEqual(response.status_code, 400)
