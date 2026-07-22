// socketEvents.ts

export const SOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  JOIN_AUCTION: 'join_auction',
  LEAVE_AUCTION: 'leave_auction',
  BID_PLACED: 'bid_placed',
  OUTBID: 'outbid',
  AUCTION_ENDED: 'auction_ended',
} as const;

export interface OutbidEvent {
  listingId: string | number;
  auctionId: string | number;
  highestBid: number;
  bidderId: string | number;
}

export interface BidPlacedEvent {
  auction_id: string | number;
  bidder_id: string | number;
  bid_amount: string | number;
  total_bids: number;
  auction_ends_at: string;
  created_at: string;
}

export interface AuctionEndedEvent {
  auction_id: string | number;
  winning_bid: number | null;
  winner_id: string | number | null;
}
