from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Cart, CartItem
from .serializers import CartSerializer
from foods.models import Food

def get_or_create_user_cart(user):
    cart, _ = Cart.objects.get_or_create(user=user)
    return cart

class CartView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cart = get_or_create_user_cart(request.user)
        return Response({
            "success": True,
            "message": "Cart retrieved successfully",
            "data": CartSerializer(cart).data
        })

class AddToCartView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        food_id = request.data.get('food_id')
        quantity = int(request.data.get('quantity', 1))

        if not food_id or quantity <= 0:
            return Response({
                "success": False,
                "message": "Valid food_id and quantity are required",
                "errors": {"detail": "Invalid parameters"}
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            food = Food.objects.get(pk=food_id, availability=True)
        except Food.DoesNotExist:
            return Response({
                "success": False,
                "message": "Food item not found or unavailable",
                "errors": {"food_id": "Not found"}
            }, status=status.HTTP_404_NOT_FOUND)

        cart = get_or_create_user_cart(request.user)

        # Optional check: If cart has items from another restaurant, reset cart or allow replacement
        first_item = cart.items.first()
        if first_item and first_item.food.restaurant_id != food.restaurant_id:
            # Clear old items to keep one restaurant per order (standard Swiggy/Zomato behavior)
            cart.items.all().delete()

        cart_item, created = CartItem.objects.get_or_create(cart=cart, food=food)
        if not created:
            cart_item.quantity += quantity
        else:
            cart_item.quantity = quantity
        cart_item.save()

        return Response({
            "success": True,
            "message": "Item added to cart",
            "data": CartSerializer(cart).data
        }, status=status.HTTP_200_OK)

class UpdateCartItemView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        cart = get_or_create_user_cart(request.user)
        quantity = int(request.data.get('quantity', 1))

        try:
            cart_item = cart.items.get(pk=pk)
            if quantity <= 0:
                cart_item.delete()
            else:
                cart_item.quantity = quantity
                cart_item.save()

            return Response({
                "success": True,
                "message": "Cart updated",
                "data": CartSerializer(cart).data
            })
        except CartItem.DoesNotExist:
            return Response({
                "success": False,
                "message": "Cart item not found",
                "errors": {"detail": "Item not found in your cart"}
            }, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        cart = get_or_create_user_cart(request.user)
        try:
            cart_item = cart.items.get(pk=pk)
            cart_item.delete()
            return Response({
                "success": True,
                "message": "Item removed from cart",
                "data": CartSerializer(cart).data
            })
        except CartItem.DoesNotExist:
            return Response({
                "success": False,
                "message": "Cart item not found",
                "errors": {"detail": "Item not in cart"}
            }, status=status.HTTP_404_NOT_FOUND)

class ClearCartView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        cart = get_or_create_user_cart(request.user)
        cart.items.all().delete()
        return Response({
            "success": True,
            "message": "Cart cleared successfully",
            "data": CartSerializer(cart).data
        })
