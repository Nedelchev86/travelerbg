from cloudinary.models import CloudinaryField
from django.contrib.auth import get_user_model
from django.db import models

from backend.core.models import Tag

UserModel = get_user_model()
# Create your models here.
class Activities(models.Model):
    user = models.ForeignKey(UserModel, on_delete=models.CASCADE)
    title = models.CharField(max_length=300)
    description = models.TextField()
    image = CloudinaryField('image', blank=True, null=True)
    image2 = CloudinaryField('image', blank=True, null=True)
    image3 = CloudinaryField('image', blank=True, null=True)
    price = models.DecimalField(max_digits=5, decimal_places=2)
    time = models.IntegerField(blank=True, null=True)
    tags = models.ManyToManyField(Tag, related_name="activities", blank=True)
    # Other fields...