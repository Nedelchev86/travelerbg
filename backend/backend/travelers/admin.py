from django.contrib import admin

from backend.travelers.models import Traveler


@admin.register(Traveler)
class JobSeekerAdmin(admin.ModelAdmin):
    list_display = ('user', 'name', 'city', 'occupation', 'activated', 'average_rating')
    list_filter = ('city', 'occupation', 'activated')
    search_fields = ('user__username', 'name', 'city', 'occupation')
    readonly_fields = ('user',)

#
# @admin.register(Education)
# class EducationAdmin(admin.ModelAdmin):
#     list_display = ('job_seeker', 'institution', 'start_date', 'end_date')
#     list_filter = ('institution', 'start_date', 'end_date')
#     search_fields = ('job_seeker__user__username', 'institution', 'description')
#     # readonly_fields = ['job_seeker']
#
#
# @admin.register(Experience)
# class ExperienceAdmin(admin.ModelAdmin):
#     list_display = ('job_seeker', 'company', 'start_date', 'end_date')
#     list_filter = ('company', 'start_date', 'end_date')
#     search_fields = ('job_seeker__user__username', 'company', 'description')
#     readonly_fields = ['job_seeker']
