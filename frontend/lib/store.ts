import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
}

interface CartItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

interface WishlistItem {
  productId: string;
}

interface Notification {
  id: string;
  message: string;
  read: boolean;
  type: 'info' | 'urgent' | 'success';
}

interface StoreState {
  user: User | null;
  token: string | null;
  location: string | null;
  cart: CartItem[];
  wishlist: WishlistItem[];
  notifications: Notification[];
  
  // Auth Actions
  login: (user: User, token: string) => void;
  logout: () => void;
  setLocation: (location: string) => void;
  
  // Cart Actions
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  
  // Wishlist Actions
  toggleWishlist: (productId: string) => void;
  
  // Notification Actions
  addNotification: (notification: Omit<Notification, 'id' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  
  // Merge Anonymous data to user
  mergeAnonymousData: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      location: null,
      cart: [],
      wishlist: [],
      notifications: [],
      
      login: (user, token) => {
        set({ user, token });
        get().mergeAnonymousData();
      },
      logout: () => set({ user: null, token: null, location: null, cart: [], wishlist: [], notifications: [] }),
      setLocation: (location) => set({ location }),
      
      addToCart: (item) => set((state) => {
        const existing = state.cart.find(i => i.productId === item.productId);
        if (existing) {
          return {
            cart: state.cart.map(i => i.productId === item.productId ? { ...i, quantity: i.quantity + item.quantity } : i)
          };
        }
        return { cart: [...state.cart, item] };
      }),
      removeFromCart: (productId) => set((state) => ({
        cart: state.cart.filter(i => i.productId !== productId)
      })),
      updateCartQuantity: (productId, quantity) => set((state) => ({
        cart: state.cart.map(i => i.productId === productId ? { ...i, quantity } : i)
      })),
      clearCart: () => set({ cart: [] }),
      
      toggleWishlist: (productId) => set((state) => {
        const exists = state.wishlist.find(i => i.productId === productId);
        if (exists) {
          return { wishlist: state.wishlist.filter(i => i.productId !== productId) };
        }
        return { wishlist: [...state.wishlist, { productId }] };
      }),
      
      addNotification: (notification) => set((state) => ({
        notifications: [{ ...notification, id: Math.random().toString(36).substr(2, 9), read: false }, ...state.notifications]
      })),
      markNotificationRead: (id) => set((state) => ({
        notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
      })),
      
      mergeAnonymousData: () => {
        // Since we are persisting the whole store, cart and wishlist are already in state.
        // On login, we would typically sync this to the backend.
        // For now, we just keep the state as is.
      }
    }),
    {
      name: 'bidcraft-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        cart: state.cart,
        wishlist: state.wishlist,
        token: state.token, // Optional: persist token
        user: state.user // Optional: persist user
      }),
    }
  )
)
