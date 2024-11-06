from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny, IsAuthenticated
from rest_framework.response import Response

from backend.activities.models import Activities
from backend.activities.serializers import ActivitiesSerializer
from backend.destinations.models import Destination, Category
from backend.destinations.serializers import DestinationSerializer, CategorySerializer
from backend.hotels.models import Hotel
from backend.hotels.serializers import HotelSerializer


# Create your views here.

class DestinationViewSet(viewsets.ModelViewSet):
    queryset = Destination.objects.all()
    serializer_class = DestinationSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]  # Allows read access to all, but restricts modifications to authenticated users

    @action(detail=True, methods=['get'])
    def related(self, request, pk=None):
        destination = self.get_object()
        tags = destination.tags.all()  # Get all tags related to the destination

        # Fetch related activities where any of the destination tags match
        related_activities = Activities.objects.filter(tags__in=tags).distinct()
        related_hotels = Hotel.objects.filter(tags__in=tags).distinct()

        return Response({
            'related_activities': ActivitiesSerializer(related_activities, many=True).data,
            'related_hotels': HotelSerializer(related_hotels, many=True).data,
        })

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my(self, request):
        user = request.user
        destinations = Destination.objects.filter(user=user)
        serializer = self.get_serializer(destinations, many=True)
        return Response(serializer.data)


class DestinationCategory(ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]  # Allows read access to all
