"""
Script to populate the database with sample vaccine products.
Run with: python manage.py shell < scripts/populate_products.py
Or: python manage.py shell then: exec(open('scripts/populate_products.py').read())
"""

from api.models import Product, DosePack

# Clear existing products (optional)
# Product.objects.all().delete()

# Sample vaccine products
products_data = [
    {
        'name': 'Newcastle Disease Vaccine (ND Live)',
        'brand': 'MERIAL',
        'species': 'poultry',
        'product_type': 'live',
        'manufacturer': 'MERIAL Limited',
        'description': 'Live attenuated Newcastle disease vaccine for poultry. Used for prevention of Newcastle disease in broilers and layers.',
        'active_ingredients': 'Newcastle disease virus (LaSota strain)',
        'cold_chain_required': True,
        'storage_temp_range': '2-8°C',
        'image_url': '/placeholder.svg',
        'image_alt': 'Newcastle Disease Vaccine',
        'tags': '["newcastle", "nd", "poultry", "live"]',
        'minimum_order_qty': 100,
        'lead_time_days': 3,
        'available_stock': 5000,
        'administration_notes': 'Spray or eye-drop application. Use within 30 minutes of reconstitution.',
        'dose_packs': [
            {'doses': 1000, 'units_per_pack': 1},
            {'doses': 5000, 'units_per_pack': 5},
        ]
    },
    {
        'name': 'Infectious Bursal Disease Vaccine (IBD)',
        'brand': 'HIPRA',
        'species': 'poultry',
        'product_type': 'killed',
        'manufacturer': 'HIPRA S.A.',
        'description': 'Inactivated infectious bursal disease vaccine. Provides protection against IBDV in broilers and breeders.',
        'active_ingredients': 'Inactivated infectious bursal disease virus',
        'cold_chain_required': True,
        'storage_temp_range': '2-8°C',
        'image_url': '/placeholder.svg',
        'image_alt': 'IBD Vaccine',
        'tags': '["ibd", "infectious-bursal-disease", "poultry", "killed"]',
        'minimum_order_qty': 50,
        'lead_time_days': 5,
        'available_stock': 3000,
        'administration_notes': 'Intramuscular or subcutaneous injection. For breeder birds use.',
        'dose_packs': [
            {'doses': 500, 'units_per_pack': 1},
            {'doses': 2500, 'units_per_pack': 5},
        ]
    },
    {
        'name': 'Marek\'s Disease Vaccine (HVT)',
        'brand': 'CEVA',
        'species': 'poultry',
        'product_type': 'live',
        'manufacturer': 'CEVA Santé Animale',
        'description': 'Live herpesvirus of turkey vaccine for protection against Marek\'s disease in chickens.',
        'active_ingredients': 'Herpesvirus of turkey (HVT), Fc126 strain',
        'cold_chain_required': True,
        'storage_temp_range': '-18°C or 2-8°C',
        'image_url': '/placeholder.svg',
        'image_alt': 'Marek\'s Vaccine',
        'tags': '["mareks", "hvt", "poultry", "live"]',
        'minimum_order_qty': 100,
        'lead_time_days': 2,
        'available_stock': 4500,
        'administration_notes': 'Subcutaneous injection in day-old chicks. Do not expose to light for extended periods.',
        'dose_packs': [
            {'doses': 1000, 'units_per_pack': 1},
            {'doses': 10000, 'units_per_pack': 10},
        ]
    },
    {
        'name': 'Avian Influenza Vaccine (H5N1)',
        'brand': 'BOEHRINGER INGELHEIM',
        'species': 'poultry',
        'product_type': 'killed',
        'manufacturer': 'Boehringer Ingelheim',
        'description': 'Inactivated avian influenza vaccine for poultry. Provides protection against H5N1 strain.',
        'active_ingredients': 'Inactivated avian influenza virus (H5N1 strain)',
        'cold_chain_required': True,
        'storage_temp_range': '2-8°C',
        'image_url': '/placeholder.svg',
        'image_alt': 'Avian Influenza Vaccine',
        'tags': '["avian-influenza", "h5n1", "poultry", "killed"]',
        'minimum_order_qty': 200,
        'lead_time_days': 7,
        'available_stock': 2000,
        'administration_notes': 'Intramuscular injection. Requires booster vaccination after 2-3 weeks.',
        'dose_packs': [
            {'doses': 1000, 'units_per_pack': 1},
            {'doses': 5000, 'units_per_pack': 5},
        ]
    },
    {
        'name': 'Swine Fever Vaccine (Classical)',
        'brand': 'MERIAL',
        'species': 'swine',
        'product_type': 'killed',
        'manufacturer': 'MERIAL Limited',
        'description': 'Inactivated classical swine fever vaccine for prevention of CSF in pigs.',
        'active_ingredients': 'Inactivated classical swine fever virus (CSF virus)',
        'cold_chain_required': True,
        'storage_temp_range': '2-8°C',
        'image_url': '/placeholder.svg',
        'image_alt': 'Swine Fever Vaccine',
        'tags': '["swine-fever", "csf", "swine", "killed"]',
        'minimum_order_qty': 50,
        'lead_time_days': 4,
        'available_stock': 1500,
        'administration_notes': 'Intramuscular injection. Administer to breeding stock and growing pigs.',
        'dose_packs': [
            {'doses': 250, 'units_per_pack': 1},
            {'doses': 2500, 'units_per_pack': 10},
        ]
    },
    {
        'name': 'Porcine Reproductive & Respiratory Syndrome (PRRS) Vaccine',
        'brand': 'HIPRA',
        'species': 'swine',
        'product_type': 'live',
        'manufacturer': 'HIPRA S.A.',
        'description': 'Modified-live PRRS vaccine for protection against porcine reproductive and respiratory syndrome.',
        'active_ingredients': 'PRRS virus (modified-live)',
        'cold_chain_required': True,
        'storage_temp_range': '-18°C or 2-8°C',
        'image_url': '/placeholder.svg',
        'image_alt': 'PRRS Vaccine',
        'tags': '["prrs", "porcine-reproductive-respiratory-syndrome", "swine", "live"]',
        'minimum_order_qty': 100,
        'lead_time_days': 6,
        'available_stock': 2500,
        'administration_notes': 'Intramuscular or intranasal administration. Vaccinate breeding sows and gilts.',
        'dose_packs': [
            {'doses': 500, 'units_per_pack': 1},
            {'doses': 5000, 'units_per_pack': 10},
        ]
    },
]

# Create products and dose packs
for product_data in products_data:
    dose_packs_data = product_data.pop('dose_packs')
    
    # Create or update product
    product, created = Product.objects.get_or_create(
        name=product_data['name'],
        defaults=product_data
    )
    
    if created:
        print(f"✓ Created: {product.name}")
    else:
        # Update existing product
        for key, value in product_data.items():
            setattr(product, key, value)
        product.save()
        print(f"↻ Updated: {product.name}")
    
    # Create dose packs
    for dose_pack_data in dose_packs_data:
        dose_pack, dp_created = DosePack.objects.get_or_create(
            product=product,
            doses=dose_pack_data['doses'],
            defaults={'units_per_pack': dose_pack_data['units_per_pack']}
        )
        if dp_created:
            print(f"  → Added dose pack: {dose_pack_data['doses']} doses")

print("\n✓ Sample products populated successfully!")
print("\nYou can now:")
print("1. Access Django Admin: http://localhost:8000/admin/")
print("2. View products in the catalog: http://localhost:8080/catalog")
