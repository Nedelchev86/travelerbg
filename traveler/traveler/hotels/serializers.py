from rest_framework import serializers


from traveler.core.models import Tag
from traveler.core.serializers import TagSerializer
from traveler.destinations.models import Destination
from traveler.hotels.models import Hotel


class HotelSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, required=False)

    class Meta:
        model = Hotel
        fields = '__all__'

    def create(self, validated_data):
        tags_data = validated_data.pop('tags', [])
        hotel = Hotel.objects.create(**validated_data)
        for tag_data in tags_data:
            tag, created = Tag.objects.get_or_create(name=tag_data['name'])
            hotel.tags.add(tag)
        return hotel

    def update(self, instance, validated_data):
        tags_data = validated_data.pop('tags', [])
        instance = super().update(instance, validated_data)

        instance.tags.clear()  # Clear existing tags
        for tag_data in tags_data:
            tag, created = Tag.objects.get_or_create(name=tag_data['name'])
            instance.tags.add(tag)
        return instance