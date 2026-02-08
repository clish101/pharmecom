#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from api.models import DosePack, Product

# Find Henry product1
henry = Product.objects.filter(name='Henry product1').first()

if henry:
    # Add dose packs
    DosePack.objects.create(product=henry, doses=500, units_per_pack=100)
    DosePack.objects.create(product=henry, doses=1000, units_per_pack=50)
    print('Added 2 dose packs to Henry product1')
    
    # Verify
    packs = DosePack.objects.filter(product=henry)
    for pack in packs:
        print(f'  - {pack.doses} doses, {pack.units_per_pack} units per pack')
else:
    print('Henry product1 not found')
