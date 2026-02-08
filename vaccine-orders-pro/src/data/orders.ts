export type OrderStatus = 'requested' | 'confirmed' | 'prepared' | 'dispatched' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  dosePackId: string;
  doses: number;
  quantity: number;
  unitPrice: number;
  requestedDeliveryDate: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  clientId: string;
  clientName: string;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  internalNotes?: string;
}

export const sampleOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    clientId: 'client-1',
    clientName: 'Green Valley Farms',
    items: [
      {
        productId: '1',
        productName: 'Newcastle Disease Vaccine',
        dosePackId: 'dp3',
        doses: 10000,
        quantity: 5,
        unitPrice: 320.00,
        requestedDeliveryDate: '2025-01-15',
      },
      {
        productId: '3',
        productName: 'Gumboro (IBD) Vaccine',
        dosePackId: 'dp2',
        doses: 5000,
        quantity: 3,
        unitPrice: 195.00,
        requestedDeliveryDate: '2025-01-15',
      },
    ],
    status: 'confirmed',
    totalAmount: 2185.00,
    createdAt: '2024-12-01T10:30:00Z',
    updatedAt: '2024-12-02T14:00:00Z',
    notes: 'Please deliver before noon',
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    clientId: 'client-2',
    clientName: 'Sunrise Poultry Co.',
    items: [
      {
        productId: '2',
        productName: 'Infectious Bronchitis Vaccine',
        dosePackId: 'dp2',
        doses: 5000,
        quantity: 10,
        unitPrice: 210.00,
        requestedDeliveryDate: '2025-02-01',
      },
    ],
    status: 'requested',
    totalAmount: 2100.00,
    createdAt: '2024-12-10T09:15:00Z',
    updatedAt: '2024-12-10T09:15:00Z',
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    clientId: 'client-3',
    clientName: 'Heritage Swine Ltd.',
    items: [
      {
        productId: '7',
        productName: 'Classical Swine Fever Vaccine',
        dosePackId: 'dp3',
        doses: 50,
        quantity: 20,
        unitPrice: 320.00,
        requestedDeliveryDate: '2025-01-20',
      },
      {
        productId: '8',
        productName: 'PRRS Vaccine',
        dosePackId: 'dp2',
        doses: 25,
        quantity: 15,
        unitPrice: 265.00,
        requestedDeliveryDate: '2025-01-20',
      },
    ],
    status: 'prepared',
    totalAmount: 10375.00,
    createdAt: '2024-11-28T11:00:00Z',
    updatedAt: '2024-12-05T16:30:00Z',
    internalNotes: 'High priority client - expedite if possible',
  },
  {
    id: '4',
    orderNumber: 'ORD-2024-004',
    clientId: 'client-1',
    clientName: 'Green Valley Farms',
    items: [
      {
        productId: '5',
        productName: 'Gumboro Disease Vaccine',
        dosePackId: 'dp3',
        doses: 2500,
        quantity: 8,
        unitPrice: 72.00,
        requestedDeliveryDate: '2025-03-01',
      },
    ],
    status: 'requested',
    totalAmount: 576.00,
    createdAt: '2024-12-12T14:20:00Z',
    updatedAt: '2024-12-12T14:20:00Z',
    notes: 'Future delivery for spring vaccination campaign',
  },
  {
    id: '5',
    orderNumber: 'ORD-2024-005',
    clientId: 'client-4',
    clientName: 'Oakwood Layers',
    items: [
      {
        productId: '4',
        productName: 'Fowl Pox Vaccine',
        dosePackId: 'dp2',
        doses: 5000,
        quantity: 2,
        unitPrice: 155.00,
        requestedDeliveryDate: '2024-12-20',
      },
      {
        productId: '6',
        productName: 'Newcastle Disease Vaccine',
        dosePackId: 'dp2',
        doses: 1000,
        quantity: 5,
        unitPrice: 28.00,
        requestedDeliveryDate: '2024-12-20',
      },
    ],
    status: 'dispatched',
    totalAmount: 450.00,
    createdAt: '2024-12-08T08:45:00Z',
    updatedAt: '2024-12-15T10:00:00Z',
  },
  {
    id: '6',
    orderNumber: 'ORD-2024-006',
    clientId: 'client-5',
    clientName: 'Valley Pork Producers',
    items: [
      {
        productId: '8',
        productName: 'PRRS Vaccine',
        dosePackId: 'dp3',
        doses: 50,
        quantity: 10,
        unitPrice: 480.00,
        requestedDeliveryDate: '2025-02-15',
      },
    ],
    status: 'confirmed',
    totalAmount: 4800.00,
    createdAt: '2024-12-11T13:00:00Z',
    updatedAt: '2024-12-13T09:30:00Z',
  },
];

export const getOrdersByClient = (clientId: string): Order[] => {
  return sampleOrders.filter(o => o.clientId === clientId);
};

export const getOrdersByStatus = (status: OrderStatus): Order[] => {
  return sampleOrders.filter(o => o.status === status);
};
