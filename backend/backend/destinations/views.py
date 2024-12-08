from django.db.models import Avg
from django.shortcuts import render
from rest_framework import viewsets, generics, status
from rest_framework.decorators import action
from rest_framework.generics import ListAPIView, get_object_or_404
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny, IsAuthenticated
from rest_framework.response import Response

from backend.activities.models import Activities
from backend.activities.serializers import ActivitiesSerializer
from backend.destinations.models import Destination, Category, DestinationRating, DestinationsComment, \
    FavoriteDestinations
from backend.destinations.pagination import DestinationPagination
from backend.destinations.serializers import DestinationSerializer, CategorySerializer, DestinationCommentSerializer
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

    @action(detail=False, methods=['get'], permission_classes=[AllowAny], authentication_classes=[], url_path='top-rated')
    def top_rated(self, request):
        # top_destinations = Destination.objects.annotate(avg_rating=Avg('destination_ratings__rating')).order_by('-avg_rating')[:5]

        top_destinations = Destination.objects.annotate(avg_rating=Avg('destination_ratings__rating')).filter(
            avg_rating__gt=0).order_by('-avg_rating')[:5]

        serializer = self.get_serializer(top_destinations, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def add_to_favorites(self, request, pk=None):
        destination = self.get_object()
        favorite, created = FavoriteDestinations.objects.get_or_create(user=request.user, destination=destination)
        if created:
            return Response({'status': 'hotel added to favorites'})
        else:
            return Response({'status': 'hotel already in favorites'})

    @action(detail=True, methods=['delete'], permission_classes=[IsAuthenticated])
    def remove_from_favorites(self, request, pk=None):
        destination = self.get_object()
        FavoriteDestinations.objects.filter(user=request.user, destination=destination).delete()
        return Response({'status': 'hotel removed from favorites'})

    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated])
    def is_favorite(self, request, pk=None):
        destination = self.get_object()
        is_favorite = FavoriteDestinations.objects.filter(user=request.user, destination=destination).exists()
        return Response({'is_favorite': is_favorite}, status=status.HTTP_200_OK)

class DestinationCategory(ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]  # Allows read access to all




class DestinationCommentListView(generics.ListAPIView):
    serializer_class = DestinationCommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        destination_id = self.kwargs['destination_id']
        return DestinationsComment.objects.filter(destination_id=destination_id)


class DestinationCommentCreateView(generics.CreateAPIView):
    serializer_class = DestinationCommentSerializer
    permission_classes = [AllowAny]


    def perform_create(self, serializer):
        destination_id = self.kwargs['destination_id']
        destination = get_object_or_404(Destination, id=destination_id)
        if self.request.user.is_authenticated:
            email = self.request.user.email
            if hasattr(self.request.user, 'traveler'):
                name = f"{self.request.user.traveler.name}"
            elif hasattr(self.request.user, 'business'):
                name = self.request.user.business.name
            else:
                name = self.request.user.email
            serializer.save(destination=destination, user=self.request.user, name=name, email=email)
        else:
            serializer.save(destination=destination)