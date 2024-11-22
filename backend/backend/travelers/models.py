from cloudinary.models import CloudinaryField
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models

from backend.activities.models import Activities
from backend.core.validators import validate_start_with_upper, validate_phone_number
from backend.destinations.models import Destination

UserModel = get_user_model()
# Create your models here.
class Traveler(models.Model):
    user = models.OneToOneField(UserModel, on_delete=models.CASCADE, primary_key=True)
    name = models.CharField(max_length=50, blank=False, null=False, validators=[validate_start_with_upper], verbose_name="First Name")
    city = models.CharField(max_length=50, blank=False, null=False)
    occupation = models.CharField(max_length=50, blank=False, null=False)
    website = models.URLField(max_length=70, blank=True, null=True)
    linkedin = models.URLField(blank=True, null=True, max_length=50)
    facebook = models.URLField(blank=True, null=True, max_length=50)
    youtube = models.URLField(blank=True, null=True, max_length=50)
    instagram = models.URLField(blank=True, null=True, max_length=50)
    about = models.TextField(blank=False, null=False)
    phone_number = models.CharField(max_length=50, blank=True, null=True, validators=[validate_phone_number])
    profile_picture = models.URLField(max_length=255, blank=True, null=True)
    cover = models.URLField(max_length=255, blank=True, null=True)
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

    def count_published_destinations(self):
        return Destination.objects.filter(user=self.user).count()

    def count_published_activities(self):
        return Activities.objects.filter(user=self.user).count()




    def __str__(self):
        return self.name

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