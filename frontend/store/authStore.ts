import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/lib/api'
import { useStore } from '@/lib/store'

const API_BASE = process.env.NEXT_PUBLIC_API_URL

type AuthStore = {
  user: User | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  setAuth: (user: User, token: string, refreshToken?: string) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      setAuth: async (user, token, refreshToken) => {
        set((state) => ({ 
          user, 
          token, 
          refreshToken: refreshToken || state.refreshToken, 
          isAuthenticated: true 
        }));
        try {
          const { authenticatedFetch } = await import('@/lib/api');
          const [cartRes, wishRes] = await Promise.all([
            authenticatedFetch(`/api/cart`, { credentials: 'include' }),
            authenticatedFetch(`/api/wishlist`, { credentials: 'include' })
          ]);
          
          let serverCart = { items: [] };
          let serverWishlist = { items: [] };
          
          if (cartRes.ok) serverCart = await cartRes.json();
          if (wishRes.ok) serverWishlist = await wishRes.json();
          
          useStore.getState().mergeWithServer(serverCart.items || [], serverWishlist.items || []);
        } catch (e) {
          console.error("Failed to merge with server", e);
        }
      },
      clearAuth: () => {
        set({ user: null, token: null, refreshToken: null, isAuthenticated: false });
        useStore.getState().clearCart();
        useStore.getState().clearWishlist();
      },
    }),
    {
      name: 'bidcraft-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        refreshToken: state.refreshToken,
      }),
    }
  )
)
