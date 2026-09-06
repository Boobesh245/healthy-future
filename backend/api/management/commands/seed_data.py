from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.db import transaction
from decimal import Decimal
import random

from accounts.models import UserProfile, HotelOwner
from restaurants.models import Restaurant
from foods.models import Category, Food

# Curated high quality food images from Unsplash
IMAGE_COLLECTION = [
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1577805947697-89e18249d767?auto=format&fit=crop&w=600&q=80",
]

RESTAURANT_IMAGES = [
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?auto=format&fit=crop&w=600&q=80",
]

CATEGORIES_DATA = [
    ("Healthy Food", "All-around nutritious, balanced healthy wholesome meals"),
    ("Salads", "Fresh organic leafy greens, sprout bowls, and nutrient-dense salad creations"),
    ("Protein Meals", "High-protein muscle-building dishes crafted with clean lean protein"),
    ("Vegan", "100% plant-powered, dairy-free vegan culinary masterworks"),
    ("Vegetarian", "Nutrient-packed vegetarian delights rich in minerals and fiber"),
    ("Keto", "High healthy fats and ultra-low net carbs for ketogenic energy"),
    ("Low-Calorie", "Guilt-free meals carefully crafted under 350-400 calories"),
    ("Organic", "Farm-fresh certified organic produce cooked naturally without chemicals"),
    ("Healthy Breakfast", "Energizing morning oats, chia bowls, and egg-white scrambles"),
    ("Healthy Snacks", "Roasted nuts, energy balls, baked chips, and healthy munchies"),
    ("Juices", "Cold-pressed pure vegetable and fruit juices with zero added sugar"),
    ("Smoothies", "Thick antioxidant-rich superfood fruit & protein smoothies"),
    ("Diet Meals", "Custom macro-balanced meal portions tailored for fitness enthusiasts"),
]

RESTAURANT_NAMES = [
    ("FitBites Green Cafe", "Salads & Bowls", "Bagalur Road, Hosur", "Hosur"),
    ("The Nutri Bowl Co.", "Protein Meals", "MG Road, Hosur", "Hosur"),
    ("Pure Green Salad Bar", "Organic & Salads", "Rayakottai Road, Hosur", "Hosur"),
    ("Keto Craft Kitchen", "Keto & High Protein", "Sipcot Phase 1, Hosur", "Hosur"),
    ("Vegan Soul Bistro", "Vegan Delights", "Denkanikotta Road, Hosur", "Hosur"),
    ("Hosur Protein Hub", "High Protein", "Mathigiri, Hosur", "Hosur"),
    ("Organic Oasis", "Organic Farm Food", "Mookandapalli, Hosur", "Hosur"),
    ("Green Harvest Kitchen", "Healthy Breakfast", "Thally Road, Hosur", "Hosur"),
    ("Raw & Fresh Juice Bar", "Juices & Smoothies", "Gandhi Nagar, Hosur", "Hosur"),
    ("Diet Doctor Kitchen", "Diet Meals", "Avalapalli Road, Hosur", "Hosur"),
    ("Lean Life Cafe", "Low-Calorie", "Kamraj Colony, Hosur", "Hosur"),
    ("Wholesome Grain Kitchen", "Superfoods", "Zuzuvadi, Hosur", "Hosur"),
    ("Soul Greens Deli", "Salads", "Ring Road, Hosur", "Hosur"),
    ("Vitality Fuel Bar", "Protein Meals", "Old ASTC Hudco, Hosur", "Hosur"),
    ("Clean Plate Cafe", "Healthy Food", "New ASTC Hudco, Hosur", "Hosur"),
    ("Green Leaf Diner", "Vegetarian Healthy", "Railway Station Road, Hosur", "Hosur"),
    ("Nature's Spoon Bistro", "Organic", "Shanthi Nagar, Hosur", "Hosur"),
    ("Active Pulse Kitchen", "High Protein", "Bagalur Road, Hosur", "Hosur"),
    ("Herb & Root Eatery", "Vegan", "Denkanikotta Road, Hosur", "Hosur"),
    ("Smoothie Central", "Smoothies & Shakes", "MG Road, Hosur", "Hosur"),
    ("Bangalore Green Pantry", "Salads & Bowls", "Koramangala, Bangalore", "Bangalore"),
    ("The Protein Vault", "High Protein", "Indiranagar, Bangalore", "Bangalore"),
    ("Clean Eats Co.", "Low-Calorie", "HSR Layout, Bangalore", "Bangalore"),
    ("Keto Craze Cafe", "Keto Specialist", "Whitefield, Bangalore", "Bangalore"),
    ("Vegan Vibes Kitchen", "Vegan", "Jayanagar, Bangalore", "Bangalore"),
    ("Fresh & Raw Garden", "Organic Juices", "Electronic City, Bangalore", "Bangalore"),
    ("Mindful Meal Lab", "Diet Meals", "Bellandur, Bangalore", "Bangalore"),
    ("The Sprout & Leaf", "Salads", "JP Nagar, Bangalore", "Bangalore"),
    ("Superfood Symphony", "Healthy Breakfast", "Sarjapur Road, Bangalore", "Bangalore"),
    ("Pure Balance Kitchen", "Wholesome Meals", "Marathahalli, Bangalore", "Bangalore"),
    ("Power Greens Deli", "Salads", "BTM Layout, Bangalore", "Bangalore"),
    ("Macro Matrix Diner", "Protein Meals", "Banashankari, Bangalore", "Bangalore"),
    ("Green Zen Garden", "Organic Vegan", "Malleshwaram, Bangalore", "Bangalore"),
    ("The Nourish Room", "Healthy Food", "Rajajinagar, Bangalore", "Bangalore"),
    ("Nutri Fuel Spot", "Healthy Snacks", "Hebbal, Bangalore", "Bangalore"),
    ("Vital Root Cafe", "Juices & Smoothies", "Kalyan Nagar, Bangalore", "Bangalore"),
    ("Harvest Bowl Co.", "Salads & Grain Bowls", "Frazer Town, Bangalore", "Bangalore"),
    ("Skinny Spoon Diner", "Low-Calorie", "Richmond Town, Bangalore", "Bangalore"),
    ("Lean Beast Kitchen", "High Protein", "Yelahanka, Bangalore", "Bangalore"),
    ("Pure Prana Cafe", "Ayurvedic & Healthy", "Basavanagudi, Bangalore", "Bangalore"),
    ("Hosur Farm Direct", "Organic", "Moranapalli, Hosur", "Hosur"),
    ("Zero Guilt Bakery & Deli", "Keto & Sugar Free", "Alasanatham Road, Hosur", "Hosur"),
    ("Blender Bros Juice Co.", "Juices & Smoothies", "NH 44 Hub, Hosur", "Hosur"),
    ("Ironclad Nutrition", "Protein Meals", "Sipcot Phase 2, Hosur", "Hosur"),
    ("Zenith Salad House", "Salads", "Kelamangalam Road, Hosur", "Hosur"),
    ("Naturally You Cafe", "Diet Meals", "Bagalur Road, Hosur", "Hosur"),
    ("The Fiber Forge", "Low-Calorie", "MG Road, Hosur", "Hosur"),
    ("Plant Power Kitchen", "Vegan", "Mathigiri, Hosur", "Hosur"),
    ("Sun Kissed Smoothies", "Smoothies", "Rayakottai Road, Hosur", "Hosur"),
    ("Calorie Count Diner", "Low-Calorie", "Mookandapalli, Hosur", "Hosur"),
    ("Bangalore Keto Lab", "Keto", "Koramangala 4th Block, Bangalore", "Bangalore"),
    ("Oat & Berry Breakfast Club", "Healthy Breakfast", "Indiranagar 100ft Road, Bangalore", "Bangalore"),
    ("Green Crunch Salad Bar", "Salads", "HSR Sector 2, Bangalore", "Bangalore"),
    ("Protein Prodigy", "High Protein", "Whitefield Main Road, Bangalore", "Bangalore"),
    ("The Healthy Habit", "Diet Meals", "Jayanagar 4th Block, Bangalore", "Bangalore"),
    ("Sprout House Kitchen", "Organic", "JP Nagar Phase 3, Bangalore", "Bangalore"),
    ("The Detox Bar", "Juices & Cleanses", "Electronic City Phase 1, Bangalore", "Bangalore"),
    ("Vigor & Vine Deli", "Vegan & Organic", "Bellandur Outer Ring Road, Bangalore", "Bangalore"),
    ("Good Earth Eatery", "Healthy Food", "Sarjapur Green Glen, Bangalore", "Bangalore"),
    ("Vitality Bowls Cafe", "Protein & Acai Bowls", "BTM Stage 2, Bangalore", "Bangalore"),
]

FOOD_TEMPLATES = [
    ("Mediterranean Quinoa Salad Bowl", "Fluffy tri-color quinoa, baby spinach, cherry tomatoes, kalamata olives, English cucumbers, feta cheese and lemon herb vinaigrette.", "Quinoa, spinach, cherry tomatoes, olives, cucumber, feta cheese, extra virgin olive oil", 180, 320, 14.5, 38.0, 11.2, "Veg", "Organic, High Protein, Low Calorie"),
    ("Grilled Herbed Chicken Breast Meal", "Tender rosemary & thyme grilled chicken breast served with steamed broccoli, garlic mashed sweet potatoes.", "Chicken breast, broccoli, sweet potatoes, rosemary, olive oil, cracked pepper", 260, 420, 38.0, 24.0, 7.5, "Non-Veg", "High Protein, Diet Friendly"),
    ("Avocado Super Green Buddha Bowl", "Ripe Hass avocado slices, massaged kale, roasted chickpeas, shredded purple cabbage, edamame and tahini drizzle.", "Avocado, kale, chickpeas, edamame, purple cabbage, toasted sesame seeds, lemon tahini", 210, 390, 16.0, 34.0, 19.5, "Vegan", "Vegan, Organic, High Protein"),
    ("Keto Almond Butter Paneer Tikka", "Char-grilled cottage cheese chunks marinated in almond butter, Greek yogurt, and stone-ground Indian spices.", "Paneer, greek yogurt, almond butter, bell peppers, onions, garam masala", 240, 380, 26.5, 8.0, 24.0, "Veg", "Keto, High Protein, Gluten Free"),
    ("Wild Berry Chia Seed Protein Pudding", "Omega-3 rich chia seeds soaked in unsweetened almond milk topped with fresh wild berries and raw pumpkin seeds.", "Chia seeds, almond milk, blueberries, strawberries, pumpkin seeds, stevia", 160, 260, 12.0, 28.0, 9.0, "Vegan", "Sugar Free, Low Calorie, Vegan"),
    ("Cold-Pressed Celery Detox Elixir", "100% pure cold-pressed celery, green apple, cucumber, mint leaves and fresh ginger root with no added sugar.", "Celery, green apple, cucumber, mint, ginger, lime", 120, 95, 2.0, 21.0, 0.5, "Vegan", "Sugar Free, Low Calorie, Organic"),
    ("Grilled Norwegian Salmon Macro Plate", "Omega-rich grilled Atlantic salmon fillet accompanied by sautéed asparagus, garlic mushrooms and brown rice.", "Salmon fillet, asparagus, portobello mushrooms, brown rice, olive oil, sea salt", 380, 480, 42.0, 26.0, 18.0, "Non-Veg", "High Protein, Diet Friendly, Keto"),
    ("Smoked Tofu Zucchini Noodle Pad Thai", "Spiralized zucchini zoodles tossed with marinated smoked tofu cubes, bell peppers and peanut lime dressing.", "Zucchini noodles, firm tofu, red peppers, crushed peanuts, tamari, lime juice", 200, 290, 19.0, 14.0, 13.5, "Vegan", "Keto, Vegan, Low Calorie, Gluten Free"),
    ("High-Fiber Steel Cut Oats Bowl", "Slow cooked steel cut rolled oats served with cinnamon, roasted walnuts, golden flax seeds and sliced banana.", "Steel cut oats, almond milk, walnuts, flax seeds, banana, Ceylon cinnamon", 150, 310, 11.5, 48.0, 6.5, "Vegan", "Organic, Diet Friendly, Healthy Breakfast"),
    ("Antioxidant Acai Power Smoothie", "Pure Brazilian acai pulp blended with plant protein, unsweetened almond milk, raspberries and cacao nibs.", "Organic acai pulp, plant protein, almond milk, raspberries, raw cacao nibs", 190, 270, 22.0, 25.0, 5.0, "Vegan", "Sugar Free, High Protein, Vegan"),
    ("Spinach & Egg White Power Omelette", "Four free-range egg whites folded with baby spinach, button mushrooms, goat cheese and toasted wholewheat bread.", "Egg whites, fresh spinach, mushrooms, goat cheese, wholewheat multigrain bread", 170, 240, 28.0, 12.0, 5.5, "Non-Veg", "High Protein, Low Calorie, Diet Friendly"),
    ("Roasted Garlic Hummus & Seed Crisps", "Creamy traditional chickpea hummus drizzled with cold-pressed olive oil, served with flax and sunflower seed crackers.", "Chickpeas, tahini, garlic, extra virgin olive oil, multi-seed crackers", 150, 295, 13.0, 24.0, 14.0, "Vegan", "Vegan, Healthy Snacks, Gluten Free"),
]

class Command(BaseCommand):
    help = 'Seeds database with 60 restaurants, 720+ foods, 100+ customers, hotel owners, and admin.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("Beginning Healthy Future comprehensive seed data generation..."))

        with transaction.atomic():
            # 1. Admin
            admin_user, _ = User.objects.get_or_create(
                username='admin',
                defaults={'email': 'admin@healthyfuture.com', 'is_superuser': True, 'is_staff': True}
            )
            admin_user.set_password('admin@123')
            admin_user.is_superuser = True
            admin_user.is_staff = True
            admin_user.save()
            admin_profile, _ = UserProfile.objects.get_or_create(user=admin_user)
            admin_profile.role = 'admin'
            admin_profile.save()
            self.stdout.write(self.style.SUCCESS("[OK] Admin initialized (admin / admin@123)"))

            # 2. Categories
            category_map = {}
            for name, desc in CATEGORIES_DATA:
                cat_img = random.choice(IMAGE_COLLECTION)
                cat, _ = Category.objects.get_or_create(name=name, defaults={'description': desc, 'image': cat_img})
                category_map[name] = cat
            self.stdout.write(self.style.SUCCESS(f"[OK] {len(category_map)} Categories created/verified."))

            # 3. Hotel Owners (at least 10)
            owners = []
            demo_owner_user, _ = User.objects.get_or_create(
                username='healthyowner',
                defaults={'email': 'owner@example.com', 'first_name': 'Ramesh', 'last_name': 'Kumar'}
            )
            demo_owner_user.set_password('Owner@12345')
            demo_owner_user.save()
            demo_profile, _ = UserProfile.objects.get_or_create(user=demo_owner_user)
            demo_profile.role = 'hotel_owner'
            demo_profile.city = 'Hosur'
            demo_profile.save()
            demo_ho, _ = HotelOwner.objects.get_or_create(user=demo_owner_user, defaults={'phone': '9876543210', 'is_approved': True})
            demo_ho.is_approved = True
            demo_ho.save()
            owners.append(demo_owner_user)

            for i in range(1, 15):
                u, _ = User.objects.get_or_create(
                    username=f'owner_{i}',
                    defaults={'email': f'owner{i}@healthyfuture.com', 'first_name': f'Owner', 'last_name': f'Partner {i}'}
                )
                u.set_password('Owner@12345')
                u.save()
                p, _ = UserProfile.objects.get_or_create(user=u)
                p.role = 'hotel_owner'
                p.city = 'Hosur' if i % 2 == 0 else 'Bangalore'
                p.save()
                ho, _ = HotelOwner.objects.get_or_create(user=u, defaults={'phone': f'98765430{i:02d}', 'is_approved': True})
                ho.is_approved = True
                ho.save()
                owners.append(u)
            self.stdout.write(self.style.SUCCESS(f"[OK] {len(owners)} Hotel Owners created/verified."))

            # 4. Customers (100+)
            demo_customer, _ = User.objects.get_or_create(
                username='boobesh',
                defaults={'email': 'user@example.com', 'first_name': 'Boobesh', 'last_name': 'D'}
            )
            demo_customer.set_password('User@12345')
            demo_customer.save()
            cust_p, _ = UserProfile.objects.get_or_create(user=demo_customer)
            cust_p.role = 'customer'
            cust_p.phone = '9876543210'
            cust_p.city = 'Hosur'
            cust_p.address = 'NH-44 Bagalur Junction, Hosur'
            cust_p.save()

            for i in range(1, 105):
                cu, _ = User.objects.get_or_create(
                    username=f'customer_{i}',
                    defaults={'email': f'customer{i}@gmail.com', 'first_name': f'Customer', 'last_name': f'{i}'}
                )
                cu.set_password('User@12345')
                cu.save()
                cp, _ = UserProfile.objects.get_or_create(user=cu)
                cp.role = 'customer'
                cp.city = 'Hosur' if i % 2 == 0 else 'Bangalore'
                cp.save()
            self.stdout.write(self.style.SUCCESS("[OK] 100+ Customers created/verified."))

            # 5. 60 Restaurants
            created_restaurants = []
            for idx, (r_name, cuisine, addr, city) in enumerate(RESTAURANT_NAMES):
                owner = owners[idx % len(owners)]
                r_img = RESTAURANT_IMAGES[idx % len(RESTAURANT_IMAGES)]
                rating = Decimal(str(round(random.uniform(4.3, 4.9), 1)))
                del_time = random.choice([20, 25, 30, 35, 40])
                del_charge = Decimal(random.choice([0, 20, 25, 30, 40]))

                restaurant, _ = Restaurant.objects.get_or_create(
                    name=r_name,
                    defaults={
                        'owner': owner,
                        'description': f"Premium destination for healthy, organic, and nutritious food in {city}. Chef-crafted with clean, nutrient-dense ingredients.",
                        'address': addr,
                        'city': city,
                        'state': 'Tamil Nadu' if city == 'Hosur' else 'Karnataka',
                        'pincode': '635109' if city == 'Hosur' else '560034',
                        'phone': f"98765{idx:05d}",
                        'cuisine': cuisine,
                        'rating': rating,
                        'delivery_time': del_time,
                        'delivery_charge': del_charge,
                        'image': r_img,
                        'is_approved': True,
                        'is_active': True
                    }
                )
                created_restaurants.append(restaurant)

            self.stdout.write(self.style.SUCCESS(f"[OK] {len(created_restaurants)} Restaurants created/verified."))

            # 6. 12 Dishes per Restaurant (60 x 12 = 720 Foods)
            total_foods_created = 0
            cat_list = list(category_map.values())

            for r_idx, rest in enumerate(created_restaurants):
                # Ensure 12 dishes per restaurant
                for f_idx, (base_name, desc, ing, base_price, base_cal, base_prot, base_carb, base_fat, f_type, h_tags) in enumerate(FOOD_TEMPLATES):
                    # Slight variations per restaurant to make them distinct
                    food_name = f"{base_name}"
                    if f_idx % 3 == 0:
                        food_name = f"{rest.name.split()[0]}'s {base_name}"

                    price = Decimal(str(base_price + (r_idx % 5) * 10))
                    calories = base_cal + ((r_idx * 3) % 40) - 20
                    protein = Decimal(str(round(float(base_prot) + ((r_idx % 4) * 0.5), 1)))
                    carbs = Decimal(str(round(float(base_carb) + ((r_idx % 3) * 0.5), 1)))
                    fat = Decimal(str(round(float(base_fat) + ((r_idx % 2) * 0.4), 1)))
                    food_img = IMAGE_COLLECTION[(r_idx * 12 + f_idx) % len(IMAGE_COLLECTION)]
                    assigned_cat = cat_list[(f_idx + r_idx) % len(cat_list)]
                    food_rating = Decimal(str(round(random.uniform(4.4, 4.9), 1)))

                    food, created = Food.objects.get_or_create(
                        restaurant=rest,
                        food_name=food_name,
                        defaults={
                            'category': assigned_cat,
                            'description': desc,
                            'ingredients': ing,
                            'price': price,
                            'calories': calories,
                            'protein': protein,
                            'carbohydrates': carbs,
                            'fat': fat,
                            'food_type': f_type,
                            'health_tags': h_tags,
                            'image': food_img,
                            'rating': food_rating,
                            'availability': True,
                            'is_popular': (f_idx % 4 == 0),
                            'is_recommended': (f_idx % 5 == 0)
                        }
                    )
                    total_foods_created += 1

            self.stdout.write(self.style.SUCCESS(f"[OK] {total_foods_created} Food items verified (12 dishes x {len(created_restaurants)} restaurants = {len(created_restaurants) * 12} total dishes)."))

        self.stdout.write(self.style.SUCCESS("""
=====================================================
Healthy Future Database Seeding Completed Successfully!
- 1 Superuser Admin: admin / admin@123
- 1 Customer: boobesh / User@12345
- 1 Hotel Owner: healthyowner / Owner@12345
- 100+ Customers
- 15 Hotel Owners
- 60 Healthy Restaurants
- 720 Nutrition-Rich Food Items
- 13 Categories
=====================================================
"""))
