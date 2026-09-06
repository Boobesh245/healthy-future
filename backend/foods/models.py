from django.db import models
from restaurants.models import Restaurant

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, default='')
    image = models.CharField(max_length=500, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ['name']

    def __str__(self):
        return self.name

class Food(models.Model):
    FOOD_TYPE_CHOICES = (
        ('Veg', 'Veg'),
        ('Non-Veg', 'Non-Veg'),
        ('Vegan', 'Vegan'),
    )

    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='foods')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='foods')
    food_name = models.CharField(max_length=200)
    description = models.TextField(blank=True, default='')
    ingredients = models.TextField(blank=True, default='')
    price = models.DecimalField(max_digits=8, decimal_places=2)
    calories = models.IntegerField(help_text="Calories in kcal")
    protein = models.DecimalField(max_digits=6, decimal_places=1, help_text="Protein in grams")
    carbohydrates = models.DecimalField(max_digits=6, decimal_places=1, help_text="Carbohydrates in grams")
    fat = models.DecimalField(max_digits=6, decimal_places=1, help_text="Fat in grams")
    food_type = models.CharField(max_length=20, choices=FOOD_TYPE_CHOICES, default='Veg')
    health_tags = models.CharField(max_length=255, default='Diet Friendly', help_text="Comma-separated tags e.g. High Protein, Low Calorie")
    image = models.CharField(max_length=500, blank=True, null=True)
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=4.5)
    availability = models.BooleanField(default=True)
    is_popular = models.BooleanField(default=False)
    is_recommended = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-rating', '-created_at']

    def __str__(self):
        return f"{self.food_name} - ₹{self.price} ({self.restaurant.name})"
