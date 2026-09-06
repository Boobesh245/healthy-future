from rest_framework import serializers
from .models import Restaurant

class RestaurantSerializer(serializers.ModelSerializer):
    owner_name = serializers.CharField(source='owner.username', read_only=True)
    total_foods = serializers.SerializerMethodField()

    class Meta:
        model = Restaurant
        fields = [
            'id', 'owner', 'owner_name', 'name', 'description', 'address',
            'city', 'state', 'pincode', 'phone', 'cuisine', 'rating',
            'delivery_time', 'delivery_charge', 'image', 'is_approved',
            'is_active', 'total_foods', 'created_at'
        ]
        read_only_fields = ['owner', 'rating', 'created_at']

    def get_total_foods(self, obj):
        return obj.foods.filter(availability=True).count()
