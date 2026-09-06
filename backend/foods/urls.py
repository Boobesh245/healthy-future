from django.urls import path
from .views import (
    FoodListView, FoodDetailView, PopularFoodView,
    HighProteinFoodView, LowCalorieFoodView, VeganFoodView,
    KetoFoodView, RecommendedFoodView
)

urlpatterns = [
    path('', FoodListView.as_view(), name='food_list'),
    path('popular/', PopularFoodView.as_view(), name='food_popular'),
    path('high-protein/', HighProteinFoodView.as_view(), name='food_high_protein'),
    path('low-calorie/', LowCalorieFoodView.as_view(), name='food_low_calorie'),
    path('vegan/', VeganFoodView.as_view(), name='food_vegan'),
    path('keto/', KetoFoodView.as_view(), name='food_keto'),
    path('recommended/', RecommendedFoodView.as_view(), name='food_recommended'),
    path('<int:pk>/', FoodDetailView.as_view(), name='food_detail'),
]
