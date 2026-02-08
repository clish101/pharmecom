# PharmSave - Getting Started

## ✅ Project Status: READY FOR TESTING

Your PharmSave vaccine ordering platform is fully configured and ready for comprehensive end-to-end testing.

---

## Quick Start

### 1. Verify Both Servers Are Running

**Frontend** (React/Vite):
- Should be running on: `http://localhost:8081`
- Terminal output: Should show "VITE v4.x.x ready in XXX ms"

**Backend** (Django):
- Should be running on: `http://localhost:8000`
- Terminal output: Should show "Starting development server at http://127.0.0.1:8000/"

### 2. Database is Pre-Populated

✅ **6 Realistic Vaccine Products** ready in database:
1. Newcastle Disease Vaccine (ND Live) - MERIAL - Poultry
2. Infectious Bursal Disease (IBD) - HIPRA - Poultry
3. Marek's Disease Vaccine (HVT) - CEVA - Poultry
4. Avian Influenza Vaccine (H5N1) - BOEHRINGER INGELHEIM - Poultry
5. Swine Fever Vaccine (Classical) - MERIAL - Swine
6. PRRS Vaccine - HIPRA - Swine

✅ **Test Users** available:
- Admin: `admin` / `admin123` (can access `/admin`)
- Test User: `testuser` / `test123` (regular user)

---

## Start the Application

### If servers are NOT running, start them now:

**Terminal 1 - Backend:**
```bash
cd backend
python manage.py runserver
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

---

## Access Points

| Name | URL | Purpose |
|------|-----|---------|
| **Frontend App** | http://localhost:8081 | User interface for browsing products and placing orders |
| **Django Admin** | http://localhost:8000/admin | Administrative dashboard for managing products/orders |
| **API Base** | http://localhost:8000/api | RESTful API endpoints |

---

## Test Workflow

### For New Users: Complete Sign-Up Flow

1. **Go to Frontend**: `http://localhost:8081`
2. **Sign Up**:
   - Click "Create Account"
   - Enter email, username, password
   - Create account
   - Should redirect to `/catalog`

3. **Browse Products**: `/catalog`
   - See 6 vaccine products
   - Try filters by species (Poultry/Swine)
   - Click "View Details" on any product

4. **Add to Cart**:
   - Click "View Details" on any product
   - Select dose pack size (1000, 5000, or 10000 doses)
   - Enter quantity
   - Set delivery date (optional)
   - Click "Add to Cart"

5. **View Cart**: Click cart icon in header
   - See all items
   - Adjust quantities
   - Remove items if needed

6. **Submit Order**:
   - Click "Submit Order" button
   - See success notification
   - Redirected to `/orders`

7. **Track Order**: `/orders`
   - See your submitted order
   - View order number
   - Check order status
   - Click to see order details

---

## For Admins: Test Admin Dashboard

### 1. Access Admin Interface

**Option A: Django Admin**
```
URL: http://localhost:8000/admin
Login: admin / admin123
```

**Option B: Frontend Admin Dashboard**
```
1. Go to http://localhost:8081
2. Sign in as admin user
3. Should see "Admin" option in header
```

### 2. Manage Products
- View all 6 vaccine products
- Edit product details (stock, pricing, description)
- View dose pack options
- Manage inventory

### 3. Manage Orders
- View all customer orders
- See who placed each order
- Update order status:
  - pending → confirmed
  - confirmed → prepared
  - prepared → dispatched
  - dispatched → delivered
- View order items with product details
- See delivery dates

### 4. User Management
- View registered users
- Promote user to staff/admin
- View user activity

---

## Staff-Only Access Control Test

### To promote a user to staff (admin access):

1. Go to Django Admin: `http://localhost:8000/admin`
2. Login as: `admin` / `admin123`
3. Click "Users"
4. Select the user to promote
5. Check "Staff status" checkbox
6. Click Save
7. That user can now access `/admin` dashboard

---

## Documentation Files

| File | Purpose |
|------|---------|
| **TESTING_GUIDE.md** | 📋 Complete end-to-end testing procedures |
| **PROJECT_SUMMARY.md** | 📊 Full project overview and specifications |
| **SETUP_GUIDE.md** | 🔧 Initial project setup (already completed) |
| **INTEGRATION_CHECKLIST.md** | ✅ Feature tracking and status |

---

## Common Test Scenarios

### Scenario 1: New User Orders
```
1. Create new account via sign-up form
2. Browse products in /catalog
3. Add 2-3 items to cart
4. Set delivery dates
5. Submit order from cart
6. Verify order appears in /orders
7. Check admin sees the order with correct user info
```

### Scenario 2: Admin Updates Order Status
```
1. Admin views order in admin panel
2. Updates status from "pending" to "confirmed"
3. User refreshes /orders page
4. Sees order status updated to "confirmed"
```

### Scenario 3: Filter and Search
```
1. Go to /catalog
2. Filter by "Poultry" species
3. See only poultry vaccines (4 products)
4. Clear filter
5. Search for "Swine"
6. See only swine vaccines (2 products)
```

### Scenario 4: Staff-Only Access
```
1. Create new user (regular)
2. Try to access /admin
3. Redirected to /catalog (no access)
4. Admin promotes user to staff
5. User refreshes /admin
6. Can now access admin dashboard
```

---

## Expected Behavior Checklist

- [ ] **Authentication**: Users can sign up, sign in, and sign out
- [ ] **Catalog**: All 6 products visible with proper details
- [ ] **Filtering**: Species and type filters work correctly
- [ ] **Product Details**: Shows ingredients, storage, dosing info
- [ ] **Cart**: Items persist, quantities adjust, delivery dates set
- [ ] **Checkout**: Orders submit successfully
- [ ] **Order Tracking**: Users see only their orders
- [ ] **Admin Access**: Only staff users can access `/admin`
- [ ] **Order Management**: Admin can view and update orders
- [ ] **Error Messages**: User-friendly (no raw JSON)
- [ ] **Logout**: Clears authentication and redirects
- [ ] **API**: All endpoints respond with correct data

---

## Troubleshooting

### "Products not showing on catalog"
- **Check**: `http://localhost:8000/api/products/` directly
- **Fix**: Run `python manage.py populate_products` in backend folder

### "Can't sign in"
- **Check**: Email matches the one you registered with
- **Check**: Browser console for CORS/CSRF errors
- **Fix**: Clear browser cache and try again

### "Admin access denied"
- **Check**: User has `Staff status` enabled in Django admin
- **Fix**: `http://localhost:8000/admin` → Users → Enable "Staff status"

### "Cart items disappear"
- **Check**: Browser localStorage (F12 → Application → Local Storage)
- **Fix**: Clear localStorage and refresh

### "Backend not responding"
- **Check**: Is Python still running? Look for Django output
- **Fix**: Stop and restart: `python manage.py runserver`

### "Frontend not loading"
- **Check**: Is Node still running? Look for Vite output
- **Fix**: Stop and restart: `npm run dev`

---

## Advanced Features

### API Testing (Optional)
All endpoints documented in `PROJECT_SUMMARY.md`

Example:
```bash
# Get CSRF token
curl http://localhost:8000/api/auth/csrf/

# Get all products
curl http://localhost:8000/api/products/

# Create order (with authentication)
curl -X POST http://localhost:8000/api/orders/ \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"notes": "Test", "items": [...]}'
```

### Database Inspection
```bash
cd backend
python manage.py dbshell
```

Common queries:
```sql
-- Count products
SELECT COUNT(*) FROM api_product;

-- View all orders
SELECT * FROM api_order;

-- Check user staff status
SELECT username, is_staff, is_superuser FROM auth_user;
```

---

## Success Criteria

Your PharmSave platform is fully operational when:

✅ Both servers running (Backend on 8000, Frontend on 8081)
✅ 6 realistic vaccine products in database
✅ New users can sign up and browse products
✅ Shopping cart works with persistence
✅ Orders submit successfully
✅ Admin dashboard displays all orders with user info
✅ Admin can update order status
✅ Staff-only access control working
✅ All error messages are user-friendly
✅ Logout redirects properly

---

## Next Steps

1. **Start both servers** (if not already running)
2. **Open a browser** to `http://localhost:8081`
3. **Create a test account** to verify sign-up
4. **Browse the 6 products** to verify catalog
5. **Add items to cart** and submit an order
6. **View order in admin panel** to verify order tracking
7. **Test admin features**: Update order status, manage products
8. **Promote a user to staff** and verify admin access control

---

## Support

For detailed testing procedures, see: **TESTING_GUIDE.md**  
For project architecture, see: **PROJECT_SUMMARY.md**

---

**PharmSave Vaccine Ordering Platform**  
**Status**: ✅ Ready for Production Testing  
**Version**: 1.0.0  
**Last Updated**: January 18, 2025
