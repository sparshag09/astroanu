from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.consultations.views import ConsultationViewSet

router = DefaultRouter()
router.register(r'', ConsultationViewSet, basename='consultation')

urlpatterns = [
    path('', include(router.urls)),
]
