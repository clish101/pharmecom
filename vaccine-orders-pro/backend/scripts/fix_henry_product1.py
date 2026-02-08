import os
import sys
import pathlib
import django
from django.utils import timezone

# Ensure backend path is on sys.path so `import core` works when run from workspace root
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

# Ensure dose pack exists: 1000 doses @ 10 units
dp, created = DosePack.objects.get_or_create(product=product, doses=1000, units_per_pack=10)
if created:
    print('Created DosePack: 1000 doses @ 10u')
else:
    dp.doses = 1000
    dp.units_per_pack = 10
    dp.save()
    print('Updated DosePack to 1000 doses @ 10u')

# Ensure a batch exists with 10 available packs
# We'll look for an existing batch for this product; update or create
batch = Batch.objects.filter(product=product).order_by('-created_at').first()
if batch:
    batch.quantity = 10
    batch.quantity_reserved = 0
    # set expiry one year from now if not set
    if not batch.expiry_date or batch.expiry_date <= timezone.now().date():
        batch.expiry_date = timezone.now().date() + timezone.timedelta(days=365)
    batch.save()
    print(f'Updated existing batch {batch.batch_number} to quantity=10')
else:
    # create a new batch
    import uuid
    bn = f"HP1-{uuid.uuid4().hex[:8].upper()}"
    batch = Batch.objects.create(
        product=product,
        batch_number=bn,
        expiry_date=timezone.now().date() + timezone.timedelta(days=365),
        quantity=10,
        quantity_reserved=0,
        status='available'
    )
    print(f'Created batch {bn} with quantity=10')

# Update product.available_stock to reflect pack count
try:
    product.available_stock = 10
    product.save()
    print('Set product.available_stock = 10')
except Exception as e:
    print('Failed to set available_stock:', e)

print('Done')
