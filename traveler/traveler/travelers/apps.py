from django.apps import AppConfig


class TravelersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'traveler.travelers'

    def ready(self):
        import traveler.travelers.signals