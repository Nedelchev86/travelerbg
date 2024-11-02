from rest_framework import serializers

from backend.core.models import Tag
from backend.destinations.models import Destination


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']
