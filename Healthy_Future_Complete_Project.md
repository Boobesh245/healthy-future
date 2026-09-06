# Healthy Future

## Healthy Food Ordering & Delivery Web Application

Healthy Future is a responsive full-stack healthy food ordering and delivery web application inspired by Zomato and Swiggy, but focused only on healthy, nutritious, diet-friendly food.

### Technology Stack

- Frontend: HTML5, CSS3, JavaScript, Bootstrap 5
- Backend: Python, Django, Django REST Framework
- Database: MySQL
- Authentication: JWT
- Development: Python Virtual Environment
- Version Control: Git + GitHub
- Frontend Hosting: Vercel
- Backend Hosting: Render / Railway / another Django-compatible platform

---

# 1. User Roles

## Customer

Customers can:

- Register and login
- Browse restaurants
- Search restaurants and dishes
- Filter healthy foods
- View restaurant details
- View food and nutrition details
- Add food to cart
- Update/remove cart items
- Checkout
- Place orders
- View order history
- Manage profile

## Hotel Owner

Hotel owners can:

- Register/login
- Create and manage their restaurant
- Add dishes
- View dishes
- Edit dishes
- Delete dishes
- Manage food availability
- View restaurant orders
- Update order status
- View restaurant statistics

Hotel owners must only be able to manage their own restaurant and food items.

## Admin

Default local/demo credentials:

```text
Username: admin
Password: admin@123
```

Admin can:

- Access dashboard
- Manage customers
- Manage hotel owners
- Approve/reject owners
- Manage restaurants
- Approve/block restaurants
- Manage categories
- Manage food
- Manage orders
- Perform complete CRUD operations
- View statistics

For production, change the default password.

---

# 2. Restaurant and Food Requirements

The homepage must contain at least:

- 50+ restaurants
- 10+ dishes per restaurant

Recommended seed data:

```text
60 Restaurants
12 Dishes per Restaurant
720 Food Items
100+ Customers
10+ Hotel Owners
```

Minimum requirement:

```text
50 Restaurants × 10 Dishes = 500 Dishes
```

---

# 3. Restaurant Categories

- Healthy Food
- Salads
- Protein Meals
- Vegan
- Vegetarian
- Keto
- Low-Calorie
- Organic
- Healthy Breakfast
- Healthy Snacks
- Juices
- Smoothies
- Diet Meals

---

# 4. Food Health Tags

Food items can have:

- High Protein
- Low Calorie
- Keto
- Vegan
- Organic
- Sugar Free
- Diet Friendly
- Gluten Free

Nutrition fields:

```text
Calories
Protein
Carbohydrates
Fat
```

---

# 5. Search and Filters

Search:

```text
Search restaurants or dishes...
```

Food filters:

- Food type
- Category
- Price
- Rating
- Calories
- Protein
- Carbohydrates
- Fat
- Health tags
- Delivery time

Examples:

```text
/api/foods/?search=salad
/api/foods/?category=salad
/api/foods/?food_type=Vegan
/api/foods/?min_price=150&max_price=300
/api/foods/?max_calories=500
/api/foods/?min_protein=25
/api/foods/?rating=4.5
/api/foods/?health_tag=high-protein
```

Combined:

```text
/api/foods/?category=salad&food_type=Vegan&min_protein=15&max_calories=400&max_price=300&rating=4.5
```

Sorting:

```text
/api/foods/?ordering=price
/api/foods/?ordering=-price
/api/foods/?ordering=-rating
/api/foods/?ordering=calories
/api/foods/?ordering=-protein
```

Restaurant filters:

```text
/api/restaurants/?city=Hosur
/api/restaurants/?rating=4.5
/api/restaurants/?cuisine=Healthy
/api/restaurants/?max_delivery_time=30
```

---

# 6. Complete API Specification

Base URL:

```text
/api/
```

Production example:

```text
https://your-backend-domain.com/api/
```

All APIs return JSON.

## Standard Success Response

```json
{
    "success": true,
    "message": "Request successful",
    "data": {}
}
```

## Standard Error Response

```json
{
    "success": false,
    "message": "Something went wrong",
    "errors": {}
}
```

---

# 7. Authentication APIs

## Customer Registration

```http
POST /api/auth/register/
```

Request:

```json
{
    "username": "boobesh",
    "email": "user@example.com",
    "password": "User@12345",
    "password_confirm": "User@12345",
    "first_name": "Boobesh",
    "last_name": "D",
    "phone": "9876543210"
}
```

## Login

```http
POST /api/auth/login/
```

Request:

```json
{
    "username": "boobesh",
    "password": "User@12345"
}
```

Response:

```json
{
    "success": true,
    "message": "Login successful",
    "data": {
        "access": "ACCESS_TOKEN",
        "refresh": "REFRESH_TOKEN",
        "user": {
            "id": 1,
            "username": "boobesh",
            "role": "customer"
        }
    }
}
```

## Refresh Token

```http
POST /api/auth/token/refresh/
```

Request:

```json
{
    "refresh": "REFRESH_TOKEN"
}
```

## Logout

```http
POST /api/auth/logout/
```

## Current Profile

```http
GET /api/auth/profile/
```

## Update Profile

```http
PUT /api/auth/profile/
```

## Change Password

```http
POST /api/auth/change-password/
```

---

# 8. Authentication Header

Protected APIs use:

```http
Authorization: Bearer ACCESS_TOKEN
```

JWT should be used for API authentication.

---

# 9. Restaurant APIs

## Get All Restaurants

```http
GET /api/restaurants/
```

## Restaurant Details

```http
GET /api/restaurants/{restaurant_id}/
```

## Restaurant Foods

```http
GET /api/restaurants/{restaurant_id}/foods/
```

## Search Restaurants

```http
GET /api/restaurants/?search=healthy
```

## Restaurant Filters

```http
GET /api/restaurants/?city=Hosur
GET /api/restaurants/?rating=4.5
GET /api/restaurants/?cuisine=Healthy
GET /api/restaurants/?max_delivery_time=30
```

## Restaurant Sorting

```http
GET /api/restaurants/?ordering=-rating
GET /api/restaurants/?ordering=delivery_charge
GET /api/restaurants/?ordering=delivery_time
```

---

# 10. Food APIs

## Get All Foods

```http
GET /api/foods/
```

## Food Details

```http
GET /api/foods/{food_id}/
```

## Foods by Restaurant

```http
GET /api/restaurants/{restaurant_id}/foods/
```

## Food Search

```http
GET /api/foods/?search=salad
```

Examples:

```text
/api/foods/?search=chicken
/api/foods/?search=paneer
/api/foods/?search=protein
/api/foods/?search=smoothie
/api/foods/?search=vegan
```

---

# 11. Food Filter APIs

## Category

```http
GET /api/foods/?category=salad
```

## Food Type

```http
GET /api/foods/?food_type=Veg
GET /api/foods/?food_type=Non-Veg
GET /api/foods/?food_type=Vegan
```

## Price

```http
GET /api/foods/?max_price=300
GET /api/foods/?min_price=150
GET /api/foods/?min_price=150&max_price=300
```

## Calories

```http
GET /api/foods/?max_calories=500
```

## Protein

```http
GET /api/foods/?min_protein=25
```

## Nutrition

```http
GET /api/foods/?min_protein=25&max_calories=500
```

## Rating

```http
GET /api/foods/?rating=4.5
```

## Health Tag

```http
GET /api/foods/?health_tag=high-protein
```

---

# 12. Special Food APIs

## Popular Foods

```http
GET /api/foods/popular/
```

## High Protein Foods

```http
GET /api/foods/high-protein/
```

## Low Calorie Foods

```http
GET /api/foods/low-calorie/
```

## Vegan Foods

```http
GET /api/foods/vegan/
```

## Keto Foods

```http
GET /api/foods/keto/
```

## Recommended Foods

```http
GET /api/foods/recommended/
```

---

# 13. Category APIs

## Get Categories

```http
GET /api/categories/
```

## Category Details

```http
GET /api/categories/{category_id}/
```

---

# 14. Homepage API

The homepage can use one combined API to reduce requests.

```http
GET /api/home/
```

Response should include:

```text
categories
top_restaurants
popular_foods
high_protein_foods
low_calorie_foods
recommended_foods
```

---

# 15. Cart APIs

Authentication required.

## Get Cart

```http
GET /api/cart/
```

## Add to Cart

```http
POST /api/cart/add/
```

Request:

```json
{
    "food_id": 1,
    "quantity": 2
}
```

## Update Cart Item

```http
PUT /api/cart/{cart_item_id}/
```

Request:

```json
{
    "quantity": 3
}
```

## Remove Cart Item

```http
DELETE /api/cart/{cart_item_id}/
```

## Clear Cart

```http
DELETE /api/cart/clear/
```

---

# 16. Order APIs

## Create Order

```http
POST /api/orders/
```

Request:

```json
{
    "delivery_address": "Hosur, Tamil Nadu",
    "city": "Hosur",
    "pincode": "635109",
    "phone": "9876543210",
    "payment_method": "COD"
}
```

Backend must:

1. Validate cart.
2. Calculate subtotal.
3. Calculate delivery charge.
4. Calculate total.
5. Create order.
6. Create order items.
7. Save order to MySQL.
8. Clear the cart.

## My Orders

```http
GET /api/orders/
```

## Order Details

```http
GET /api/orders/{order_id}/
```

## Cancel Order

```http
POST /api/orders/{order_id}/cancel/
```

Allowed cancellation statuses:

```text
Pending
Confirmed
```

---

# 17. Hotel Owner APIs

## Owner Registration

```http
POST /api/owner/register/
```

Request:

```json
{
    "username": "healthyowner",
    "email": "owner@example.com",
    "password": "Owner@12345",
    "restaurant_name": "Healthy Kitchen",
    "phone": "9876543210",
    "address": "Hosur",
    "city": "Hosur"
}
```

New restaurants should initially be:

```text
is_approved = false
```

## Owner Dashboard

```http
GET /api/owner/dashboard/
```

## Own Restaurant

```http
GET /api/owner/restaurant/
PUT /api/owner/restaurant/
```

---

# 18. Hotel Owner Food CRUD

## Add Food

```http
POST /api/owner/foods/
```

## List Own Foods

```http
GET /api/owner/foods/
```

## Food Details

```http
GET /api/owner/foods/{food_id}/
```

## Update Food

```http
PUT /api/owner/foods/{food_id}/
```

## Delete Food

```http
DELETE /api/owner/foods/{food_id}/
```

The backend must verify that the food belongs to the logged-in owner's restaurant.

---

# 19. Hotel Owner Order APIs

## Get Restaurant Orders

```http
GET /api/owner/orders/
```

## Order Details

```http
GET /api/owner/orders/{order_id}/
```

## Update Order Status

```http
PATCH /api/owner/orders/{order_id}/status/
```

Request:

```json
{
    "status": "Preparing"
}
```

Allowed statuses:

```text
Confirmed
Preparing
Out for Delivery
Delivered
```

---

# 20. Admin APIs

Admin authentication and permission are required.

## Admin Dashboard

```http
GET /api/admin/dashboard/
```

Dashboard statistics:

```text
Customers
Hotel Owners
Restaurants
Foods
Orders
Pending Orders
Completed Orders
Cancelled Orders
```

---

# 21. Admin User CRUD

## List Users

```http
GET /api/admin/users/
```

## User Details

```http
GET /api/admin/users/{user_id}/
```

## Update User

```http
PUT /api/admin/users/{user_id}/
```

## Delete User

```http
DELETE /api/admin/users/{user_id}/
```

---

# 22. Admin Hotel Owner APIs

## List Owners

```http
GET /api/admin/owners/
```

## Owner Details

```http
GET /api/admin/owners/{owner_id}/
```

## Approve Owner

```http
PATCH /api/admin/owners/{owner_id}/approve/
```

## Reject Owner

```http
PATCH /api/admin/owners/{owner_id}/reject/
```

## Block Owner

```http
PATCH /api/admin/owners/{owner_id}/block/
```

---

# 23. Admin Restaurant CRUD

## Create Restaurant

```http
POST /api/admin/restaurants/
```

## List Restaurants

```http
GET /api/admin/restaurants/
```

## Restaurant Details

```http
GET /api/admin/restaurants/{restaurant_id}/
```

## Update Restaurant

```http
PUT /api/admin/restaurants/{restaurant_id}/
```

## Delete Restaurant

```http
DELETE /api/admin/restaurants/{restaurant_id}/
```

## Approve Restaurant

```http
PATCH /api/admin/restaurants/{restaurant_id}/approve/
```

## Block Restaurant

```http
PATCH /api/admin/restaurants/{restaurant_id}/block/
```

## Activate Restaurant

```http
PATCH /api/admin/restaurants/{restaurant_id}/activate/
```

## Deactivate Restaurant

```http
PATCH /api/admin/restaurants/{restaurant_id}/deactivate/
```

---

# 24. Admin Food CRUD

## Create Food

```http
POST /api/admin/foods/
```

## List Foods

```http
GET /api/admin/foods/
```

## Food Details

```http
GET /api/admin/foods/{food_id}/
```

## Update Food

```http
PUT /api/admin/foods/{food_id}/
```

## Delete Food

```http
DELETE /api/admin/foods/{food_id}/
```

---

# 25. Admin Category CRUD

## Create Category

```http
POST /api/admin/categories/
```

## List Categories

```http
GET /api/admin/categories/
```

## Update Category

```http
PUT /api/admin/categories/{category_id}/
```

## Delete Category

```http
DELETE /api/admin/categories/{category_id}/
```

---

# 26. Admin Order APIs

## All Orders

```http
GET /api/admin/orders/
```

## Order Details

```http
GET /api/admin/orders/{order_id}/
```

## Update Order Status

```http
PATCH /api/admin/orders/{order_id}/status/
```

Request:

```json
{
    "status": "Delivered"
}
```

---

# 27. API Pagination

Default page size:

```text
12
```

Example:

```http
GET /api/restaurants/?page=2
GET /api/foods/?page=3
```

Response:

```json
{
    "count": 60,
    "next": "/api/restaurants/?page=3",
    "previous": "/api/restaurants/?page=1",
    "results": []
}
```

---

# 28. HTTP Status Codes

| Status | Meaning |
|---|---|
| 200 | Successful request |
| 201 | Created |
| 204 | Deleted successfully |
| 400 | Bad request |
| 401 | Authentication required |
| 403 | Permission denied |
| 404 | Not found |
| 409 | Conflict |
| 422 | Validation error |
| 500 | Server error |

---

# 29. API Permission Matrix

| Feature | Customer | Hotel Owner | Admin |
|---|---:|---:|---:|
| View Restaurants | Yes | Yes | Yes |
| View Foods | Yes | Yes | Yes |
| Search | Yes | Yes | Yes |
| Filters | Yes | Yes | Yes |
| Cart | Yes | No | Yes |
| Place Order | Yes | No | Yes |
| View Own Orders | Yes | Yes | Yes |
| Add Food | No | Own Restaurant | Yes |
| Edit Food | No | Own Food | Yes |
| Delete Food | No | Own Food | Yes |
| Manage Users | No | No | Yes |
| Manage Restaurant | No | Own Restaurant | Yes |
| Manage Categories | No | No | Yes |
| Approve Restaurant | No | No | Yes |
| Admin Dashboard | No | No | Yes |
| Owner Dashboard | No | Yes | Yes |

---

# 30. Database Models

Main tables/models:

```text
User
UserProfile
HotelOwner
Restaurant
Category
Food
Cart
CartItem
Order
OrderItem
```

## Restaurant Fields

```text
id
owner
name
description
address
city
state
pincode
phone
cuisine
rating
delivery_time
delivery_charge
image
is_approved
is_active
created_at
```

## Food Fields

```text
id
restaurant
category
food_name
description
ingredients
price
calories
protein
carbohydrates
fat
food_type
health_tags
image
rating
availability
created_at
```

---

# 31. Project Folder Structure

```text
healthy-future/
│
├── frontend/
│   ├── index.html
│   ├── restaurants.html
│   ├── food-details.html
│   ├── cart.html
│   ├── checkout.html
│   ├── login.html
│   ├── register.html
│   ├── profile.html
│   ├── owner/
│   ├── admin/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── main.js
│   │   ├── auth.js
│   │   ├── search.js
│   │   ├── filter.js
│   │   ├── cart.js
│   │   └── api.js
│   └── images/
│
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env
│   ├── .env.example
│   ├── healthy_future/
│   ├── accounts/
│   ├── restaurants/
│   ├── foods/
│   ├── cart/
│   ├── orders/
│   └── api/
│
├── database/
│   └── seed_data/
│
├── .gitignore
├── README.md
└── vercel.json
```

---

# 32. Python Virtual Environment

Create:

```bash
python -m venv venv
```

Windows:

```bash
venv\Scripts\activate
```

Linux/Mac:

```bash
source venv/bin/activate
```

Upgrade pip:

```bash
python -m pip install --upgrade pip
```

---

# 33. Dependencies

Install:

```bash
pip install django
pip install djangorestframework
pip install djangorestframework-simplejwt
pip install django-cors-headers
pip install mysqlclient
pip install pillow
pip install python-dotenv
pip install gunicorn
```

Generate requirements:

```bash
pip freeze > requirements.txt
```

Recommended requirements:

```text
Django
djangorestframework
djangorestframework-simplejwt
django-cors-headers
mysqlclient
Pillow
python-dotenv
gunicorn
```

---

# 34. Environment Variables

`.env`:

```text
SECRET_KEY=your-secret-key
DEBUG=True

DB_NAME=healthy_future_db
DB_USER=root
DB_PASSWORD=
DB_HOST=localhost
DB_PORT=3306

FRONTEND_URL=http://127.0.0.1:5500
```

`.env` must not be committed to GitHub.

`.env.example`:

```text
SECRET_KEY=
DEBUG=False

DB_NAME=
DB_USER=
DB_PASSWORD=
DB_HOST=
DB_PORT=3306

FRONTEND_URL=
```

---

# 35. Git Ignore

`.gitignore`:

```text
venv/
.env
__pycache__/
*.pyc
media/
staticfiles/
db.sqlite3
.vscode/
.idea/
```

---

# 36. Django Setup

Create project:

```bash
django-admin startproject healthy_future backend
```

Create apps:

```bash
python manage.py startapp accounts
python manage.py startapp restaurants
python manage.py startapp foods
python manage.py startapp cart
python manage.py startapp orders
python manage.py startapp api
```

Migrations:

```bash
python manage.py makemigrations
python manage.py migrate
```

Seed data:

```bash
python manage.py seed_data
```

Run server:

```bash
python manage.py runserver
```

---

# 37. Default Admin Setup

Local/demo admin:

```text
Username: admin
Password: admin@123
```

Create:

```bash
python manage.py createsuperuser
```

Recommended automated command:

```bash
python manage.py create_default_admin
```

The command should create the admin only if it does not already exist.

---

# 38. Seed Data

The seed command:

```bash
python manage.py seed_data
```

must create:

```text
1 Admin
100+ Customers
10+ Hotel Owners
60 Restaurants
720 Foods
13+ Categories
```

It must be safe to run repeatedly without creating duplicate restaurants or foods.

---

# 39. Responsive Frontend

The website must work on:

- Mobile
- Tablet
- Laptop
- Desktop
- Large Desktop

Use Bootstrap:

```text
container
row
col-12
col-sm-6
col-md-4
col-lg-3
navbar-expand-lg
card
btn
form-control
table-responsive
```

---

# 40. Homepage

The homepage should contain:

```text
Navbar
Hero Section
Search Bar
Healthy Categories
Top Restaurants
Popular Foods
High Protein Foods
Low Calorie Foods
Recommended Foods
Footer
```

Restaurant cards should show:

```text
Image
Restaurant Name
Rating
Cuisine
Delivery Time
Delivery Charge
Location
View Restaurant
```

---

# 41. Admin Dashboard

Dashboard cards:

```text
Total Customers
Total Hotel Owners
Total Restaurants
Total Foods
Total Orders
Pending Orders
Completed Orders
Cancelled Orders
```

Admin navigation:

```text
Dashboard
Users
Hotel Owners
Restaurants
Categories
Foods
Orders
Reports
Logout
```

---

# 42. Hotel Owner Dashboard

Dashboard:

```text
Restaurant Name
Total Dishes
Total Orders
Today's Orders
Pending Orders
Completed Orders
```

Navigation:

```text
Dashboard
Restaurant
Foods
Add Food
Orders
Profile
Logout
```

---

# 43. Customer Flow

```text
Home
  ↓
Search / Filter
  ↓
Restaurant
  ↓
Food Details
  ↓
Add to Cart
  ↓
Cart
  ↓
Checkout
  ↓
Place Order
  ↓
Order History
```

---

# 44. Hotel Owner Flow

```text
Register
  ↓
Admin Approval
  ↓
Owner Login
  ↓
Owner Dashboard
  ↓
Manage Restaurant
  ↓
Add/Edit/Delete Foods
  ↓
Receive Orders
  ↓
Update Order Status
```

---

# 45. Admin Flow

```text
Admin Login
  ↓
Dashboard
  ↓
Manage Customers
  ↓
Manage Hotel Owners
  ↓
Approve Restaurants
  ↓
Manage Foods
  ↓
Manage Categories
  ↓
Manage Orders
  ↓
Reports
```

---

# 46. Deployment Architecture

The frontend and backend should be deployable separately.

```text
Customer
   ↓
Frontend
   ↓
Vercel
   ↓
Django REST API
   ↓
Backend Hosting
   ↓
MySQL
```

Recommended:

```text
Frontend → Vercel
Backend → Render / Railway / Django-compatible hosting
Database → Cloud MySQL
```

The frontend must use an environment/configurable API base URL instead of hardcoding localhost.

Example:

```javascript
const API_BASE_URL = "https://your-backend-domain.com/api";
```

For local development:

```javascript
const API_BASE_URL = "http://127.0.0.1:8000/api";
```

---

# 47. Vercel Readiness

The frontend should remain static:

```text
HTML
CSS
JavaScript
Bootstrap
Images
```

Do not require Node.js for the frontend unless a future framework is introduced.

The repository should contain a Vercel configuration if required by the selected deployment structure.

Example:

```json
{
    "version": 2,
    "builds": [
        {
            "src": "frontend/**",
            "use": "@vercel/static"
        }
    ]
}
```

If the Vercel deployment layout requires a different configuration, use the simplest configuration supported by the final repository structure.

---

# 48. Backend Production Settings

Before deployment:

```text
DEBUG=False
```

Configure:

```text
SECRET_KEY
ALLOWED_HOSTS
CORS_ALLOWED_ORIGINS
DATABASE credentials
FRONTEND_URL
```

Never commit production secrets.

---

# 49. CORS

Install:

```bash
pip install django-cors-headers
```

Allow the deployed Vercel frontend:

```text
https://your-healthy-future.vercel.app
```

Do not allow all origins in production.

---

# 50. GitHub Setup

Repository:

```text
healthy-future
```

Commands:

```bash
git init
git add .
git commit -m "Initial Healthy Future project"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY
git push -u origin main
```

The repository should contain:

```text
frontend/
backend/
database/
README.md
.gitignore
requirements.txt
vercel.json
```

Do not upload:

```text
venv/
.env
passwords
API secrets
database credentials
```

---

# 51. Postman API Testing

Create a Postman collection:

```text
Healthy Future API
│
├── Authentication
├── Customers
├── Restaurants
├── Foods
├── Categories
├── Cart
├── Orders
├── Hotel Owner
└── Admin
```

Recommended test sequence:

```text
Register
 ↓
Login
 ↓
Get JWT
 ↓
Get Restaurants
 ↓
Get Foods
 ↓
Search
 ↓
Filter
 ↓
Add to Cart
 ↓
View Cart
 ↓
Create Order
 ↓
View Order
```

---

# 52. Complete API URL Tree

```text
/api/
│
├── auth/
│   ├── register/
│   ├── login/
│   ├── logout/
│   ├── token/refresh/
│   ├── profile/
│   └── change-password/
│
├── home/
│
├── restaurants/
│   ├──
│   ├── {id}/
│   └── {id}/foods/
│
├── foods/
│   ├──
│   ├── {id}/
│   ├── popular/
│   ├── high-protein/
│   ├── low-calorie/
│   ├── vegan/
│   ├── keto/
│   └── recommended/
│
├── categories/
│   └── {id}/
│
├── cart/
│   ├──
│   ├── add/
│   ├── {id}/
│   └── clear/
│
├── orders/
│   ├──
│   ├── {id}/
│   └── {id}/cancel/
│
├── owner/
│   ├── register/
│   ├── dashboard/
│   ├── restaurant/
│   ├── foods/
│   └── orders/
│
└── admin/
    ├── dashboard/
    ├── users/
    ├── owners/
    ├── restaurants/
    ├── foods/
    ├── categories/
    └── orders/
```

---

# 53. Final Requirements Checklist

```text
[✓] Healthy Future
[✓] Zomato/Swiggy-inspired UI
[✓] Healthy foods only
[✓] HTML5
[✓] CSS3
[✓] JavaScript
[✓] Bootstrap 5
[✓] Python
[✓] Django
[✓] Django REST Framework
[✓] MySQL
[✓] JWT Authentication
[✓] Virtual Environment
[✓] requirements.txt
[✓] .env support
[✓] GitHub ready
[✓] Vercel-ready frontend
[✓] Separate backend deployment
[✓] Admin Dashboard
[✓] Default admin: admin
[✓] Default password: admin@123
[✓] Customer role
[✓] Hotel Owner role
[✓] Admin role
[✓] Admin CRUD
[✓] Hotel Owner CRUD
[✓] 50+ Restaurants
[✓] 10+ Dishes per Restaurant
[✓] 500+ Minimum Foods
[✓] 60 Restaurants / 720 Foods recommended
[✓] Search
[✓] Multiple filters
[✓] Nutrition filters
[✓] Sorting
[✓] Pagination
[✓] Cart
[✓] Checkout
[✓] Orders
[✓] Order History
[✓] Owner Order Management
[✓] Role-Based Access Control
[✓] Seed Data
[✓] Postman API testing
[✓] Responsive Design
[✓] Deployment configuration
```

# 54. Final Project Description

Healthy Future is a responsive full-stack healthy food ordering platform developed using HTML5, CSS3, JavaScript, Bootstrap, Python Django, Django REST Framework, and MySQL.

Unlike general food delivery platforms, Healthy Future focuses exclusively on healthy and nutritious food. Customers can discover healthy restaurants, search and filter dishes based on price, rating, calories, protein, food type, category, and health tags, view nutritional information, add items to a cart, place orders, and track their order history.

The application supports three roles: Customer, Hotel Owner, and Admin. Hotel owners can manage their own restaurants and dishes through CRUD operations, while administrators have complete control over users, hotel owners, restaurants, categories, foods, and orders.

The demo database should contain at least 50 restaurants and 500 dishes, with recommended seed data of 60 restaurants and 720 dishes.

The project is designed with a separated static frontend and Django REST backend. The frontend can be hosted on Vercel, while the Django backend can be hosted on Render, Railway, or another Django-compatible service. MySQL is used for persistent application data.

The project must be responsive, secure, GitHub-ready, API-driven, easy to run using a Python virtual environment, and suitable for local development as well as cloud deployment.
