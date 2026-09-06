# pyrefly: ignore [missing-import]
from django.core.management.base import BaseCommand
from accounts.models import User, UserProfile, HotelOwner
from restaurants.models import Restaurant
from foods.models import Food, Category
from api.mongodb_client import get_mongodb_database

class Command(BaseCommand):
    help = 'Export all Django SQLite data to MongoDB database collections'

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("Connecting to MongoDB..."))
        try:
            db = get_mongodb_database()
            # Test connection
            db.command('ping')
            self.stdout.write(self.style.SUCCESS("[OK] Connected to MongoDB"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Could not connect to MongoDB: {e}"))
            self.stdout.write("Ensure MONGODB_URI is set or local MongoDB is running.")
            return

        # 1. Sync Categories
        categories_col = db['categories']
        categories_col.delete_many({})
        cat_count = 0
        for cat in Category.objects.all():
            categories_col.insert_one({
                "django_id": cat.id,
                "name": cat.name,
                "slug": cat.slug,
                "icon": cat.icon,
                "description": cat.description,
                "is_active": cat.is_active
            })
            cat_count += 1
        self.stdout.write(self.style.SUCCESS(f"[OK] Synced {cat_count} categories to MongoDB."))

        # 2. Sync Restaurants
        restaurants_col = db['restaurants']
        restaurants_col.delete_many({})
        rest_count = 0
        for r in Restaurant.objects.all():
            restaurants_col.insert_one({
                "django_id": r.id,
                "name": r.name,
                "description": r.description,
                "tagline": r.tagline,
                "cuisine": r.cuisine,
                "city": r.city,
                "address": r.address,
                "phone": r.phone,
                "rating": float(r.rating or 4.8),
                "total_reviews": r.total_reviews,
                "delivery_time_mins": r.delivery_time_mins,
                "delivery_charge": float(r.delivery_charge),
                "minimum_order": float(r.minimum_order),
                "is_pure_veg": r.is_pure_veg,
                "is_approved": r.is_approved,
                "is_featured": r.is_featured,
                "logo_image": r.logo_image,
                "banner_image": r.banner_image
            })
            rest_count += 1
        self.stdout.write(self.style.SUCCESS(f"[OK] Synced {rest_count} restaurants to MongoDB."))

        # 3. Sync Foods
        foods_col = db['foods']
        foods_col.delete_many({})
        food_count = 0
        for f in Food.objects.all():
            foods_col.insert_one({
                "django_id": f.id,
                "name": f.name,
                "restaurant_id": f.restaurant_id,
                "restaurant_name": f.restaurant.name if f.restaurant else None,
                "category_id": f.category_id,
                "category_name": f.category.name if f.category else None,
                "price": float(f.price),
                "original_price": float(f.original_price) if f.original_price else None,
                "calories": f.calories,
                "protein_g": float(f.protein_g),
                "carbs_g": float(f.carbs_g),
                "fat_g": float(f.fat_g),
                "fiber_g": float(f.fiber_g),
                "is_veg": f.is_veg,
                "is_available": f.is_available,
                "rating": float(f.rating or 4.8),
                "tags": f.tags,
                "image": f.image
            })
            food_count += 1
        self.stdout.write(self.style.SUCCESS(f"[OK] Synced {food_count} healthy dishes to MongoDB."))

        # 4. Sync Users
        users_col = db['users']
        users_col.delete_many({})
        user_count = 0
        for u in User.objects.all():
            role = 'customer'
            phone = ''
            city = 'Coimbatore'
            if hasattr(u, 'profile'):
                role = u.profile.role
                phone = u.profile.phone
                city = u.profile.city
            users_col.insert_one({
                "django_id": u.id,
                "username": u.username,
                "email": u.email,
                "first_name": u.first_name,
                "last_name": u.last_name,
                "role": role,
                "phone": phone,
                "city": city,
                "is_staff": u.is_staff,
                "is_superuser": u.is_superuser
            })
            user_count += 1
        self.stdout.write(self.style.SUCCESS(f"[OK] Synced {user_count} users to MongoDB."))

        self.stdout.write(self.style.SUCCESS("All Healthy Future data synced to MongoDB successfully!"))
