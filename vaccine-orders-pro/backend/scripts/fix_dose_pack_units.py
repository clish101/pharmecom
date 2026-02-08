import os
import sys
import pathlib
import django
from django.utils import timezone

BASE_DIR = pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BASE_DIR))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from api.models import Product, DosePack

NAME = 'Henry product1'

product = Product.objects.filter(name__iexact=NAME).first()
if not product:
    print(f'Product "{NAME}" not found')
    exit(1)

dose_pack = DosePack.objects.filter(product=product).first()
if not dose_pack:
    print('No dose pack found')
    exit(1)

print(f'Fixing dose pack for {product.name}:')
print(f'  Before: {dose_pack.doses} doses @ {dose_pack.units_per_pack}u')

# Fix the units_per_pack
dose_pack.units_per_pack = 10
dose_pack.save()

total_units = dose_pack.doses * dose_pack.units_per_pack
print(f'  After: {dose_pack.doses} doses @ {dose_pack.units_per_pack}u = {total_units} total units')
print('Done')
