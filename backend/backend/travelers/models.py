from cloudinary.models import CloudinaryField
from django.contrib.auth import get_user_model
from django.db import models

from backend.core.validators import validate_start_with_upper, validate_phone_number

UserModel = get_user_model()
# Create your models here.
class Traveler(models.Model):
    user = models.OneToOneField(UserModel, on_delete=models.CASCADE, primary_key=True)
    first_name = models.CharField(max_length=50, blank=False, null=False, validators=[validate_start_with_upper], verbose_name="First Name")
    last_name = models.CharField(max_length=50, blank=False, null=False, validators=[validate_start_with_upper])
    city = models.CharField(max_length=50, blank=False, null=False)
    nationality = models.CharField(max_length=50, blank=False, null=False)
    occupation = models.CharField(max_length=50, blank=False, null=False)

    website = models.URLField(max_length=70, blank=True, null=True)
    linkedin = models.URLField(blank=True, null=True, max_length=50)
    facebook = models.URLField(blank=True, null=True, max_length=50)
    github = models.URLField(blank=True, null=True, max_length=50)
    about = models.TextField(blank=False, null=False)
    phone_number = models.CharField(max_length=50, blank=True, null=True, validators=[validate_phone_number])
    profile_picture = CloudinaryField('image', blank=True, null=True)
    cover = CloudinaryField('image', blank=True, null=True)
    # gender = models.CharField(blank=False, null=False,
    #                           choices=GENDER_TYPE, max_length=6)
    # skills = models.ManyToManyField(Skills, related_name="skills")
    activated = models.BooleanField(default=False)

    # @property
    # def get_user_all_applicant(self):
    #     return Applicant.objects.filter(user=self.user).count()
    #
    # def __str__(self):
    #     if self.first_name and self.last_name:
    #         return f"{self.first_name} {self.last_name}"
    #     else:
    #         return str(self.user)

    class Meta:
        ordering = ['-pk']