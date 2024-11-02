from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from backend.activities.models import Activities
from backend.activities.serializers import ActivitiesSerializer


# Create your views here.
class ActivitiesViewSet(viewsets.ModelViewSet):
    queryset = Activities.objects.all()
    serializer_class = ActivitiesSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]  # Allows read access to all, but restricts modifications to authenticated users