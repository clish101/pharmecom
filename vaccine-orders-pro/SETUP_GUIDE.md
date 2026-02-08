# Vaccine Orders Pro - Setup & Integration Guide

## ✅ Project Status

Your project is now fully configured with Django-React integration. Both servers are running and API communication is seamless.

### Running Servers

1. **Frontend Server (Vite)**: http://localhost:8080
   - React + TypeScript + Tailwind CSS
   - Proxies `/api/*` requests to Django backend
   
2. **Backend Server (Django)**: http://localhost:8000
   - Django REST Framework API
   - SQLite database for development
   - CORS enabled for frontend communication

---

## 🔧 What Was Fixed

### 1. React Hook Error in Orders.tsx
**Issue**: Used `useState` instead of `useEffect` to fetch orders
**Fix**: Changed to `useEffect` with proper dependency array

```typescript
// Before: useState(() => { ... })
// After: useEffect(() => { ... }, [])
```

### 2. Django Deprecation Warnings
**Issue**: Old deprecated allauth settings
**Fix**: Updated to new settings format in `core/settings.py`:
- `ACCOUNT_AUTHENTICATION_METHOD` → `ACCOUNT_LOGIN_METHODS`
- `ACCOUNT_EMAIL_REQUIRED` → `ACCOUNT_SIGNUP_FIELDS`

### 3. ALLOWED_HOSTS Configuration
**Issue**: Empty ALLOWED_HOSTS blocking requests
**Fix**: Added proper hosts for development:
```python
ALLOWED_HOSTS = ["localhost", "127.0.0.1", "192.168.100.35"]
```

### 4. API Integration Enhancement
**Improved**: `src/lib/api.ts` with additional methods:
- `fetchProducts()` - Get all products from backend
- `fetchProductById(id)` - Get single product
- `getCurrentUser()` - Get authenticated user
- `registerUser()` - Register new accounts

### 5. OrderSerializer Improvement
**Enhanced**: Now returns full user object with order data
```python
user = UserSerializer(read_only=True)  # Returns user details with order
```

---

## 📋 API Endpoints Reference

All endpoints are prefixed with `/api`

### Products
- **GET** `/api/products/` - List all products
- **GET** `/api/products/{id}/` - Get product details
- **GET** `/api/products/{id}/dose_packs/` - Get available dose packs

### Orders
- **GET** `/api/orders/` - List user's orders (requires authentication)
- **POST** `/api/orders/` - Create new order
- **GET** `/api/orders/{id}/` - Get order details
- **POST** `/api/orders/{id}/set_status/` - Update order status (admin only)

### Authentication
- **GET** `/api/auth/user/` - Get current authenticated user
- **POST** `/api/auth/register/` - Register new user
- **GET** `/api/auth/csrf/` - Get CSRF token for POST requests
- **POST** `/api/auth/login/` - Login with credentials

---

## 🚀 How to Use

### Starting the Development Environment

**Terminal 1 - Frontend:**
```bash
npm i              # Install dependencies (if needed)
npm run dev        # Start Vite dev server on http://localhost:8080
```

**Terminal 2 - Backend:**
```bash
cd backend
python -m pip install -r requirements.txt  # If needed
python manage.py runserver                 # Start on http://localhost:8000
```

### Creating Test Data

```bash
cd backend
python manage.py shell

# In the shell:
from api.models import Product, DosePack

# Create a product
product = Product.objects.create(
    name="Test Vaccine",
    brand="TestBrand",
    species="poultry",
    product_type="live",
    manufacturer="Test Manufacturer",
    description="Test vaccine",
    active_ingredients="Test ingredient",
    storage_temp_range="-20°C to -10°C",
    image_url="/placeholder.svg",
    image_alt="Test image"
)

# Create dose pack
dose_pack = DosePack.objects.create(
    product=product,
    doses=1000,
    units_per_pack=1
)
```

---

## 🔐 Frontend-Backend Communication Flow

### 1. Product Fetching
```typescript
// Frontend requests products
const products = await api.fetchProducts();

// Backend returns products with dose packs
GET /api/products/ → ProductSerializer
```

### 2. Order Creation
```typescript
// Frontend collects order data and submits
const order = await api.createOrder({
  items: [{ product: 1, dose_pack: 1, quantity: 100 }],
  notes: "Order notes"
});

// Backend:
// 1. Gets CSRF token
// 2. Authenticates user
// 3. Creates Order record
// 4. Creates OrderItem records
// 5. Calculates total amount
// 6. Returns order with nested items
```

### 3. CORS & CSRF Protection
- CORS enabled: `CORS_ALLOW_ALL_ORIGINS = True` (dev only)
- CSRF protection: Frontend gets token from `/api/auth/csrf/`
- Credentials included: `credentials: 'include'` in all requests

---

## 📦 Project Structure

```
vaccine-orders-pro/
├── frontend (React + TypeScript)
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── pages/           # Route pages
│   │   ├── context/         # CartContext
│   │   ├── lib/             # API client (api.ts)
│   │   └── data/            # Mock data
│   ├── vite.config.ts       # Vite proxy config
│   └── package.json
│
└── backend (Django REST)
    ├── core/                # Django settings
    │   └── settings.py      # CORS, CSRF, Auth config
    ├── api/                 # REST API app
    │   ├── models.py        # Product, Order, OrderItem
    │   ├── serializers.py   # DRF serializers
    │   ├── views.py         # ViewSets
    │   └── urls.py          # API routes
    ├── manage.py
    └── requirements.txt
```

---

## 🧪 Testing the Integration

### Test 1: Fetch Products
```bash
curl -X GET http://localhost:8000/api/products/
```

### Test 2: Register User
```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password1":"testpass123","password2":"testpass123"}'
```

### Test 3: Create Order (requires authentication)
```bash
# First login or use token auth
curl -X POST http://localhost:8000/api/orders/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Token YOUR_TOKEN" \
  -d '{"items":[{"product":1,"quantity":10}]}'
```

---

## 🐛 Troubleshooting

### Issue: "CORS error" or "Access blocked"
**Solution**: Ensure Django server is running and CORS is enabled in settings

### Issue: "CSRF token missing"
**Solution**: Frontend calls `/api/auth/csrf/` before POST requests

### Issue: "Orders not loading"
**Solution**: Check that user is authenticated (visit `/` to sign in first)

### Issue: Port already in use
**Solution**: 
```bash
# For port 8080
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# For port 8000
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

---

## 📝 Recent Changes Made

1. ✅ Fixed Orders.tsx hook (useState → useEffect)
2. ✅ Updated Django settings for deprecated allauth config
3. ✅ Added ALLOWED_HOSTS for proper request handling
4. ✅ Enhanced API client with additional methods
5. ✅ Improved OrderSerializer with nested user data
6. ✅ Verified Vite proxy configuration for API calls

---

## 🎯 Next Steps

1. **Create test products** in Django admin or shell
2. **Test order flow** by creating an account and placing orders
3. **Build out admin features** in Admin.tsx
4. **Add payment processing** (if needed)
5. **Deploy to production** (update ALLOWED_HOSTS, DEBUG=False, etc.)

---

## 📚 Useful Commands

```bash
# Backend
cd backend
python manage.py migrate              # Run migrations
python manage.py createsuperuser      # Create admin user
python manage.py shell                # Interactive shell
python manage.py runserver 0.0.0.0:8000  # Allow external connections

# Frontend
npm run build                         # Build for production
npm run preview                       # Preview production build
npm run lint                          # Run ESLint
```

---

**Status**: ✅ Ready for development and testing!
