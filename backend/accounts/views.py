from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .serializers import CustomerRegisterSerializer, UserSerializer

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def POST(self, request):
        serializer = CustomerRegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                "success": True,
                "message": "User registered successfully",
                "data": {
                    "user": UserSerializer(user).data,
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                }
            }, status=status.HTTP_201_CREATED)
        return Response({
            "success": False,
            "message": "Registration failed",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    # In Django REST framework, HTTP method names on APIView are lowercase (post, get, put, etc.)
    post = POST

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({
                "success": False,
                "message": "Username and password required",
                "errors": {"detail": "Both username and password are required."}
            }, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=username, password=password)
        if user is None:
            # Check if user exists by email
            try:
                user_obj = User.objects.get(email=username)
                user = authenticate(username=user_obj.username, password=password)
            except User.DoesNotExist:
                user = None

        if user is None:
            return Response({
                "success": False,
                "message": "Invalid username or password",
                "errors": {"detail": "Invalid credentials"}
            }, status=status.HTTP_401_UNAUTHORIZED)

        # Check if hotel owner is blocked
        if hasattr(user, 'hotel_owner') and user.hotel_owner.is_blocked:
            return Response({
                "success": False,
                "message": "Your account has been blocked by administrator.",
                "errors": {"detail": "Account blocked"}
            }, status=status.HTTP_403_FORBIDDEN)

        refresh = RefreshToken.for_user(user)
        return Response({
            "success": True,
            "message": "Login successful",
            "data": {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": UserSerializer(user).data
            }
        }, status=status.HTTP_200_OK)

class TokenRefreshView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response({
                "success": False,
                "message": "Refresh token required",
                "errors": {"refresh": "This field is required."}
            }, status=status.HTTP_400_BAD_REQUEST)
        try:
            refresh = RefreshToken(refresh_token)
            return Response({
                "success": True,
                "message": "Token refreshed",
                "data": {
                    "access": str(refresh.access_token)
                }
            })
        except Exception as e:
            return Response({
                "success": False,
                "message": "Invalid or expired refresh token",
                "errors": {"detail": str(e)}
            }, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
        except Exception:
            pass
        return Response({
            "success": True,
            "message": "Logged out successfully",
            "data": {}
        }, status=status.HTTP_200_OK)

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "success": True,
            "message": "Profile retrieved",
            "data": UserSerializer(request.user).data
        })

    def put(self, request):
        user = request.user
        data = request.data

        user.first_name = data.get('first_name', user.first_name)
        user.last_name = data.get('last_name', user.last_name)
        if 'email' in data:
            user.email = data.get('email')
        user.save()

        profile = user.profile
        if 'phone' in data:
            profile.phone = data.get('phone')
        if 'address' in data:
            profile.address = data.get('address')
        if 'city' in data:
            profile.city = data.get('city')
        if 'pincode' in data:
            profile.pincode = data.get('pincode')
        profile.save()

        return Response({
            "success": True,
            "message": "Profile updated successfully",
            "data": UserSerializer(user).data
        })

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')

        if not user.check_password(old_password):
            return Response({
                "success": False,
                "message": "Old password is incorrect",
                "errors": {"old_password": "Wrong password"}
            }, status=status.HTTP_400_BAD_REQUEST)

        if not new_password or len(new_password) < 6:
            return Response({
                "success": False,
                "message": "New password must be at least 6 characters long",
                "errors": {"new_password": "Too short"}
            }, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()

        return Response({
            "success": True,
            "message": "Password changed successfully",
            "data": {}
        })
