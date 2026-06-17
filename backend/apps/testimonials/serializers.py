from rest_framework import serializers
from apps.testimonials.models import Testimonial


class TestimonialSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = Testimonial
        fields = ['id', 'user', 'user_name', 'user_email', 'title', 'content', 'rating', 'created_at']
        read_only_fields = ['id', 'created_at']


class TestimonialDetailSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    
    class Meta:
        model = Testimonial
        fields = ['id', 'user', 'user_name', 'title', 'content', 'rating', 'featured', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class TestimonialCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = ['title', 'content', 'rating']
