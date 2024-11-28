from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.response import Response

from backend.activities.models import FavoriteActivity
from backend.activities.serializers import ActivitiesSerializer
from backend.business.models import BusinessProfile
from backend.business.serializers import BusinessSerializer
from backend.destinations.models import FavoriteDestinations
from backend.destinations.serializers import DestinationSerializer
from backend.hotels.models import FavoriteHotels
from backend.hotels.serializers import HotelSerializer


# Create your views here.
class BusinessProfileViewSet(viewsets.ModelViewSet):
    queryset = BusinessProfile.objects.all()
    serializer_class = BusinessSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


    @action(detail=True, methods=['get'], url_path='favorites', permission_classes=[IsAuthenticated])
    def favorites(self, request, pk=None):
        traveler = self.get_object()
        user = traveler.user

        favorite_activities = FavoriteActivity.objects.filter(user=user)
        favorite_hotels = FavoriteHotels.objects.filter(user=user)
        favorite_destinations = FavoriteDestinations.objects.filter(user=user)

        activities_serializer = ActivitiesSerializer([fav.activity for fav in favorite_activities], many=True)
        hotels_serializer = HotelSerializer([fav.hotel for fav in favorite_hotels], many=True)
        destinations_serializer = DestinationSerializer([fav.destination for fav in favorite_destinations], many=True)

        combined_favorites = {
            'favorite_activities': activities_serializer.data,
            'favorite_hotels': hotels_serializer.data,
            'favorite_destinations': destinations_serializer.data,
        }

        return Response(combined_favorites)