from rest_framework import serializers

from traveler.destinations.models import Destination


class DestinationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Destination
        fields = '__all__'  # Include all fields, or you can specify fields explicitly