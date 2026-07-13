import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { useAuthStore } from '@/store/authStore'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// User interface removed from here as it belongs to authStore

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
  location: string | null;
  cart: CartItem[];
  wishlistIds: number[];
  wishlistCount: number;
  notifications: Notification[];
  
  // Auth Actions removed (handled by authStore)
  setLocation: (location: string) => void;
  
  // Cart Actions
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  
  // Wishlist Actions
  toggleWishlist: (listingId: number) => Promise<void>;
  loadWishlist: () => Promise<void>;
  
  // Cart load
  loadCart: () => Promise<void>;
  
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
      location: null,
      cart: [],
      wishlistIds: [],
      wishlistCount: 0,
      notifications: staticNotifications,
      
      // Auth actions removed to avoid duplication with authStore
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
            await fetch('/api/cart', {
              method: 'POST',
              credentials: 'include',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ listing_id: item.productId })
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
            await fetch(`/api/cart?listing_id=${productId}`, {
              method: 'DELETE',
              credentials: 'include'
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
      
      toggleWishlist: async (listingId: number) => {
        const { wishlistIds } = get()
      
        // Optimistic update
        const isCurrentlyWishlisted = wishlistIds.includes(listingId)
        set({
          wishlistIds: isCurrentlyWishlisted
            ? wishlistIds.filter(id => id !== listingId)
            : [...wishlistIds, listingId]
        })
      
        try {
          const res = await fetch('/api/wishlist', {
            method: 'POST',
            credentials: 'include',        // CRITICAL — sends session cookie
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ listing_id: listingId }),
          })
      
          if (!res.ok) {
            const error = await res.json()
             console.error('[wishlist toggle] API error:', error?.error || error?.message || error)
            // Revert optimistic update on failure
            set({
              wishlistIds: isCurrentlyWishlisted
                ? [...wishlistIds, listingId]
                : wishlistIds.filter(id => id !== listingId)
            })
            return
          }
      
          const data = await res.json()
          console.log('[wishlist toggle] success:', data.action, listingId)
        } catch (err) {
          console.error('[wishlist toggle] Network error:', err)
          // Revert
          set({
            wishlistIds: isCurrentlyWishlisted
              ? [...wishlistIds, listingId]
              : wishlistIds.filter(id => id !== listingId)
          })
        }
      },

      loadWishlist: async () => {
        try {
          const res = await fetch('/api/wishlist', {
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
          })
          if (!res.ok) return
          const data = await res.json()
          set({ 
            wishlistIds: data.items.map((item: { id: number }) => item.id),
            wishlistCount: data.items.length
          })
        } catch (err) {
          console.error('[wishlist load] error:', err)
        }
      },

      loadCart: async () => {
        try {
          const res = await fetch('/api/cart', {
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
          })
          if (!res.ok) return
          const data = await res.json()
          set({ 
            cart: data.items.map((item: any) => ({
              id: item.cart_item_id?.toString() || Math.random().toString(),
              productId: item.id?.toString(),
              title: item.title,
              price: item.price,
              quantity: item.quantity,
              image: item.cloudinary_public_id || ''
            }))
          })
        } catch (err) {
          console.error('[cart load] error:', err)
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
        
        const serverWishIds = new Set(serverWishlist.map((i: any) => (i.listing_id || i.id)));
        const localWishOnly = state.wishlistIds.filter(id => !serverWishIds.has(id));
        
        const mergedWishlistIds = [
          ...serverWishlist.map((i: any) => Number(i.listing_id || i.id)),
          ...localWishOnly
        ];

        return { cart: mergedCart, wishlistIds: mergedWishlistIds, wishlistCount: mergedWishlistIds.length };
      })
    }),
    {
      name: 'bidcraft-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        cart: state.cart,
        wishlistIds: state.wishlistIds,
        wishlistCount: state.wishlistCount
      }),
    }
  )
)
