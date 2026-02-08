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
from api.models import Order, Product, DosePack, OrderItem
from decimal import Decimal

# Get a staff user
staff_user = User.objects.filter(is_staff=True).first()
regular_user = User.objects.filter(is_staff=False).first()

# Get the product and dose pack
product = Product.objects.get(id=12)  # Henry product2
dose_pack = product.dose_packs.first()

print(f"Testing dose pack deduction with NEW code...")
print(f"Product: {product.name}")
print(f"Dose pack: {dose_pack.doses} doses @ {dose_pack.units_per_pack} u/pack")

# Option 1: Reset the existing order to 'requested' and re-confirm it
existing_order = Order.objects.get(order_number='ORD05BB68DABFF6')
print(f"\nResetting order {existing_order.order_number} to 'requested'...")
existing_order.status = 'requested'
existing_order.save()

# Clear old inventory logs for this order
from api.models import InventoryLog
InventoryLog.objects.filter(related_order=existing_order).delete()

# Reset dose pack to original state
dose_pack.units_per_pack = 30
dose_pack.save()

print(f"Order status reset to: {existing_order.status}")
print(f"Dose pack units reset to: {dose_pack.units_per_pack}")

# Now confirm it via the API with the new code
print(f"\nConfirming order {existing_order.order_number} with UPDATED code...")
factory = APIRequestFactory()
request = factory.post(f'/api/orders/{existing_order.id}/set_status/', {'status': 'confirmed'}, format='json')
request.user = staff_user

viewset = OrderViewSet.as_view({'post': 'set_status'})
response = viewset(request, pk=existing_order.id)

print(f"Response status: {response.status_code}")
print(f"Response: {response.data}")

# Check dose pack after confirmation
dose_pack.refresh_from_db()
product.refresh_from_db()

print(f"\nAFTER confirmation with NEW code:")
print(f"  Dose pack units: {dose_pack.units_per_pack} (reduction: {30 - dose_pack.units_per_pack})")
print(f"  Product available_stock: {product.available_stock}")

# Check inventory logs
logs = InventoryLog.objects.filter(related_order=existing_order).order_by('created_at')
print(f"\nInventory logs:")
for log in logs:
    print(f"  - {log.action}: {log.quantity_changed} units")
    print(f"    Reason: {log.reason}")
