from rest_framework import serializers

from traveler.core.models import Tag
from traveler.destinations.models import Destination


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']
