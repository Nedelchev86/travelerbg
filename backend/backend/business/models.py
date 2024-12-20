from cloudinary.models import CloudinaryField
from django.contrib.auth import get_user_model
from django.db import models

from backend.activities.models import Activities
from backend.core.validators import validate_start_with_upper, validate_phone_number
from backend.hotels.models import Hotel

UserModel = get_user_model()


class BusinessProfile(models.Model):
    user = models.OneToOneField(UserModel, on_delete=models.CASCADE, primary_key=True, related_name="business")
    name = models.CharField(max_length=40, null=False, blank=False, validators=[validate_start_with_upper])
    description = models.TextField(null=False, blank=False)
    location = models.CharField(max_length=40, null=False, blank=False)
    phone = models.CharField(max_length=20, null=True, blank=True, validators=[validate_phone_number])
    image = models.CharField(max_length=200, blank=False, null=False)
    linkedin = models.URLField(max_length=200, null=True, blank=True)
    facebook = models.URLField(max_length=200, null=True, blank=True)
    activated = models.BooleanField(default=False)


    def count_published_hotels(self):
        return Hotel.objects.filter(user=self.user).count()

    def count_published_activities(self):
        return Activities.objects.filter(user=self.user).count()


    def __str__(self):
        if self.name:
            return self.name
        return str(self.user)



    # @property
    # def get_all_applicant(self):
    #
    #     return Applicant.objects.filter(job__user=self.user, job__is_published=True).count()

    class Meta:
        ordering = ['-pk']
