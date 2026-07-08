import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

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

async function getUserId(request: Request) {
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
  return userId ? parseInt(userId as string, 10) : null;
}

export async function POST(request: Request) {
  try {
    const userId = await getUserId(request);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const listingId = parseInt(body.listing_id, 10);

    if (!listingId) return NextResponse.json({ error: 'listing_id_required' }, { status: 400 });

    // Add to cart (upsert — don't duplicate)
    await prisma.$queryRaw`
      INSERT INTO cart_items (user_id, listing_id, quantity, created_at)
      VALUES (${userId}, ${listingId}, 1, NOW())
      ON CONFLICT (user_id, listing_id) DO UPDATE SET quantity = cart_items.quantity + 1
    `;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Cart POST error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const userId = await getUserId(request);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Cart page query
    const cartItems = await prisma.$queryRaw`
      SELECT c.id as cart_item_id, c.quantity, l.*
      FROM cart_items c
      JOIN listings l ON l.id = c.listing_id
      WHERE c.user_id = ${userId} AND l.status = 'active' AND l.is_published = true
      ORDER BY c.created_at DESC
    `;

    return NextResponse.json({ cart: cartItems });
  } catch (err: any) {
    console.error('Cart GET error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const userId = await getUserId(request);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const listingId = parseInt(searchParams.get('listing_id') || '0', 10);

    if (listingId) {
      await prisma.$queryRaw`DELETE FROM cart_items WHERE user_id = ${userId} AND listing_id = ${listingId}`;
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Cart DELETE error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
