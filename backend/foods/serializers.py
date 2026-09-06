from rest_framework import serializers
from .models import Category, Food

class CategorySerializer(serializers.ModelSerializer):
    total_foods = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'image', 'total_foods', 'created_at']

    def get_total_foods(self, obj):
        return obj.foods.filter(availability=True).count()

class FoodSerializer(serializers.ModelSerializer):
    restaurant_name = serializers.CharField(source='restaurant.name', read_only=True)
    restaurant_rating = serializers.DecimalField(source='restaurant.rating', max_digits=3, decimal_places=1, read_only=True)
    delivery_time = serializers.IntegerField(source='restaurant.delivery_time', read_only=True)
    delivery_charge = serializers.DecimalField(source='restaurant.delivery_charge', max_digits=6, decimal_places=2, read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Food
        fields = [
            'id', 'restaurant', 'restaurant_name', 'restaurant_rating',
            'delivery_time', 'delivery_charge', 'category', 'category_name',
            'food_name', 'description', 'ingredients', 'price',
            'calories', 'protein', 'carbohydrates', 'fat',
            'food_type', 'health_tags', 'image', 'rating',
            'availability', 'is_popular', 'is_recommended', 'created_at'
        ]
