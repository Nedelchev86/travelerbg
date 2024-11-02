from django.db.models.signals import post_save
from django.dispatch import receiver

from backend.business.models import BusinessProfile


@receiver(post_save, sender=BusinessProfile)
def update_business_activation(sender, instance, **kwargs):
    # Recursion
    if instance.name and not instance.activated:
        instance.activated = True
        instance.save()
