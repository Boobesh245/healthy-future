from django.urls import path
from .views import (
    OwnerRegisterView, OwnerDashboardView, OwnerRestaurantView,
    OwnerFoodListCreateView, OwnerFoodDetailUpdateDeleteView,
    OwnerOrdersView, OwnerOrderDetailView, OwnerOrderStatusView
)

urlpatterns = [
    path('register/', OwnerRegisterView.as_view(), name='owner_register'),
    path('dashboard/', OwnerDashboardView.as_view(), name='owner_dashboard'),
    path('restaurant/', OwnerRestaurantView.as_view(), name='owner_restaurant'),
    path('foods/', OwnerFoodListCreateView.as_view(), name='owner_foods'),
    path('foods/<int:pk>/', OwnerFoodDetailUpdateDeleteView.as_view(), name='owner_food_detail'),
    path('orders/', OwnerOrdersView.as_view(), name='owner_orders'),
    path('orders/<int:pk>/', OwnerOrderDetailView.as_view(), name='owner_order_detail'),
    path('orders/<int:pk>/status/', OwnerOrderStatusView.as_view(), name='owner_order_status'),
]
