#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from api.models import Order, OrderStatusHistory

orders = Order.objects.all()
for order in orders:
    # Check if this order already has a status history
    if not OrderStatusHistory.objects.filter(order=order).exists():
        # Create status history entries based on the order's current status and updated_at time
        # We'll create an initial "requested" entry
        OrderStatusHistory.objects.create(
            order=order,
            status=order.status,
            changed_by=None,  # System created
            changed_at=order.created_at
        )
        print(f"Created status history for order {order.order_number}")

print(f"Total status histories now: {OrderStatusHistory.objects.count()}")
