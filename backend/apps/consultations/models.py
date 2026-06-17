from django.db import models
from apps.accounts.models import CustomUser
import uuid


class Consultation(models.Model):
    """Consultation booking model"""
    
    STATUS_CHOICES = [
        ('pending', 'Pending Payment'),
        ('confirmed', 'Confirmed'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    TOPIC_CHOICES = [
        ('career', 'Career & Professional Growth'),
        ('marriage', 'Marriage & Relationships'),
        ('finance', 'Finance & Wealth'),
        ('health', 'Health & Wellness'),
        ('education', 'Education & Learning'),
        ('spirituality', 'Spiritual Growth'),
        ('family', 'Family Matters'),
        ('general', 'General Life Guidance'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='consultations')
    
    # Consultation Details
    topic = models.CharField(max_length=50, choices=TOPIC_CHOICES)
    description = models.TextField()
    questions = models.TextField()
    
    # Birth Details
    birth_date = models.DateField()
    birth_time = models.TimeField()
    birth_place = models.CharField(max_length=255)
    
    # Astrologer Details
    assigned_astrologer = models.CharField(max_length=255, blank=True, null=True)
    
    # Status & Pricing
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    payment_id = models.CharField(max_length=255, blank=True, null=True)
    is_paid = models.BooleanField(default=False)
    
    # Response
    response = models.TextField(blank=True, null=True)
    response_file = models.FileField(upload_to='consultations/', blank=True, null=True)
    
    # Scheduling
    scheduled_date = models.DateTimeField(null=True, blank=True)
    completed_date = models.DateTimeField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Consultation'
        verbose_name_plural = 'Consultations'
    
    def __str__(self):
        return f"Consultation - {self.user.email} ({self.get_status_display()})"


class ConsultationFeedback(models.Model):
    """Feedback for consultations"""
    RATING_CHOICES = [(i, str(i)) for i in range(1, 6)]
    
    consultation = models.OneToOneField(Consultation, on_delete=models.CASCADE, related_name='feedback')
    rating = models.IntegerField(choices=RATING_CHOICES)
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Feedback for {self.consultation.id} - {self.rating} stars"
