import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { invalidateListingCache } from '@/lib/dbProducts';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  try {
    const body = await request.json();
    const bidAmount = Number(body.bidAmount);

    if (isNaN(bidAmount)) {
      return NextResponse.json({ error: 'Invalid bid amount' }, { status: 400 });
    }
    
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;

    const response = await fetch(`${API_BASE}/api/auctions/${id}/bids`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': token ? `session_token=${token}` : '',
      },
      body: JSON.stringify({ bid_amount: bidAmount })
    });

    const data = await response.json();

    if (!response.ok) {
        return NextResponse.json({ error: data.error || 'Failed to place bid' }, { status: response.status });
    }

    const numericId = parseInt(id, 10);
    const isNumericId = !isNaN(numericId);
    
    // Invalidate product cache
    try {
      await invalidateListingCache(id);
      if (isNumericId) {
        await invalidateListingCache(String(numericId));
      }
    } catch (e) {
      console.warn('Redis cache delete error:', e);
    }

    return NextResponse.json({ 
        success: data.success, 
        currentBid: data.bidAmount,
        ...data 
    });

  } catch (error: any) {
    console.error('Error placing bid:', error);
    return NextResponse.json({ error: 'Failed to place bid' }, { status: 500 });
  }
}
