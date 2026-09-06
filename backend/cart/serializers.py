from rest_framework import serializers
from .models import Cart, CartItem
from foods.serializers import FoodSerializer

class CartItemSerializer(serializers.ModelSerializer):
    food = FoodSerializer(read_only=True)
    food_id = serializers.IntegerField(write_only=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = CartItem
        fields = ['id', 'food', 'food_id', 'quantity', 'total_price']

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    restaurant_id = serializers.SerializerMethodField()
    delivery_charge = serializers.SerializerMethodField()
    total = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id', 'items', 'subtotal', 'restaurant_id', 'delivery_charge', 'total', 'updated_at']

    def get_restaurant_id(self, obj):
        first_item = obj.items.first()
        if first_item:
            return first_item.food.restaurant.id
        return None

    def get_delivery_charge(self, obj):
        first_item = obj.items.first()
        if first_item:
            return obj.subtotal > 0 and first_item.food.restaurant.delivery_charge or 0
        return 0

    def get_total(self, obj):
        charge = self.get_delivery_charge(obj)
        return float(obj.subtotal) + float(charge)
