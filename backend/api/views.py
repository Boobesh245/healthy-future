from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework import status
from django.utils import timezone
from django.contrib.auth.models import User
from django.db.models import Count, Q, Sum
from rest_framework_simplejwt.tokens import RefreshToken

from accounts.models import UserProfile, HotelOwner
from accounts.serializers import UserSerializer
from restaurants.models import Restaurant
from restaurants.serializers import RestaurantSerializer
from foods.models import Category, Food
from foods.serializers import CategorySerializer, FoodSerializer
from orders.models import Order
from orders.serializers import OrderSerializer

# -----------------
# 14. HOMEPAGE API
# -----------------
class HomeView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        categories = Category.objects.all()[:12]
        top_restaurants = Restaurant.objects.filter(is_approved=True, is_active=True).order_by('-rating')[:8]
        popular_foods = Food.objects.filter(availability=True, restaurant__is_approved=True, restaurant__is_active=True).filter(
            Q(is_popular=True) | Q(rating__gte=4.6)
        ).order_by('-rating')[:8]
        high_protein_foods = Food.objects.filter(
            availability=True, restaurant__is_approved=True, restaurant__is_active=True, protein__gte=25
        ).order_by('-protein')[:8]
        low_calorie_foods = Food.objects.filter(
            availability=True, restaurant__is_approved=True, restaurant__is_active=True, calories__lte=350
        ).order_by('calories')[:8]
        recommended_foods = Food.objects.filter(
            availability=True, restaurant__is_approved=True, restaurant__is_active=True
        ).filter(Q(is_recommended=True) | Q(rating__gte=4.7)).order_by('-rating')[:8]

        return Response({
            "success": True,
            "message": "Home feed loaded",
            "data": {
                "categories": CategorySerializer(categories, many=True).data,
                "top_restaurants": RestaurantSerializer(top_restaurants, many=True).data,
                "popular_foods": FoodSerializer(popular_foods, many=True).data,
                "high_protein_foods": FoodSerializer(high_protein_foods, many=True).data,
                "low_calorie_foods": FoodSerializer(low_calorie_foods, many=True).data,
                "recommended_foods": FoodSerializer(recommended_foods, many=True).data,
            }
        })


# -----------------
# HOTEL OWNER PERMISSION HELPER
# -----------------
def get_owner_restaurant(user):
    return Restaurant.objects.filter(owner=user).first()


# -----------------
# 17. HOTEL OWNER APIS
# -----------------
class OwnerRegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        restaurant_name = data.get('restaurant_name')
        phone = data.get('phone', '')
        address = data.get('address', '')
        city = data.get('city', 'Hosur')
        cuisine = data.get('cuisine', 'Healthy Food')

        if not username or not password or not restaurant_name:
            return Response({
                "success": False,
                "message": "Username, password and restaurant_name are required",
                "errors": {"detail": "Missing required fields"}
            }, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({
                "success": False,
                "message": "Username already taken",
                "errors": {"username": "Username exists"}
            }, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, email=email, password=password)
        profile = user.profile
        profile.role = 'hotel_owner'
        profile.phone = phone
        profile.address = address
        profile.city = city
        profile.save()

        HotelOwner.objects.create(
            user=user,
            phone=phone,
            is_approved=False,
            is_blocked=False
        )

        restaurant = Restaurant.objects.create(
            owner=user,
            name=restaurant_name,
            phone=phone,
            address=address,
            city=city,
            cuisine=cuisine,
            is_approved=False,
            is_active=True
        )

        refresh = RefreshToken.for_user(user)

        return Response({
            "success": True,
            "message": "Owner registered successfully. Waiting for admin approval.",
            "data": {
                "user": UserSerializer(user).data,
                "restaurant": RestaurantSerializer(restaurant).data,
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            }
        }, status=status.HTTP_201_CREATED)

class OwnerDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        restaurant = get_owner_restaurant(user)
        if not restaurant:
            return Response({
                "success": False,
                "message": "No restaurant found for this owner",
                "errors": {"detail": "No restaurant associated"}
            }, status=status.HTTP_404_NOT_FOUND)

        today = timezone.now().date()
        orders = Order.objects.filter(restaurant=restaurant)
        total_orders = orders.count()
        today_orders = orders.filter(created_at__date=today).count()
        pending_orders = orders.filter(status='Pending').count()
        completed_orders = orders.filter(status='Delivered').count()
        total_dishes = Food.objects.filter(restaurant=restaurant).count()

        return Response({
            "success": True,
            "message": "Dashboard retrieved",
            "data": {
                "restaurant_name": restaurant.name,
                "is_approved": restaurant.is_approved,
                "total_dishes": total_dishes,
                "total_orders": total_orders,
                "today_orders": today_orders,
                "pending_orders": pending_orders,
                "completed_orders": completed_orders,
                "restaurant": RestaurantSerializer(restaurant).data
            }
        })

class OwnerRestaurantView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        restaurant = get_owner_restaurant(request.user)
        if not restaurant:
            return Response({
                "success": False,
                "message": "No restaurant found",
                "errors": {"detail": "Not found"}
            }, status=status.HTTP_404_NOT_FOUND)
        return Response({
            "success": True,
            "message": "Restaurant profile retrieved",
            "data": RestaurantSerializer(restaurant).data
        })

    def put(self, request):
        restaurant = get_owner_restaurant(request.user)
        if not restaurant:
            return Response({
                "success": False,
                "message": "No restaurant found",
                "errors": {"detail": "Not found"}
            }, status=status.HTTP_404_NOT_FOUND)

        data = request.data
        restaurant.name = data.get('name', restaurant.name)
        restaurant.description = data.get('description', restaurant.description)
        restaurant.address = data.get('address', restaurant.address)
        restaurant.city = data.get('city', restaurant.city)
        restaurant.state = data.get('state', restaurant.state)
        restaurant.pincode = data.get('pincode', restaurant.pincode)
        restaurant.phone = data.get('phone', restaurant.phone)
        restaurant.cuisine = data.get('cuisine', restaurant.cuisine)
        if 'delivery_time' in data:
            restaurant.delivery_time = int(data['delivery_time'])
        if 'delivery_charge' in data:
            restaurant.delivery_charge = float(data['delivery_charge'])
        if 'image' in data:
            restaurant.image = data['image']
        restaurant.save()

        return Response({
            "success": True,
            "message": "Restaurant updated successfully",
            "data": RestaurantSerializer(restaurant).data
        })


# -----------------
# 18. HOTEL OWNER FOOD CRUD
# -----------------
class OwnerFoodListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        restaurant = get_owner_restaurant(request.user)
        if not restaurant:
            return Response({"success": False, "message": "Restaurant not found"}, status=status.HTTP_404_NOT_FOUND)
        foods = Food.objects.filter(restaurant=restaurant).order_by('-created_at')
        return Response({
            "success": True,
            "message": "Foods retrieved",
            "data": FoodSerializer(foods, many=True).data
        })

    def post(self, request):
        restaurant = get_owner_restaurant(request.user)
        if not restaurant:
            return Response({"success": False, "message": "Restaurant not found"}, status=status.HTTP_404_NOT_FOUND)

        data = request.data.copy()
        data['restaurant'] = restaurant.id
        serializer = FoodSerializer(data=data)
        if serializer.is_valid():
            food = serializer.save(restaurant=restaurant)
            return Response({
                "success": True,
                "message": "Food created successfully",
                "data": FoodSerializer(food).data
            }, status=status.HTTP_201_CREATED)
        return Response({
            "success": False,
            "message": "Failed to create food",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

class OwnerFoodDetailUpdateDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        restaurant = get_owner_restaurant(request.user)
        try:
            food = Food.objects.get(pk=pk, restaurant=restaurant)
            return Response({
                "success": True,
                "message": "Food item retrieved",
                "data": FoodSerializer(food).data
            })
        except Food.DoesNotExist:
            return Response({"success": False, "message": "Food not found or does not belong to your restaurant"}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        restaurant = get_owner_restaurant(request.user)
        try:
            food = Food.objects.get(pk=pk, restaurant=restaurant)
        except Food.DoesNotExist:
            return Response({"success": False, "message": "Food not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = FoodSerializer(food, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "success": True,
                "message": "Food updated successfully",
                "data": serializer.data
            })
        return Response({"success": False, "message": "Update failed", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        restaurant = get_owner_restaurant(request.user)
        try:
            food = Food.objects.get(pk=pk, restaurant=restaurant)
            food.delete()
            return Response({
                "success": True,
                "message": "Food item deleted successfully",
                "data": {}
            }, status=status.HTTP_200_OK)
        except Food.DoesNotExist:
            return Response({"success": False, "message": "Food not found"}, status=status.HTTP_404_NOT_FOUND)


# -----------------
# 19. HOTEL OWNER ORDER APIS
# -----------------
class OwnerOrdersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        restaurant = get_owner_restaurant(request.user)
        if not restaurant:
            return Response({"success": False, "message": "Restaurant not found"}, status=status.HTTP_404_NOT_FOUND)
        orders = Order.objects.filter(restaurant=restaurant).order_by('-created_at')
        return Response({
            "success": True,
            "message": "Orders retrieved",
            "data": OrderSerializer(orders, many=True).data
        })

class OwnerOrderDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        restaurant = get_owner_restaurant(request.user)
        try:
            order = Order.objects.get(pk=pk, restaurant=restaurant)
            return Response({
                "success": True,
                "message": "Order retrieved",
                "data": OrderSerializer(order).data
            })
        except Order.DoesNotExist:
            return Response({"success": False, "message": "Order not found"}, status=status.HTTP_404_NOT_FOUND)

class OwnerOrderStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        restaurant = get_owner_restaurant(request.user)
        try:
            order = Order.objects.get(pk=pk, restaurant=restaurant)
        except Order.DoesNotExist:
            return Response({"success": False, "message": "Order not found"}, status=status.HTTP_404_NOT_FOUND)

        new_status = request.data.get('status')
        allowed_statuses = ['Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled']
        if new_status not in allowed_statuses:
            return Response({
                "success": False,
                "message": f"Status must be one of: {', '.join(allowed_statuses)}",
                "errors": {"status": "Invalid status"}
            }, status=status.HTTP_400_BAD_REQUEST)

        order.status = new_status
        order.save()

        return Response({
            "success": True,
            "message": f"Order status updated to {new_status}",
            "data": OrderSerializer(order).data
        })


# -----------------
# 20. ADMIN DASHBOARD & CRUD APIS
# -----------------
def is_admin(user):
    return user.is_authenticated and (user.is_superuser or user.is_staff or (hasattr(user, 'profile') and user.profile.role == 'admin'))

class AdminDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not is_admin(request.user):
            return Response({"success": False, "message": "Admin permission required"}, status=status.HTTP_403_FORBIDDEN)

        customers_count = UserProfile.objects.filter(role='customer').count()
        owners_count = HotelOwner.objects.count()
        restaurants_count = Restaurant.objects.count()
        foods_count = Food.objects.count()
        orders_count = Order.objects.count()
        pending_orders = Order.objects.filter(status='Pending').count()
        completed_orders = Order.objects.filter(status='Delivered').count()
        cancelled_orders = Order.objects.filter(status='Cancelled').count()

        return Response({
            "success": True,
            "message": "Admin dashboard stats retrieved",
            "data": {
                "customers": customers_count,
                "hotel_owners": owners_count,
                "restaurants": restaurants_count,
                "foods": foods_count,
                "orders": orders_count,
                "pending_orders": pending_orders,
                "completed_orders": completed_orders,
                "cancelled_orders": cancelled_orders
            }
        })

# 21. Admin User CRUD
class AdminUserListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not is_admin(request.user):
            return Response({"success": False, "message": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
        users = User.objects.all().order_by('-date_joined')
        return Response({
            "success": True,
            "message": "Users retrieved",
            "data": UserSerializer(users, many=True).data
        })

class AdminUserDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        if not is_admin(request.user):
            return Response({"success": False, "message": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
        try:
            user = User.objects.get(pk=pk)
            return Response({"success": True, "message": "User retrieved", "data": UserSerializer(user).data})
        except User.DoesNotExist:
            return Response({"success": False, "message": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        if not is_admin(request.user):
            return Response({"success": False, "message": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({"success": False, "message": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        data = request.data
        user.first_name = data.get('first_name', user.first_name)
        user.last_name = data.get('last_name', user.last_name)
        user.email = data.get('email', user.email)
        user.is_active = data.get('is_active', user.is_active)
        user.save()

        if hasattr(user, 'profile'):
            user.profile.role = data.get('role', user.profile.role)
            user.profile.phone = data.get('phone', user.profile.phone)
            user.profile.city = data.get('city', user.profile.city)
            user.profile.save()

        return Response({"success": True, "message": "User updated", "data": UserSerializer(user).data})

    def delete(self, request, pk):
        if not is_admin(request.user):
            return Response({"success": False, "message": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
        try:
            user = User.objects.get(pk=pk)
            if user.is_superuser:
                return Response({"success": False, "message": "Cannot delete superuser"}, status=status.HTTP_400_BAD_REQUEST)
            user.delete()
            return Response({"success": True, "message": "User deleted", "data": {}})
        except User.DoesNotExist:
            return Response({"success": False, "message": "User not found"}, status=status.HTTP_404_NOT_FOUND)

# 22. Admin Hotel Owner APIs
class AdminOwnerListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not is_admin(request.user):
            return Response({"success": False, "message": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
        owners = HotelOwner.objects.all().order_by('-created_at')
        from accounts.serializers import HotelOwnerSerializer
        return Response({"success": True, "message": "Owners retrieved", "data": HotelOwnerSerializer(owners, many=True).data})

class AdminOwnerDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        if not is_admin(request.user):
            return Response({"success": False, "message": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
        try:
            owner = HotelOwner.objects.get(pk=pk)
            from accounts.serializers import HotelOwnerSerializer
            return Response({"success": True, "message": "Owner retrieved", "data": HotelOwnerSerializer(owner).data})
        except HotelOwner.DoesNotExist:
            return Response({"success": False, "message": "Owner not found"}, status=status.HTTP_404_NOT_FOUND)

class AdminOwnerStatusActionView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk, action):
        if not is_admin(request.user):
            return Response({"success": False, "message": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
        try:
            owner = HotelOwner.objects.get(pk=pk)
        except HotelOwner.DoesNotExist:
            return Response({"success": False, "message": "Owner not found"}, status=status.HTTP_404_NOT_FOUND)

        if action == 'approve':
            owner.is_approved = True
            owner.is_blocked = False
            owner.save()
            Restaurant.objects.filter(owner=owner.user).update(is_approved=True)
            msg = "Owner approved successfully"
        elif action == 'reject':
            owner.is_approved = False
            owner.save()
            Restaurant.objects.filter(owner=owner.user).update(is_approved=False)
            msg = "Owner rejected"
        elif action == 'block':
            owner.is_blocked = True
            owner.is_approved = False
            owner.save()
            Restaurant.objects.filter(owner=owner.user).update(is_approved=False, is_active=False)
            msg = "Owner blocked"
        else:
            return Response({"success": False, "message": "Invalid action"}, status=status.HTTP_400_BAD_REQUEST)

        from accounts.serializers import HotelOwnerSerializer
        return Response({"success": True, "message": msg, "data": HotelOwnerSerializer(owner).data})

# 23. Admin Restaurant CRUD
class AdminRestaurantListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not is_admin(request.user):
            return Response({"success": False, "message": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
        restaurants = Restaurant.objects.all().order_by('-created_at')
        return Response({"success": True, "message": "Restaurants retrieved", "data": RestaurantSerializer(restaurants, many=True).data})

    def post(self, request):
        if not is_admin(request.user):
            return Response({"success": False, "message": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
        data = request.data
        owner_id = data.get('owner') or request.user.id
        serializer = RestaurantSerializer(data=data)
        if serializer.is_valid():
            restaurant = serializer.save(owner_id=owner_id, is_approved=True)
            return Response({"success": True, "message": "Restaurant created", "data": RestaurantSerializer(restaurant).data}, status=status.HTTP_201_CREATED)
        return Response({"success": False, "message": "Creation failed", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class AdminRestaurantDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        if not is_admin(request.user):
            return Response({"success": False, "message": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
        try:
            restaurant = Restaurant.objects.get(pk=pk)
            return Response({"success": True, "message": "Restaurant retrieved", "data": RestaurantSerializer(restaurant).data})
        except Restaurant.DoesNotExist:
            return Response({"success": False, "message": "Restaurant not found"}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        if not is_admin(request.user):
            return Response({"success": False, "message": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
        try:
            restaurant = Restaurant.objects.get(pk=pk)
        except Restaurant.DoesNotExist:
            return Response({"success": False, "message": "Restaurant not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = RestaurantSerializer(restaurant, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"success": True, "message": "Restaurant updated", "data": serializer.data})
        return Response({"success": False, "message": "Update failed", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        if not is_admin(request.user):
            return Response({"success": False, "message": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
        try:
            restaurant = Restaurant.objects.get(pk=pk)
            restaurant.delete()
            return Response({"success": True, "message": "Restaurant deleted", "data": {}})
        except Restaurant.DoesNotExist:
            return Response({"success": False, "message": "Restaurant not found"}, status=status.HTTP_404_NOT_FOUND)

class AdminRestaurantActionView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk, action):
        if not is_admin(request.user):
            return Response({"success": False, "message": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
        try:
            restaurant = Restaurant.objects.get(pk=pk)
        except Restaurant.DoesNotExist:
            return Response({"success": False, "message": "Restaurant not found"}, status=status.HTTP_404_NOT_FOUND)

        if action == 'approve':
            restaurant.is_approved = True
        elif action == 'block':
            restaurant.is_approved = False
            restaurant.is_active = False
        elif action == 'activate':
            restaurant.is_active = True
        elif action == 'deactivate':
            restaurant.is_active = False
        else:
            return Response({"success": False, "message": "Invalid action"}, status=status.HTTP_400_BAD_REQUEST)

        restaurant.save()
        return Response({"success": True, "message": f"Restaurant {action}d successfully", "data": RestaurantSerializer(restaurant).data})

# 24. Admin Food CRUD
class AdminFoodListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not is_admin(request.user):
            return Response({"success": False, "message": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
        foods = Food.objects.all().order_by('-created_at')
        return Response({"success": True, "message": "Foods retrieved", "data": FoodSerializer(foods, many=True).data})

    def post(self, request):
        if not is_admin(request.user):
            return Response({"success": False, "message": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
        serializer = FoodSerializer(data=request.data)
        if serializer.is_valid():
            food = serializer.save()
            return Response({"success": True, "message": "Food created", "data": FoodSerializer(food).data}, status=status.HTTP_201_CREATED)
        return Response({"success": False, "message": "Creation failed", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class AdminFoodDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        if not is_admin(request.user):
            return Response({"success": False, "message": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
        try:
            food = Food.objects.get(pk=pk)
            return Response({"success": True, "message": "Food retrieved", "data": FoodSerializer(food).data})
        except Food.DoesNotExist:
            return Response({"success": False, "message": "Food not found"}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        if not is_admin(request.user):
            return Response({"success": False, "message": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
        try:
            food = Food.objects.get(pk=pk)
        except Food.DoesNotExist:
            return Response({"success": False, "message": "Food not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = FoodSerializer(food, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"success": True, "message": "Food updated", "data": serializer.data})
        return Response({"success": False, "message": "Update failed", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        if not is_admin(request.user):
            return Response({"success": False, "message": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
        try:
            food = Food.objects.get(pk=pk)
            food.delete()
            return Response({"success": True, "message": "Food deleted", "data": {}})
        except Food.DoesNotExist:
            return Response({"success": False, "message": "Food not found"}, status=status.HTTP_404_NOT_FOUND)

# 25. Admin Category CRUD
class AdminCategoryListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not is_admin(request.user):
            return Response({"success": False, "message": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
        categories = Category.objects.all().order_by('name')
        return Response({"success": True, "message": "Categories retrieved", "data": CategorySerializer(categories, many=True).data})

    def post(self, request):
        if not is_admin(request.user):
            return Response({"success": False, "message": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            cat = serializer.save()
            return Response({"success": True, "message": "Category created", "data": CategorySerializer(cat).data}, status=status.HTTP_201_CREATED)
        return Response({"success": False, "message": "Creation failed", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class AdminCategoryDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        if not is_admin(request.user):
            return Response({"success": False, "message": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
        try:
            category = Category.objects.get(pk=pk)
        except Category.DoesNotExist:
            return Response({"success": False, "message": "Category not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = CategorySerializer(category, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"success": True, "message": "Category updated", "data": serializer.data})
        return Response({"success": False, "message": "Update failed", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        if not is_admin(request.user):
            return Response({"success": False, "message": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
        try:
            category = Category.objects.get(pk=pk)
            category.delete()
            return Response({"success": True, "message": "Category deleted", "data": {}})
        except Category.DoesNotExist:
            return Response({"success": False, "message": "Category not found"}, status=status.HTTP_404_NOT_FOUND)

# 26. Admin Order APIs
class AdminOrderListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not is_admin(request.user):
            return Response({"success": False, "message": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
        orders = Order.objects.all().order_by('-created_at')
        return Response({"success": True, "message": "All orders retrieved", "data": OrderSerializer(orders, many=True).data})

class AdminOrderDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        if not is_admin(request.user):
            return Response({"success": False, "message": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
        try:
            order = Order.objects.get(pk=pk)
            return Response({"success": True, "message": "Order retrieved", "data": OrderSerializer(order).data})
        except Order.DoesNotExist:
            return Response({"success": False, "message": "Order not found"}, status=status.HTTP_404_NOT_FOUND)

class AdminOrderStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        if not is_admin(request.user):
            return Response({"success": False, "message": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
        try:
            order = Order.objects.get(pk=pk)
        except Order.DoesNotExist:
            return Response({"success": False, "message": "Order not found"}, status=status.HTTP_404_NOT_FOUND)

        new_status = request.data.get('status')
        if not new_status:
            return Response({"success": False, "message": "Status required"}, status=status.HTTP_400_BAD_REQUEST)

        order.status = new_status
        order.save()
        return Response({"success": True, "message": f"Order status updated to {new_status}", "data": OrderSerializer(order).data})
