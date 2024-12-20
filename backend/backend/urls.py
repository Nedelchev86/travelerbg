
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from backend.accounts.views import UserRegistrationAPIView, MyTokenObtainPairView, MyTokenRefreshView, UserProfileView
from backend.activities.views import ActivitiesViewSet, ActivitiesCategory, FavoriteActivityViewSet
from backend.business.views import BusinessProfileViewSet
from backend.core.views import TagViewSet
from backend.destinations.views import DestinationViewSet, DestinationCategory, DestinationCommentCreateView, \
    DestinationCommentListView
from backend.hotels.models import Highlights
from backend.hotels.views import HotelViewSet, HighlightsViewSet, HotelCommentListView, \
    HotelCommentCreateView, HotelsCategory
from backend.travelers.views import TravelerkerViewSet, TravelerkerUpdateAPIView

router = DefaultRouter()
# router.register(r'api/company', CompanyProfileViewSet)
router.register(r'api/travelers', TravelerkerViewSet)
router.register(r'api/destinations', DestinationViewSet)
router.register(r'api/activities', ActivitiesViewSet)
router.register(r'api/hotels', HotelViewSet)
router.register(r'api/tags', TagViewSet)
router.register(r'api/highlights', HighlightsViewSet)
router.register(r'api/business', BusinessProfileViewSet)
router.register(r'api/favorite-activities', FavoriteActivityViewSet, basename='favorite-activity')







urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include(router.urls)),
    path('api/register/', UserRegistrationAPIView.as_view(), name='user-registration'),
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),  # Endpoint to obtain JWT token
    path('api/token/refresh/', MyTokenRefreshView.as_view(), name='token_refresh'),
    path('api/user/', UserProfileView.as_view(), name='user-profile'),
    path('api/traveler/update/', TravelerkerUpdateAPIView.as_view(), name='traveler-update'),
    path('api/categories/', DestinationCategory.as_view(), name='destination-category'),

    path('api/categories/hotels/', HotelsCategory.as_view(), name='hotel-category'),
    path('api/categories/activities/', ActivitiesCategory.as_view(), name='activities-category'),
    path('api/hotels/<int:hotel_id>/comments/', HotelCommentListView.as_view(), name='hotel-comment-list'),
    path('api/hotels/<int:hotel_id>/comments/add/', HotelCommentCreateView.as_view(), name='hotel-comment-add'),


    path('api/destinations/<int:destination_id>/comments/', DestinationCommentListView.as_view(), name='destination-comment-list'),
    path('api/destinations/<int:destination_id>/comments/add/', DestinationCommentCreateView.as_view(), name='destination-comment-add'),


]
