from django.test import TestCase
from rest_framework.test import APIClient
from django.urls import reverse
from django.contrib.auth.models import User
from .models import Product, DosePack
from decimal import Decimal


class OrderAPITests(TestCase):
	def setUp(self):
		self.client = APIClient()
		self.user = User.objects.create_user(username='tester', password='pass')
		self.admin = User.objects.create_user(username='admin', password='pass', is_staff=True)

		self.product = Product.objects.create(
			name='Vaccine A', brand='BrandX', species='poultry', product_type='live',
			manufacturer='Mfg', description='desc', active_ingredients='ing',
			cold_chain_required=True, storage_temp_range='2-8C', image_alt='alt',
			minimum_order_qty=1, lead_time_days=3, available_stock=100, administration_notes='notes'
		)

		self.dose_pack = DosePack.objects.create(product=self.product, doses=10, units_per_pack=1)

	def test_create_order_success(self):
		self.client.force_authenticate(user=self.user)
		url = reverse('order-list')
		payload = {
			'notes': 'Please deliver carefully',
			'items': [
				{'product': self.product.id, 'dose_pack': self.dose_pack.id, 'quantity': 2, 'unit_price': '12.50', 'requested_delivery_date': '2026-01-10'}
			]
		}
		resp = self.client.post(url, payload, format='json')
		self.assertEqual(resp.status_code, 201)
		self.assertIn('total_amount', resp.data)
		self.assertEqual(Decimal(resp.data['total_amount']), Decimal('25.00'))

	def test_create_order_invalid_product(self):
		self.client.force_authenticate(user=self.user)
		url = reverse('order-list')
		payload = {
			'items': [
				{'product': 9999, 'dose_pack': self.dose_pack.id, 'quantity': 1, 'unit_price': '5.00', 'requested_delivery_date': '2026-01-10'}
			]
		}
		resp = self.client.post(url, payload, format='json')
		self.assertEqual(resp.status_code, 400)

	def test_create_order_invalid_quantity(self):
		self.client.force_authenticate(user=self.user)
		url = reverse('order-list')
		payload = {
			'items': [
				{'product': self.product.id, 'dose_pack': self.dose_pack.id, 'quantity': 0, 'unit_price': '5.00', 'requested_delivery_date': '2026-01-10'}
			]
		}
		resp = self.client.post(url, payload, format='json')
		self.assertEqual(resp.status_code, 400)

	def test_admin_set_status_and_add_internal_note(self):
		# create an order as normal user
		self.client.force_authenticate(user=self.user)
		url = reverse('order-list')
		payload = {
			'notes': 'Please deliver carefully',
			'items': [
				{'product': self.product.id, 'dose_pack': self.dose_pack.id, 'quantity': 1, 'unit_price': '10.00', 'requested_delivery_date': '2026-01-10'}
			]
		}
		resp = self.client.post(url, payload, format='json')
		self.assertEqual(resp.status_code, 201)
		order_id = resp.data['id']

		# admin updates status
		self.client.force_authenticate(user=self.admin)
		status_url = reverse('order-set-status', kwargs={'pk': order_id})
		r2 = self.client.post(status_url, {'status': 'confirmed'}, format='json')
		self.assertEqual(r2.status_code, 200)

		# admin adds internal note
		note_url = reverse('order-add-internal-note', kwargs={'pk': order_id})
		r3 = self.client.post(note_url, {'note': 'Handled by admin'}, format='json')
		self.assertEqual(r3.status_code, 200)
