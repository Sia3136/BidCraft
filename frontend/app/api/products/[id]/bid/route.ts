import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

import { invalidateListingCache } from '@/lib/dbProducts';
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
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

      // Update the auction record
      const updatedAuction = await tx.auctions.update({
        where: { id: listing.auctions.id },
        data: {
          current_bid: bidAmount,
          total_bids: { increment: 1 }
        }
      });

      // Dummy bidder ID for demo purposes
      let demoUser = await tx.users.findFirst({ where: { role: 'buyer' } });
      if (!demoUser) {
        demoUser = await tx.users.create({
          data: {
            email: 'demobidder@example.com',
            name: 'Demo Bidder',
            role: 'buyer'
          }
        });
      }

      await tx.bids.create({
        data: {
          auction_id: listing.auctions.id,
          bidder_id: demoUser.id,
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
