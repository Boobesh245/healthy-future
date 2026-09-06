from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db.models import Q
from .models import Category, Food
from .serializers import CategorySerializer, FoodSerializer

class FoodListView(generics.ListAPIView):
    serializer_class = FoodSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Food.objects.filter(availability=True, restaurant__is_approved=True, restaurant__is_active=True)

        # Search
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(food_name__icontains=search) |
                Q(description__icontains=search) |
                Q(ingredients__icontains=search) |
                Q(health_tags__icontains=search) |
                Q(restaurant__name__icontains=search)
            )

        # Category
        category = self.request.query_params.get('category')
        if category:
            if category.isdigit():
                queryset = queryset.filter(category_id=category)
            else:
                queryset = queryset.filter(category__name__icontains=category)

        # Food Type (Veg, Non-Veg, Vegan)
        food_type = self.request.query_params.get('food_type')
        if food_type:
            queryset = queryset.filter(food_type__iexact=food_type)

        # Price range
        min_price = self.request.query_params.get('min_price')
        if min_price:
            try:
                queryset = queryset.filter(price__gte=float(min_price))
            except ValueError:
                pass

        max_price = self.request.query_params.get('max_price')
        if max_price:
            try:
                queryset = queryset.filter(price__lte=float(max_price))
            except ValueError:
                pass

        # Calories & Protein
        max_calories = self.request.query_params.get('max_calories')
        if max_calories:
            try:
                queryset = queryset.filter(calories__lte=int(max_calories))
            except ValueError:
                pass

        min_protein = self.request.query_params.get('min_protein')
        if min_protein:
            try:
                queryset = queryset.filter(protein__gte=float(min_protein))
            except ValueError:
                pass

        # Rating
        rating = self.request.query_params.get('rating')
        if rating:
            try:
                queryset = queryset.filter(rating__gte=float(rating))
            except ValueError:
                pass

        # Health Tag
        health_tag = self.request.query_params.get('health_tag')
        if health_tag:
            # normalize e.g. high-protein -> high protein
            tag_query = health_tag.replace('-', ' ')
            queryset = queryset.filter(health_tags__icontains=tag_query)

        # Ordering
        ordering = self.request.query_params.get('ordering')
        allowed_orderings = ['price', '-price', 'rating', '-rating', 'calories', '-calories', 'protein', '-protein', 'created_at', '-created_at']
        if ordering in allowed_orderings:
            queryset = queryset.order_by(ordering)

        return queryset

class FoodDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        try:
            food = Food.objects.get(pk=pk, availability=True, restaurant__is_approved=True, restaurant__is_active=True)
            return Response({
                "success": True,
                "message": "Food details retrieved",
                "data": FoodSerializer(food).data
            })
        except Food.DoesNotExist:
            return Response({
                "success": False,
                "message": "Food item not found",
                "errors": {"detail": "No active food item found with this ID"}
            }, status=status.HTTP_404_NOT_FOUND)

class PopularFoodView(generics.ListAPIView):
    serializer_class = FoodSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Food.objects.filter(
            availability=True, restaurant__is_approved=True, restaurant__is_active=True
        ).filter(Q(is_popular=True) | Q(rating__gte=4.6)).order_by('-rating')[:20]

class HighProteinFoodView(generics.ListAPIView):
    serializer_class = FoodSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Food.objects.filter(
            availability=True, restaurant__is_approved=True, restaurant__is_active=True, protein__gte=25
        ).order_by('-protein')[:20]

class LowCalorieFoodView(generics.ListAPIView):
    serializer_class = FoodSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Food.objects.filter(
            availability=True, restaurant__is_approved=True, restaurant__is_active=True, calories__lte=350
        ).order_by('calories')[:20]

class VeganFoodView(generics.ListAPIView):
    serializer_class = FoodSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Food.objects.filter(
            availability=True, restaurant__is_approved=True, restaurant__is_active=True
        ).filter(Q(food_type='Vegan') | Q(health_tags__icontains='Vegan')).order_by('-rating')[:20]

class KetoFoodView(generics.ListAPIView):
    serializer_class = FoodSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Food.objects.filter(
            availability=True, restaurant__is_approved=True, restaurant__is_active=True, health_tags__icontains='Keto'
        ).order_by('-rating')[:20]

class RecommendedFoodView(generics.ListAPIView):
    serializer_class = FoodSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Food.objects.filter(
            availability=True, restaurant__is_approved=True, restaurant__is_active=True
        ).filter(Q(is_recommended=True) | Q(rating__gte=4.7)).order_by('-rating')[:20]

class CategoryListView(generics.ListAPIView):
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
    queryset = Category.objects.all().order_by('name')
    pagination_class = None

class CategoryDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        try:
            category = Category.objects.get(pk=pk)
            foods = Food.objects.filter(category=category, availability=True, restaurant__is_approved=True, restaurant__is_active=True)
            return Response({
                "success": True,
                "message": "Category retrieved",
                "data": {
                    "category": CategorySerializer(category).data,
                    "foods": FoodSerializer(foods, many=True).data
                }
            })
        except Category.DoesNotExist:
            return Response({
                "success": False,
                "message": "Category not found",
                "errors": {"detail": "No category found"}
            }, status=status.HTTP_404_NOT_FOUND)
