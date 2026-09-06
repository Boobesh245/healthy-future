from django.contrib import admin
from .models import Category, Food

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at')
    search_fields = ('name',)

@admin.register(Food)
class FoodAdmin(admin.ModelAdmin):
    list_display = ('food_name', 'restaurant', 'category', 'price', 'calories', 'protein', 'food_type', 'availability', 'rating')
    list_filter = ('food_type', 'availability', 'is_popular', 'is_recommended', 'category')
    search_fields = ('food_name', 'description', 'ingredients', 'health_tags')
