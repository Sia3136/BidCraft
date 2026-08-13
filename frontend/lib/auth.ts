import { cookies, headers } from 'next/headers';
import jwt from 'jsonwebtoken';

const getApiUrl = () => { if (typeof window === 'undefined') { return process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || '' } return process.env.NEXT_PUBLIC_API_URL || '' }; 
const API_BASE = getApiUrl();

export const authOptions = {};

export async function getServerSession(options?: any) {
  const cookieStore = await cookies();
  const headerStore = await headers();
  let token = cookieStore.get('session_token')?.value;

  if (!token) {
    const authHeader = headerStore.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
  }

  if (!token) return null;
  try {
    if (process.env.JWT_SECRET) {
      const payload = jwt.verify(token, process.env.JWT_SECRET) as any;
      return { user: { id: payload.userId } };
    }
    throw new Error('No JWT_SECRET');
  } catch (e) {
    // If local verification fails (mismatched secret in deployment or missing secret), fallback to backend
    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store'
        });
        if (res.ok) {
          const json = await res.json();
          if (json.user && json.user.id) {
            return { user: { id: json.user.id } };
          }
        }
      } catch (err) {
        return null;
      }
    }
    return null;
  }
}
