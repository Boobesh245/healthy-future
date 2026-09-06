from django.contrib import admin
from .models import Restaurant

@admin.register(Restaurant)
class RestaurantAdmin(admin.ModelAdmin):
    list_display = ('name', 'cuisine', 'city', 'rating', 'delivery_time', 'delivery_charge', 'is_approved', 'is_active')
    list_filter = ('is_approved', 'is_active', 'city', 'cuisine')
    search_fields = ('name', 'cuisine', 'city', 'address')
