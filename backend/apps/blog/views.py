from rest_framework import viewsets, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from apps.blog.models import BlogPost, BlogCategory, BlogComment
from apps.blog.serializers import (
    BlogPostSerializer, BlogPostDetailSerializer, BlogPostCreateUpdateSerializer,
    BlogCategorySerializer, BlogCommentSerializer
)


class BlogPostViewSet(viewsets.ModelViewSet):
    """Blog post management"""
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'is_published']
    search_fields = ['title', 'excerpt', 'content']
    ordering_fields = ['publish_date', 'views_count', 'created_at']
    ordering = ['-publish_date']
    
    def get_queryset(self):
        queryset = BlogPost.objects.filter(is_published=True)
        if self.request.user.is_staff:
            queryset = BlogPost.objects.all()
        return queryset
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return BlogPostDetailSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return BlogPostCreateUpdateSerializer
        return BlogPostSerializer
    
    def create(self, request, *args, **kwargs):
        """Create blog post (admin only)"""
        if not request.user.is_staff:
            return Response(
                {'error': 'Only staff can create blog posts'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(author=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def retrieve(self, request, *args, **kwargs):
        """Get post with incremented view count"""
        instance = self.get_object()
        instance.views_count += 1
        instance.save(update_fields=['views_count'])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured posts"""
        posts = BlogPost.objects.filter(is_published=True).order_by('-views_count')[:6]
        serializer = BlogPostSerializer(posts, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def latest(self, request):
        """Get latest posts"""
        posts = BlogPost.objects.filter(is_published=True)[:6]
        serializer = BlogPostSerializer(posts, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def add_comment(self, request, pk=None):
        """Add comment to blog post"""
        post = self.get_object()
        content = request.data.get('content')
        
        if not content:
            return Response(
                {'error': 'Comment content is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        comment = BlogComment.objects.create(
            post=post,
            author=request.user,
            content=content,
            is_approved=False
        )
        
        serializer = BlogCommentSerializer(comment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class BlogCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """Blog categories"""
    queryset = BlogCategory.objects.all()
    serializer_class = BlogCategorySerializer
    permission_classes = [permissions.AllowAny]
