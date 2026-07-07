'use client'
import { useState, useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'

type AuctionState = {
  currentBid: number | null
  bidCount: number
  auctionEndsAt: string
  isEnded: boolean
}

export function useAuction(auctionId: string | undefined, initial: AuctionState) {
  const [state, setState] = useState<AuctionState>(initial)
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    if (!auctionId) return;

    const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

    const socket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    })

    socketRef.current = socket

    socket.on('connect', () => {
      socket.emit('join_auction', auctionId)
    })

    socket.on('bid_placed', (data: {
      auction_id: string
      bidder_id: string
      bid_amount: string
      total_bids: number
      auction_ends_at: string
      created_at: string
    }) => {
      if (String(data.auction_id) !== String(auctionId)) return
      
      setState(prev => ({
        ...prev,
        currentBid: Number(data.bid_amount),
        bidCount: data.total_bids || prev.bidCount + 1,
        auctionEndsAt: data.auction_ends_at || prev.auctionEndsAt,
      }))
    })

    // The backend uses a job to close the auction, so we just rely on local timer for isEnded for now.
    // We could listen for a 'auction_ended' event if backend emitted one.

    socket.on('disconnect', () => {
      console.log('[socket] Disconnected from auction room')
    })

    return () => {
      socket.emit('leave_auction', auctionId)
      socket.disconnect()
    }
  }, [auctionId])

  return state
}
