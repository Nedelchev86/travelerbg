from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny, IsAuthenticated
from rest_framework.response import Response

from backend.activities.models import Activities, ActivityCategory, FavoriteActivity
from backend.activities.serializers import ActivitiesSerializer, ActivityCategorySerializer, FavoriteActivitySerializer


# Create your views here.
class ActivitiesViewSet(viewsets.ModelViewSet):
    queryset = Activities.objects.all()
    serializer_class = ActivitiesSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]  # Allows read access to all, but restricts modifications to authenticated users


    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my(self, request):
        user = request.user
        activities = Activities.objects.filter(user=user)
        serializer = self.get_serializer(activities, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def add_to_favorites(self, request, pk=None):
        activity = self.get_object()
        favorite, created = FavoriteActivity.objects.get_or_create(user=request.user, activity=activity)
        if created:
            return Response({'status': 'activity added to favorites'})
        else:
            return Response({'status': 'activity already in favorites'})

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def remove_from_favorites(self, request, pk=None):
        activity = self.get_object()
        FavoriteActivity.objects.filter(user=request.user, activity=activity).delete()
        return Response({'status': 'activity removed from favorites'})

    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated])
    def is_favorite(self, request, pk=None):
        activity = self.get_object()
        is_favorite = FavoriteActivity.objects.filter(user=request.user, activity=activity).exists()
        return Response({'is_favorite': is_favorite}, status=status.HTTP_200_OK)



class ActivitiesCategory(ListAPIView):
    queryset = ActivityCategory.objects.all()
    serializer_class = ActivityCategorySerializer
    permission_classes = [AllowAny]  # Allows read access to all


class FavoriteActivityViewSet(viewsets.ModelViewSet):
    queryset = FavoriteActivity.objects.all()
    serializer_class = FavoriteActivitySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

