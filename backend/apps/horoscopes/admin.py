from django.contrib import admin
from apps.horoscopes.models import ZodiacSign, Horoscope, CosmicEvent

@admin.register(ZodiacSign)
class ZodiacSignAdmin(admin.ModelAdmin):
    list_display  = ('name', 'symbol', 'element', 'ruling_planet', 'date_range', 'lucky_number', 'lucky_color')
    list_filter   = ('element',)
    search_fields = ('name',)

@admin.register(Horoscope)
class HoroscopeAdmin(admin.ModelAdmin):
    list_display   = ('zodiac_sign', 'date', 'horoscope_type', 'mood', 'love', 'money', 'health', 'career')
    list_filter    = ('horoscope_type', 'zodiac_sign', 'date')
    search_fields  = ('prediction', 'advice', 'zodiac_sign__name')
    readonly_fields = ('created_at', 'updated_at')
    date_hierarchy = 'date'
    list_per_page  = 25
    fieldsets = (
        ('Basic',         {'fields': ('zodiac_sign','date','horoscope_type','mood')}),
        ('Content',       {'fields': ('prediction','advice','caution')}),
        ('Lucky Elements',{'fields': ('lucky_numbers','lucky_color','lucky_day')}),
        ('Aspect Ratings',{'fields': ('love','money','health','career','family')}),
        ('Timestamps',    {'fields': ('created_at','updated_at'), 'classes': ('collapse',)}),
    )

@admin.register(CosmicEvent)
class CosmicEventAdmin(admin.ModelAdmin):
    list_display   = ('title', 'category', 'event_date', 'created_at')
    list_filter    = ('category', 'event_date')
    search_fields  = ('title', 'description', 'impact')
    filter_horizontal = ('affected_signs',)
    readonly_fields = ('created_at', 'updated_at')
    date_hierarchy = 'event_date'
