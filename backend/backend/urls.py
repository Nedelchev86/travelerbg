
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from backend.accounts.views import UserRegistrationAPIView, MyTokenObtainPairView, MyTokenRefreshView, UserProfileView
from backend.activities.views import ActivitiesViewSet
from backend.destinations.views import DestinationViewSet
from backend.hotels.views import HotelViewSet
from backend.travelers.views import TravelerkerViewSet, TravelerkerUpdateAPIView

router = DefaultRouter()
# router.register(r'api/company', CompanyProfileViewSet)
router.register(r'api/travelers', TravelerkerViewSet)
router.register(r'api/destinations', DestinationViewSet)
router.register(r'api/activities', ActivitiesViewSet)
router.register(r'api/hotels', HotelViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include(router.urls)),
    path('api/register/', UserRegistrationAPIView.as_view(), name='user-registration'),
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),  # Endpoint to obtain JWT token
    path('api/token/refresh/', MyTokenRefreshView.as_view(), name='token_refresh'),
    path('api/user/', UserProfileView.as_view(), name='user-profile'),
    path('api/traveler/update/', TravelerkerUpdateAPIView.as_view(), name='traveler-update'),
]
