from rest_framework import serializers

from backend.business.models import BusinessProfile
from backend.travelers.models import Traveler


class BusinessSerializer(serializers.ModelSerializer):
    published_activities_count = serializers.SerializerMethodField()
    published_hotels_count = serializers.SerializerMethodField()

    class Meta:
        model = BusinessProfile
        # exclude = [ 'activated']
        fields = '__all__'

        extra_kwargs = {
            'user': {'read_only': True}
        }

    def get_published_hotels_count(self, obj):
        return obj.count_published_hotels()

    def get_published_activities_count(self, obj):
        return obj.count_published_activities()

