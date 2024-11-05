from rest_framework import serializers

from backend.business.models import BusinessProfile
from backend.travelers.models import Traveler


class BusinessSerializer(serializers.ModelSerializer):
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
        model = BusinessProfile
        # exclude = [ 'activated']
        fields = '__all__'


