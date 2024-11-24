from django.contrib import admin

from backend.destinations.models import Destination, Category


# Register your models here.
@admin.register(Destination)
class DestinationAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'location', 'is_published')
    list_filter = ('category', 'location', 'is_published')
    search_fields = ('title', 'description', 'location', )
    # prepopulated_fields = {'slug': ('title',)}
    # readonly_fields = ["user"]

    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        form.base_fields['tags'].widget.can_add_related = True  # Disable the "Add Tag" button
        return form


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)
    prepopulated_fields = {'slug': ('name',)}

