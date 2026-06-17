from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.horoscopes.views import ZodiacSignViewSet, HoroscopeViewSet, CosmicEventViewSet

router = DefaultRouter()
router.register(r'zodiac-signs', ZodiacSignViewSet, basename='zodiac-sign')
router.register(r'horoscopes', HoroscopeViewSet, basename='horoscope')
router.register(r'cosmic-events', CosmicEventViewSet, basename='cosmic-event')

urlpatterns = [
    path('', include(router.urls)),
]
