from rest_framework import serializers

from backend.travelers.models import Traveler


class TravelerSerializer(serializers.ModelSerializer):
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
        fields = '__all__'
        extra_kwargs = {
            'user': {'read_only': True}
        }



