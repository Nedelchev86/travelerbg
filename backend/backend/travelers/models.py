from cloudinary.models import CloudinaryField
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models

from backend.core.validators import validate_start_with_upper, validate_phone_number

UserModel = get_user_model()
# Create your models here.
class Traveler(models.Model):
    user = models.OneToOneField(UserModel, on_delete=models.CASCADE, primary_key=True)
    name = models.CharField(max_length=50, blank=False, null=False, validators=[validate_start_with_upper], verbose_name="First Name")
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

    def average_rating(self):
        ratings = self.ratings.all()
        if ratings.exists():
            return ratings.aggregate(models.Avg('rating'))['rating__avg']
        return 0

    def number_of_votes(self):
        return self.ratings.count()
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


class Rating(models.Model):
    user = models.ForeignKey(UserModel, on_delete=models.CASCADE)
    traveler = models.ForeignKey('Traveler', related_name='ratings', on_delete=models.CASCADE)
    rating = models.PositiveSmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'traveler')