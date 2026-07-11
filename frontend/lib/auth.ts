import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export const authOptions = {};

export async function getServerSession(options?: any) {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;
  if (!token) return null;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'd7be4a7c8635974f2e2c1e638f49958c41111a12648c9905170b9f36b6f5fda5c51086c2c0d4ba71a20219be37850139d4dfeee43a5698a89d9acf6e186f0627') as any;
    return { user: { id: payload.userId } };
  } catch (e) {
    return null;
  }
}
