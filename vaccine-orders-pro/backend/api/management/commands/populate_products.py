from django.core.management.base import BaseCommand
from api.models import Product, DosePack

class Command(BaseCommand):
    help = 'Populates the database with realistic vaccine products'

    def handle(self, *args, **options):
        products_data = [
            {
                'name': 'Newcastle Disease Vaccine (ND Live)',
                'brand': 'MERIAL',
                'species': 'poultry',
                'product_type': 'live',
                'manufacturer': 'MERIAL Limited',
                'description': 'Live attenuated Newcastle disease vaccine for poultry. Used for prevention of Newcastle disease in broilers and layers. Provides rapid immunity onset.',
                'active_ingredients': 'Newcastle disease virus (LaSota strain), live attenuated, 10^6.5 EID50/dose minimum',
                'cold_chain_required': True,
                'storage_temp_range': '2-8°C, protected from light',
                'image_url': '/placeholder.svg',
                'image_alt': 'Newcastle Disease Vaccine',
                'tags': '["newcastle", "nd", "poultry", "live", "respiratory"]',
                'minimum_order_qty': 100,
                'lead_time_days': 1,
                'available_stock': 5000,
                'administration_notes': 'Spray, eye-drop, or drinking water application. Use within 30 minutes of reconstitution. Do not vaccinate with other live vaccines simultaneously.',
                'dose_packs': [
                    {'doses': 1000, 'units_per_pack': 1},
                    {'doses': 5000, 'units_per_pack': 5},
                    {'doses': 10000, 'units_per_pack': 10},
                ]
            },
            {
                'name': 'Infectious Bursal Disease (IBD) Vaccine',
                'brand': 'HIPRA',
                'species': 'poultry',
                'product_type': 'killed',
                'manufacturer': 'HIPRA S.A.',
                'description': 'Inactivated infectious bursal disease vaccine. Provides protection against IBDV in broilers and breeders. Oil-emulsion adjuvant for enhanced immunity.',
                'active_ingredients': 'Inactivated IBDV, oil-emulsion adjuvant, 2 HA units/0.5mL dose',
                'cold_chain_required': True,
                'storage_temp_range': '2-8°C',
                'image_url': '/placeholder.svg',
                'image_alt': 'IBD Vaccine',
                'tags': '["ibd", "gumboro", "bursa", "poultry", "killed"]',
                'minimum_order_qty': 50,
                'lead_time_days': 2,
                'available_stock': 3000,
                'administration_notes': 'Intramuscular or subcutaneous injection. For breeder birds use 0.5mL, for broilers use based on body weight. Allow 2 weeks for full immunity.',
                'dose_packs': [
                    {'doses': 500, 'units_per_pack': 1},
                    {'doses': 2500, 'units_per_pack': 5},
                    {'doses': 5000, 'units_per_pack': 10},
                ]
            },
            {
                'name': 'Marek\'s Disease Vaccine (HVT+SB-1)',
                'brand': 'CEVA',
                'species': 'poultry',
                'product_type': 'live',
                'manufacturer': 'CEVA Santé Animale',
                'description': 'Trivalent live vaccine combining HVT and serotypes 1 & 2. Provides broad protection against Marek\'s disease in chickens from day of hatch.',
                'active_ingredients': 'HVT (Fc126 strain) + MD serotype 1 + MD serotype 2, live, 2000 PFU/dose minimum',
                'cold_chain_required': True,
                'storage_temp_range': '-18°C to -10°C or 2-8°C for up to 1 month',
                'image_url': '/placeholder.svg',
                'image_alt': 'Marek\'s Disease Vaccine',
                'tags': '["mareks", "hvt", "md", "poultry", "live"]',
                'minimum_order_qty': 100,
                'lead_time_days': 1,
                'available_stock': 4500,
                'administration_notes': 'Subcutaneous injection in day-old chicks at 0.2mL/bird. Protect from light. Use immediately after reconstitution. Compatible with other live vaccines.',
                'dose_packs': [
                    {'doses': 1000, 'units_per_pack': 1},
                    {'doses': 10000, 'units_per_pack': 10},
                    {'doses': 50000, 'units_per_pack': 50},
                ]
            },
            {
                'name': 'Avian Influenza Vaccine (H5N1)',
                'brand': 'BOEHRINGER INGELHEIM',
                'species': 'poultry',
                'product_type': 'killed',
                'manufacturer': 'Boehringer Ingelheim',
                'description': 'Inactivated H5N1 vaccine for poultry. Provides robust protection against highly pathogenic avian influenza. Regulatory approved for commercial flocks.',
                'active_ingredients': 'Inactivated HPAI H5N1 virus, aluminum hydroxide adjuvant, ≥6 log2 hemagglutinin units/dose',
                'cold_chain_required': True,
                'storage_temp_range': '2-8°C, avoid freezing',
                'image_url': '/placeholder.svg',
                'image_alt': 'Avian Influenza H5N1 Vaccine',
                'tags': '["avian-influenza", "h5n1", "hpai", "poultry", "killed"]',
                'minimum_order_qty': 200,
                'lead_time_days': 3,
                'available_stock': 2000,
                'administration_notes': 'Intramuscular injection at 0.5mL per bird. Primary vaccination requires booster after 2-3 weeks. Vaccination records required for trade.',
                'dose_packs': [
                    {'doses': 1000, 'units_per_pack': 1},
                    {'doses': 5000, 'units_per_pack': 5},
                    {'doses': 10000, 'units_per_pack': 10},
                ]
            },
            {
                'name': 'Classical Swine Fever Vaccine (CSF)',
                'brand': 'MERIAL',
                'species': 'swine',
                'product_type': 'killed',
                'manufacturer': 'MERIAL Limited',
                'description': 'Inactivated classical swine fever vaccine for prevention of CSF. Oil-adjuvanted formula for long-lasting immunity in breeding and growing pigs.',
                'active_ingredients': 'Inactivated CSF virus strain C-strain, mineral oil adjuvant, ≥4 TCID50 equivalents/dose',
                'cold_chain_required': True,
                'storage_temp_range': '2-8°C, protect from freezing',
                'image_url': '/placeholder.svg',
                'image_alt': 'CSF Vaccine',
                'tags': '["swine-fever", "csf", "hog-cholera", "swine", "killed"]',
                'minimum_order_qty': 50,
                'lead_time_days': 2,
                'available_stock': 1500,
                'administration_notes': 'Intramuscular injection at 2mL per pig. Vaccinate breeding stock and growing pigs from 3 weeks of age. Booster at 10-12 weeks.',
                'dose_packs': [
                    {'doses': 250, 'units_per_pack': 1},
                    {'doses': 1250, 'units_per_pack': 5},
                    {'doses': 2500, 'units_per_pack': 10},
                ]
            },
            {
                'name': 'Porcine Reproductive & Respiratory Syndrome (PRRS) Vaccine',
                'brand': 'HIPRA',
                'species': 'swine',
                'product_type': 'live',
                'manufacturer': 'HIPRA S.A.',
                'description': 'Modified-live PRRS vaccine for protection against European PRRS virus strains. Reduces viral shedding and respiratory disease in pigs.',
                'active_ingredients': 'PRRS virus modified-live strain, ≥4 TCID50/dose minimum',
                'cold_chain_required': True,
                'storage_temp_range': '-18°C to -10°C for long-term or 2-8°C for max 8 weeks',
                'image_url': '/placeholder.svg',
                'image_alt': 'PRRS Vaccine',
                'tags': '["prrs", "blue-ear-disease", "swine-respiratory", "swine", "live"]',
                'minimum_order_qty': 100,
                'lead_time_days': 2,
                'available_stock': 2500,
                'administration_notes': 'Intramuscular or intranasal administration at 2mL/pig. Vaccinate breeding sows at 4-6 weeks before farrowing and growing pigs at 3 weeks of age.',
                'dose_packs': [
                    {'doses': 500, 'units_per_pack': 1},
                    {'doses': 2500, 'units_per_pack': 5},
                    {'doses': 5000, 'units_per_pack': 10},
                ]
            },
        ]

        for product_data in products_data:
            dose_packs_data = product_data.pop('dose_packs')
            
            product, created = Product.objects.get_or_create(
                name=product_data['name'],
                defaults=product_data
            )
            
            if created:
                self.stdout.write(self.style.SUCCESS(f'✓ Created: {product.name}'))
            else:
                for key, value in product_data.items():
                    setattr(product, key, value)
                product.save()
                self.stdout.write(self.style.WARNING(f'↻ Updated: {product.name}'))
            
            for dose_pack_data in dose_packs_data:
                dose_pack, dp_created = DosePack.objects.get_or_create(
                    product=product,
                    doses=dose_pack_data['doses'],
                    defaults={'units_per_pack': dose_pack_data['units_per_pack']}
                )
                if dp_created:
                    self.stdout.write(f'  → Added dose pack: {dose_pack_data["doses"]} doses')

        self.stdout.write(self.style.SUCCESS('\n✓ Products populated successfully!'))
        self.stdout.write('\nAccess your application:')
        self.stdout.write('1. Frontend: http://localhost:8081')
        self.stdout.write('2. Admin: http://localhost:8000/admin/ (admin/admin123)')
        self.stdout.write('3. API: http://localhost:8000/api/')

