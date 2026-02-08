import os
import sys
import pathlib
import django
from django.utils import timezone

BASE_DIR = pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BASE_DIR))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from api.models import Product, DosePack, Batch

NAME = 'Henry product1'

product = Product.objects.filter(name__iexact=NAME).first()
if not product:
    print(f'Product "{NAME}" not found')
    exit(1)

print(f'Product: {product.name}')
print(f'  available_stock in DB: {product.available_stock}')

dose_packs = DosePack.objects.filter(product=product)
print(f'\nDose Packs ({dose_packs.count()}):')
for dp in dose_packs:
    total_units = dp.doses * dp.units_per_pack
    print(f'  - {dp.doses} doses @ {dp.units_per_pack}u = {total_units} total units')

batches = Batch.objects.filter(product=product)
print(f'\nBatches ({batches.count()}):')
for b in batches:
    available = b.quantity - b.quantity_reserved
    print(f'  - {b.batch_number}: qty={b.quantity}, reserved={b.quantity_reserved}, available={available}')

# Compute backend exposed values
total_units = sum(dp.doses * dp.units_per_pack for dp in dose_packs)
available_packs = sum(b.quantity - b.quantity_reserved for b in batches)
print(f'\nComputed values:')
print(f'  total_units (from dose packs): {total_units}')
print(f'  available_packs (from batches): {available_packs}')
