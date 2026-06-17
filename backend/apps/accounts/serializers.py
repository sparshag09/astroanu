from rest_framework import serializers
from django.contrib.auth import authenticate
from apps.accounts.models import CustomUser, UserVerificationToken, PasswordResetToken


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user profile"""
    zodiac_sign = serializers.SerializerMethodField()
    
    class Meta:
        model = CustomUser
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 'phone',
            'profile_picture', 'birth_date', 'birth_time', 'birth_place',
            'birth_latitude', 'birth_longitude', 'gender', 'zodiac_sign',
            'moon_sign', 'rising_sign', 'bio', 'occupation', 'is_verified',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'zodiac_sign']
    
    def get_zodiac_sign(self, obj):
        return obj.get_zodiac_sign()


class UserDetailSerializer(serializers.ModelSerializer):
    """Detailed user serializer"""
    zodiac_sign = serializers.SerializerMethodField()
    
    class Meta:
        model = CustomUser
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 'phone',
            'profile_picture', 'birth_date', 'birth_time', 'birth_place',
            'birth_latitude', 'birth_longitude', 'gender', 'zodiac_sign',
            'moon_sign', 'rising_sign', 'bio', 'occupation', 'is_verified',
            'receive_emails', 'receive_sms', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'zodiac_sign', 'is_verified']
    
    def get_zodiac_sign(self, obj):
        return obj.get_zodiac_sign()


class SignUpSerializer(serializers.Serializer):
    """Serializer for user registration"""
    email = serializers.EmailField()
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, min_length=8)
    first_name = serializers.CharField(max_length=150, required=False)
    last_name = serializers.CharField(max_length=150, required=False)
    
    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError("Passwords do not match")
        
        if CustomUser.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError("Email already registered")
        
        if CustomUser.objects.filter(username=data['username']).exists():
            raise serializers.ValidationError("Username already taken")
        
        return data
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = CustomUser.objects.create_user(**validated_data)
        return user


class LoginSerializer(serializers.Serializer):
    """Serializer for user login"""
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, data):
        user = authenticate(username=data['email'], password=data['password'])
        if not user:
            # Try with username field
            try:
                user_obj = CustomUser.objects.get(email=data['email'])
                user = authenticate(username=user_obj.username, password=data['password'])
            except CustomUser.DoesNotExist:
                pass
        
        if not user:
            raise serializers.ValidationError("Invalid email or password")
        
        data['user'] = user
        return data


class PasswordResetRequestSerializer(serializers.Serializer):
    """Serializer for password reset request"""
    email = serializers.EmailField()
    
    def validate_email(self, value):
        if not CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("User with this email does not exist")
        return value


class PasswordResetSerializer(serializers.Serializer):
    """Serializer for password reset"""
    token = serializers.CharField()
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, min_length=8)
    
    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError("Passwords do not match")
        
        try:
            reset_token = PasswordResetToken.objects.get(token=data['token'])
            if not reset_token.is_valid():
                raise serializers.ValidationError("Invalid or expired reset token")
        except PasswordResetToken.DoesNotExist:
            raise serializers.ValidationError("Invalid reset token")
        
        data['reset_token'] = reset_token
        return data
