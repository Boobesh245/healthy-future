from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse

def root_api_index(request):
    return JsonResponse({
        "success": True,
        "message": "Healthy Future REST API is live!",
        "version": "1.0",
        "endpoints": {
            "home": "/api/home/",
            "restaurants": "/api/restaurants/",
            "foods": "/api/foods/",
            "auth": "/api/auth/",
            "cart": "/api/cart/",
            "orders": "/api/orders/",
            "owner": "/api/owner/",
            "admin": "/api/admin/"
        }
    })

urlpatterns = [
    path('', root_api_index, name='api_root'),
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/home/', include('api.home_urls')),
    path('api/restaurants/', include('restaurants.urls')),
    path('api/foods/', include('foods.urls')),
    path('api/categories/', include('foods.category_urls')),
    path('api/cart/', include('cart.urls')),
    path('api/orders/', include('orders.urls')),
    path('api/owner/', include('api.owner_urls')),
    path('api/admin/', include('api.admin_urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
