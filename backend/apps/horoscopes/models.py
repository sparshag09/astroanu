from django.db import models
import uuid


class ZodiacSign(models.Model):
    """Zodiac signs model"""
    ELEMENT_CHOICES = [
        ('fire', 'Fire'),
        ('earth', 'Earth'),
        ('air', 'Air'),
        ('water', 'Water'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=50, unique=True)
    symbol = models.CharField(max_length=10)
    date_range = models.CharField(max_length=50)
    element = models.CharField(max_length=10, choices=ELEMENT_CHOICES)
    ruling_planet = models.CharField(max_length=50)
    lucky_number = models.IntegerField()
    lucky_color = models.CharField(max_length=50)
    description = models.TextField()
    
    class Meta:
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Horoscope(models.Model):
    """Daily horoscope model"""
    HOROSCOPE_TYPE = [
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
        ('yearly', 'Yearly'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    zodiac_sign = models.ForeignKey(ZodiacSign, on_delete=models.CASCADE, related_name='horoscopes')
    
    date = models.DateField()
    horoscope_type = models.CharField(max_length=20, choices=HOROSCOPE_TYPE, default='daily')
    
    prediction = models.TextField()
    mood = models.CharField(max_length=50, blank=True)
    
    lucky_numbers = models.CharField(max_length=100)
    lucky_color = models.CharField(max_length=50, blank=True)
    lucky_day = models.CharField(max_length=50, blank=True)
    
    # Aspects
    love = models.IntegerField(default=5)  # 1-10 scale
    money = models.IntegerField(default=5)
    health = models.IntegerField(default=5)
    career = models.IntegerField(default=5)
    family = models.IntegerField(default=5)
    
    advice = models.TextField(blank=True)
    caution = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-date', 'zodiac_sign']
        unique_together = ['zodiac_sign', 'date', 'horoscope_type']
    
    def __str__(self):
        return f"{self.zodiac_sign.name} - {self.date}"


class CosmicEvent(models.Model):
    """Cosmic events (eclipses, full moons, etc.)"""
    CATEGORY_CHOICES = [
        ('eclipse', 'Eclipse'),
        ('full_moon', 'Full Moon'),
        ('new_moon', 'New Moon'),
        ('planetary_alignment', 'Planetary Alignment'),
        ('retrograde', 'Retrograde'),
        ('other', 'Other'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    
    event_date = models.DateTimeField()
    description = models.TextField()
    impact = models.TextField()
    
    affected_signs = models.ManyToManyField(ZodiacSign, related_name='cosmic_events')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-event_date']
    
    def __str__(self):
        return f"{self.title} - {self.event_date}"
