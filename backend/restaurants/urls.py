from django.urls import path
from .views import RestaurantListView, RestaurantDetailView, RestaurantFoodsView

urlpatterns = [
    path('', RestaurantListView.as_view(), name='restaurant_list'),
    path('<int:pk>/', RestaurantDetailView.as_view(), name='restaurant_detail'),
    path('<int:pk>/foods/', RestaurantFoodsView.as_view(), name='restaurant_foods'),
]
