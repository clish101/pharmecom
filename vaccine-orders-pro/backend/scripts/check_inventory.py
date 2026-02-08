#!/usr/bin/env python
import os
import sys
import pathlib

BASE_DIR = pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BASE_DIR))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

import django
django.setup()

from api.models import Order, Product, Batch, DosePack

# Get the order that failed to confirm
order = Order.objects.get(order_number='ORD05BB68DABFF6')
print(f"Order {order.order_number}:")
print(f"  Status: {order.status}")
print()

# Check what items are in the order
print(f"Items in order:")
for item in order.items.all():
    product = item.product
    print(f"  - Product {product.id} ({product.name})")
    print(f"    Quantity: {item.quantity}")
    print(f"    Dose pack: {item.dose_pack}")
    print()
    
    # Check the product's inventory
    print(f"    Product inventory:")
    print(f"      Available stock: {product.available_stock}")
    print(f"      Dose packs: {product.dose_packs.count()}")
    
    for dp in product.dose_packs.all():
        print(f"        - {dp.doses} doses @ {dp.units_per_pack} u/pack")
        print(f"          Total units: {dp.doses * dp.units_per_pack}")
    
    print(f"      Batches:")
    batches = Batch.objects.filter(product=product)
    total_quantity = 0
    total_reserved = 0
    for batch in batches:
        available = batch.quantity - batch.quantity_reserved
        total_quantity += batch.quantity
        total_reserved += batch.quantity_reserved
        print(f"        - Batch {batch.id}: {batch.quantity} units (reserved: {batch.quantity_reserved}, available: {available})")
        print(f"          Expiry: {batch.expiry_date}")
    
    print(f"      Total batches: {batches.count()} (qty: {total_quantity}, reserved: {total_reserved}, available: {total_quantity - total_reserved})")
    print()
