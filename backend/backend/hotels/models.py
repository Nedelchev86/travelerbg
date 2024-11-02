from cloudinary.models import CloudinaryField
from django.contrib.auth import get_user_model
from django.db import models

from backend.core.models import Tag

UserModel = get_user_model()
# Create your models here.
class Hotel(models.Model):
    user = models.ForeignKey(UserModel, on_delete=models.CASCADE)
    name = models.CharField(max_length=300)
    description = models.TextField()
    location = models.CharField(max_length=255)
    image = CloudinaryField('image', blank=True, null=True)
    image2 = CloudinaryField('image', blank=True, null=True)
    image3 = CloudinaryField('image', blank=True, null=True)
    price = models.DecimalField(max_digits=5, decimal_places=2)
    tags = models.ManyToManyField(Tag, related_name="hotels", blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    # Other fields...
    def __str__(self):
        return self.name