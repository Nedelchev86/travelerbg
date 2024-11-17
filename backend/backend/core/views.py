from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from backend.core.models import Tag
from backend.core.serializers import TagSerializer


# Create your views here.
class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]