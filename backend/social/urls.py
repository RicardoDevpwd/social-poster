from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SocialAccountViewSet

router = DefaultRouter()
router.register("accounts", SocialAccountViewSet, basename="social-account")

urlpatterns = [
    path("", include(router.urls)),
]
