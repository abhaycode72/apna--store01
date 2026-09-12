import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null, // null if not logged in
      login: (userData) => set({ user: userData }),
      logout: () => set({ user: null }),
      
      // For dashboard features
      addresses: [],
      addAddress: (address) => set((state) => ({ addresses: [...state.addresses, address] })),
      removeAddress: (index) => set((state) => ({ 
        addresses: state.addresses.filter((_, i) => i !== index) 
      })),
      
      // Dummy order history for the UI
      orders: [
        { id: 'ORD-9021', date: '12 Sep 2026', total: 540, status: 'Delivered', items: 'Classic Milds (Pack of 20), Tata Salt' },
        { id: 'ORD-8742', date: '05 Sep 2026', total: 120, status: 'Delivered', items: 'Amul Taaza Milk' }
      ]
    }),
    {
      name: 'apnastore-auth-storage', // saves to localStorage
    }
  )
);
