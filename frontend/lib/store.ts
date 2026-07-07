import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { useAuthStore } from '@/store/authStore'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

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

import { notifications as staticNotifications, Notification as NotificationType } from './notifications';

type Notification = NotificationType;

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
  markAllNotificationsRead: () => void;
  markNotificationRead: (id: string) => void;
  
  // Merge Anonymous data to user
  mergeAnonymousData: () => void;
  mergeWithServer: (serverCart: any[], serverWishlist: any[]) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      location: null,
      cart: [],
      wishlist: [],
      notifications: staticNotifications,
      
      login: (user, token) => {
        set({ user, token });
        get().mergeAnonymousData();
      },
      logout: () => set({ user: null, token: null, location: null, cart: [], wishlist: [], notifications: staticNotifications }),
      setLocation: (location) => set({ location }),
      
      addToCart: async (item) => {
        const { token, isAuthenticated } = useAuthStore.getState();
        set((state) => {
          const existing = state.cart.find(i => i.productId === item.productId);
          if (existing) {
            return {
              cart: state.cart.map(i => i.productId === item.productId ? { ...i, quantity: i.quantity + item.quantity } : i)
            };
          }
          return { cart: [...state.cart, item] };
        });

        if (isAuthenticated && token) {
          try {
            await fetch(`${API_BASE}/api/cart/${item.productId}`, {
              method: 'POST',
              headers: { Authorization: `Bearer ${token}` }
            });
          } catch (err) {
            console.error('[cart] Failed to persist:', err);
          }
        }
      },
      removeFromCart: async (productId) => {
        const { token, isAuthenticated } = useAuthStore.getState();
        set((state) => ({ cart: state.cart.filter(i => i.productId !== productId) }));

        if (isAuthenticated && token) {
          try {
            await fetch(`${API_BASE}/api/cart/${productId}`, {
              method: 'DELETE',
              headers: { Authorization: `Bearer ${token}` }
            });
          } catch (err) {
            console.error('[cart] Failed to persist:', err);
          }
        }
      },
      updateCartQuantity: (productId, quantity) => set((state) => ({
        cart: state.cart.map(i => i.productId === productId ? { ...i, quantity } : i)
      })),
      clearCart: () => set({ cart: [] }),
      
      toggleWishlist: async (productId) => {
        const { token, isAuthenticated } = useAuthStore.getState();
        const isAdding = !get().wishlist.find(i => i.productId === productId);
        
        set((state) => {
          if (!isAdding) {
            return { wishlist: state.wishlist.filter(i => i.productId !== productId) };
          }
          return { wishlist: [...state.wishlist, { productId }] };
        });

        if (isAuthenticated && token) {
          try {
            const res = await fetch(`${API_BASE}/api/wishlist/${productId}`, {
              method: isAdding ? 'POST' : 'DELETE',
              headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('API Error');
          } catch (err) {
            console.error('[wishlist] Failed to persist:', err);
            // Revert on error
            set((state) => {
              if (isAdding) {
                return { wishlist: state.wishlist.filter(i => i.productId !== productId) };
              }
              return { wishlist: [...state.wishlist, { productId }] };
            });
          }
        }
      },
      
      addNotification: (notification) => set((state) => ({
        notifications: [{ ...notification, id: Math.random().toString(36).substr(2, 9), read: false }, ...state.notifications]
      })),
      markNotificationRead: (id) => set((state) => ({
        notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
      })),
      markAllNotificationsRead: () => set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, read: true }))
      })),
      
      mergeAnonymousData: () => {
        // Left intact
      },
      mergeWithServer: (serverCart, serverWishlist) => set(state => {
        const serverCartIds = new Set(serverCart.map((i: any) => (i.listing_id || i.listingId)?.toString()));
        const localCartOnly = state.cart.filter(i => !serverCartIds.has(i.productId));
        
        const mergedCart = [
          ...serverCart.map((i: any) => ({
            id: i.id?.toString() || Math.random().toString(),
            productId: (i.listing_id || i.listingId)?.toString(),
            title: i.title,
            price: Number(i.price),
            quantity: 1,
            image: i.photos?.[0] || i.image || ''
          })),
          ...localCartOnly
        ];
        
        const serverWishIds = new Set(serverWishlist.map((i: any) => (i.listing_id || i.id)?.toString()));
        const localWishOnly = state.wishlist.filter(i => !serverWishIds.has(i.productId));
        
        const mergedWishlist = [
          ...serverWishlist.map((i: any) => ({ productId: (i.listing_id || i.id)?.toString() })),
          ...localWishOnly
        ];

        return { cart: mergedCart, wishlist: mergedWishlist };
      })
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
