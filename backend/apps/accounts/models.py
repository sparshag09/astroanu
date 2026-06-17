from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import FileExtensionValidator
from django.utils import timezone

class CustomUser(AbstractUser):
    """Extended user model with additional fields for astrology"""
    
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    ]
    
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    profile_picture = models.ImageField(
        upload_to='profiles/',
        null=True,
        blank=True,
        validators=[FileExtensionValidator(['png', 'jpg', 'jpeg'])]
    )
    
    # Astrological Information
    birth_date = models.DateField(null=True, blank=True)
    birth_time = models.TimeField(null=True, blank=True)
    birth_place = models.CharField(max_length=255, blank=True, null=True)
    birth_latitude = models.FloatField(null=True, blank=True)
    birth_longitude = models.FloatField(null=True, blank=True)
    
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, blank=True)
    zodiac_sign = models.CharField(max_length=50, blank=True)
    moon_sign = models.CharField(max_length=50, blank=True)
    rising_sign = models.CharField(max_length=50, blank=True)
    
    # Profile Information
    bio = models.TextField(blank=True, null=True)
    occupation = models.CharField(max_length=100, blank=True)
    
    # Preferences
    is_verified = models.BooleanField(default=False)
    receive_emails = models.BooleanField(default=True)
    receive_sms = models.BooleanField(default=False)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_login_ip = models.GenericIPAddressField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'User'
        verbose_name_plural = 'Users'
    
    def __str__(self):
        return f"{self.get_full_name()} ({self.email})"
    
    def get_zodiac_sign(self):
        """Calculate zodiac sign from birth date"""
        if not self.birth_date:
            return None
        
        zodiac_signs = [
            ((3, 21), (4, 19), 'Aries'),
            ((4, 20), (5, 20), 'Taurus'),
            ((5, 21), (6, 20), 'Gemini'),
            ((6, 21), (7, 22), 'Cancer'),
            ((7, 23), (8, 22), 'Leo'),
            ((8, 23), (9, 22), 'Virgo'),
            ((9, 23), (10, 22), 'Libra'),
            ((10, 23), (11, 21), 'Scorpio'),
            ((11, 22), (12, 21), 'Sagittarius'),
            ((12, 22), (1, 19), 'Capricorn'),
            ((1, 20), (2, 18), 'Aquarius'),
            ((2, 19), (3, 20), 'Pisces'),
        ]
        
        month, day = self.birth_date.month, self.birth_date.day
        
        for (start_month, start_day), (end_month, end_day), sign in zodiac_signs:
            if (month == start_month and day >= start_day) or (month == end_month and day <= end_day):
                return sign
        
        return None


class UserVerificationToken(models.Model):
    """Token for email verification"""
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    token = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)
    
    def __str__(self):
        return f"Verification token for {self.user.email}"
    
    def is_valid(self):
        return not self.is_used and timezone.now() < self.expires_at


class PasswordResetToken(models.Model):
    """Token for password reset"""
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    token = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)
    
    def __str__(self):
        return f"Password reset token for {self.user.email}"
    
    def is_valid(self):
        return not self.is_used and timezone.now() < self.expires_at
