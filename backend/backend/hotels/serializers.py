from rest_framework import serializers
from rest_framework.templatetags.rest_framework import highlight_code

from backend.accounts.serializers import UserSerializer
from backend.business.serializers import BusinessSerializer
from backend.core.models import Tag
from backend.core.serializers import TagSerializer
from backend.destinations.models import Destination
from backend.hotels.models import Hotel, Category, Highlights, HotelComment
from backend.travelers.serializers import TravelerSerializer


class HighlightsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Highlights
        fields = ['id', 'name']
        extra_kwargs = {
            "id": {"read_only": True},  # Ensure `id` is not required for creation
        }

    def to_internal_value(self, data):
        """
        Handle existing highlights gracefully by looking them up.
        """
        if isinstance(data, dict):
            highlights_id = data.get("id", None)
        elif isinstance(data, str):
            highlights_id = data.strip()
        else:
            raise serializers.ValidationError("Invalid highlights data format.")

        if highlights_id is None:
            raise serializers.ValidationError("Highlights ID is required.")

        try:
            highlights = Highlights.objects.get(id=highlights_id)
        except Highlights.DoesNotExist:
            raise serializers.ValidationError("Highlights not found.")

        return highlights


class HotelSerializer(serializers.ModelSerializer):
    # tags = serializers.PrimaryKeyRelatedField(queryset=Tag.objects.all(), many=True, required=False)
    tags = TagSerializer(many=True, required=False)
    highlights = HighlightsSerializer(many=True, required=False)

    class Meta:
        model = Hotel
        fields = ["id", "user", "name", "description", "location", "highlights", "website", "lat", "lng", "image", "image2", "image3", "price", "tags", "created_at", "modified_at"]
        extra_kwargs = {
            'user': {'read_only': True}
        }


    def create(self, validated_data):
        tags_data = validated_data.pop('tags', [])
        highlight_data = validated_data.pop('highlights', [])
        hotel = Hotel.objects.create(**validated_data)
        hotel.tags.set(tags_data)
        hotel.highlights.set(highlight_data)
        return hotel



    # def create(self, validated_data):
    #     tags_data = validated_data.pop('tags', [])
    #     hotel = Hotel.objects.create(**validated_data)
    #     hotel.tags.set(tags_data)
    #     return hotel

    def update(self, instance, validated_data):
        tags_data = validated_data.pop('tags', [])
        instance = super().update(instance, validated_data)
        instance.tags.clear()
        instance.tags.set(tags_data)
        return instance

    # def to_representation(self, instance):
    #     representation = super().to_representation(instance)
    #     representation['tags'] = [tag.name for tag in instance.tags.all()]
    #     return representation



    # tags = TagSerializer(many=True, required=False)
    #
    # class Meta:
    #     model = Hotel
    #     fields = ["id", "user", "name", "description", "location", "image", "image2", "image3", "price", "tags", "created_at", "modified_at"]
    #     extra_kwargs = {
    #         'user': {'read_only': True}
    #     }
    #
    # def create(self, validated_data):
    #     tags_data = validated_data.pop('tags', [])
    #     hotel = Hotel.objects.create(**validated_data)
    #     for tag_data in tags_data:
    #         tag, created = Tag.objects.get_or_create(name=tag_data['name'])
    #         hotel.tags.add(tag)
    #     return hotel
    #
    # def update(self, instance, validated_data):
    #     tags_data = validated_data.pop('tags', [])
    #     instance = super().update(instance, validated_data)
    #     instance.tags.clear()  # Clear existing tags
    #     for tag_data in tags_data:
    #         tag, created = Tag.objects.get_or_create(name=tag_data['name'])
    #         instance.tags.add(tag)
    #
    #     return instance

        # model = Hotel
        # fields = ["id", "user", "name", "description", "location", "image", "image2", "image3", "price", "tags", "created_at", "modified_at"]
        #
        # extra_kwargs = {
        #     'user': {'read_only': True}
        # }

    # def create(self, validated_data):
    #     tags_data = validated_data.pop('tags', [])
    #     hotel = Hotel.objects.create(**validated_data)
    #     for tag_data in tags_data:
    #         tag, created = Tag.objects.get_or_create(name=tag_data['name'])
    #         hotel.tags.add(tag)
    #     return hotel
    #
    # def update(self, instance, validated_data):
    #     tags_data = validated_data.pop('tags', None)
    #     instance = super().update(instance, validated_data)
    #     if tags_data is not None:
    #         instance.tags.set(tags_data)
    #     return instance

    # def update(self, instance, validated_data):
    #     tags_data = validated_data.pop('tags', [])
    #     instance = super().update(instance, validated_data)
    #
    #     instance.tags.clear()  # Clear existing tags
    #     for tag_data in tags_data:
    #         tag, created = Tag.objects.get_or_create(name=tag_data['name'])
    #         instance.tags.add(tag)
    #     return instance

class CategorySerializer(serializers.ModelSerializer):
    number_of_destinations = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'created_at', 'modified_at', 'number_of_destinations', ]
        extra_kwargs = {
            'slug': {'read_only': True}}

    def get_number_of_destinations(self, obj):
        return obj.get_number_of_destinations()


class HotelCommentSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()

    class Meta:
        model = HotelComment
        fields = ['id', 'user',   'name', 'email', 'hotel', 'text', 'created_at',
                  'modified_at']
        read_only_fields = ['user', 'created_at', 'modified_at']

    def get_user(self, obj):
        if not obj.user:
            return None
        if obj.user.role == 'traveler':
            return TravelerSerializer(obj.user.traveler).data
        elif obj.user.role == 'business':
            return BusinessSerializer(obj.user.business).data
        return UserSerializer(obj.user).data