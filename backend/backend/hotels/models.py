from cloudinary.models import CloudinaryField
from django.contrib.auth import get_user_model
from django.db import models
from django.utils.text import slugify

from backend import settings
from backend.core.models import Tag

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


# Create your models here.

class Hotel(models.Model):
    user = models.ForeignKey(UserModel, on_delete=models.CASCADE)
    name = models.CharField(max_length=300)
    # category = models.ForeignKey(Category,  on_delete=models.CASCADE)
    description = models.TextField()
    location = models.CharField(max_length=255)
    website = models.URLField(blank=True, null=True)
    # image = CloudinaryField('image', blank=True, null=True)
    # image2 = CloudinaryField('image', blank=True, null=True)
    # image3 = CloudinaryField('image', blank=True, null=True)
    lat = models.DecimalField(max_digits=20, decimal_places=16, blank=True, null=True)
    lng = models.DecimalField(max_digits=20, decimal_places=16, blank=True, null=True)
    highlights = models.ManyToManyField('Highlights', related_name='hotels_highlights', blank=True)
    image = models.CharField(max_length=255, blank=True, null=True)
    image2 = models.CharField(max_length=255, blank=True, null=True)
    image3 = models.CharField(max_length=255, blank=True, null=True)
    price = models.DecimalField(max_digits=14, decimal_places=2)
    tags = models.ManyToManyField(Tag, related_name="hotels", blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    # Other fields...
    def __str__(self):
        return self.name

class Highlights(models.Model):
    name = models.CharField(max_length=300, unique=True, blank=False, null=False)

    # Other fields...
    def __str__(self):
        return self.name

# class HotelComment(models.Model):
#     user = models.ForeignKey(UserModel, on_delete=models.CASCADE)
#     hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE, related_name='comments')
#     text = models.TextField()
#     created_at = models.DateTimeField(auto_now_add=True)
#     modified_at = models.DateTimeField(auto_now=True)
#
#     def __str__(self):
#         return f'Comment by {self.user} on {self.hotel}'

class HotelComment(models.Model):
    hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.text