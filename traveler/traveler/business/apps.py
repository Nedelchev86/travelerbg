from django.apps import AppConfig


class BusinessConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'traveler.business'

    def ready(self):
        import traveler.business.signals