#!/usr/bin/env python
import os
import sys
import pathlib

BASE_DIR = pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BASE_DIR))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

import django
django.setup()

from api.models import Order, Product, DosePack, InventoryLog

# Get the order and product
order = Order.objects.get(order_number='ORD05BB68DABFF6')
product = Product.objects.get(id=12)
dose_pack = product.dose_packs.first()

print(f"Order: {order.order_number}")
print(f"  Status: {order.status}")
print(f"  Items:")
for item in order.items.all():
    print(f"    - {item.product_name}, qty: {item.quantity}, dose_pack: {item.dose_pack}")

print(f"\nProduct: {product.name}")
print(f"  Available stock: {product.available_stock}")

print(f"\nDose pack: {dose_pack.id if dose_pack else 'None'}")
if dose_pack:
    print(f"  Doses: {dose_pack.doses}")
    print(f"  Units per pack: {dose_pack.units_per_pack}")

print(f"\nInventory logs for this order:")
logs = InventoryLog.objects.filter(related_order=order).order_by('created_at')
for log in logs:
    print(f"  - {log.action}: {log.quantity_changed} units")
    print(f"    Reason: {log.reason}")
    print(f"    By: {log.performed_by.username if log.performed_by else 'System'}")
    print()
