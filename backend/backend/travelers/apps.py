from django.apps import AppConfig


class TravelersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'backend.travelers'

    def ready(self):
        import backend.travelers.signals