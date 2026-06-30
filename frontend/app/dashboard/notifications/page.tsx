'use client'

import React, { useState } from 'react'
import { Bell, Check, Package, MessageSquare, Gavel, AlertCircle, ShoppingBag } from 'lucide-react'

// Mock Data
const mockNotifications = [
  {
    id: 'n1',
    type: 'bid',
    title: 'Outbid on "Vintage Rolex"',
    message: 'Someone placed a higher bid of ₹42,000.',
    time: '2m ago',
    unread: true,
  },
  {
    id: 'n2',
    type: 'message',
    title: 'New message from Alex M.',
    message: '"I can ship it tomorrow morning..."',
    time: '1h ago',
    unread: true,
  },
  {
    id: 'n3',
    type: 'order',
    title: 'Order Shipped',
    message: 'Your order "Handcrafted Vase" is on the way. Tracking: BD12345',
    time: '3h ago',
    unread: false,
  },
  {
    id: 'n4',
    type: 'system',
    title: 'Action Required: Dispute Opened',
    message: 'A buyer opened a dispute for order #ORD-102. Please respond within 48h.',
    time: '1d ago',
    unread: false,
  },
  {
    id: 'n5',
    type: 'bid',
    title: 'Auction Won!',
    message: 'Congratulations, you won the auction for "Polaroid Camera" at ₹2,800.',
    time: '2d ago',
    unread: false,
  },
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications)

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'bid': return <Gavel className="w-5 h-5 text-terracotta-600" />
      case 'message': return <MessageSquare className="w-5 h-5 text-ink-500" />
      case 'order': return <Package className="w-5 h-5 text-success-600" />
      case 'system': return <AlertCircle className="w-5 h-5 text-urgent-600" />
      default: return <Bell className="w-5 h-5 text-ink-500" />
    }
  }

  return (
    <div className="animate-in fade-in duration-500 max-w-3xl mx-auto">
      <div className="mb-6 flex justify-between items-end border-b border-border-subtle pb-6">
        <div>
          <h1 className="text-display-md text-foreground mb-2">Notifications</h1>
          <p className="text-body-md text-ink-500">Stay updated on your account activity.</p>
        </div>
        <button 
          onClick={markAllRead}
          className="text-sm font-semibold text-terracotta-600 hover:text-terracotta-700 transition-colors flex items-center gap-1.5"
        >
          <Check className="w-4 h-4" /> Mark all as read
        </button>
      </div>

      <div className="bg-white rounded-md border border-border-subtle shadow-card overflow-hidden">
        <div className="divide-y divide-border-subtle">
          {notifications.map((notif) => (
            <div 
              key={notif.id}
              className={`flex items-start gap-4 p-4 transition-colors relative cursor-pointer hover:bg-cream-raised ${
                notif.unread ? 'bg-cream-raised' : 'bg-white'
              }`}
              onClick={() => {
                if (notif.unread) {
                  setNotifications(notifications.map(n => n.id === notif.id ? { ...n, unread: false } : n))
                }
              }}
            >
              {notif.unread && (
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-terracotta-600" />
              )}
              
              <div className="mt-1 bg-white border border-border-subtle p-2 rounded-full shadow-sm flex-shrink-0">
                {getIcon(notif.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h4 className={`text-body-md ${notif.unread ? 'font-bold text-ink-900' : 'font-semibold text-ink-900'}`}>
                    {notif.title}
                  </h4>
                  <span className="text-caption text-ink-500 whitespace-nowrap ml-4">
                    {notif.time}
                  </span>
                </div>
                <p className={`text-sm ${notif.unread ? 'text-ink-700' : 'text-ink-500'}`}>
                  {notif.message}
                </p>
              </div>
            </div>
          ))}

          {notifications.length === 0 && (
            <div className="p-12 text-center text-ink-500">
              <Bell className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>No notifications yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
