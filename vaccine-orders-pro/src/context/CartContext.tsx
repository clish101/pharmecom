import React, { createContext, useContext, useState, useCallback } from 'react';
import { Product, DosePack } from '@/data/products';

export interface CartItem {
  product: Product;
  dosePack: DosePack;
  quantity: number;
  requestedDeliveryDate: string;
  specialInstructions?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, dosePack: DosePack, quantity: number, deliveryDate: string, specialInstructions?: string) => void;
  removeItem: (productId: string, dosePackId: number) => void;
  updateQuantity: (productId: string, dosePackId: number, quantity: number) => void;
  updateDeliveryDate: (productId: string, dosePackId: number, date: string) => void;
  updateSpecialInstructions: (productId: string, dosePackId: number, instructions: string) => void;
  clearCart: () => void;
  setUserIdAndClearCart: (id: string | null) => void;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [userId, setUserId] = useState<string | null>(localStorage.getItem('userId') || null);

  const addItem = useCallback((product: Product, dosePack: DosePack, quantity: number, deliveryDate: string, specialInstructions?: string) => {
    setItems(prev => {
      const existingIndex = prev.findIndex(
        item => item.product.id === product.id && item.dosePack.id === dosePack.id
      );

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
          specialInstructions: specialInstructions || updated[existingIndex].specialInstructions,
        };
        return updated;
      }

      return [...prev, { product, dosePack, quantity, requestedDeliveryDate: deliveryDate, specialInstructions: specialInstructions || '' }];
    });
  }, []);

  const removeItem = useCallback((productId: string, dosePackId: number) => {
    setItems(prev => prev.filter(
      item => !(item.product.id === productId && item.dosePack.id === dosePackId)
    ));
  }, []);

  const updateQuantity = useCallback((productId: string, dosePackId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId, dosePackId);
      return;
    }

    setItems(prev => prev.map(item => 
      item.product.id === productId && item.dosePack.id === dosePackId
        ? { ...item, quantity }
        : item
    ));
  }, [removeItem]);

  const updateDeliveryDate = useCallback((productId: string, dosePackId: number, date: string) => {
    setItems(prev => prev.map(item =>
      item.product.id === productId && item.dosePack.id === dosePackId
        ? { ...item, requestedDeliveryDate: date }
        : item
    ));
  }, []);

  const updateSpecialInstructions = useCallback((productId: string, dosePackId: number, instructions: string) => {
    setItems(prev => prev.map(item =>
      item.product.id === productId && item.dosePack.id === dosePackId
        ? { ...item, specialInstructions: instructions }
        : item
    ));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const setUserIdAndClearCart = useCallback((id: string | null) => {
    setUserId(id);
    if (id === null) {
      // User logged out, clear cart
      setItems([]);
    } else {
      // User logged in, clear cart for the new user
      setItems([]);
    }
    if (id) {
      localStorage.setItem('userId', id);
    } else {
      localStorage.removeItem('userId');
    }
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      updateDeliveryDate,
      updateSpecialInstructions,
      clearCart,
      setUserIdAndClearCart,
      totalItems,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
