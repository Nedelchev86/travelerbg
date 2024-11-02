from django.shortcuts import render
from rest_framework import permissions, viewsets

from backend.travelers.models import Traveler
from backend.travelers.serializers import TravelerSerializer


# Create your views here.
class TravelerkerViewSet(viewsets.ModelViewSet):
    queryset = Traveler.objects.filter(activated=True)
    serializer_class = TravelerSerializer
    permission_classes = permissions.AllowAny,
    pagination_class = None  # Disable pagination

    def get_queryset(self, location__icontains=None):
        queryset = Traveler.objects.filter(activated=True)
        # city = self.request.GET.get('city', None)
        # seniority_filter = self.request.GET.get('seniority')
        # skills_filter = self.request.GET.get('skill')

        # if city:
        #     queryset = queryset.filter(city__icontains=city)
        # if seniority_filter:
        #     queryset = queryset.filter(seniority=seniority_filter)
        #
        # if skills_filter:
        #     skill = get_object_or_404(Skills, name=skills_filter)

            # queryset = queryset.filter(skills=skill)
        return queryset
