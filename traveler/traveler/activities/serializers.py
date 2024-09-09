from rest_framework import serializers

from traveler.core.models import Tag
from traveler.core.serializers import TagSerializer
from traveler.destinations.models import Destination


class DestinationSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, required=False)
    class Meta:
        model = Destination
        fields = '__all__'  # Include all fields, or you can specify fields explicitly

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