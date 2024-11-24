from rest_framework import serializers

from backend.activities.models import Activities, ActivityCategory, FavoriteActivity
from backend.core.models import Tag
from backend.core.serializers import TagSerializer
from backend.destinations.models import Destination


class ActivitiesSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, required=False)

    class Meta:
        model = Activities
        fields = ["id", "user", "title", 'highlights', "category", "description", "location", "highlights", "duration", "lat", "lng", "image", "image2", "image3", "price", "tags", "created_at", "modified_at",]
        extra_kwargs = {
            'user': {'read_only': True}
        }

    def create(self, validated_data):
        tags_data = validated_data.pop('tags', [])

        hotel = Activities.objects.create(**validated_data)
        hotel.tags.set(tags_data)
        return hotel

    def update(self, instance, validated_data):
        tags_data = validated_data.pop('tags', [])
        instance = super().update(instance, validated_data)

        instance.tags.clear()  # Clear existing tags
        for tag_data in tags_data:
            tag, created = Tag.objects.get_or_create(name=tag_data['name'])
            instance.tags.add(tag)
        return instance

class ActivityCategorySerializer(serializers.ModelSerializer):
    number_of_activity = serializers.SerializerMethodField()
    class Meta:
        model = ActivityCategory
        fields = ['id', 'name', 'slug', 'created_at', 'modified_at', 'number_of_activity']
        extra_kwargs = {
            'slug': {'read_only': True}}

    def get_number_of_activity(self, obj):
        return obj.get_number_of_activity()

class FavoriteActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = FavoriteActivity
        fields = ['user', 'activity', 'created_at']
        read_only_fields = ['created_at']