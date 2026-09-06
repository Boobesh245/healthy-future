# pyrefly: ignore [missing-import]
from rest_framework import serializers
# pyrefly: ignore [missing-import]
from django.contrib.auth.models import User
from .models import UserProfile, HotelOwner

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['role', 'phone', 'address', 'city', 'pincode', 'avatar']

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    role = serializers.CharField(source='profile.role', read_only=True)
    phone = serializers.CharField(source='profile.phone', read_only=True)
    city = serializers.CharField(source='profile.city', read_only=True)
    address = serializers.CharField(source='profile.address', read_only=True)
    pincode = serializers.CharField(source='profile.pincode', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'phone', 'city', 'address', 'pincode', 'profile']

class CustomerRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    password_confirm = serializers.CharField(write_only=True, min_length=6)
    phone = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'first_name', 'last_name', 'phone']

    def validate(self, attrs):
        if attrs.get('password') != attrs.get('password_confirm'):
            raise serializers.ValidationError({"password": "Passwords do not match."})
        if User.objects.filter(username=attrs.get('username')).exists():
            raise serializers.ValidationError({"username": "Username already taken."})
        if attrs.get('email') and User.objects.filter(email=attrs.get('email')).exists():
            raise serializers.ValidationError({"email": "Email already registered."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        phone = validated_data.pop('phone', '')
        user = User.objects.create_user(**validated_data)
        profile = getattr(user, 'profile', None)
        if profile:
            profile.role = 'customer'
            profile.phone = phone
            profile.save()
        return user

class HotelOwnerSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = HotelOwner
        fields = ['id', 'user', 'phone', 'is_approved', 'is_blocked', 'created_at']
