from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Hotel, Tag, Category, Highlights  # Ensure correct import paths
from cloudinary.models import CloudinaryField
from django.utils.html import format_html


@admin.register(Hotel)
class HotelAdmin(admin.ModelAdmin):
    # Fields to display in the admin list view
    list_display = (
        'id',
        'name',
        'user',
        'price',
        'location',

        'created_at',
        'modified_at',
        'image_preview',
        'image2_preview',
        'image3_preview'
    )

    # Fields to enable search functionality
    search_fields = (
        'name',
        'description',
        'user__username',
        'location'
    )

    # Fields to filter by in the admin sidebar
    list_filter = (
        'tags',
        'location',

        'created_at',
        'modified_at'
    )

    # Use horizontal filter widget for ManyToMany fields
    filter_horizontal = ('tags',)

    # Fields to display as read-only
    readonly_fields = ('created_at', 'modified_at', 'image_preview', 'image2_preview', 'image3_preview')

    # Define the layout of fields in the admin form
    fields = (
        'user',
        'name',
        'description',
        'image',
        'image_preview',
        'image2',
        'image2_preview',
        'image3',
        'image3_preview',
        'price',
        'tags',
        'location',


        'created_at',
        'modified_at'
    )

    # Default ordering of records
    ordering = ('-created_at',)

    # Custom methods to display image previews
    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="150" height="150" />', obj.image.url)
        return "No Image"

    image_preview.short_description = 'Image Preview'

    def image2_preview(self, obj):
        if obj.image2:
            return format_html('<img src="{}" width="150" height="150" />', obj.image2.url)
        return "No Image"

    image2_preview.short_description = 'Image 2 Preview'

    def image3_preview(self, obj):
        if obj.image3:
            return format_html('<img src="{}" width="150" height="150" />', obj.image3.url)
        return "No Image"

    image3_preview.short_description = 'Image 3 Preview'

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Highlights)
class HighlightsAdmin(admin.ModelAdmin):
    list_display = ('name',)
