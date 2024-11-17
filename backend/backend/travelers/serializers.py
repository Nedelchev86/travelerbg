from rest_framework import serializers

from backend.travelers.models import Traveler, Rating


class TravelerSerializer(serializers.ModelSerializer):
    average_rating = serializers.SerializerMethodField()
    number_of_votes = serializers.SerializerMethodField()
    # skills = serializers.SlugRelatedField(
    #     queryset=Skills.objects.all(),
    #     many=True,  # Allow multiple skills
    #     slug_field='name'  # Use the 'name' field of the Skills model
    # )
    # seniority = serializers.SlugRelatedField(
    #     queryset=Seniority.objects.all(),  # Ensure this queryset is correct
    #     slug_field='name'
    # )
    class Meta:
        model = Traveler
        # exclude = [ 'activated']

        fields = [
            'user', 'name', 'city', 'nationality', 'occupation',
            'website', 'linkedin', 'facebook', 'github', 'about', 'phone_number',
            'profile_picture', 'cover', 'activated', 'average_rating', 'number_of_votes'
        ]
        extra_kwargs = {
            'user': {'read_only': True}


        }

    def get_average_rating(self, obj):
            return obj.average_rating()

    def get_number_of_votes(self, obj):
            return obj.number_of_votes()



class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ['id', 'user', 'traveler', 'rating', 'created_at', 'modified_at']
        extra_kwargs = {
            'user': {'read_only': True},
            'traveler': {'read_only': True}}