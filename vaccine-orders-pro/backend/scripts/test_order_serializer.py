import os
import sys
import pathlib
import django
import json

BASE_DIR = pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BASE_DIR))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from api.models import Order
from api.serializers import OrderSerializer

# Get an order that has multiple status changes
order = Order.objects.filter(status='prepared').first()
if order:
    serializer = OrderSerializer(order)
    data = serializer.data
    print(f'Order {order.order_number}:')
    print(f'  Status: {data.get("status")}')
    print(f'  Status History included: {"status_history" in data}')
    if 'status_history' in data:
        print(f'  Status History entries: {len(data["status_history"])}')
        for entry in data['status_history']:
            print(f'    - {entry}')
    else:
        print('  WARNING: status_history NOT in serialized data!')
        print(f'  Available fields: {list(data.keys())}')
else:
    print('No orders with status prepared found')
