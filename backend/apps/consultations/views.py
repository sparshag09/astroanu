from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.conf import settings
from apps.consultations.models import Consultation, ConsultationFeedback
from apps.consultations.serializers import (
    ConsultationSerializer, ConsultationDetailSerializer,
    ConsultationCreateSerializer, ConsultationFeedbackCreateSerializer
)


class ConsultationViewSet(viewsets.ModelViewSet):
    """Consultation booking and management"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Users see only their consultations"""
        if self.request.user.is_staff:
            return Consultation.objects.all()
        return Consultation.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.action == 'create':
            return ConsultationCreateSerializer
        elif self.action == 'retrieve':
            return ConsultationDetailSerializer
        return ConsultationSerializer
    
    def create(self, request, *args, **kwargs):
        """Create new consultation"""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            consultation = serializer.save(
                user=request.user,
                price=settings.CONSULTATION_FEE,
                status='pending'
            )
            return Response(
                ConsultationSerializer(consultation).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def my_consultations(self, request):
        """Get all user consultations"""
        consultations = self.get_queryset()
        serializer = ConsultationSerializer(consultations, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def detail(self, request, pk=None):
        """Get consultation details"""
        consultation = self.get_object()
        serializer = ConsultationDetailSerializer(consultation)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def submit_feedback(self, request, pk=None):
        """Submit feedback for consultation"""
        consultation = self.get_object()
        
        if consultation.status != 'completed':
            return Response(
                {'error': 'Can only submit feedback for completed consultations'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if hasattr(consultation, 'feedback'):
            return Response(
                {'error': 'Feedback already submitted'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = ConsultationFeedbackCreateSerializer(data=request.data)
        if serializer.is_valid():
            feedback = serializer.save(consultation=consultation)
            return Response(
                ConsultationSerializer(consultation).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def process_payment(self, request, pk=None):
        """Process payment for consultation"""
        consultation = self.get_object()
        
        if consultation.is_paid:
            return Response(
                {'error': 'Consultation already paid'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # In production, use Stripe or similar payment gateway
        payment_id = request.data.get('payment_id')
        
        if not payment_id:
            return Response(
                {'error': 'Payment ID is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        consultation.payment_id = payment_id
        consultation.is_paid = True
        consultation.status = 'confirmed'
        consultation.save()
        
        return Response(
            ConsultationSerializer(consultation).data,
            status=status.HTTP_200_OK
        )
    
    @action(detail=True, methods=['get'], permission_classes=[permissions.IsAdminUser])
    def analytics(self, request, pk=None):
        """Get consultation analytics"""
        consultations = Consultation.objects.all()
        stats = {
            'total_consultations': consultations.count(),
            'pending': consultations.filter(status='pending').count(),
            'confirmed': consultations.filter(status='confirmed').count(),
            'completed': consultations.filter(status='completed').count(),
            'cancelled': consultations.filter(status='cancelled').count(),
            'total_revenue': sum(c.price for c in consultations if c.is_paid),
        }
        return Response(stats)
