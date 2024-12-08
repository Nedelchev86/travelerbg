from django.db.models import Avg
from django.shortcuts import render
from rest_framework import permissions, viewsets, generics
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from backend.activities.models import FavoriteActivity
from backend.activities.serializers import ActivitiesSerializer
from backend.destinations.models import FavoriteDestinations
from backend.destinations.serializers import DestinationSerializer
from backend.hotels.models import FavoriteHotels
from backend.hotels.serializers import HotelSerializer
from backend.travelers.models import Traveler, Rating
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

    @action(detail=False, methods=['get'], url_path='top-rated', permission_classes=[permissions.AllowAny],authentication_classes=[] )
    def top_rated(self, request):
        top_travelers = Traveler.objects.filter(activated=True).annotate(avg_rating=Avg('ratings__rating')).order_by(
            '-avg_rating')[:8]
        serializer = self.get_serializer(top_travelers, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def count(self, request):
        count = Traveler.objects.count()
        return Response({'count': count})

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def rate(self, request, pk=None):
        traveler = self.get_object()
        user = request.user
        rating_value = request.data.get('rating')

        if rating_value is None:
            return Response({'error': 'Rating value is required.'}, status=400)

        rating, created = Rating.objects.update_or_create(
            user=user,
            traveler=traveler,
            defaults={'rating': rating_value}
        )

        return Response({'status': 'rating set', 'rating': rating_value})

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



class TravelerkerUpdateAPIView(generics.RetrieveUpdateAPIView):
    queryset = Traveler.objects.all()
    serializer_class = TravelerSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # Retrieve the JobSeeker instance of the current user
        return Traveler.objects.get(user=self.request.user)