from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny

from backend.activities.models import Activities, ActivityCategory
from backend.activities.serializers import ActivitiesSerializer, ActivityCategorySerializer


# Create your views here.
class ActivitiesViewSet(viewsets.ModelViewSet):
    queryset = Activities.objects.all()
    serializer_class = ActivitiesSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]  # Allows read access to all, but restricts modifications to authenticated users


class ActivitiesCategory(ListAPIView):
    queryset = ActivityCategory.objects.all()
    serializer_class = ActivityCategorySerializer
    permission_classes = [AllowAny]  # Allows read access to all
