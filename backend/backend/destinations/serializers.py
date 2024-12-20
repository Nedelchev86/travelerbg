from rest_framework import serializers

from backend.accounts.serializers import UserSerializer
from backend.activities.models import Activities
from backend.activities.serializers import ActivitiesSerializer
from backend.business.serializers import BusinessSerializer
from backend.core.models import Tag
from backend.core.serializers import TagSerializer
from backend.destinations.models import Destination, Category, DestinationRating, DestinationsComment, \
    FavoriteDestinations
from backend.hotels.models import Hotel
from backend.hotels.serializers import HotelSerializer
from backend.travelers.serializers import TravelerSerializer


class DestinationSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, required=False)
    # related_activities = serializers.SerializerMethodField()
    related_hotels = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    number_of_votes = serializers.SerializerMethodField()
    # lat = serializers.SerializerMethodField()
    # lng = serializers.SerializerMethodField()


    class Meta:
        model = Destination
        fields = [
            'id', 'user', 'title', 'category', 'description',
             'image', 'image2', 'image3', 'image4', 'image5',
             'location', 'lat', 'lng', 'time', 'is_published', 'created_at', 'modified_at',
            'tags', 'average_rating', 'number_of_votes', 'related_hotels',
        ]
        extra_kwargs = {
            'user': {'read_only': True}
        }
    def get_average_rating(self, obj):
            return obj.average_rating()

    def get_number_of_votes(self, obj):
            return obj.number_of_votes()

    # def get_lat(self, obj):
    #     return float(obj.lat) if obj.lat is not None else None
    #
    # def get_lng(self, obj):
    #     return float(obj.lng) if obj.lng is not None else None

    # def get_related_activities(self, obj):
    #     related_activities = obj.related_activities()
    #     return ActivitiesSerializer(related_activities, many=True).data


    # def get_related_activities(self, obj):
    #     tags = obj.tags.all()  # Get all tags related to the destination
    #     related_activities = Activities.objects.filter(tags__in=tags).distinct()
    #     return ActivitiesSerializer(related_activities, many=True).data
    #
    # def get_related_hotels(self, obj):
    #     tags = obj.tags.all()  # Get all tags related to the destination
    #     related_hotels = Hotel.objects.filter(tags__in=tags).distinct()
    #     return HotelSerializer(related_hotels, many=True).data

    def get_related_hotels(self, obj):
        related_hotels = obj.related_hotels()
        return HotelSerializer(related_hotels, many=True).data

    # def get_related_activities(self, obj):
    #     related_activities = obj.related_hotels()
    #     return ActivitiesSerializer(related_activities, many=True).data


    def create(self, validated_data):
        tags_data = validated_data.pop('tags', [])
        request = self.context.get('request', None)
        if request and hasattr(request, 'user'):
            validated_data['user'] = request.user
        destination = Destination.objects.create(**validated_data)
        destination.tags.set(tags_data)
        # for tag_data in tags_data:
        #     tag, created = Tag.objects.get_or_create(name=tag_data['name'])
        #     destination.tags.add(tag)
        return destination

    def update(self, instance, validated_data):
        tags_data = validated_data.pop('tags', [])
        instance = super().update(instance, validated_data)

        instance.tags.clear()  # Clear existing tags
        instance.tags.set(tags_data)
        return instance

# class DestinationSerializer(serializers.ModelSerializer):
#     tags = TagSerializer(many=True, required=False)
#     related_activities = serializers.SerializerMethodField()
#     related_hotels = serializers.SerializerMethodField()
#
#     class Meta:
#         model = Destination
#         fields = [
#             'id', 'user', 'title', 'category', 'basic_information', 'responsibilities',
#             'benefits', 'image', 'image2', 'image3', 'image4', 'image5', 'image6',
#             'vacancy', 'location', 'cost', 'is_published', 'created_at', 'modified_at',
#             'tags', 'related_activities', 'related_hotels'
#         ]
#         extra_kwargs = {
#             'user': {'read_only': True}
#         }
#
#     def get_related_activities(self, obj):
#         tags = obj.tags.all()  # Get all tags related to the destination
#         related_activities = Activities.objects.filter(tags__in=tags).distinct()
#         return ActivitiesSerializer(related_activities, many=True).data
#
#     def get_related_hotels(self, obj):
#         tags = obj.tags.all()  # Get all tags related to the destination
#         related_hotels = Hotel.objects.filter(tags__in=tags).distinct()
#         return HotelSerializer(related_hotels, many=True).data
#
#     def create(self, validated_data):
#         tags_data = validated_data.pop('tags', [])
#         destination = Destination.objects.create(**validated_data)
#         for tag_data in tags_data:
#             tag, created = Tag.objects.get_or_create(name=tag_data['name'])
#             destination.tags.add(tag)
#         return destination
#
#     def update(self, instance, validated_data):
#         tags_data = validated_data.pop('tags', [])
#         instance = super().update(instance, validated_data)
#
#         instance.tags.clear()  # Clear existing tags
#         for tag_data in tags_data:
#             tag, created = Tag.objects.get_or_create(name=tag_data['name'])
#             instance.tags.add(tag)
#         return instance

class CategorySerializer(serializers.ModelSerializer):
    number_of_destinations = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'created_at', 'modified_at', 'number_of_destinations', ]
        extra_kwargs = {
            'slug': {'read_only': True}}

    def get_number_of_destinations(self, obj):
        return obj.get_number_of_destinations()


class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = DestinationRating
        fields = ['id', 'user', 'destination', "rating", 'created_at', 'modified_at']
        extra_kwargs = {
            'user': {'read_only': True},
            'destination': {'read_only': True}}


class DestinationCommentSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()

    class Meta:
        model = DestinationsComment
        fields = ['id', 'user',   'name', 'email', 'destination', 'text', 'created_at',
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

class FavoriteDestinationSerializer(serializers.ModelSerializer):
    class Meta:
        model = FavoriteDestinations
        fields = ['user', 'destination', 'created_at']
        read_only_fields = ['created_at']