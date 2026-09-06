from django.contrib import admin
from .models import UserProfile, HotelOwner

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'role', 'phone', 'city', 'created_at')
    list_filter = ('role', 'city')
    search_fields = ('user__username', 'user__email', 'phone')

@admin.register(HotelOwner)
class HotelOwnerAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone', 'is_approved', 'is_blocked', 'created_at')
    list_filter = ('is_approved', 'is_blocked')
    search_fields = ('user__username', 'phone')
