from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.testimonials.models import Testimonial
from apps.testimonials.serializers import (
    TestimonialSerializer, TestimonialDetailSerializer, TestimonialCreateSerializer
)


class TestimonialViewSet(viewsets.ModelViewSet):
    """Testimonials management"""
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        """Only show approved testimonials to public"""
        if self.request.user.is_staff:
            return Testimonial.objects.all()
        return Testimonial.objects.filter(is_approved=True)
    
    def get_serializer_class(self):
        if self.action == 'create':
            return TestimonialCreateSerializer
        elif self.action == 'retrieve':
            return TestimonialDetailSerializer
        return TestimonialSerializer
    
    def create(self, request, *args, **kwargs):
        """Create testimonial"""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured testimonials"""
        testimonials = Testimonial.objects.filter(
            is_approved=True,
            featured=True
        ).order_by('-created_at')[:5]
        serializer = TestimonialSerializer(testimonials, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def top_rated(self, request):
        """Get top rated testimonials"""
        testimonials = Testimonial.objects.filter(
            is_approved=True
        ).order_by('-rating', '-created_at')[:5]
        serializer = TestimonialSerializer(testimonials, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def my_testimonials(self, request):
        """Get user's testimonials"""
        testimonials = Testimonial.objects.filter(user=request.user)
        serializer = TestimonialSerializer(testimonials, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get testimonials statistics"""
        all_testimonials = Testimonial.objects.all()
        stats = {
            'total_testimonials': all_testimonials.count(),
            'approved_testimonials': all_testimonials.filter(is_approved=True).count(),
            'average_rating': round(
                sum(t.rating for t in all_testimonials) / max(all_testimonials.count(), 1), 1
            ),
            'featured_count': all_testimonials.filter(featured=True).count(),
        }
        return Response(stats)
