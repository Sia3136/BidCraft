import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/lib/api'
import { useStore } from '@/lib/store'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

type AuthStore = {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  setAuth: (user: User, token: string) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: async (user, token) => {
        set({ user, token, isAuthenticated: true });
        try {
          const [cartRes, wishRes] = await Promise.all([
            fetch(`${API_BASE}/api/cart`, { headers: { Authorization: `Bearer ${token}` } }),
            fetch(`${API_BASE}/api/wishlist`, { headers: { Authorization: `Bearer ${token}` } })
          ]);
          
          let serverCart = { cart: [] };
          let serverWishlist = { wishlist: [] };
          
          if (cartRes.ok) serverCart = await cartRes.json();
          if (wishRes.ok) serverWishlist = await wishRes.json();
          
          useStore.getState().mergeWithServer(serverCart.cart || [], serverWishlist.wishlist || []);
        } catch (e) {
          console.error("Failed to merge with server", e);
        }
      },
      clearAuth: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'bidcraft-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
