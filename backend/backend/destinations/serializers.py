from rest_framework import serializers

from backend.activities.models import Activities
from backend.activities.serializers import ActivitiesSerializer
from backend.core.models import Tag
from backend.core.serializers import TagSerializer
from backend.destinations.models import Destination
from backend.hotels.models import Hotel
from backend.hotels.serializers import HotelSerializer


class DestinationSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, required=False)
    related_activities = serializers.SerializerMethodField()
    related_hotels = serializers.SerializerMethodField()

    class Meta:
        model = Destination
        fields = [
            'id', 'user', 'title', 'category', 'basic_information', 'responsibilities',
            'benefits', 'image', 'image2', 'image3', 'image4', 'image5', 'image6',
            'vacancy', 'location', 'cost', 'is_published', 'created_at', 'modified_at',
            'tags', 'related_activities', 'related_hotels'
        ]

    def get_related_activities(self, obj):
        tags = obj.tags.all()  # Get all tags related to the destination
        related_activities = Activities.objects.filter(tags__in=tags).distinct()
        return ActivitiesSerializer(related_activities, many=True).data

    def get_related_hotels(self, obj):
        tags = obj.tags.all()  # Get all tags related to the destination
        related_hotels = Hotel.objects.filter(tags__in=tags).distinct()
        return HotelSerializer(related_hotels, many=True).data

    def create(self, validated_data):
        tags_data = validated_data.pop('tags', [])
        destination = Destination.objects.create(**validated_data)
        for tag_data in tags_data:
            tag, created = Tag.objects.get_or_create(name=tag_data['name'])
            destination.tags.add(tag)
        return destination

    def update(self, instance, validated_data):
        tags_data = validated_data.pop('tags', [])
        instance = super().update(instance, validated_data)

        instance.tags.clear()  # Clear existing tags
        for tag_data in tags_data:
            tag, created = Tag.objects.get_or_create(name=tag_data['name'])
            instance.tags.add(tag)
        return instance