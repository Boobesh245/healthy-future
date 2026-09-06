from django.contrib import admin
from .models import Order, OrderItem

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'restaurant', 'total', 'status', 'payment_method', 'created_at')
    list_filter = ('status', 'payment_method', 'city', 'created_at')
    search_fields = ('id', 'user__username', 'phone', 'delivery_address')
    inlines = [OrderItemInline]
