from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from apps.accounts.models import CustomUser, UserVerificationToken, PasswordResetToken

@admin.register(CustomUser)
class CustomUserAdmin(BaseUserAdmin):
    list_display = ('email', 'username', 'first_name', 'last_name', 'zodiac_sign', 'is_verified', 'is_staff', 'created_at')
    list_filter  = ('is_verified', 'is_staff', 'is_active', 'receive_emails', 'gender', 'created_at')
    search_fields = ('email', 'username', 'first_name', 'last_name', 'phone')
    ordering      = ('-created_at',)
    list_per_page = 25
    readonly_fields = ('created_at', 'updated_at', 'last_login_ip')
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Astrological Information', {'fields': ('birth_date','birth_time','birth_place','birth_latitude','birth_longitude','zodiac_sign','moon_sign','rising_sign'), 'classes': ('collapse',)}),
        ('Profile', {'fields': ('profile_picture','bio','occupation','phone','gender')}),
        ('Preferences & Status', {'fields': ('is_verified','receive_emails','receive_sms')}),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Additional Info', {'fields': ('email','first_name','last_name','phone')}),
    )

@admin.register(UserVerificationToken)
class UserVerificationTokenAdmin(admin.ModelAdmin):
    list_display  = ('user', 'is_used', 'expires_at', 'created_at')
    list_filter   = ('is_used', 'created_at')
    search_fields = ('user__email', 'user__username')
    readonly_fields = ('created_at', 'token')

@admin.register(PasswordResetToken)
class PasswordResetTokenAdmin(admin.ModelAdmin):
    list_display  = ('user', 'is_used', 'expires_at', 'created_at')
    list_filter   = ('is_used', 'created_at')
    search_fields = ('user__email',)
    readonly_fields = ('created_at', 'token')
