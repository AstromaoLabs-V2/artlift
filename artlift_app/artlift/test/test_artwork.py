from unittest.mock import patch

from rest_framework.test import APITestCase, APIClient
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from artlift.models import Artwork, ArtworkDetails, Category

User = get_user_model()


def fake_image_file():
    return SimpleUploadedFile("test.png", b"fake-image-bytes", content_type="image/png")


class ArtworkOwnershipAPITest(APITestCase):
    def setUp(self):
        # Artist.objects.create() is not called here directly: signals.py already
        # auto-creates an Artist via post_save whenever a User is created.
        self.user = User.objects.create_user(username="artist1", password="Hehe123@")
        self.other_user = User.objects.create_user(username="artist2", password="Hehe123@")
        self.artist = self.user.artist

        self.artwork = Artwork.objects.create(
            title="Existing artwork",
            size="100x100",
            img="http://example.com/img.png",
            artist=self.artist,
        )
        ArtworkDetails.objects.create(artwork=self.artwork, about="", medium="", subject="", year_created=None)

        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_owner_can_edit_own_artwork(self):
        response = self.client.patch(
            f"/artwork/{self.artwork.id}/",
            {"title": "Updated title"},
            format="multipart",
        )
        self.assertEqual(response.status_code, 200)
        self.artwork.refresh_from_db()
        self.assertEqual(self.artwork.title, "Updated title")

    def test_owner_can_delete_own_artwork(self):
        response = self.client.delete(f"/artwork/{self.artwork.id}/")
        self.assertEqual(response.status_code, 204)
        self.assertFalse(Artwork.objects.filter(id=self.artwork.id).exists())

    def test_non_owner_cannot_edit(self):
        self.client.force_authenticate(user=self.other_user)
        response = self.client.patch(
            f"/artwork/{self.artwork.id}/",
            {"title": "Hacked title"},
            format="multipart",
        )
        self.assertEqual(response.status_code, 403)

    def test_non_owner_cannot_delete(self):
        self.client.force_authenticate(user=self.other_user)
        response = self.client.delete(f"/artwork/{self.artwork.id}/")
        self.assertEqual(response.status_code, 403)
        self.assertTrue(Artwork.objects.filter(id=self.artwork.id).exists())


class ArtworkCreateAPITest(APITestCase):
    def setUp(self):
        # ArtworkListView.post() does Artist.objects.get_or_create(), and signals.py
        # already auto-creates an Artist via post_save, so no manual creation needed here.
        self.user = User.objects.create_user(username="artist3", password="Hehe123@")
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    @patch("artlift.views.upload_to_supabase", return_value="http://fake-cdn.test/test.png")
    def test_create_artwork_without_year_created_succeeds(self, mock_upload):
        response = self.client.post(
            "/artworks/",
            {"title": "No year artwork", "file": fake_image_file()},
            format="multipart",
        )
        self.assertEqual(response.status_code, 201)
        artwork = Artwork.objects.get(title="No year artwork")
        self.assertIsNone(artwork.details.year_created)

    @patch("artlift.views.upload_to_supabase", return_value="http://fake-cdn.test/test.png")
    def test_create_artwork_with_invalid_category_ids_returns_400(self, mock_upload):
        response = self.client.post(
            "/artworks/",
            {"title": "Bad category", "file": fake_image_file(), "category_ids": "abc"},
            format="multipart",
        )
        self.assertEqual(response.status_code, 400)
        self.assertFalse(Artwork.objects.filter(title="Bad category").exists())

    @patch("artlift.views.upload_to_supabase", return_value="http://fake-cdn.test/test.png")
    def test_create_artwork_with_too_many_categories_returns_400(self, mock_upload):
        cats = [Category.objects.create(name=f"Style{i}", type="art_style") for i in range(4)]
        response = self.client.post(
            "/artworks/",
            {
                "title": "Too many cats",
                "file": fake_image_file(),
                "category_ids": [c.id for c in cats],
            },
            format="multipart",
        )
        self.assertEqual(response.status_code, 400)
        self.assertFalse(Artwork.objects.filter(title="Too many cats").exists())

    @patch("artlift.views.upload_to_supabase", return_value="http://fake-cdn.test/test.png")
    @patch("artlift.views.ArtworkDetails.objects.create", side_effect=Exception("boom"))
    def test_failed_details_creation_rolls_back_artwork(self, mock_details_create, mock_upload):
        with self.assertRaises(Exception):
            self.client.post(
                "/artworks/",
                {"title": "Should not persist", "file": fake_image_file()},
                format="multipart",
            )
        self.assertFalse(Artwork.objects.filter(title="Should not persist").exists())
