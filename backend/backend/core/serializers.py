from rest_framework import serializers

from backend.core.models import Tag
from backend.destinations.models import Destination


class TagSerializer(serializers.ModelSerializer):

    class Meta:
        model = Tag
        fields = ['id', 'name']

    extra_kwargs = {
        "id": {"read_only": True},  # Ensure `id` is not required for creation
    }


    def to_internal_value(self, data):
        """
        Handle existing tags gracefully by looking them up.
        """
        if isinstance(data, dict):
            tag_name = data.get("name", "").strip().lower()
        elif isinstance(data, str):
            tag_name = data.strip().lower()
        else:
            raise serializers.ValidationError("Invalid tag data format.")

        # Check if the tag already exists
        tag, created = Tag.objects.get_or_create(name=tag_name)
        return tag

    # def to_internal_value(self, data):
    #     """
    #     Handle existing tags gracefully by looking them up.
    #     """
    #     if isinstance(data, dict):
    #         tag_name = data.get("name", "").strip().lower()
    #     elif isinstance(data, str):
    #         tag_name = data.strip().lower()
    #     else:
    #         raise serializers.ValidationError("Invalid tag data format.")
    #
    #     # Check if the tag already exists
    #     tag, created = Tag.objects.get_or_create(name=tag_name)
    #     return tag  # Return the existing or newly created tag instance


class TagSerializerWitoutId(serializers.ModelSerializer):
    name = serializers.CharField(max_length=50)
    # class Meta:
    #     model = Tag
    #     fields = ['id', 'name']
    #
    # extra_kwargs = {
    #     "id": {"read_only": True},  # Ensure `id` is not required for creation
    # }
    #
    # def to_internal_value(self, data):
    #     """
    #     Handle existing tags gracefully by looking them up.
    #     """
    #
    #     if isinstance(data, dict):
    #         tag_name = data.get("name", "").strip().lower()
    #     elif isinstance(data, str):
    #         tag_name = data.strip().lower()
    #     else:
    #         raise serializers.ValidationError("Invalid tag data format.")
    #
    #     # Check if the tag already exists
    #     tag, created = Tag.objects.get_or_create(name=tag_name)
    #     return tag  # Return the existing or newly created tag instance
