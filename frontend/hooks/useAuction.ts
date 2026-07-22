'use client'
import { useState, useEffect } from 'react'
import { useSocketContext } from '@/components/SocketProvider'
import { SOCKET_EVENTS, BidPlacedEvent, AuctionEndedEvent } from '@/lib/socketEvents'

type AuctionState = {
  currentBid: number | null
  bidCount: number
  auctionEndsAt: string
  isEnded: boolean
}

export function useAuction(auctionId: string | undefined, initial: AuctionState) {
  const [state, setState] = useState<AuctionState>(initial)
  const { socket } = useSocketContext()

  useEffect(() => {
    if (!auctionId || !socket) return;

    // Join room with acknowledgement callback
    socket.emit(SOCKET_EVENTS.JOIN_AUCTION, auctionId, (response: { success: boolean, error?: string }) => {
      if (!response?.success) {
        console.error('[useAuction] Failed to join auction room:', response?.error)
      } else {
        console.log('[useAuction] Joined auction room:', auctionId)
      }
    })

    const onBidPlaced = (data: BidPlacedEvent) => {
      if (String(data.auction_id) !== String(auctionId)) return
      
      setState(prev => ({
        ...prev,
        currentBid: Number(data.bid_amount),
        bidCount: data.total_bids || prev.bidCount + 1,
        auctionEndsAt: data.auction_ends_at || prev.auctionEndsAt,
      }))
    }

    const onAuctionEnded = (data: AuctionEndedEvent) => {
      if (String(data.auction_id) !== String(auctionId)) return
      
      setState(prev => ({
        ...prev,
        isEnded: true,
        currentBid: data.winning_bid !== null ? Number(data.winning_bid) : prev.currentBid
      }))
    }

    socket.on(SOCKET_EVENTS.BID_PLACED, onBidPlaced)
    socket.on(SOCKET_EVENTS.AUCTION_ENDED, onAuctionEnded)

    return () => {
      socket.emit(SOCKET_EVENTS.LEAVE_AUCTION, auctionId)
      socket.off(SOCKET_EVENTS.BID_PLACED, onBidPlaced)
      socket.off(SOCKET_EVENTS.AUCTION_ENDED, onAuctionEnded)
    }
  }, [auctionId, socket])

  return state
}
