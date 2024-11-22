from cloudinary.models import CloudinaryField
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models
from django.db.models import Count
from django.utils.crypto import get_random_string
from django.utils.text import slugify

from backend import settings
from backend.activities.models import Activities
from backend.core.models import Tag
from backend.hotels.models import Hotel

UserModel = get_user_model()


class Category(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(allow_unicode=True, max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if self.slug:
            self.slug = slugify(self.name, allow_unicode=True)
        return super().save(*args, **kwargs)

    def get_number_of_destinations(self):
        return self.destination_set.count()


class Destination(models.Model):
    user = models.ForeignKey(UserModel,  on_delete=models.CASCADE)
    title = models.CharField(max_length=300)
    tags = models.ManyToManyField(Tag, related_name="destinations")
    category = models.ForeignKey(Category,  on_delete=models.CASCADE)
    basic_information = models.TextField(null=False, blank=False)
    image = models.URLField(max_length=255, blank=False, null=False)
    image2 = models.URLField(max_length=255, blank=True, null=True)
    image3 = models.URLField(max_length=255, blank=True, null=True)
    image4 = models.URLField(max_length=255, blank=True, null=True)
    image5 = models.URLField(max_length=255, blank=True, null=True)
    location = models.CharField(max_length=300,)
    lat = models.DecimalField(max_digits=20, decimal_places=16, blank=True, null=True)
    lng = models.DecimalField(max_digits=20, decimal_places=16, blank=True, null=True)
    time = models.IntegerField(blank=True)
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)


    def average_rating(self):
        ratings = self.destination_ratings.all()
        if ratings.exists():
            return ratings.aggregate(models.Avg('rating'))['rating__avg']
        return 0

    def related_hotels(self):
        return Hotel.objects.filter(tags__in=self.tags.all()) \
            .annotate(num_shared_tags=Count('tags')) \
            .order_by('-num_shared_tags').distinct()

    def related_activities(self):
        return Activities.objects.filter(tags__in=self.tags.all()) \
            .annotate(num_shared_tags=Count('tags')) \
            .order_by('-num_shared_tags').distinct()[:8]


    # def related_activities(self):
    #     return Activities.objects.filter(tags__in=self.tags.all()) \
    #         .annotate(num_shared_tags=Count('tags')) \
    #         .order_by('-num_shared_tags').distinct()[:8]


    def number_of_votes(self):
        return self.destination_ratings.count()

    def __str__(self):
        return self.title

    # def save(self, *args, **kwargs):
    #     if not self.slug:
    #         self.slug = unique_slugify(self, slugify(self.title))
    #     super().save(*args, **kwargs)

    class Meta:
        ordering = ['-created_at']

class DestinationRating(models.Model):
    user = models.ForeignKey(UserModel, on_delete=models.CASCADE)
    destination = models.ForeignKey('Destination', related_name='destination_ratings', on_delete=models.CASCADE)
    rating = models.PositiveSmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'destination')


class DestinationsComment(models.Model):
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.text