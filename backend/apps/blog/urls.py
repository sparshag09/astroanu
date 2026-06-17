from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.blog.views import BlogPostViewSet, BlogCategoryViewSet

router = DefaultRouter()
router.register(r'posts', BlogPostViewSet, basename='blog-post')
router.register(r'categories', BlogCategoryViewSet, basename='blog-category')

urlpatterns = [
    path('', include(router.urls)),
]
