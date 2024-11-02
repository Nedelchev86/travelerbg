from django.contrib import admin
from .models import Activities, Tag
from django.db import models

# Register your models here.
class ActivitiesAdmin(admin.ModelAdmin):
    # List display fields
    list_display = ['title', 'user', 'price', 'time',]
    list_filter = ['user', 'tags', 'price']
    search_fields = ['title', 'description']

    # Fields to be displayed in the form for adding/editing
    fields = ['user', 'title', 'description', 'image', 'image2', 'image3', 'price', 'time', 'tags']

    # Widget for tags
    filter_horizontal = ('tags',)

    # Display fields for the form
    formfield_overrides = {
        models.ManyToManyField: {'widget': admin.widgets.FilteredSelectMultiple('Tags', is_stacked=False)},
    }

    # Optional: Add ordering of items


    # Read-only fields (if you want to show the timestamp fields as read-only)



# Register models in the admin panel
admin.site.register(Activities, ActivitiesAdmin)