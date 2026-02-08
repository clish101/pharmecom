import os
import sys
import pathlib
import json

BASE_DIR = pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BASE_DIR))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

import django
django.setup()

from rest_framework.test import APIClient
from django.contrib.auth.models import User

# Get a staff user to simulate frontend fetch
staff_user = User.objects.filter(is_staff=True).first()
if not staff_user:
    print("No staff user found")
    sys.exit(1)

# Use APIClient to make actual request
client = APIClient()
client.force_authenticate(user=staff_user)

# Fetch orders
response = client.get('/api/orders/')
orders_data = response.json()

print("Orders API Response - First Order:")
if isinstance(orders_data, list) and len(orders_data) > 0:
    first_order = orders_data[0]
    print(json.dumps(first_order, indent=2, default=str))
    
    if 'status_history' in first_order:
        print(f"\n✓ status_history present in response")
        print(f"  Entries: {len(first_order['status_history'])}")
        for entry in first_order['status_history']:
            print(f"    - {entry.get('status')}: {entry.get('changed_by_username')}")
    else:
        print("\n✗ status_history NOT in response")
        print(f"Available fields: {list(first_order.keys())}")
else:
    print(f"Response type: {type(orders_data)}")
    if isinstance(orders_data, dict):
        print(f"Keys: {list(orders_data.keys())}")
        if 'results' in orders_data:
            print(f"Found 'results' key, first order:")
            first_order = orders_data['results'][0]
            print(json.dumps(first_order, indent=2, default=str))
