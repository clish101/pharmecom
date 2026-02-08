#!/usr/bin/env python
import os
import sys
import pathlib

BASE_DIR = pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BASE_DIR))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

import django
django.setup()

from rest_framework.test import APIRequestFactory
from api.views import OrderViewSet
from django.contrib.auth.models import User
from api.models import Order, Product, DosePack

# Get a staff user
staff_user = User.objects.filter(is_staff=True).first()

# Get the Henry product2 to check current units
product = Product.objects.get(id=12)  # Henry product2
dose_pack = product.dose_packs.first()

print(f"BEFORE confirmation:")
print(f"  Product: {product.name} (ID: {product.id})")
print(f"  Available stock: {product.available_stock}")
if dose_pack:
    print(f"  Dose pack ID {dose_pack.id}: {dose_pack.doses} doses @ {dose_pack.units_per_pack} u/pack")

# Get the order that we just confirmed (ORD05BB68DABFF6)
try:
    order = Order.objects.get(order_number='ORD05BB68DABFF6')
    print(f"\nOrder {order.order_number}:")
    for item in order.items.all():
        print(f"  Item: {item.product_name}, Quantity: {item.quantity}, Dose Pack: {item.dose_pack}")
    
    # Check if it's already confirmed
    if order.status == 'confirmed':
        print(f"  Status: {order.status} (already confirmed)")
except Order.DoesNotExist:
    print("Order ORD05BB68DABFF6 not found")
    order = None

# Create a new order for testing
print(f"\n\nCreating a new test order for Henry product2...")
from api.models import OrderItem
from decimal import Decimal

# Create a test order
test_order = Order.objects.create(
    user=User.objects.filter(is_staff=False).first(),
    order_number=f"TEST_{os.urandom(6).hex().upper()}",
    status='requested',
    notes='Test order for dose pack deduction'
)

# Create order item (1 pack of Henry product2)
OrderItem.objects.create(
    order=test_order,
    product=product,
    dose_pack=dose_pack,
    batch=None,
    quantity=1,
    unit_price=Decimal('0'),
    requested_delivery_date='2026-02-15'
)

print(f"Created test order: {test_order.order_number}")

# Get stock before confirmation
dose_pack.refresh_from_db()
stock_before = dose_pack.units_per_pack
print(f"\nBefore confirming test order:")
print(f"  Dose pack units: {stock_before}")

# Now confirm the order via API
print(f"\nConfirming order {test_order.order_number}...")
factory = APIRequestFactory()
request = factory.post(f'/api/orders/{test_order.id}/set_status/', {'status': 'confirmed'}, format='json')
request.user = staff_user

viewset = OrderViewSet.as_view({'post': 'set_status'})
response = viewset(request, pk=test_order.id)

print(f"Response status: {response.status_code}")
print(f"Response: {response.data}")

# Check dose pack after confirmation
dose_pack.refresh_from_db()
product.refresh_from_db()

print(f"\nAFTER confirming test order:")
print(f"  Dose pack units: {dose_pack.units_per_pack} (was {stock_before}, change: {stock_before - dose_pack.units_per_pack})")
print(f"  Product available_stock: {product.available_stock}")

# Check inventory log
from api.models import InventoryLog
logs = InventoryLog.objects.filter(related_order=test_order).order_by('-created_at')
print(f"\nInventory logs for this order:")
for log in logs:
    print(f"  - {log.action}: {log.quantity_changed} units by {log.performed_by.username}")

test_order.delete()
print(f"\nTest order cleaned up.")
