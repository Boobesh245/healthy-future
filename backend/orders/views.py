from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.db import transaction
from decimal import Decimal
from .models import Order, OrderItem
from .serializers import OrderSerializer
from cart.models import Cart

class OrderListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(user=request.user).order_by('-created_at')
        return Response({
            "success": True,
            "message": "Orders retrieved",
            "data": OrderSerializer(orders, many=True).data
        })

    def post(self, request):
        user = request.user
        try:
            cart = Cart.objects.get(user=user)
        except Cart.DoesNotExist:
            return Response({
                "success": False,
                "message": "Cart is empty",
                "errors": {"cart": "Cart not found"}
            }, status=status.HTTP_400_BAD_REQUEST)

        cart_items = cart.items.select_related('food', 'food__restaurant').all()
        if not cart_items.exists():
            return Response({
                "success": False,
                "message": "Cannot place order with empty cart",
                "errors": {"cart": "Your cart is empty"}
            }, status=status.HTTP_400_BAD_REQUEST)

        delivery_address = request.data.get('delivery_address')
        city = request.data.get('city', 'Hosur')
        pincode = request.data.get('pincode', '635109')
        phone = request.data.get('phone', '')
        payment_method = request.data.get('payment_method', 'COD')

        if not delivery_address:
            return Response({
                "success": False,
                "message": "Delivery address is required",
                "errors": {"delivery_address": "This field is required."}
            }, status=status.HTTP_400_BAD_REQUEST)

        first_item = cart_items.first()
        restaurant = first_item.food.restaurant if first_item else None
        delivery_charge = restaurant.delivery_charge if restaurant else Decimal('30.00')

        with transaction.atomic():
            subtotal = Decimal('0.00')
            for item in cart_items:
                subtotal += (item.food.price * item.quantity)

            total = subtotal + delivery_charge

            order = Order.objects.create(
                user=user,
                restaurant=restaurant,
                delivery_address=delivery_address,
                city=city,
                pincode=pincode,
                phone=phone or (user.profile.phone if hasattr(user, 'profile') else ''),
                payment_method=payment_method,
                subtotal=subtotal,
                delivery_charge=delivery_charge,
                total=total,
                status='Pending'
            )

            for item in cart_items:
                OrderItem.objects.create(
                    order=order,
                    food=item.food,
                    food_name=item.food.food_name,
                    price=item.food.price,
                    quantity=item.quantity,
                    total_price=item.food.price * item.quantity
                )

            # Clear cart
            cart.items.all().delete()

        return Response({
            "success": True,
            "message": "Order placed successfully",
            "data": OrderSerializer(order).data
        }, status=status.HTTP_201_CREATED)

class OrderDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            # Customers can see their own orders; admins/owners can see restaurant orders
            user = request.user
            if user.is_staff or (hasattr(user, 'profile') and user.profile.role == 'admin'):
                order = Order.objects.get(pk=pk)
            elif hasattr(user, 'profile') and user.profile.role == 'hotel_owner':
                order = Order.objects.get(pk=pk, restaurant__owner=user)
            else:
                order = Order.objects.get(pk=pk, user=user)

            return Response({
                "success": True,
                "message": "Order retrieved",
                "data": OrderSerializer(order).data
            })
        except Order.DoesNotExist:
            return Response({
                "success": False,
                "message": "Order not found",
                "errors": {"detail": "Order does not exist or you do not have permission"}
            }, status=status.HTTP_404_NOT_FOUND)

class CancelOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            order = Order.objects.get(pk=pk, user=request.user)
        except Order.DoesNotExist:
            return Response({
                "success": False,
                "message": "Order not found",
                "errors": {"detail": "Order not found"}
            }, status=status.HTTP_404_NOT_FOUND)

        if order.status not in ['Pending', 'Confirmed']:
            return Response({
                "success": False,
                "message": f"Cannot cancel order with status '{order.status}'",
                "errors": {"status": "Only Pending or Confirmed orders can be cancelled."}
            }, status=status.HTTP_400_BAD_REQUEST)

        order.status = 'Cancelled'
        order.save()

        return Response({
            "success": True,
            "message": "Order cancelled successfully",
            "data": OrderSerializer(order).data
        })
