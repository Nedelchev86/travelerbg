from rest_framework import serializers

from backend.travelers.models import Traveler, Rating


class TravelerSerializer(serializers.ModelSerializer):
    average_rating = serializers.SerializerMethodField()
    number_of_votes = serializers.SerializerMethodField()
    published_destinations_count = serializers.SerializerMethodField()
    published_activities_count = serializers.SerializerMethodField()

    class Meta:
        model = Traveler
        # exclude = [ 'activated']

        fields = [
            'user', 'name', 'city', 'occupation',
            'website', 'instagram', 'facebook', 'youtube', 'linkedin','instagram', 'about', 'phone_number',
            'profile_picture', 'cover', 'activated', 'average_rating', 'number_of_votes', 'published_destinations_count', 'published_activities_count'
        ]
        extra_kwargs = {
            'user': {'read_only': True}


        }

    def get_average_rating(self, obj):
            return obj.average_rating()

    def get_number_of_votes(self, obj):
            return obj.number_of_votes()

    def get_published_destinations_count(self, obj):
        return obj.count_published_destinations()

    def get_published_activities_count(self, obj):
        return obj.count_published_activities()


class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ['id', 'user', 'traveler', 'rating', 'created_at', 'modified_at']
        extra_kwargs = {
            'user': {'read_only': True},
            'traveler': {'read_only': True}}