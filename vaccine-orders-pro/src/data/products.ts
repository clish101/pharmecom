export interface DosePack {
  id: number;
  doses: number;
  unitsPerPack: number;
}

export interface Batch {
  batchNumber: string;
  expiryDate: string;
  quantity: number;
}

export interface Product {
  id: string;
  batchNumber: string;
  name: string;
  brand: string;
  species: 'poultry' | 'swine';
  type: 'live' | 'killed' | 'attenuated';
  manufacturer: string;
  description: string;
  activeIngredients: string;
  dosePacks: DosePack[];
  coldChainRequired: boolean;
  storageTempRange: string;
  image?: string;
  imageUrl: string;
  imageAlt: string;
  tags: string[];
  minimumOrderQty: number;
  leadTimeDays: number;
  availableStock: number;
  batches: Batch[];
  administrationNotes: string;
}

export const products: Product[] = [
  // Poultry Vaccines
  {
    id: '1',
    batchNumber: 'NDV-2024-A1',
    name: 'Newcastle Disease Vaccine (ND Live)',
    brand: 'MERIAL',
    species: 'poultry',
    type: 'live',
    manufacturer: 'MERIAL',
    description: 'Live attenuated vaccine for active immunization of healthy chickens against Newcastle Disease. Provides robust protection with excellent field immunity.',
    activeIngredients: 'Newcastle Disease Virus, La Sota strain',
    dosePacks: [
      { id: 1, doses: 1000, unitsPerPack: 1 },
      { id: 2, doses: 5000, unitsPerPack: 1 },
    ],
    coldChainRequired: true,
    storageTempRange: '2-8°C',
    imageUrl: '/placeholder.svg',
    imageAlt: 'Newcastle Disease Vaccine vial',
    tags: ['respiratory', 'essential', 'layer', 'broiler'],
    minimumOrderQty: 1,
    leadTimeDays: 3,
    availableStock: 2500,
    batches: [
      { batchNumber: 'NDV-2024-A1', expiryDate: '2025-06-15', quantity: 1500 },
      { batchNumber: 'NDV-2024-A2', expiryDate: '2025-08-20', quantity: 1000 },
    ],
    administrationNotes: 'Administer via drinking water, eye drop, or spray. Ensure cold chain integrity during transport and storage.',
  },
  {
    id: '2',
    batchNumber: 'IBD-2024-B1',
    name: 'Infectious Bursal Disease (IBD)',
    brand: 'HIPRA',
    species: 'poultry',
    type: 'live',
    manufacturer: 'HIPRA',
    description: 'Live vaccine for protection against Infectious Bursal Disease (Gumboro). Breaks through maternal antibodies effectively.',
    activeIngredients: 'Infectious Bursal Disease Virus, intermediate plus strain',
    dosePacks: [
      { id: 3, doses: 500, unitsPerPack: 1 },
      { id: 4, doses: 2500, unitsPerPack: 1 },
    ],
    coldChainRequired: true,
    storageTempRange: '2-8°C',
    imageUrl: '/placeholder.svg',
    imageAlt: 'IBD Vaccine vial',
    tags: ['immunosuppressive', 'broiler', 'layer'],
    minimumOrderQty: 1,
    leadTimeDays: 5,
    availableStock: 3200,
    batches: [
      { batchNumber: 'IBD-2024-B1', expiryDate: '2025-09-01', quantity: 2000 },
      { batchNumber: 'IBD-2024-B2', expiryDate: '2025-10-15', quantity: 1200 },
    ],
    administrationNotes: 'Drinking water administration recommended. Ensure chlorine-free water.',
  },
  {
    id: '3',
    batchNumber: 'MD-2024-C1',
    name: 'Marek\'s Disease Vaccine (HVT)',
    brand: 'CEVA',
    species: 'poultry',
    type: 'live',
    manufacturer: 'CEVA',
    description: 'Live herpesvirus of turkeys (HVT) vaccine for protection against Marek\'s disease in chickens.',
    activeIngredients: 'Herpesvirus of turkeys, attenuated',
    dosePacks: [
      { id: 5, doses: 1000, unitsPerPack: 1 },
      { id: 6, doses: 10000, unitsPerPack: 1 },
    ],
    coldChainRequired: true,
    storageTempRange: '2-8°C',
    imageUrl: '/placeholder.svg',
    imageAlt: 'Marek\'s Disease Vaccine vial',
    tags: ['neurological', 'essential', 'broiler'],
    minimumOrderQty: 1,
    leadTimeDays: 4,
    availableStock: 2100,
    batches: [
      { batchNumber: 'MD-2024-C1', expiryDate: '2025-08-01', quantity: 1300 },
      { batchNumber: 'MD-2024-C2', expiryDate: '2025-11-10', quantity: 800 },
    ],
    administrationNotes: 'In-ovo or post-hatch application. Subcutaneous injection in the neck region.',
  },
  {
    id: '4',
    batchNumber: 'AI-2024-D1',
    name: 'Avian Influenza Vaccine (H5N1)',
    brand: 'BOEHRINGER INGELHEIM',
    species: 'poultry',
    type: 'killed',
    manufacturer: 'BOEHRINGER INGELHEIM',
    description: 'Inactivated vaccine for protection against Avian Influenza H5N1 in poultry.',
    activeIngredients: 'Inactivated Avian Influenza virus H5N1',
    dosePacks: [
      { id: 7, doses: 1000, unitsPerPack: 1 },
      { id: 8, doses: 5000, unitsPerPack: 1 },
    ],
    coldChainRequired: true,
    storageTempRange: '2-8°C',
    imageUrl: '/placeholder.svg',
    imageAlt: 'Avian Influenza Vaccine vial',
    tags: ['influenza', 'respiratory', 'notifiable'],
    minimumOrderQty: 1,
    leadTimeDays: 7,
    availableStock: 1900,
    batches: [
      { batchNumber: 'AI-2024-D1', expiryDate: '2025-07-15', quantity: 1200 },
      { batchNumber: 'AI-2024-D2', expiryDate: '2025-10-20', quantity: 700 },
    ],
    administrationNotes: 'Intramuscular or subcutaneous injection. Two-dose program recommended.',
  },

  // Swine Vaccines
  {
    id: '5',
    batchNumber: 'SF-2024-S1',
    name: 'Swine Fever Vaccine (Classical)',
    brand: 'MERIAL',
    species: 'swine',
    type: 'live',
    manufacturer: 'MERIAL',
    description: 'Live attenuated vaccine for immunization of swine against Classical Swine Fever.',
    activeIngredients: 'Classical Swine Fever Virus, attenuated C strain',
    dosePacks: [
      { id: 9, doses: 250, unitsPerPack: 1 },
      { id: 10, doses: 2500, unitsPerPack: 1 },
    ],
    coldChainRequired: true,
    storageTempRange: '2-8°C',
    imageUrl: '/placeholder.svg',
    imageAlt: 'Swine Fever Vaccine vial',
    tags: ['notifiable', 'piglet', 'systemic'],
    minimumOrderQty: 1,
    leadTimeDays: 5,
    availableStock: 580,
    batches: [
      { batchNumber: 'SF-2024-S1', expiryDate: '2025-06-01', quantity: 350 },
      { batchNumber: 'SF-2024-S2', expiryDate: '2025-09-15', quantity: 230 },
    ],
    administrationNotes: 'Intramuscular injection. Single dose from 4 weeks of age. Do not use in breeding sows.',
  },
  {
    id: '6',
    batchNumber: 'PRRS-2024-S1',
    name: 'Porcine Reproductive & Respiratory Syndrome (PRRS) Vaccine',
    brand: 'HIPRA',
    species: 'swine',
    type: 'live',
    manufacturer: 'HIPRA',
    description: 'Live attenuated vaccine for prevention of Porcine Reproductive and Respiratory Syndrome (PRRS) in swine.',
    activeIngredients: 'PRRS Virus, attenuated strain',
    dosePacks: [
      { id: 11, doses: 500, unitsPerPack: 1 },
      { id: 12, doses: 5000, unitsPerPack: 1 },
    ],
    coldChainRequired: true,
    storageTempRange: '2-8°C',
    imageUrl: '/placeholder.svg',
    imageAlt: 'PRRS Vaccine vial',
    tags: ['respiratory', 'reproductive', 'nursery', 'grower'],
    minimumOrderQty: 1,
    leadTimeDays: 5,
    availableStock: 740,
    batches: [
      { batchNumber: 'PRRS-2024-S1', expiryDate: '2025-08-10', quantity: 450 },
      { batchNumber: 'PRRS-2024-S2', expiryDate: '2025-11-25', quantity: 290 },
    ],
    administrationNotes: 'Intramuscular injection. Administer from 2-3 weeks of age. Can be combined with other live vaccines.',
  },
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(p => p.id === id);
};

export const getProductsBySpecies = (species: 'poultry' | 'swine'): Product[] => {
  return products.filter(p => p.species === species);
};

export const getProductsByBrand = (brand: string): Product[] => {
  return products.filter(p => p.brand === brand);
};
