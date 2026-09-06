from django.urls import path
from .views import CartView, AddToCartView, UpdateCartItemView, ClearCartView

urlpatterns = [
    path('', CartView.as_view(), name='cart_view'),
    path('add/', AddToCartView.as_view(), name='cart_add'),
    path('clear/', ClearCartView.as_view(), name='cart_clear'),
    path('<int:pk>/', UpdateCartItemView.as_view(), name='cart_item_update_delete'),
]
