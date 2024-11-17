from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny, IsAuthenticated
from rest_framework.response import Response

from backend.activities.models import Activities
from backend.activities.serializers import ActivitiesSerializer
from backend.destinations.models import Destination, Category, DestinationRating
from backend.destinations.pagination import DestinationPagination
from backend.destinations.serializers import DestinationSerializer, CategorySerializer
from backend.hotels.models import Hotel
from backend.hotels.serializers import HotelSerializer


# Create your views here.

class DestinationViewSet(viewsets.ModelViewSet):
    queryset = Destination.objects.all()
    serializer_class = DestinationSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]  # Allows read access to all, but restricts modifications to authenticated users

    pagination_class = DestinationPagination
    def get_queryset(self):
        queryset = Destination.objects.all()
        title = self.request.GET.get('title', None)
        category = self.request.GET.get('category', None)
        location = self.request.GET.get('location', None)

        if title:
            queryset = queryset.filter(title__icontains=title)
        if category:
            queryset = queryset.filter(category__name__icontains=category)
        if location:
            queryset = queryset.filter(location__icontains=location)

        return queryset
    @action(detail=True, methods=['get'], url_path='related_hotels', url_name='related-hotels')
    def related_hotels(self, request, pk=None):
        destination = self.get_object()
        related_hotels = destination.related_hotels()
        serializer = HotelSerializer(related_hotels, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'], url_path='related_activities', url_name='related-activities')
    def related_activities(self, request, pk=None):
        destination = self.get_object()
        related_activities = destination.related_activities()
        serializer = ActivitiesSerializer(related_activities, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my(self, request):
        user = request.user
        destinations = Destination.objects.filter(user=user)
        serializer = self.get_serializer(destinations, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='by_user/(?P<user_id>[^/.]+)', permission_classes=[AllowAny])
    def by_user(self, request, user_id=None):
        if not user_id:
            return Response({'error': 'user_id parameter is required.'}, status=400)

        destinations = Destination.objects.filter(user_id=user_id)
        serializer = self.get_serializer(destinations, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def rate(self, request, pk=None):
        destination = self.get_object()
        user = request.user
        rating_value = request.data.get('rating')

        if rating_value is None:
            return Response({'error': 'Rating value is required.'}, status=400)

        rating, created = DestinationRating.objects.update_or_create(
            user=user,
            destination=destination,
            defaults={'rating': rating_value}
        )

        return Response({'status': 'rating set', 'rating': rating_value})

class DestinationCategory(ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]  # Allows read access to all
