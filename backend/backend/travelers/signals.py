from django.db.models.signals import post_save
from django.dispatch import receiver

from backend.travelers.models import Traveler


@receiver(post_save, sender=Traveler)
def update_traveler_activation(sender, instance, **kwargs):
    # Recursion
    if instance.name and not instance.activated:
        instance.activated = True
        instance.save()



