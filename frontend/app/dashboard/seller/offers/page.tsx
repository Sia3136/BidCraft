'use client'

import React, { useState } from 'react'
import { Clock, Check, X, CornerDownRight } from 'lucide-react'

// Mock Data
const mockOffers = [
  {
    id: 'OFF-01',
    user: { name: 'Alex M.', avatar: 'https://i.pravatar.cc/150?u=1' },
    item: { title: 'Vintage Rolex Submariner', image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=100&q=80' },
    amount: '₹40,000',
    type: 'Offer',
    timeLeft: '2h 15m',
    status: 'Pending',
    message: "I can pay immediately if we can agree on this price.",
    originalPrice: '₹45,000'
  },
  {
    id: 'OFF-02',
    user: { name: 'Sarah K.', avatar: 'https://i.pravatar.cc/150?u=2' },
    item: { title: 'Limited Edition Art Print', image: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=100&q=80' },
    amount: '₹1,200',
    type: 'Offer',
    timeLeft: '14h 30m',
    status: 'Pending',
    message: "",
    originalPrice: '₹1,500'
  },
  {
    id: 'OFF-03',
    user: { name: 'David R.', avatar: 'https://i.pravatar.cc/150?u=3' },
    item: { title: 'Custom Mechanical Keyboard', image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=100&q=80' },
    amount: 'Trade: Keycaps Set + ₹2000',
    type: 'Trade',
    timeLeft: '21h 0m',
    status: 'Pending',
    message: "Would you consider a trade? I have a brand new GMK set.",
    originalPrice: '₹8,000'
  }
]

export default function OffersManagementPage() {
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(mockOffers[0].id)
  const [isCountering, setIsCountering] = useState(false)
  const [counterAmount, setCounterAmount] = useState('')

  const selectedOffer = mockOffers.find(o => o.id === selectedOfferId)

  return (
    <div className="animate-in fade-in duration-500 h-[calc(100vh-140px)] flex flex-col">
      <div className="mb-6 pb-4 border-b border-border-subtle shrink-0">
        <h1 className="text-display-md text-foreground mb-2">Offers & Trades</h1>
        <p className="text-body-md text-ink-500">Review and negotiate incoming offers for your listings.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-0">
        
        {/* Left Column: List */}
        <div className="w-full md:w-1/3 lg:w-2/5 flex flex-col gap-3 overflow-y-auto pr-2">
          {mockOffers.map((offer) => {
            const isSelected = offer.id === selectedOfferId
            return (
              <div 
                key={offer.id}
                onClick={() => {
                  setSelectedOfferId(offer.id)
                  setIsCountering(false)
                }}
                className={`p-4 rounded-md border cursor-pointer transition-all duration-base ease-default ${
                  isSelected 
                    ? 'border-terracotta-600 bg-terracotta-100/30 shadow-sm' 
                    : 'border-border-subtle bg-white hover:border-ink-300 hover:bg-cream-raised'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <img src={offer.user.avatar} alt="" className="w-6 h-6 rounded-full" />
                    <span className="text-sm font-semibold text-ink-900">{offer.user.name}</span>
                  </div>
                  <span className="flex items-center text-xs font-semibold text-urgent-700 bg-urgent-100 px-2 py-0.5 rounded-sm">
                    <Clock className="w-3 h-3 mr-1" /> {offer.timeLeft}
                  </span>
                </div>
                
                <div className="flex gap-3">
                  <img src={offer.item.image} alt="" className="w-12 h-12 rounded-sm object-cover bg-slate-100" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-ink-500 truncate mb-1">{offer.item.title}</p>
                    <p className="text-sm font-bold text-ink-900 truncate">{offer.amount}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Right Column: Detail Panel */}
        <div className="flex-1 bg-white rounded-md border border-border-subtle shadow-card overflow-y-auto">
          {selectedOffer ? (
            <div className="p-6 h-full flex flex-col">
              
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border-subtle">
                <img src={selectedOffer.item.image} alt="" className="w-20 h-20 rounded-md object-cover bg-slate-100" />
                <div>
                  <h2 className="text-heading-lg text-ink-900 mb-1">{selectedOffer.item.title}</h2>
                  <p className="text-body-md text-ink-500">Listed Price: {selectedOffer.originalPrice}</p>
                </div>
              </div>

              <div className="bg-cream-raised rounded-md p-6 mb-8 relative">
                <div className="absolute top-6 right-6">
                  <span className="flex items-center text-xs font-semibold text-urgent-700 bg-urgent-100 px-2 py-1 rounded-sm">
                    <Clock className="w-3 h-3 mr-1" /> Expires in {selectedOffer.timeLeft}
                  </span>
                </div>
                
                <p className="text-sm text-ink-500 font-medium uppercase tracking-wider mb-2">
                  {selectedOffer.type} From {selectedOffer.user.name}
                </p>
                <p className="text-display-md text-terracotta-600 mb-4">{selectedOffer.amount}</p>
                
                {selectedOffer.message && (
                  <div className="bg-white p-4 rounded-md border border-border-subtle">
                    <p className="text-body-md text-ink-700 italic">"{selectedOffer.message}"</p>
                  </div>
                )}
              </div>

              <div className="mt-auto">
                {isCountering ? (
                  <div className="bg-slate-50 p-4 rounded-md border border-border-subtle animate-in slide-in-from-bottom-2 duration-fast">
                    <label className="block text-sm font-semibold text-ink-900 mb-2">Your Counter Offer (₹)</label>
                    <div className="flex gap-3">
                      <input 
                        type="number" 
                        value={counterAmount}
                        onChange={(e) => setCounterAmount(e.target.value)}
                        className="flex-1 bg-white border border-border-subtle rounded-md px-3 py-2 text-ink-900 focus:outline-none focus:border-terracotta-600 focus:ring-1 focus:ring-terracotta-600"
                        placeholder="e.g. 42000"
                      />
                      <button className="bg-terracotta-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-terracotta-700 transition-colors">
                        Send
                      </button>
                      <button 
                        onClick={() => setIsCountering(false)}
                        className="text-ink-500 hover:text-ink-900 px-4 py-2 font-semibold transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    <button className="flex-1 min-w-[120px] bg-success-600 text-white px-4 py-3 rounded-md font-semibold hover:bg-success-700 transition-colors flex items-center justify-center gap-2">
                      <Check className="w-4 h-4" /> Accept
                    </button>
                    <button 
                      onClick={() => setIsCountering(true)}
                      className="flex-1 min-w-[120px] bg-slate-100 text-ink-900 border border-border-subtle px-4 py-3 rounded-md font-semibold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <CornerDownRight className="w-4 h-4" /> Counter
                    </button>
                    <button className="flex-1 min-w-[120px] bg-transparent text-urgent-600 border border-urgent-100 hover:bg-urgent-50 px-4 py-3 rounded-md font-semibold transition-colors flex items-center justify-center gap-2">
                      <X className="w-4 h-4" /> Decline
                    </button>
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-ink-500">
              Select an offer to view details
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
