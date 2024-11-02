from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.dispatch import receiver
from backend.business.models import BusinessProfile
from backend.travelers.models import Traveler

userModel = get_user_model()


@receiver(post_save, sender=userModel)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        if instance.role == 'traveler':
            Traveler.objects.create(user=instance)
        elif instance.role == 'business':
            BusinessProfile.objects.create(user=instance)