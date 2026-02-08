import os
import sys
import pathlib
import django
from django.utils import timezone

BASE_DIR = pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BASE_DIR))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from api.models import Order, OrderStatusHistory
from django.contrib.auth.models import User

# Find all orders and ensure they have complete status history
orders = Order.objects.all()
print(f'Checking {orders.count()} orders for complete status history...\n')

for order in orders:
    print(f'Order {order.order_number}:')
    print(f'  Current status: {order.status}')
    
    # Check what history entries exist
    history = OrderStatusHistory.objects.filter(order=order).order_by('changed_at')
    print(f'  History entries: {history.count()}')
    for entry in history:
        print(f'    - {entry.status} by {entry.changed_by.username if entry.changed_by else "System"} at {entry.changed_at}')
    
    # Ensure there's at least an initial 'requested' entry
    if not history.exists():
        print(f'    [Creating initial requested entry]')
        OrderStatusHistory.objects.create(
            order=order,
            status='requested',
            changed_by=None
        )
    
    print()

print('Status history check complete')
