import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

// Simple mock for NextAuth's getServerSession logic using the cookie we set
const authOptions = {};
async function getServerSession(options: any) {
  const cookieStore = cookies();
  const token = cookieStore.get('session_token')?.value;
  if (!token) return null;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret_change_me') as any;
    return { user: { id: payload.userId } };
  } catch (e) {
    return null;
  }
}

export async function POST(request: Request) {
  try {
    // Support both Bearer token AND session cookie auth
    const session = await getServerSession(authOptions);
    let userId = session?.user?.id;

    if (!userId) {
      // Check Bearer token just in case
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        try {
          const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret_change_me') as any;
          userId = payload.userId;
        } catch (e) {}
      }
    }

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userIdInt = parseInt(userId as string, 10);
    const body = await request.json();
    const listingId = body.listing_id;

    if (!listingId) {
      return NextResponse.json({ error: 'listing_id_required' }, { status: 400 });
    }

    // Check if already wishlisted
    const existing: any = await prisma.$queryRaw`SELECT id FROM wishlists WHERE user_id = ${userIdInt} AND listing_id = ${parseInt(listingId, 10)}`;

    if (existing && existing.length > 0) {
      // If exists: DELETE (toggle off)
      await prisma.$queryRaw`DELETE FROM wishlists WHERE user_id = ${userIdInt} AND listing_id = ${parseInt(listingId, 10)}`;
    } else {
      // If not: INSERT (toggle on)
      await prisma.$queryRaw`INSERT INTO wishlists (user_id, listing_id, created_at) VALUES (${userIdInt}, ${parseInt(listingId, 10)}, NOW())`;
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Wishlist error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    let userId = session?.user?.id;
    if (!userId) {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        try {
          const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret_change_me') as any;
          userId = payload.userId;
        } catch (e) {}
      }
    }
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userIdInt = parseInt(userId as string, 10);

    const wishlistItems = await prisma.$queryRaw`
      SELECT l.*, w.id as wishlist_id, w.created_at as saved_at
      FROM wishlists w
      JOIN listings l ON l.id = w.listing_id
      WHERE w.user_id = ${userIdInt}
        AND l.status = 'active'
        AND l.is_published = true
      ORDER BY w.created_at DESC
    `;
    return NextResponse.json({ wishlist: wishlistItems });
  } catch (err: any) {
    console.error('Wishlist GET error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}

