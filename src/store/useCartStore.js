import { create } from 'zustand';

export const useCartStore = create((set) => ({
  items: [],
  addToCart: (product) => set((state) => {
    const existingItem = state.items.find((item) => item.id === product.id);
    if (existingItem) {
      return {
        items: state.items.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        ),
      };
    }
    return { items: [...state.items, { ...product, quantity: 1 }] };
  }),
  removeFromCart: (productId) => set((state) => ({
    items: state.items.filter((item) => item.id !== productId),
  })),
  decreaseQuantity: (productId) => set((state) => {
    const existingItem = state.items.find((item) => item.id === productId);
    if (existingItem?.quantity === 1) {
      return { items: state.items.filter((item) => item.id !== productId) };
    }
    return {
      items: state.items.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
      ),
    };
  }),
  totalItems: () => set((state) => state.items.reduce((acc, item) => acc + item.quantity, 0)),
}));