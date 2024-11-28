from django.db.models import Avg
from django.shortcuts import render
from rest_framework import viewsets, generics, permissions, status
from rest_framework.decorators import action
from rest_framework.generics import ListAPIView, get_object_or_404
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated, AllowAny
from rest_framework.response import Response

from backend.hotels.pagination import HotelsPagination
from backend.hotels.serializers import CategorySerializer, HighlightsSerializer, HotelCommentSerializer, \
    FavoriteHotelSerializer
from backend.hotels.models import Hotel, Category, Highlights, HotelComment, HotelRating, FavoriteHotels
from backend.hotels.serializers import HotelSerializer


# Create your views here.
class HotelViewSet(viewsets.ModelViewSet):
    queryset = Hotel.objects.all()
    serializer_class = HotelSerializer
    permission_classes = []  # Allows re
    pagination_class = HotelsPagination

    def get_queryset(self):
        queryset = Hotel.objects.all()
        name = self.request.GET.get('name', None)
        category = self.request.GET.get('category', None)


        if name:
            queryset = queryset.filter(name__icontains=name)
        if category:
            queryset = queryset.filter(category__name__icontains=category)


        return queryset


    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my(self, request):
        user = request.user
        hotels = Hotel.objects.filter(user=user)
        serializer = self.get_serializer(hotels, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def rate(self, request, pk=None):
        hotel = self.get_object()
        user = request.user
        rating_value = request.data.get('rating')

        if rating_value is None:
            return Response({'error': 'Rating value is required.'}, status=400)

        rating, created = HotelRating.objects.update_or_create(
            user=user,
            hotel=hotel,
            defaults={'rating': rating_value}
        )

        return Response({'status': 'rating set', 'rating': rating_value})

    @action(detail=False, methods=['get'], url_path='top-rated')
    def top_rated(self, request):
        top_hotels = Hotel.objects.annotate(avg_rating=Avg('hotel_ratings__rating')).order_by('-avg_rating')[:5]
        serializer = self.get_serializer(top_hotels, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def add_to_favorites(self, request, pk=None):
        hotel = self.get_object()
        favorite, created = FavoriteHotels.objects.get_or_create(user=request.user, hotel=hotel)
        if created:
            return Response({'status': 'hotel added to favorites'})
        else:
            return Response({'status': 'hotel already in favorites'})

    @action(detail=True, methods=['delete'], permission_classes=[IsAuthenticated])
    def remove_from_favorites(self, request, pk=None):
        hotel = self.get_object()
        FavoriteHotels.objects.filter(user=request.user, hotel=hotel).delete()
        return Response({'status': 'hotel removed from favorites'})

    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated])
    def is_favorite(self, request, pk=None):
        hotel = self.get_object()
        is_favorite = FavoriteHotels.objects.filter(user=request.user, hotel=hotel).exists()
        return Response({'is_favorite': is_favorite}, status=status.HTTP_200_OK)

class HotelsCategory(ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]  # Allows read access to all


class HighlightsViewSet(viewsets.ModelViewSet):
    queryset = Highlights.objects.all()
    serializer_class = HighlightsSerializer
    permission_classes = [AllowAny]  # Allows re


class HotelCommentListView(generics.ListAPIView):
    serializer_class = HotelCommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        hotel_id = self.kwargs['hotel_id']
        return HotelComment.objects.filter(hotel_id=hotel_id)

class HotelCommentCreateView(generics.CreateAPIView):
    serializer_class = HotelCommentSerializer
    permission_classes = [AllowAny]


    def perform_create(self, serializer):
        hotel_id = self.kwargs['hotel_id']
        hotel = get_object_or_404(Hotel, id=hotel_id)
        if self.request.user.is_authenticated:
            email = self.request.user.email
            if hasattr(self.request.user, 'traveler'):
                name = f"{self.request.user.traveler.name}"
            elif hasattr(self.request.user, 'business'):
                name = self.request.user.business.name
            else:
                name = self.request.user.email
            serializer.save(hotel=hotel, user=self.request.user, name=name, email=email)
        else:
            serializer.save(hotel=hotel)


class FavoriteActivityViewSet(viewsets.ModelViewSet):
    queryset = FavoriteHotels.objects.all()
    serializer_class = FavoriteHotelSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)
