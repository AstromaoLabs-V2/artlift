from django.apps import AppConfig


class ArtliftConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'artlift'

    def ready(self):
        import artlift.signals 