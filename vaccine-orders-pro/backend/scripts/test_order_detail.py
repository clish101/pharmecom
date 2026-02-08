#!/usr/bin/env python
import os
import sys
import pathlib
import json

BASE_DIR = pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BASE_DIR))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

import django
django.setup()

from rest_framework.test import APIRequestFactory
from api.views import OrderViewSet
from django.contrib.auth.models import User
from api.models import Order

# Get a staff user and the order we just confirmed
staff_user = User.objects.filter(is_staff=True).first()
order = Order.objects.get(order_number='ORD05BB68DABFF6')

print(f"Order {order.order_number}: {order.status}")
print(f"Status history entries: {order.status_history.count()}")

# Simulate a GET request to the single order endpoint
factory = APIRequestFactory()
request = factory.get(f'/api/orders/{order.id}/')
request.user = staff_user

# Call the viewset retrieve method
viewset = OrderViewSet.as_view({'get': 'retrieve'})
response = viewset(request, pk=order.id)

print(f"\nAPI Response Status: {response.status_code}")
print(f"\nOrder data (with status_history):")
print(json.dumps(response.data, indent=2, default=str))
