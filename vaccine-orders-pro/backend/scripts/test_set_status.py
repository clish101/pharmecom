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
from rest_framework.request import Request
from api.views import OrderViewSet
from django.contrib.auth.models import User
from api.models import Order

# Get a staff user and an order
staff_user = User.objects.filter(is_staff=True).first()
if not staff_user:
    print("No staff user found")
    sys.exit(1)

# Get an order that's in 'requested' status (can be confirmed)
order = Order.objects.filter(status='requested').first()
if not order:
    # Try any order
    order = Order.objects.first()

if not order:
    print("No orders found in database")
    sys.exit(1)

print(f"Testing set_status action for order {order.order_number} (ID: {order.id})")
print(f"Current status: {order.status}")
print(f"Staff user: {staff_user.username}")
print()

# Create a factory and request to call the viewset action directly
factory = APIRequestFactory()
new_status = 'confirmed' if order.status == 'requested' else 'prepared'

print(f"Attempting to change status to: {new_status}")
request = factory.post(f'/api/orders/{order.id}/set_status/', {'status': new_status}, format='json')
request.user = staff_user

# Call the viewset
viewset = OrderViewSet.as_view({'post': 'set_status'})
response = viewset(request, pk=order.id)

print(f"Response status: {response.status_code}")
print(f"Response data: {response.data}")

# Check if status was updated
order.refresh_from_db()
print(f"\nOrder status after update: {order.status}")

# Check status history
history_entries = order.status_history.all()
print(f"Status history entries: {history_entries.count()}")
for entry in history_entries:
    print(f"  - {entry.status} by {entry.changed_by.username if entry.changed_by else 'System'} at {entry.changed_at}")
