from django.contrib import admin
from apps.testimonials.models import Testimonial

@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display  = ('user', 'title', 'rating', 'is_approved', 'featured', 'created_at')
    list_filter   = ('is_approved', 'featured', 'rating', 'created_at')
    search_fields = ('content', 'title', 'user__email', 'user__username')
    list_editable = ('is_approved', 'featured')
    readonly_fields = ('id', 'created_at', 'updated_at')
    list_per_page = 25
    fieldsets = (
        ('Testimonial', {'fields': ('id','user','title','content','rating')}),
        ('Moderation',  {'fields': ('is_approved','featured')}),
        ('Timestamps',  {'fields': ('created_at','updated_at'), 'classes': ('collapse',)}),
    )
