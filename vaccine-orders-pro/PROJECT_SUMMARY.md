# PharmSave - Vaccine Ordering Platform

**Project Status**: ✅ READY FOR TESTING

A modern, seamless B2B vaccine ordering platform for livestock health. PharmSave enables veterinary clinics, farms, and animal health professionals to browse, select, and order premium vaccines with real-time order tracking.

---

## Project Overview

### Company: PharmSave
**Mission**: Make vaccine ordering seamless and efficient for livestock professionals  
**Target Users**: Veterinary clinics, livestock farms, animal health distributors  
**Primary Products**: Poultry & Swine Vaccines  

### Core Features

✅ **User Authentication**
- Email-based registration with secure password handling
- Session-based authentication with CSRF protection
- Logout functionality
- Role-based access control (staff vs. regular users)

✅ **Product Catalog**
- Browse 6+ realistic vaccine products
- Filter by animal species (Poultry, Swine)
- Filter by vaccine type
- Detailed product information with clinical specifications

✅ **Seamless Ordering**
- Shopping cart with persistent storage (localStorage)
- Select dose pack sizes (1000, 5000, 10000 units)
- Quantity management
- Requested delivery date selection
- One-click order submission

✅ **Order Management**
- User dashboard showing all their orders
- Order number tracking
- Order status visibility (pending, confirmed, prepared, dispatched, delivered)
- Order detail dialog with item breakdowns

✅ **Admin Dashboard** (Staff-Only)
- View all customer orders with user attribution
- Update order status
- Manage product inventory and pricing
- Track order fulfillment
- User management with staff/admin roles

---

## Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn-ui components
- **State Management**: React Context (Cart) + TanStack Query (API)
- **Routing**: React Router v6
- **Date Handling**: date-fns
- **HTTP Client**: Fetch API with custom wrapper
- **UI Icons**: Lucide React

### Backend
- **Framework**: Django 4.2
- **API**: Django REST Framework
- **Authentication**: dj-rest-auth + django-allauth (Session & Token)
- **Database**: SQLite3 (development)
- **CORS**: django-cors-headers
- **Security**: Django CSRF protection

### Architecture
- **API Style**: RESTful with JSON payloads
- **Authentication Method**: Session-based (cookies)
- **Frontend Port**: 8081 (dynamic via Vite)
- **Backend Port**: 8000 (Django development server)
- **Communication**: Vite proxy routes `/api/*` to Django backend

---

## Database Models

### User (Django built-in)
- Email (unique)
- Username
- First/Last name
- Staff status (determines admin access)
- Active/Inactive status
- Password (hashed)

### Product
```
- id: Auto-increment
- name: Vaccine name (e.g., "Newcastle Disease Vaccine (ND Live)")
- brand: Manufacturer (e.g., "MERIAL")
- species: "poultry" | "swine"
- type: Vaccine type (e.g., "Live Attenuated")
- manufacturer: Full company name
- description: Clinical details and usage info
- ingredients: Active ingredients with concentrations
- storage_requirements: Temperature and handling info
- image: Product image URL
- tags: Comma-separated tags for search/filter
- stock: Available units in inventory
- lead_time_days: Delivery timeframe
- created: Timestamp
- updated: Timestamp
```

### DosePack (linked to Product)
```
- id: Auto-increment
- product: Foreign key to Product
- doses: Number of vaccine doses (1000, 5000, 10000)
- units_per_pack: Packaging format
```

### Order (linked to User)
```
- id: Auto-increment
- order_number: Unique reference (e.g., PH-2025-0001)
- user: Foreign key to User
- status: "pending" | "confirmed" | "prepared" | "dispatched" | "delivered"
- total_amount: Order total (Decimal)
- notes: Order notes
- created: Timestamp
- updated: Timestamp
```

### OrderItem (linked to Order & Product)
```
- id: Auto-increment
- order: Foreign key to Order
- product: Foreign key to Product (for history)
- product_name: Product name at order time (snapshot)
- dose_pack: Foreign key to DosePack
- quantity: Number of dose packs ordered
- unit_price: Price per dose pack at order time
- requested_delivery_date: Requested delivery date
- delivery_date: Actual delivery date (when updated by admin)
```

### Batch (linked to Product)
```
- id: Auto-increment
- product: Foreign key to Product
- batch_number: Manufacturing batch identifier
- expiry_date: Expiration date
- quantity: Units in batch
```

---

## Current Database Content

### Products (6 vaccines)
1. **Newcastle Disease Vaccine (ND Live)**
   - Brand: MERIAL
   - Species: Poultry
   - Doses: 1000, 5000, 10000
   - Storage: 2-8°C, protected from light
   - Lead Time: 1 day, Stock: 5000 units

2. **Infectious Bursal Disease (IBD)**
   - Brand: HIPRA
   - Species: Poultry
   - Doses: 1000, 5000, 10000
   - Storage: 2-8°C, protected from light
   - Lead Time: 2 days, Stock: 4000 units

3. **Marek's Disease Vaccine (HVT)**
   - Brand: CEVA
   - Species: Poultry
   - Doses: 1000, 5000, 10000
   - Storage: 2-8°C, lyophilized
   - Lead Time: 2 days, Stock: 3000 units

4. **Avian Influenza Vaccine (H5N1)**
   - Brand: BOEHRINGER INGELHEIM
   - Species: Poultry
   - Doses: 1000, 5000, 10000
   - Storage: 2-8°C, store in original container
   - Lead Time: 3 days, Stock: 2000 units

5. **Swine Fever Vaccine (Classical)**
   - Brand: MERIAL
   - Species: Swine
   - Doses: 1000, 5000, 10000
   - Storage: 2-8°C, protect from light
   - Lead Time: 1 day, Stock: 3000 units

6. **Porcine Reproductive & Respiratory Syndrome (PRRS)**
   - Brand: HIPRA
   - Species: Swine
   - Doses: 1000, 5000, 10000
   - Storage: 2-8°C, lyophilized form
   - Lead Time: 2 days, Stock: 2500 units

### Test Users
- **Admin User**: `admin` / `admin123` (staff=true, can access `/admin`)
- **Test User**: `testuser` / `test@test.com` / `test123` (regular user)
- **Existing Order**: Order `TEST001` created by testuser

---

## Project File Structure

```
vaccine-orders-pro/
├── frontend/
│   └── src/
│       ├── pages/
│       │   ├── Index.tsx          # Landing page (rebranded to PharmSave)
│       │   ├── Catalog.tsx        # Product browsing with filters
│       │   ├── ProductDetail.tsx  # Product details view
│       │   ├── Cart.tsx           # Shopping cart & checkout
│       │   ├── Orders.tsx         # User's orders dashboard
│       │   ├── Admin.tsx          # Admin dashboard (staff-only)
│       │   ├── SignIn.tsx         # Login page
│       │   ├── SignUp.tsx         # Registration page
│       │   └── Dashboard.tsx      # Placeholder dashboard
│       ├── components/
│       │   ├── layout/
│       │   │   ├── Header.tsx     # Navigation header (with logout)
│       │   │   ├── Footer.tsx     # Footer
│       │   │   └── Layout.tsx     # Layout wrapper
│       │   ├── products/
│       │   │   ├── ProductCard.tsx
│       │   │   └── ProductFilters.tsx
│       │   ├── orders/
│       │   │   └── OrderDetailDialog.tsx
│       │   ├── admin/
│       │   │   └── AddProductForm.tsx
│       │   └── ui/                # shadcn-ui components
│       ├── context/
│       │   └── CartContext.tsx    # Cart state management
│       ├── lib/
│       │   ├── api.ts             # API wrapper with endpoints
│       │   ├── errorFormatter.ts  # User-friendly error parsing
│       │   └── utils.ts           # Utility functions
│       ├── App.tsx                # Main app component
│       └── main.tsx               # Entry point
├── backend/
│   ├── api/
│   │   ├── models.py              # Django models
│   │   ├── views.py               # API views
│   │   ├── serializers.py         # DRF serializers
│   │   ├── urls.py                # API routes
│   │   ├── admin.py               # Django admin registration
│   │   └── management/
│   │       └── commands/
│   │           └── populate_products.py  # Seed realistic vaccine data
│   ├── core/
│   │   ├── settings.py            # Django settings
│   │   ├── urls.py                # URL routing
│   │   └── wsgi.py                # WSGI config
│   ├── manage.py                  # Django CLI
│   ├── db.sqlite3                 # Development database
│   └── requirements.txt           # Python dependencies
├── TESTING_GUIDE.md               # Comprehensive testing documentation
├── SETUP_GUIDE.md                 # Initial setup guide
└── package.json                   # Frontend dependencies
```

---

## Key Features Implemented

### ✅ PharmSave Branding
- Landing page updated with PharmSave copy
- Header branding and navigation
- Consistent vaccine-focused messaging throughout
- Hero section: "Premium Livestock Vaccines, Delivered Seamlessly"

### ✅ Product Management
- 6 realistic vaccine products with clinical details
- Detailed descriptions including:
  - Active ingredients with proper concentrations
  - Storage requirements (temperature, light protection)
  - Administration instructions (spray vs. injection)
  - Contraindications and safety notes
- Multiple dose pack options per product
- Real lead times and stock levels

### ✅ Shopping Experience
- Product browsing with filter capabilities
- Product detail pages with full information
- Add-to-cart with dose pack selection
- Shopping cart with:
  - Quantity adjustment
  - Delivery date selection
  - Item removal
  - Order total calculation
- One-click checkout

### ✅ Order Processing
- Order creation with automatic order number generation
- Order tracking via unique order number
- Status management (pending → confirmed → delivered)
- Order items snapshot (captures product details at order time)
- User can view only their own orders

### ✅ Admin Dashboard
- Staff-only access control
- Product management interface
- Order management with status updates
- User management
- Visibility of who placed each order (user attribution)

### ✅ Authentication & Security
- User registration with email validation
- Secure password handling
- Session-based authentication with CSRF protection
- Role-based access control (staff vs. regular users)
- Logout functionality

### ✅ User Experience
- Error messages formatted as user-friendly text (no raw JSON)
- Loading states and toast notifications
- Responsive design with Tailwind CSS
- Smooth navigation between pages
- Persistent cart storage

---

## API Endpoints

### Authentication
- `GET /api/auth/csrf/` - Get CSRF token
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `GET /api/auth/user/` - Get current user info

### Products
- `GET /api/products/` - List all products
- `GET /api/products/{id}/` - Get product details
- `GET /api/products/?species=poultry` - Filter by species
- `GET /api/products/?search=vaccine-name` - Search products

### Orders
- `GET /api/orders/` - Get user's orders
- `POST /api/orders/` - Create new order
- `GET /api/orders/{id}/` - Get order details
- `PATCH /api/orders/{id}/` - Update order status (admin only)

### Dose Packs
- `GET /api/dose-packs/` - List all dose packs
- `GET /api/dose-packs/?product={id}` - Get dose packs for product

---

## Configuration

### Django Settings (backend/core/settings.py)
```python
ALLOWED_HOSTS = ["localhost", "127.0.0.1"]
CSRF_TRUSTED_ORIGINS = [
    "http://localhost:8080",
    "http://127.0.0.1:8080", 
    "http://localhost:8081",
    "http://127.0.0.1:8081"
]
CORS_ALLOW_ALL_ORIGINS = True  # Development only
DEBUG = True  # Development mode
```

### Vite Config (vite.config.ts)
```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  }
})
```

---

## Recent Improvements

### Branding Updates
- ✅ Index.tsx rebranded to PharmSave with vaccine-specific content
- ✅ Header updated with logout functionality
- ✅ Navigation links optimized for vaccine ordering workflow

### Data Enhancement
- ✅ 6 realistic vaccine products with clinical specifications
- ✅ Proper active ingredients with concentrations (e.g., "10^6.5 EID50/dose")
- ✅ Storage requirements with temperature ranges
- ✅ Administration methods (spray, injection, drinking water)
- ✅ Lead times and stock levels reflecting real scenarios

### Admin Features
- ✅ All models registered in Django admin
- ✅ Product management with detailed fieldsets
- ✅ Order tracking with user attribution
- ✅ Order status management
- ✅ Search and filter capabilities

### Error Handling
- ✅ User-friendly error messages (no raw JSON shown)
- ✅ errorFormatter utility for parsing API responses
- ✅ Clear validation error messages for forms

### Authentication
- ✅ Staff-only admin access control
- ✅ CSRF token management
- ✅ Proper session handling
- ✅ Logout clears all authentication

---

## Testing Status

### Completed Tests ✅
- User registration and login
- Product browsing and filtering
- Add to cart functionality
- Shopping cart management
- Order submission
- Order viewing by user
- Admin access control (staff-only)
- Product management in admin
- Order management with status updates
- Logout functionality

### Ready for Testing
- Full end-to-end workflow (signup → browse → cart → order → admin view)
- Admin dashboard features
- Order status updates propagating to user
- Multi-user order visibility isolation
- Batch operations
- Performance with multiple orders

**See `TESTING_GUIDE.md` for comprehensive testing procedures**

---

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Setup

**1. Backend Setup**
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser  # Create admin account
python manage.py runserver
```

**2. Frontend Setup**
```bash
npm install
npm run dev
```

**3. Populate Sample Data**
```bash
cd backend
python manage.py populate_products
```

**4. Access Applications**
- Frontend: `http://localhost:8081`
- Django Admin: `http://localhost:8000/admin`

---

## Production Readiness

### ⚠️ Items for Production Migration
1. Switch database from SQLite to PostgreSQL
2. Set `DEBUG = False` in settings.py
3. Configure proper `ALLOWED_HOSTS` with domain names
4. Set strong `SECRET_KEY`
5. Configure HTTPS/SSL
6. Set `CSRF_TRUSTED_ORIGINS` to production domains
7. Configure email backend for order notifications
8. Set up static file serving (WhiteNoise or similar)
9. Configure proper logging and monitoring
10. Add rate limiting for API endpoints
11. Implement API authentication (JWT or OAuth2)
12. Add order status email notifications
13. Set up automated backups for database

### Optional Enhancements
- Email notifications for order status changes
- Order analytics dashboard
- Automatic low-stock alerts
- Batch pricing discounts
- Reorder suggestions based on history
- Integration with logistics tracking
- Multi-language support
- Mobile app version

---

## Documentation Files

- **TESTING_GUIDE.md** - Complete end-to-end testing procedures
- **SETUP_GUIDE.md** - Initial project setup instructions
- **INTEGRATION_CHECKLIST.md** - Feature integration tracking
- **README.md** - Project overview
- **QUICK_START.md** - Quick start guide

---

## Support & Troubleshooting

### Common Issues

**"Products not loading"**
- Check: `curl http://localhost:8000/api/products/`
- Verify populate_products command ran: `python manage.py populate_products`

**"Admin access denied"**
- Check user staff status in Django admin
- User must have `is_staff = True` and `is_superuser = True`

**"CORS errors"**
- Verify `CSRF_TRUSTED_ORIGINS` includes frontend port
- Check `CORS_ALLOW_ALL_ORIGINS = True` in settings (for development)

**"Cart not persisting"**
- Check browser localStorage in dev tools
- Look for `pharmsave-cart` key

---

**Project**: PharmSave - Vaccine Ordering Platform  
**Status**: ✅ Ready for End-to-End Testing  
**Last Updated**: January 18, 2025  
**Version**: 1.0.0
