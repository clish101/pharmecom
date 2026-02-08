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

# Define status workflow: each status transition order
STATUS_WORKFLOW = ['requested', 'confirmed', 'prepared', 'dispatched', 'delivered', 'cancelled']

orders = Order.objects.all()
print(f'Checking {orders.count()} orders for complete status history...\n')

for order in orders:
    history = OrderStatusHistory.objects.filter(order=order).order_by('changed_at')
    current_status = order.status
    current_status_idx = STATUS_WORKFLOW.index(current_status) if current_status in STATUS_WORKFLOW else -1
    
    print(f'Order {order.order_number}: status={current_status}')
    print(f'  Existing history: {history.count()} entries')
    for e in history:
        print(f'    - {e.status} by {e.changed_by.username if e.changed_by else "System"}')
    
    # Ensure there's an entry for the current status if missing
    if current_status not in [h.status for h in history]:
        print(f'  [MISSING] Entry for current status "{current_status}"')
        # Try to find a staff member who might have made the change
        # For now, use the first staff member (usually the admin)
        staff_user = User.objects.filter(is_staff=True).first()
        OrderStatusHistory.objects.create(
            order=order,
            status=current_status,
            changed_by=staff_user  # Assign to a staff member (could be None if no staff)
        )
        print(f'  [CREATED] History entry for {current_status}')
    
    print()

print('Status history backfill complete')
