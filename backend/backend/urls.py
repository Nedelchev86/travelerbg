
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from backend.activities.views import ActivitiesViewSet
from backend.destinations.views import DestinationViewSet
from backend.hotels.views import HotelViewSet
from backend.travelers.views import TravelerkerViewSet

router = DefaultRouter()
# router.register(r'api/company', CompanyProfileViewSet)
router.register(r'api/travelers', TravelerkerViewSet)
router.register(r'api/destinations', DestinationViewSet)
router.register(r'api/activities', ActivitiesViewSet)
router.register(r'api/hotels', HotelViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include(router.urls)),
]
