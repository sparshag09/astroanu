from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from datetime import timedelta
from apps.horoscopes.models import ZodiacSign, Horoscope, CosmicEvent
from apps.horoscopes.serializers import (
    ZodiacSignSerializer, HoroscopeSerializer, HoroscopeDetailSerializer,
    CosmicEventSerializer, CosmicEventDetailSerializer
)


class ZodiacSignViewSet(viewsets.ReadOnlyModelViewSet):
    """Zodiac signs"""
    queryset = ZodiacSign.objects.all()
    serializer_class = ZodiacSignSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'element']


class HoroscopeViewSet(viewsets.ReadOnlyModelViewSet):
    """Horoscope management"""
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['zodiac_sign', 'horoscope_type', 'date']
    search_fields = ['prediction', 'advice']
    ordering_fields = ['date', 'created_at']
    ordering = ['-date']
    
    def get_queryset(self):
        return Horoscope.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return HoroscopeDetailSerializer
        return HoroscopeSerializer
    
    @action(detail=False, methods=['get'])
    def today(self, request):
        """Get today's horoscopes for all signs"""
        today = timezone.now().date()
        horoscopes = Horoscope.objects.filter(date=today, horoscope_type='daily')
        serializer = HoroscopeSerializer(horoscopes, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_sign(self, request):
        """Get horoscope for a specific sign"""
        sign_name = request.query_params.get('sign')
        horoscope_type = request.query_params.get('type', 'daily')
        
        if not sign_name:
            return Response({'error': 'Sign parameter is required'}, status=400)
        
        try:
            sign = ZodiacSign.objects.get(name__iexact=sign_name)
            horoscopes = Horoscope.objects.filter(
                zodiac_sign=sign,
                horoscope_type=horoscope_type
            ).order_by('-date')[:7]
            
            serializer = HoroscopeSerializer(horoscopes, many=True)
            return Response(serializer.data)
        except ZodiacSign.DoesNotExist:
            return Response({'error': 'Zodiac sign not found'}, status=404)
    
    @action(detail=False, methods=['get'])
    def weekly(self, request):
        """Get weekly horoscopes"""
        today = timezone.now().date()
        horoscopes = Horoscope.objects.filter(date=today, horoscope_type='weekly')
        serializer = HoroscopeSerializer(horoscopes, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def monthly(self, request):
        """Get monthly horoscopes"""
        today = timezone.now().date()
        horoscopes = Horoscope.objects.filter(date=today, horoscope_type='monthly')
        serializer = HoroscopeSerializer(horoscopes, many=True)
        return Response(serializer.data)


class CosmicEventViewSet(viewsets.ReadOnlyModelViewSet):
    """Cosmic events"""
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category']
    search_fields = ['title', 'description']
    ordering_fields = ['event_date']
    ordering = ['-event_date']
    
    def get_queryset(self):
        return CosmicEvent.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return CosmicEventDetailSerializer
        return CosmicEventSerializer
    
    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        """Get upcoming cosmic events"""
        today = timezone.now()
        events = CosmicEvent.objects.filter(
            event_date__gte=today
        ).order_by('event_date')[:10]
        serializer = CosmicEventSerializer(events, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def this_month(self, request):
        """Get cosmic events this month"""
        today = timezone.now().date()
        month_start = today.replace(day=1)
        if today.month == 12:
            month_end = month_start.replace(year=today.year + 1, month=1, day=1) - timedelta(days=1)
        else:
            month_end = month_start.replace(month=today.month + 1, day=1) - timedelta(days=1)
        
        events = CosmicEvent.objects.filter(
            event_date__date__gte=month_start,
            event_date__date__lte=month_end
        ).order_by('event_date')
        
        serializer = CosmicEventSerializer(events, many=True)
        return Response(serializer.data)
