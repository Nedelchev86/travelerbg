from rest_framework import serializers

from backend.business.models import BusinessProfile
from backend.travelers.models import Traveler


class BusinessSerializer(serializers.ModelSerializer):

    class Meta:
        model = BusinessProfile
        # exclude = [ 'activated']
        fields = '__all__'

        extra_kwargs = {
            'user': {'read_only': True}
        }


