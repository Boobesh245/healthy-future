from django.urls import path
from .views import (
    AdminDashboardView,
    AdminUserListView, AdminUserDetailView,
    AdminOwnerListView, AdminOwnerDetailView, AdminOwnerStatusActionView,
    AdminRestaurantListCreateView, AdminRestaurantDetailView, AdminRestaurantActionView,
    AdminFoodListCreateView, AdminFoodDetailView,
    AdminCategoryListCreateView, AdminCategoryDetailView,
    AdminOrderListView, AdminOrderDetailView, AdminOrderStatusView
)

urlpatterns = [
    path('dashboard/', AdminDashboardView.as_view(), name='admin_dashboard'),

    # Users
    path('users/', AdminUserListView.as_view(), name='admin_users'),
    path('users/<int:pk>/', AdminUserDetailView.as_view(), name='admin_user_detail'),

    # Owners
    path('owners/', AdminOwnerListView.as_view(), name='admin_owners'),
    path('owners/<int:pk>/', AdminOwnerDetailView.as_view(), name='admin_owner_detail'),
    path('owners/<int:pk>/<str:action>/', AdminOwnerStatusActionView.as_view(), name='admin_owner_action'),

    # Restaurants
    path('restaurants/', AdminRestaurantListCreateView.as_view(), name='admin_restaurants'),
    path('restaurants/<int:pk>/', AdminRestaurantDetailView.as_view(), name='admin_restaurant_detail'),
    path('restaurants/<int:pk>/<str:action>/', AdminRestaurantActionView.as_view(), name='admin_restaurant_action'),

    # Foods
    path('foods/', AdminFoodListCreateView.as_view(), name='admin_foods'),
    path('foods/<int:pk>/', AdminFoodDetailView.as_view(), name='admin_food_detail'),

    # Categories
    path('categories/', AdminCategoryListCreateView.as_view(), name='admin_categories'),
    path('categories/<int:pk>/', AdminCategoryDetailView.as_view(), name='admin_category_detail'),

    # Orders
    path('orders/', AdminOrderListView.as_view(), name='admin_orders'),
    path('orders/<int:pk>/', AdminOrderDetailView.as_view(), name='admin_order_detail'),
    path('orders/<int:pk>/status/', AdminOrderStatusView.as_view(), name='admin_order_status'),
]
