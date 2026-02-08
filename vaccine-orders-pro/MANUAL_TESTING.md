# 🚀 PharmSave - Manual Testing Guide

## Current Status
✅ **Both servers are running**
- Backend: http://localhost:8000
- Frontend: http://localhost:8083
- Database: Fully populated with 6 vaccine products

---

## Quick Start - Test Now!

### Step 1: Open Frontend in Browser
**Go to**: http://localhost:8083/

You should see the PharmSave landing page with:
- Hero section: "Premium Livestock Vaccines, Delivered Seamlessly"
- Navigation: Home, Catalog, Orders, Sign In
- Call-to-action buttons

---

## Test Scenarios (in order)

### Scenario 1: User Sign-Up ✅
1. Click "Create Account" button
2. Enter:
   - Email: `test_user_$(date)@pharmsave.local`
   - Username: `testuser_$(date)`
   - Password: `TestSecure123!`
   - Confirm Password: `TestSecure123!`
3. Click "Create Account"
4. **Expected**: Account created, redirected to `/catalog`

**Verification**: 
- Header shows your username
- Can see product catalog

---

### Scenario 2: Browse Products 📦
1. You should already be at `/catalog`
2. **Expected to see**:
   - 6 vaccine products displayed
   - Each with name, brand, brief description
   - "View Details" button on each

**Filter Test**:
- Try "Poultry" filter → Should show 4 products
- Try "Swine" filter → Should show 2 products
- Clear filters → Should show all 6 again

---

### Scenario 3: View Product Details 📖
1. Click "View Details" on any product
2. **Expected to see**:
   - Full product name
   - Brand and manufacturer
   - Clinical description
   - Active ingredients with concentrations
   - Storage requirements (e.g., "2-8°C")
   - Administration notes
   - Available dose packs (1000, 5000, 10000)
   - Stock level
   - Lead time

**Example Product**: Newcastle Disease Vaccine (ND Live) - MERIAL
- Active Ingredient: Newcastle Disease virus (10^6.5 EID50/dose minimum)
- Storage: 2-8°C, protected from light
- Administration: Spray application for poultry
- Lead Time: 1 day
- Stock: 5000 units

---

### Scenario 4: Add to Cart 🛒
1. On product detail page:
   - Select dose pack size (e.g., 5000 doses)
   - Enter quantity (e.g., 5 packs)
   - Optionally set delivery date (click calendar)
2. Click "Add to Cart"
3. **Expected**: 
   - Toast notification: "Added to cart"
   - Cart icon shows count

**Repeat for multiple products** to test cart with several items

---

### Scenario 5: Review Shopping Cart 🛒
1. Click cart icon in header OR navigate to `/cart`
2. **Expected to see**:
   - All items you added
   - Product name and dose pack size
   - Quantity with +/- buttons
   - Requested delivery date
   - Remove button (trash icon)
   - Order total

**Test Cart Functions**:
- Increase/decrease quantities using +/- buttons
- Click trash icon to remove an item
- Set delivery dates using date picker

---

### Scenario 6: Submit Order 📋
1. From cart page, click "Submit Order"
2. **Expected**:
   - Toast: "Order Request Submitted"
   - Cart clears
   - Redirected to `/orders`

---

### Scenario 7: View Your Orders 📊
1. You should be at `/orders` automatically
2. **Expected to see**:
   - Your submitted order(s)
   - Order number (e.g., PH-2025-0001)
   - Status badge (e.g., "pending")
   - Order total
   - Date created

3. Click on order to see details:
   - Full order number
   - Status
   - List of items with:
     - Product name
     - Dose pack size
     - Quantity
     - Requested delivery date

---

### Scenario 8: Admin Dashboard 🔐

#### Option A: Frontend Admin Access
1. Click header "Sign Out" (logout current user)
2. Sign in as: `admin` / `admin123`
3. **Expected**: Header changes, shows "Admin" option (if you have admin/staff)
4. Click "Admin" to see admin features

#### Option B: Django Admin (Recommended for full testing)
1. Go to: http://localhost:8000/admin/
2. Login: `admin` / `admin123`
3. **Expected**: Django admin dashboard with:
   - Products section
   - Orders section
   - Users section
   - Order Items section

---

### Scenario 9: Admin - Manage Products 📝
1. In Django Admin, click "Products"
2. **Expected to see**: All 6 vaccine products listed
3. Click any product to edit:
   - Change stock level
   - Modify description
   - Update pricing
   - View dose pack options
4. Save changes

---

### Scenario 10: Admin - Manage Orders 📋
1. In Django Admin, click "Orders"
2. **Expected to see**:
   - All orders submitted by users
   - Order number
   - User who placed it (with email)
   - Current status
   - Order total
   - Date created

3. Click any order to update:
   - Change status from "pending" to "confirmed"
   - Add internal notes
   - See all order items
   - View delivery dates

4. Save changes
5. **Go back to user's orders page** → Status should be updated!

---

### Scenario 11: Test Staff-Only Access 🔒
1. Create a new regular user (sign up)
2. Try to access `/admin` (frontend)
   - **Expected**: Redirected to `/catalog`
3. Try to access http://localhost:8000/admin/ directly
   - **Expected**: Login required or 403 Forbidden

4. **Promote user to staff** (in Django admin):
   - Go to http://localhost:8000/admin/auth/user/
   - Click the test user
   - Check "Staff status" checkbox
   - Save

5. Sign in as that user again
6. Try to access `/admin`
   - **Expected**: Can now see admin dashboard!

---

### Scenario 12: Logout Test 🚪
1. Click "Logout" button in header
2. **Expected**:
   - Logged out successfully
   - Redirected to sign-in page
3. Try to access `/orders` without logging in
   - **Expected**: Redirected to sign-in page

---

## Admin Test Users

### Pre-existing Users
```
Admin User:
  Username: admin
  Password: admin123
  Staff: Yes
  Superuser: Yes

Test User:
  Username: testuser
  Password: test123
  Email: test@test.com
  Staff: No
```

### Create New Users During Testing
You can sign up new accounts on the frontend at any time.

---

## Django Admin Features

### Access
- **URL**: http://localhost:8000/admin/
- **Username**: admin
- **Password**: admin123

### Available Sections
1. **Products**
   - View all 6 vaccines
   - Edit details, stock, pricing
   - Search by name/brand
   - Filter by species

2. **Orders**
   - View all customer orders
   - Update status
   - See user who placed order
   - Edit order notes

3. **Order Items**
   - See detailed item breakdown
   - View product snapshots at order time
   - Check quantities and dates

4. **Users**
   - View all registered users
   - Promote to staff
   - Manage permissions

5. **Other**
   - Dose Packs (linked to products)
   - Batches (inventory tracking)

---

## Product Reference

### All 6 Available Products

| # | Name | Brand | Species | Doses | Lead Time |
|---|------|-------|---------|-------|-----------|
| 1 | Newcastle Disease Vaccine (ND Live) | MERIAL | Poultry | 1000, 5000, 10000 | 1 day |
| 2 | Infectious Bursal Disease (IBD) | HIPRA | Poultry | 1000, 5000, 10000 | 2 days |
| 3 | Marek's Disease Vaccine (HVT) | CEVA | Poultry | 1000, 5000, 10000 | 2 days |
| 4 | Avian Influenza Vaccine (H5N1) | BOEHRINGER INGELHEIM | Poultry | 1000, 5000, 10000 | 3 days |
| 5 | Swine Fever Vaccine (Classical) | MERIAL | Swine | 1000, 5000, 10000 | 1 day |
| 6 | PRRS Vaccine | HIPRA | Swine | 1000, 5000, 10000 | 2 days |

---

## Troubleshooting

### "Can't see products"
- Check browser console (F12) for errors
- Verify backend is running: http://localhost:8000/api/products/
- Clear browser cache

### "Can't submit order"
- Make sure you're logged in
- Check cart isn't empty
- Try refreshing browser

### "Admin access denied"
- Make sure you have staff status enabled
- User must be marked as staff in Django admin
- Try signing out and back in

### "Products API not responding"
- Make sure Django backend is still running
- Check terminal for errors
- Restart: `python manage.py runserver`

### "Frontend won't load"
- Make sure npm run dev is still running
- Check terminal for errors
- Try accessing http://localhost:8083/ directly

---

## Success Checklist

Go through and check off as you complete:

- [ ] Frontend loads at http://localhost:8083/
- [ ] Can sign up for new account
- [ ] Can see 6 products in catalog
- [ ] Can filter by species
- [ ] Can view product details
- [ ] Can add items to cart
- [ ] Can modify cart (quantity, delivery date)
- [ ] Can submit order
- [ ] Can view order in `/orders`
- [ ] Can log out
- [ ] Can log in as admin
- [ ] Can access Django admin at `/admin`
- [ ] Can see all orders in admin
- [ ] Can update order status in admin
- [ ] Regular user cannot access admin
- [ ] Promoted user can access admin after staff assignment

---

## Final Notes

✅ **All systems operational**
✅ **6 realistic vaccine products loaded**
✅ **Complete ordering workflow ready**
✅ **Admin dashboard available**
✅ **Staff-only access control working**

**Start testing at**: http://localhost:8083/

Good luck! Report any issues found. 🎉
