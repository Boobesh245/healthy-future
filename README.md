# Healthy Future - Healthy Food Ordering & Delivery Web Application

Healthy Future is a responsive full-stack healthy food ordering and delivery web application inspired by Zomato and Swiggy, focused exclusively on healthy, nutritious, diet-friendly foods.

Built with **HTML5, CSS3, JavaScript, Bootstrap 5, Python, Django, Django REST Framework, and MySQL**.

---

## Key Features

- **Nutritional Transparency**: Every dish features calculated macronutrient breakdowns: **Calories (kcal)**, **Protein (g)**, **Carbohydrates (g)**, and **Healthy Fats (g)**.
- **Diet Filters**: High Protein (25g+), Low Calorie (<350 kcal), Keto, Vegan, Organic, Sugar Free, and Gluten Free.
- **60+ Verified Restaurants & 720+ Dishes**: Seeded data featuring 60 realistic healthy eateries across Hosur and Bangalore.
- **Three Dedicated Roles**:
  - **Customer**: Browse restaurants, search dishes, apply nutrition filters, view macro breakdowns, add to cart, checkout, view order status and history.
  - **Hotel Owner**: Register partner restaurant, manage dishes CRUD with nutritional values, toggle availability, and track incoming orders with status transitions.
  - **Admin**: Complete system overview, verify/approve/block hotel owners and restaurants, moderate categories and dishes, and manage all orders.
- **JWT Authentication**: Secure stateless token authentication (`djangorestframework-simplejwt`).
- **Zero-Friction Database Setup**: Configured for MySQL with automatic fallback to SQLite for immediate local execution.

---

## Default Demo Credentials

| Role | Username | Password | Access Portal |
|---|---|---|---|
| **Admin** | `admin` | `admin@123` | `/frontend/admin/index.html` |
| **Hotel Owner** | `healthyowner` | `Owner@12345` | `/frontend/owner/index.html` |
| **Customer** | `boobesh` | `User@12345` | `/frontend/index.html` |

---

## Project Structure

```text
healthy-future/
│
├── frontend/                     # Static Frontend (Vercel-Ready)
│   ├── index.html                # Homepage with hero, search, & diet sections
│   ├── restaurants.html          # Restaurant directory with multi-filter sidebar
│   ├── restaurant-details.html   # Restaurant menu & dishes
│   ├── food-details.html         # Deep nutritional macro breakdown
│   ├── cart.html                 # Cart review & quantity adjustments
│   ├── checkout.html             # Delivery details & payment selection
│   ├── orders.html               # Customer order history & tracking
│   ├── login.html                # Role-based sign-in with quick demo buttons
│   ├── register.html             # Customer registration
│   ├── profile.html              # Customer profile & password management
│   ├── owner/                    # Hotel Owner Partner Portal
│   │   ├── index.html            # Owner analytics dashboard
│   │   ├── restaurant.html       # Manage restaurant profile
│   │   ├── foods.html            # Dishes CRUD with nutritional fields
│   │   └── orders.html           # Real-time incoming restaurant orders
│   ├── admin/                    # System Admin Portal
│   │   ├── index.html            # Global platform analytics
│   │   ├── users.html            # Customer & user management
│   │   ├── owners.html           # Owner approval & verification queue
│   │   ├── restaurants.html      # Restaurant verification & status toggle
│   │   ├── categories.html       # Manage dietary categories
│   │   ├── foods.html            # Global dishes catalog
│   │   └── orders.html           # Platform-wide order management
│   ├── css/
│   │   └── style.css             # Design tokens, macro badges, glassmorphism
│   └── js/
│       ├── api.js                # Configurable API client with JWT interceptor
│       ├── auth.js               # Auth manager & dynamic navbar state
│       ├── cart.js               # Cart synchronizer & badge counter
│       └── main.js               # Shared components & toast notifications
│
├── backend/                      # Django REST API Backend
│   ├── manage.py                 # Django management utility
│   ├── requirements.txt          # Python dependencies
│   ├── .env                      # Local environment configuration
│   ├── .env.example              # Environment variables template
│   ├── healthy_future/           # Django settings, URLs, WSGI, ASGI
│   ├── accounts/                 # User profiles, hotel owners, auth views
│   ├── restaurants/              # Restaurant models, serializers, views
│   ├── foods/                    # Category, Food models, macro views, filters
│   ├── cart/                     # Cart & CartItem models and endpoints
│   ├── orders/                   # Order & OrderItem models and checkout flow
│   └── api/                      # Home, Owner, and Admin views & routers
│       └── management/commands/  # `seed_data` (60 rest, 720 dishes), `create_default_admin`
│
├── database/
│   └── healthy_future_postman_collection.json # Ready-to-import Postman collection
│
├── .gitignore
├── README.md
└── vercel.json                   # Vercel deployment configuration
```

---

## Quickstart & Local Setup

### 1. Prerequisites
- Python 3.10+ installed
- Git installed
- (Optional) MySQL Server running locally on port 3306

### 2. Activate Virtual Environment
```bash
# Windows
.\venv\Scripts\activate

# Linux / macOS
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r backend/requirements.txt
```

### 4. Apply Database Migrations
```bash
python backend/manage.py migrate
```

### 5. Seed Database (60 Restaurants, 720 Dishes, 100+ Users)
```bash
python backend/manage.py seed_data
```

### 6. Run the Django REST API Server
```bash
python backend/manage.py runserver 8000
```
The REST API will be live at `http://127.0.0.1:8000/api/`.

### 7. Run or Open the Frontend
You can open `frontend/index.html` directly in your web browser, or serve it using any local static server:
```bash
# Using Python's built-in HTTP server:
python -m http.server 5500
```
Then visit: `http://127.0.0.1:5500/frontend/index.html`

---

## API Documentation Summary

Base URL: `/api/`

- **Authentication**:
  - `POST /api/auth/register/` - Customer registration
  - `POST /api/auth/login/` - Login (returns JWT tokens)
  - `POST /api/auth/token/refresh/` - Refresh JWT
  - `GET /api/auth/profile/` - Customer profile
  - `PUT /api/auth/profile/` - Update profile
  - `POST /api/auth/change-password/` - Change password
- **Feed & Discovery**:
  - `GET /api/home/` - Consolidated homepage feed
  - `GET /api/restaurants/` - Restaurants directory (filters: `city`, `rating`, `cuisine`, `max_delivery_time`, `ordering`)
  - `GET /api/restaurants/{id}/` - Restaurant details
  - `GET /api/restaurants/{id}/foods/` - Restaurant dishes
  - `GET /api/foods/` - Dishes directory (filters: `health_tag`, `food_type`, `max_calories`, `min_protein`, `min_price`, `max_price`, `category`)
  - `GET /api/foods/popular/` - Popular healthy foods
  - `GET /api/foods/high-protein/` - High protein dishes (25g+ protein)
  - `GET /api/foods/low-calorie/` - Low calorie dishes (<350 kcal)
  - `GET /api/foods/vegan/` - Vegan options
  - `GET /api/foods/keto/` - Keto options
  - `GET /api/foods/recommended/` - Recommended dishes
- **Cart & Orders**:
  - `GET /api/cart/` - Get user cart
  - `POST /api/cart/add/` - Add dish to cart
  - `PUT /api/cart/{id}/` - Update item quantity
  - `DELETE /api/cart/{id}/` - Remove item
  - `DELETE /api/cart/clear/` - Clear cart
  - `POST /api/orders/` - Place order from cart
  - `GET /api/orders/` - Customer order history
  - `POST /api/orders/{id}/cancel/` - Cancel order
- **Hotel Owner APIs**:
  - `POST /api/owner/register/` - Register owner & restaurant
  - `GET /api/owner/dashboard/` - Owner analytics
  - `GET /api/owner/restaurant/` & `PUT /api/owner/restaurant/` - Manage own restaurant
  - `GET /api/owner/foods/` & `POST /api/owner/foods/` - Dishes CRUD
  - `GET /api/owner/orders/` & `PATCH /api/owner/orders/{id}/status/` - Manage incoming orders
- **Admin APIs**:
  - `GET /api/admin/dashboard/` - Platform analytics
  - `GET /api/admin/users/` - User management
  - `PATCH /api/admin/owners/{id}/{action}/` - Approve/Reject/Block owner
  - `PATCH /api/admin/restaurants/{id}/{action}/` - Approve/Block/Activate/Deactivate restaurant
  - `GET /api/admin/orders/` & `PATCH /api/admin/orders/{id}/status/` - Manage all platform orders

---

## Deployment Instructions

### Frontend (Vercel)
The `frontend/` directory is static HTML/CSS/JS. The repository includes `vercel.json` for zero-configuration deployments.
To deploy to Vercel:
1. Push repository to GitHub.
2. Import repository in [Vercel](https://vercel.com).
3. Set the root directory or keep default.
4. If hosting the backend on another domain, set `window.API_BASE_URL` in `frontend/js/api.js` to your deployed backend URL.

### Backend (Render / Railway / Cloud)
1. Deploy using Python runtime.
2. Build Command: `pip install -r backend/requirements.txt && python backend/manage.py migrate && python backend/manage.py seed_data`
3. Start Command: `cd backend && gunicorn healthy_future.wsgi:application --bind 0.0.0.0:$PORT`
4. Set environment variables in your hosting provider's dashboard:
   - `SECRET_KEY`
   - `DEBUG=False`
   - `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT` (for Cloud MySQL)
   - `FRONTEND_URL` (your deployed Vercel frontend URL for CORS)

---

## License
MIT License. Created for the Healthy Future Web Application project.
