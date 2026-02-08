import os
import django
import sys
from pathlib import Path
# Ensure backend directory is on sys.path so 'core' package is importable
backend_dir = str(Path(__file__).resolve().parent.parent)
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()
from rest_framework.test import APIClient
from django.contrib.auth.models import User
from api.models import Product, DosePack
from decimal import Decimal

client = APIClient()
user = User.objects.create_user(username='tester2', password='pass')
client.force_authenticate(user=user)
product = Product.objects.create(
    name='Vaccine A', brand='BrandX', species='poultry', product_type='live',
    manufacturer='Mfg', description='desc', active_ingredients='ing',
    cold_chain_required=True, storage_temp_range='2-8C', image_alt='alt',
    minimum_order_qty=1, lead_time_days=3, available_stock=100, administration_notes='notes'
)
dose_pack = DosePack.objects.create(product=product, doses=10, units_per_pack=1)

payload = {
    'notes': 'Please deliver carefully',
    'items': [
        {'product': product.id, 'dose_pack': dose_pack.id, 'quantity': 2, 'unit_price': '12.50', 'requested_delivery_date': '2026-01-10'}
    ]
}

resp = client.post('/api/orders/', payload, format='json')
print('status', resp.status_code)
print('data', resp.data)
