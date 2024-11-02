from django.contrib import admin

from backend.business.models import BusinessProfile


@admin.register(BusinessProfile)
class CompanyProfileAdmin(admin.ModelAdmin):
    list_display = ('user' ,'name', 'location', 'email', 'activated')
    list_filter = ('activated', 'location')
    search_fields = ('name', 'location', 'email')

    # def get_all_applicant(self, obj):
    #     return obj.get_all_applicant
    # get_all_applicant.short_description = 'Total Applicants'