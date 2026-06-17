from django.contrib import admin
from apps.consultations.models import Consultation, ConsultationFeedback

@admin.register(Consultation)
class ConsultationAdmin(admin.ModelAdmin):
    list_display  = ('id', 'user', 'topic', 'status', 'is_paid', 'price', 'assigned_astrologer', 'created_at')
    list_filter   = ('status', 'is_paid', 'topic', 'created_at')
    search_fields = ('user__email', 'user__username', 'description', 'payment_id')
    readonly_fields = ('id', 'created_at', 'updated_at')
    date_hierarchy = 'created_at'
    list_per_page  = 25
    fieldsets = (
        ('Client', {'fields': ('id','user','created_at','updated_at')}),
        ('Details', {'fields': ('topic','description','questions','birth_date','birth_time','birth_place')}),
        ('Response', {'fields': ('assigned_astrologer','response','response_file')}),
        ('Payment & Status', {'fields': ('status','price','payment_id','is_paid')}),
        ('Scheduling', {'fields': ('scheduled_date','completed_date'), 'classes': ('collapse',)}),
    )

@admin.register(ConsultationFeedback)
class ConsultationFeedbackAdmin(admin.ModelAdmin):
    list_display  = ('consultation', 'rating', 'created_at')
    list_filter   = ('rating', 'created_at')
    search_fields = ('consultation__id', 'comment', 'consultation__user__email')
    readonly_fields = ('created_at',)
