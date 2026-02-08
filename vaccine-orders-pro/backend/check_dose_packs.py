#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from api.models import DosePack, Product

henry = Product.objects.filter(name='Henry product1').first()
print('Henry product1:', henry)

if henry:
    packs = DosePack.objects.filter(product=henry)
    print('Dose Packs:', list(packs))
    print('Count:', packs.count())
    for pack in packs:
        print(f'  - {pack.doses} doses, {pack.units_per_pack} units per pack')
else:
    print('Product not found')
