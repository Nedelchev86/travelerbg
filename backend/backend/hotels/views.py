from django.shortcuts import render
from rest_framework import viewsets, generics
from rest_framework.decorators import action
from rest_framework.generics import ListAPIView, get_object_or_404
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated, AllowAny
from rest_framework.response import Response

from backend.hotels.serializers import CategorySerializer, HighlightsSerializer, HotelCommentSerializer
from backend.hotels.models import Hotel, Category, Highlights, HotelComment
from backend.hotels.serializers import HotelSerializer


# Create your views here.
class HotelViewSet(viewsets.ModelViewSet):
    queryset = Hotel.objects.all()
    serializer_class = HotelSerializer
    permission_classes = []  # Allows re


    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my(self, request):
        user = request.user
        hotels = Hotel.objects.filter(user=user)
        serializer = self.get_serializer(hotels, many=True)
        return Response(serializer.data)



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
                name = f"{self.request.user.traveler.name} {self.request.user.traveler.name}"
            elif hasattr(self.request.user, 'business'):
                name = self.request.user.business.name
            else:
                name = self.request.user.email
            serializer.save(hotel=hotel, user=self.request.user, name=name, email=email)
        else:
            serializer.save(hotel=hotel)