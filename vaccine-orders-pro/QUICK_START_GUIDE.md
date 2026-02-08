# PharmSave - Quick Start Guide

## 🚀 Getting Started

### User Accounts

**Regular User:**
- Username: `testuser`
- Password: `test123`

**Staff User:**
- Username: `admin`
- Password: `admin123`

---

## 👤 USER JOURNEY

### 1. Browse & Order (Regular Users)

1. **Sign In** → Navigate to `/` or click Sign In
2. **Browse Catalog** → `/catalog`
   - Filter by species, brand, or vaccine type
   - Search by name or keywords
   - View stock availability
3. **View Product Details** → Click "View Details" on any product
   - See full specifications
   - View dose pack options
   - Check availability
4. **Add to Cart** → Select dose pack and quantity
   - Set requested delivery date
   - Adjust quantities anytime
5. **Checkout** → Go to `/cart`
   - Review items and quantities
   - Confirm delivery dates
   - Submit order request
6. **Track Order** → `/order-tracking`
   - See real-time status updates
   - View order timeline
   - Copy order numbers
7. **View All Orders** → `/orders`
   - Filter by status
   - Access order details

---

## 👨‍💼 STAFF OPERATIONS

### 1. Dashboard View

Navigate to `/dashboard` after signing in as staff:
- **4 Key Metrics**: Open Orders, Upcoming Deliveries, Total Orders, Delivered
- **Recent Orders**: List with status
- **Quick Actions**: Update order status
- **Order Details**: Click to expand and manage

### 2. Inventory Management

Navigate to `/inventory`:

#### Main Features:
- **Stock Summary**: Total inventory, low stock alerts, expiry warnings
- **Batch Listing**: All vaccine batches with:
  - Batch number
  - Product name
  - Expiry date (with alerts)
  - Total quantity
  - Available quantity
  - Reserved quantity
  - Current status
  - Storage location

#### Smart Filtering:
1. **Search** by batch number
2. **Filter** by product
3. **Sort** by:
   - Expiry date (urgent first)
   - Stock level (low stock first)

#### Action Items:
- Edit batch details
- Update stock quantities
- Manage storage locations
- Track reservations

---

## 🔄 ORDER FULFILLMENT WORKFLOW

### For Staff:

1. **Order Arrives** → Appears in Dashboard
2. **Review Order** → Click to see items, dates, customer info
3. **Confirm Stock** → Check Inventory page for available batches
4. **Prepare** → Update order status to "Prepared"
5. **Ship** → Update to "Dispatched"
6. **Deliver** → Mark as "Delivered"
7. **Track History** → All changes automatically logged

### For Customers:

1. **Submit Order** → Submits with "Requested" status
2. **See Confirmation** → Status changes to "Confirmed"
3. **Track Preparation** → Status updates to "Prepared"
4. **Monitor Shipping** → Status shows "Dispatched"
5. **Receive** → Final status "Delivered"
6. **Full Timeline** → Order Tracking page shows complete journey

---

## 📊 KEY FEATURES

### Inventory Management
✅ Real-time stock tracking
✅ Expiry date monitoring
✅ Low stock alerts
✅ Storage location management
✅ Batch-level detail tracking
✅ Reserved quantity tracking
✅ Audit logs for all changes

### Order Management
✅ User-specific order viewing
✅ Status-based filtering
✅ Order tracking timeline
✅ Delivery date management
✅ Internal notes for staff
✅ Customer notes for transparency

### Security & Access
✅ Role-based navigation
✅ User-specific data isolation
✅ Staff-only inventory access
✅ Admin-only audit logs
✅ Object-level permissions

### User Experience
✅ Responsive mobile design
✅ Intuitive filtering
✅ Real-time updates
✅ Visual status indicators
✅ Professional UI/UX
✅ Copy-to-clipboard features

---

## 🔌 API ENDPOINTS

### Public
- `GET /api/products/` - List all products
- `GET /api/products/{id}/` - Product details

### Authenticated Users
- `POST /api/orders/` - Create order
- `GET /api/orders/` - List user's orders
- `GET /api/orders/{id}/` - Order details

### Staff Only
- `GET /api/orders/` - List ALL orders
- `POST /api/orders/{id}/set_status/` - Update order status
- `POST /api/orders/{id}/add_internal_note/` - Add internal notes
- `GET /api/batches/` - List all batches
- `POST /api/batches/low_stock/` - Get low stock alert batches
- `POST /api/batches/bulk_update_stock/` - Update multiple batches

### Admin Only
- `GET /api/inventory-logs/` - Audit trail

---

## 📱 NAVIGATION STRUCTURE

### Regular Users
```
Sign In / Sign Up
    ↓
Catalog → Browse Products
    ↓
Product Details → Add to Cart
    ↓
Cart → Submit Order
    ↓
Order Tracking → Monitor Status
    ↓
My Orders → View History
```

### Staff Users
```
Sign In
    ↓
Dashboard → Manage Orders
    ↓
Inventory → Manage Stock
    ↓
Order Fulfillment → Update Status
    ↓
Audit Trail → View History
```

---

## 💡 BEST PRACTICES

### For Users:
1. Set realistic delivery dates (respects lead time)
2. Review cart before submitting
3. Track orders for updates
4. Keep order numbers for reference

### For Staff:
1. Check low stock alerts daily
2. Prioritize expiring batches
3. Keep internal notes for tracking
4. Log all manual adjustments
5. Regular inventory reconciliation

---

## 🎯 COMMON TASKS

### Task: Order a vaccine
1. Sign in as user
2. Go to /catalog
3. Search or filter products
4. Click "View Details"
5. Select dose pack
6. Set quantity and delivery date
7. Go to cart
8. Review and submit

### Task: Update order status
1. Sign in as staff
2. Go to /dashboard
3. Find order in list
4. Click to expand
5. Update status
6. Save

### Task: Check low stock items
1. Sign in as staff
2. Go to /inventory
3. Check red alert banner
4. Batches already filtered
5. Plan replenishment

### Task: Track shipment
1. Sign in as user
2. Go to /order-tracking
3. View timeline
4. See current status

---

## 🆘 TROUBLESHOOTING

### Cart Empty After Login
- Cart clears intentionally for security
- Add items again

### Can't Access Inventory
- Must be logged in as staff user
- Check is_staff flag on account

### Order Not Visible
- Staff sees ALL orders
- Users see only their orders
- Verify login status

### Expired Batches Still Showing
- Need manual status update to "expired"
- Automatic alerts help identify
- Update in Inventory page

---

## 📈 METRICS

### Dashboard Shows:
- Open orders count
- Upcoming deliveries count
- Total orders count
- Delivered orders count

### Inventory Shows:
- Total stock units
- Low stock items count
- Expiring soon batches
- Total batch count

---

## 🔐 PERMISSIONS MATRIX

| Feature | User | Staff |
|---------|------|-------|
| Browse Catalog | ✅ | ✅ |
| Order Vaccines | ✅ | ✅ |
| Track Own Orders | ✅ | ✅ |
| View All Orders | ❌ | ✅ |
| Update Order Status | ❌ | ✅ |
| Manage Inventory | ❌ | ✅ |
| Add Internal Notes | ❌ | ✅ |
| View Audit Logs | ❌ | ❌* |

*Coming soon

---

## 🚀 SYSTEM REQUIREMENTS

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection
- JavaScript enabled
- No plugins required

---

## 📞 SUPPORT

For issues or questions:
1. Check this guide first
2. Verify you're on the correct page
3. Clear browser cache and try again
4. Contact IT support

---

**Last Updated**: February 7, 2026
**Version**: 1.0
**Platform**: PharmSave Vaccine Ordering System
