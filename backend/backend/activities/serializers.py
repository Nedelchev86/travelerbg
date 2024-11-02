from rest_framework import serializers

from traveler.activities.models import Activities
from traveler.core.models import Tag
from traveler.core.serializers import TagSerializer
from traveler.destinations.models import Destination


class ActivitiesSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, required=False)

    class Meta:
        model = Activities
        fields = '__all__'

    def create(self, validated_data):
        tags_data = validated_data.pop('tags', [])
        activities = Activities.objects.create(**validated_data)
        for tag_data in tags_data:
            tag, created = Tag.objects.get_or_create(name=tag_data['name'])
            activities.tags.add(tag)
        return activities

    def update(self, instance, validated_data):
        tags_data = validated_data.pop('tags', [])
        instance = super().update(instance, validated_data)

        instance.tags.clear()  # Clear existing tags
        for tag_data in tags_data:
            tag, created = Tag.objects.get_or_create(name=tag_data['name'])
            instance.tags.add(tag)
        return instance