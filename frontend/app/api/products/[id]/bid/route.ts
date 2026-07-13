import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession, authOptions } from '@/lib/auth';

import { invalidateListingCache } from '@/lib/dbProducts';
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = parseInt(String(session.user.id), 10);

  const { id } = await params;
  
  try {
    const numericId = parseInt(id, 10);
    const isNumericId = !isNaN(numericId);

    const body = await request.json();
    const bidAmount = Number(body.bidAmount);

    if (isNaN(bidAmount)) {
      return NextResponse.json({ error: 'Invalid bid amount' }, { status: 400 });
    }

    // Run within a transaction to ensure bid consistency
    const result = await prisma.$transaction(async (tx) => {
      let listing;
      if (isNumericId) {
        listing = await tx.listings.findUnique({
          where: { id: numericId },
          include: { auctions: true }
        });
      }

      if (!listing) {
        listing = await tx.listings.findUnique({
          where: { slug: id },
          include: { auctions: true }
        });
      }

      if (!listing) {
        throw new Error('Listing not found');
      }

      if (listing.listing_type !== 'AUCTION' || !listing.auctions) {
        throw new Error('Listing is not an auction');
      }

      const currentHighestBid = listing.auctions.current_bid ? Number(listing.auctions.current_bid) : Number(listing.price);

      if (bidAmount <= currentHighestBid) {
        throw new Error(`Your bid must be higher than the current bid of ₹${currentHighestBid}`);
      }

      // Update the auction record atomically to prevent race conditions
      const updatedRows = await tx.$executeRaw`
        UPDATE auctions 
        SET current_bid = ${bidAmount}, total_bids = COALESCE(total_bids, 0) + 1 
        WHERE id = ${listing.auctions.id} 
        AND (current_bid IS NULL OR current_bid < ${bidAmount})
      `;

      if (updatedRows === 0) {
        throw new Error('Someone else just placed a higher bid. Please try again.');
      }

      const updatedAuction = await tx.auctions.findUnique({
        where: { id: listing.auctions.id }
      });

      if (!updatedAuction) {
        throw new Error('Failed to retrieve updated auction');
      }

      await tx.bids.create({
        data: {
          auction_id: listing.auctions.id,
          bidder_id: userId,
          bid_amount: bidAmount
        }
      });

      return updatedAuction;
    });

    // Invalidate product cache
    try {
      await invalidateListingCache(id);
      if (isNumericId) {
        await invalidateListingCache(String(numericId));
      }
    } catch (e) {
      console.warn('Redis cache delete error:', e);
    }

    return NextResponse.json({ success: true, currentBid: Number(result.current_bid) });

  } catch (error: any) {
    console.error('Error placing bid:', error);
    if (error.message.includes('higher than the current bid') || error.message.includes('not an auction') || error.message.includes('not found')) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to place bid' }, { status: 500 });
  }
}
