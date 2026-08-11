import { cookies, headers } from 'next/headers';
import jwt from 'jsonwebtoken';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not set');
}

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
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;
    return { user: { id: payload.userId } };
  } catch (e) {
    return null;
  }
}
