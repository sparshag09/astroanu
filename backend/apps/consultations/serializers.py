from rest_framework import serializers
from apps.consultations.models import Consultation, ConsultationFeedback


class ConsultationFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConsultationFeedback
        fields = ['id', 'rating', 'comment', 'created_at']
        read_only_fields = ['created_at']


class ConsultationSerializer(serializers.ModelSerializer):
    feedback = ConsultationFeedbackSerializer(read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = Consultation
        fields = [
            'id', 'user', 'user_email', 'topic', 'description', 'questions',
            'birth_date', 'birth_time', 'birth_place', 'assigned_astrologer',
            'status', 'price', 'payment_id', 'is_paid', 'response',
            'response_file', 'scheduled_date', 'completed_date', 'feedback',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'user', 'price', 'payment_id', 'is_paid', 'response',
            'response_file', 'assigned_astrologer', 'completed_date',
            'created_at', 'updated_at'
        ]


class ConsultationDetailSerializer(serializers.ModelSerializer):
    feedback = ConsultationFeedbackSerializer(read_only=True)
    user_details = serializers.SerializerMethodField()
    
    class Meta:
        model = Consultation
        fields = '__all__'
        read_only_fields = [
            'id', 'user', 'price', 'payment_id', 'is_paid', 'response',
            'response_file', 'assigned_astrologer', 'completed_date',
            'created_at', 'updated_at'
        ]
    
    def get_user_details(self, obj):
        return {
            'id': obj.user.id,
            'email': obj.user.email,
            'name': obj.user.get_full_name(),
        }


class ConsultationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Consultation
        fields = ['topic', 'description', 'questions', 'birth_date', 'birth_time', 'birth_place']


class ConsultationFeedbackCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConsultationFeedback
        fields = ['rating', 'comment']
