from rest_framework import serializers
from .models import Order, OrderItem

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'food', 'food_name', 'price', 'quantity', 'total_price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    restaurant_name = serializers.CharField(source='restaurant.name', read_only=True)
    customer_name = serializers.CharField(source='user.get_full_name', read_only=True)
    customer_username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'user', 'customer_name', 'customer_username', 'restaurant',
            'restaurant_name', 'delivery_address', 'city', 'pincode', 'phone',
            'payment_method', 'subtotal', 'delivery_charge', 'total', 'status',
            'items', 'created_at', 'updated_at'
        ]
        read_only_fields = ['user', 'subtotal', 'delivery_charge', 'total', 'status', 'created_at', 'updated_at']
