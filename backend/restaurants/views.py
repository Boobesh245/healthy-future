from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.db.models import Q
from .models import Restaurant
from .serializers import RestaurantSerializer
from foods.models import Food
from foods.serializers import FoodSerializer

class RestaurantListView(generics.ListAPIView):
    serializer_class = RestaurantSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Restaurant.objects.filter(is_approved=True, is_active=True)

        # Search
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(cuisine__icontains=search) |
                Q(city__icontains=search) |
                Q(description__icontains=search)
            )

        # Filters
        city = self.request.query_params.get('city')
        if city:
            queryset = queryset.filter(city__iexact=city)

        rating = self.request.query_params.get('rating')
        if rating:
            try:
                queryset = queryset.filter(rating__gte=float(rating))
            except ValueError:
                pass

        cuisine = self.request.query_params.get('cuisine')
        if cuisine:
            queryset = queryset.filter(cuisine__icontains=cuisine)

        max_delivery_time = self.request.query_params.get('max_delivery_time')
        if max_delivery_time:
            try:
                queryset = queryset.filter(delivery_time__lte=int(max_delivery_time))
            except ValueError:
                pass

        # Ordering
        ordering = self.request.query_params.get('ordering')
        if ordering in ['rating', '-rating', 'delivery_charge', '-delivery_charge', 'delivery_time', '-delivery_time', 'name']:
            queryset = queryset.order_by(ordering)

        return queryset

class RestaurantDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        try:
            restaurant = Restaurant.objects.get(pk=pk, is_approved=True, is_active=True)
            return Response({
                "success": True,
                "message": "Restaurant retrieved successfully",
                "data": RestaurantSerializer(restaurant).data
            })
        except Restaurant.DoesNotExist:
            return Response({
                "success": False,
                "message": "Restaurant not found",
                "errors": {"detail": "No active approved restaurant found with this ID"}
            }, status=status.HTTP_404_NOT_FOUND)

class RestaurantFoodsView(generics.ListAPIView):
    serializer_class = FoodSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        restaurant_id = self.kwargs.get('pk')
        queryset = Food.objects.filter(restaurant_id=restaurant_id, availability=True)
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(Q(category__name__icontains=category) | Q(category__id=category if category.isdigit() else 0))
        return queryset
