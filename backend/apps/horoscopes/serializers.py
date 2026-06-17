from rest_framework import serializers
from apps.horoscopes.models import ZodiacSign, Horoscope, CosmicEvent


class ZodiacSignSerializer(serializers.ModelSerializer):
    class Meta:
        model = ZodiacSign
        fields = [
            'id', 'name', 'symbol', 'date_range', 'element', 'ruling_planet',
            'lucky_number', 'lucky_color', 'description'
        ]


class HoroscopeSerializer(serializers.ModelSerializer):
    zodiac_name = serializers.CharField(source='zodiac_sign.name', read_only=True)
    
    class Meta:
        model = Horoscope
        fields = [
            'id', 'zodiac_sign', 'zodiac_name', 'date', 'horoscope_type',
            'prediction', 'mood', 'lucky_numbers', 'lucky_color', 'lucky_day',
            'love', 'money', 'health', 'career', 'family', 'advice', 'caution'
        ]
        read_only_fields = ['id']


class HoroscopeDetailSerializer(serializers.ModelSerializer):
    zodiac_details = ZodiacSignSerializer(source='zodiac_sign', read_only=True)
    
    class Meta:
        model = Horoscope
        fields = [
            'id', 'zodiac_sign', 'zodiac_details', 'date', 'horoscope_type',
            'prediction', 'mood', 'lucky_numbers', 'lucky_color', 'lucky_day',
            'love', 'money', 'health', 'career', 'family', 'advice', 'caution',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class CosmicEventSerializer(serializers.ModelSerializer):
    affected_signs_data = ZodiacSignSerializer(source='affected_signs', many=True, read_only=True)
    
    class Meta:
        model = CosmicEvent
        fields = [
            'id', 'title', 'category', 'event_date', 'description', 'impact',
            'affected_signs', 'affected_signs_data'
        ]


class CosmicEventDetailSerializer(serializers.ModelSerializer):
    affected_signs_data = ZodiacSignSerializer(source='affected_signs', many=True, read_only=True)
    
    class Meta:
        model = CosmicEvent
        fields = [
            'id', 'title', 'category', 'event_date', 'description', 'impact',
            'affected_signs', 'affected_signs_data', 'created_at', 'updated_at'
        ]
