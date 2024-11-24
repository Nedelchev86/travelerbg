from rest_framework import serializers
from rest_framework.templatetags.rest_framework import highlight_code

from backend.accounts.serializers import UserSerializer
from backend.business.serializers import BusinessSerializer
from backend.core.models import Tag
from backend.core.serializers import TagSerializer
from backend.destinations.models import Destination
from backend.hotels.models import Hotel, Category, Highlights, HotelComment, HotelRating, FavoriteHotels
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
    average_rating = serializers.SerializerMethodField()
    number_of_votes = serializers.SerializerMethodField()
    highlights = HighlightsSerializer(many=True, required=False)
    pagination_class = 10
    lat = serializers.SerializerMethodField()
    lng = serializers.SerializerMethodField()

    class Meta:
        model = Hotel
        fields = ["id", "user", "name", "category", "description", "location", "highlights", "website", "lat", "lng", "image", "image2", "image3", "image4", "price", "tags", "created_at", "modified_at", 'average_rating', 'number_of_votes']
        extra_kwargs = {
            'user': {'read_only': True}
        }

    def get_average_rating(self, obj):
            return obj.average_rating()

    def get_number_of_votes(self, obj):
            return obj.number_of_votes()

    def get_lat(self, obj):
        return float(obj.lat) if obj.lat is not None else None

    def get_lng(self, obj):
        return float(obj.lng) if obj.lng is not None else None

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
        highlights_data = validated_data.pop('highlights', [])
        instance = super().update(instance, validated_data)
        instance.tags.clear()
        instance.tags.set(tags_data)
        instance.highlights.clear()
        instance.highlights.set(highlights_data)
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
    number_of_hotels = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'created_at', 'modified_at', 'number_of_hotels', ]
        extra_kwargs = {
            'slug': {'read_only': True}}

    def get_number_of_hotels(self, obj):
        return obj.get_number_of_hotels()


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

class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = HotelRating
        fields = ['id', 'user', 'hotel', "rating", 'created_at', 'modified_at']
        extra_kwargs = {
            'user': {'read_only': True},
            'hotel': {'read_only': True}}


class FavoriteHotelSerializer(serializers.ModelSerializer):
    class Meta:
        model = FavoriteHotels
        fields = ['user', 'hotel', 'created_at']
        read_only_fields = ['created_at']