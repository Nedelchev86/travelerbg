from cloudinary.models import CloudinaryField
from django.contrib.auth import get_user_model
from django.db import models
from django.utils.text import slugify
from backend.core.models import Tag

UserModel = get_user_model()


class ActivityCategory(models.Model):
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

    def get_number_of_activity(self):
        return self.activities_set.count()

class Activities(models.Model):
    user = models.ForeignKey(UserModel, on_delete=models.CASCADE)
    title = models.CharField(max_length=300)
    description = models.TextField(blank=False, null=False)
    highlights = models.TextField(blank=True, null=True)
    category = models.ForeignKey(ActivityCategory,  on_delete=models.CASCADE)
    image = models.CharField(max_length=255, blank=True, null=True)
    image2 = models.CharField(max_length=255, blank=True, null=True)
    image3 = models.CharField(max_length=255, blank=True, null=True)
    price = models.DecimalField(max_digits=5, decimal_places=2)
    duration = models.IntegerField(blank=True, null=True)
    location = models.CharField(max_length=100)
    lat = models.DecimalField(max_digits=20, decimal_places=16, blank=True, null=True)
    lng = models.DecimalField(max_digits=20, decimal_places=16, blank=True, null=True)
    tags = models.ManyToManyField(Tag, related_name="activities", blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)


class FavoriteActivity(models.Model):
    user = models.ForeignKey(UserModel, on_delete=models.CASCADE, related_name='favorite_activities')
    activity = models.ForeignKey(Activities, on_delete=models.CASCADE, related_name='favorited_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'activity')