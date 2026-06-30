'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Copy, Edit2, Eye, MoreHorizontal, Plus, Trash2 } from 'lucide-react'

// Mock Data
const mockListings = [
  {
    id: 'LST-001',
    title: 'Vintage Sony Walkman TPS-L2',
    image: 'https://images.unsplash.com/photo-1608667508764-33cf0726b13a?w=100&q=80',
    method: 'Auction',
    price: '₹4,500 (Current)',
    status: 'Active',
    views: 124,
  },
  {
    id: 'LST-002',
    title: 'Handcrafted Ceramic Vase Set',
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=100&q=80',
    method: 'Fixed Price',
    price: '₹2,200',
    status: 'Active',
    views: 89,
  },
  {
    id: 'LST-003',
    title: 'Limited Edition Art Print "Neon Tokyo"',
    image: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=100&q=80',
    method: 'Fixed Price',
    price: '₹1,500',
    status: 'Sold',
    views: 312,
  },
  {
    id: 'LST-004',
    title: 'Custom Mechanical Keyboard',
    image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=100&q=80',
    method: 'Auction',
    price: '₹8,000 (Starting)',
    status: 'Draft',
    views: 0,
  },
  {
    id: 'LST-005',
    title: 'Vintage Polaroid 600 Camera',
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=100&q=80',
    method: 'Auction',
    price: '₹2,800 (Final)',
    status: 'Ended',
    views: 456,
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Active':
      return 'bg-success-100 text-success-700'
    case 'Draft':
      return 'bg-slate-100 text-slate-700'
    case 'Sold':
    case 'Ended':
      return 'bg-ink-300 text-ink-700'
    default:
      return 'bg-slate-100 text-slate-700'
  }
}

const getMethodBadge = (method: string) => {
  if (method === 'Auction') {
    return 'bg-terracotta-100 text-terracotta-700'
  }
  return 'bg-slate-100 text-slate-700'
}

export default function ListingsManagementPage() {
  const [activeTab, setActiveTab] = useState('All')
  
  const filteredListings = activeTab === 'All' 
    ? mockListings 
    : mockListings.filter(l => l.status === activeTab)

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-border-subtle pb-6 gap-4">
        <div>
          <h1 className="text-display-md text-foreground mb-2">Listings</h1>
          <p className="text-body-md text-ink-500">Manage your product listings and inventory.</p>
        </div>
        <Link href="/dashboard/seller/listings/new">
          <button className="flex items-center gap-2 bg-terracotta-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-terracotta-700 transition-colors">
            <Plus className="w-4 h-4" /> New Listing
          </button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-border-subtle mb-6 overflow-x-auto">
        {['All', 'Active', 'Draft', 'Sold', 'Ended'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-semibold transition-colors whitespace-nowrap border-b-2 ${
              activeTab === tab 
                ? 'border-terracotta-600 text-terracotta-600' 
                : 'border-transparent text-ink-500 hover:text-ink-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table (Desktop) / Cards (Mobile) */}
      <div className="bg-white rounded-md border border-border-subtle shadow-card overflow-hidden">
        
        {/* Desktop Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-border-subtle bg-slate-50 text-caption text-ink-500 uppercase tracking-wider">
          <div className="col-span-5">Item</div>
          <div className="col-span-2">Format</div>
          <div className="col-span-2">Price</div>
          <div className="col-span-1 text-center">Views</div>
          <div className="col-span-1 text-center">Status</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        {/* List Body */}
        <div className="divide-y divide-border-subtle">
          {filteredListings.map((listing) => (
            <div key={listing.id} className="group flex flex-col md:grid md:grid-cols-12 gap-4 p-4 hover:bg-cream-raised transition-colors ease-default duration-base items-start md:items-center">
              
              {/* Item */}
              <div className="col-span-5 flex items-center gap-4 w-full">
                <div className="w-12 h-12 bg-slate-100 rounded-md overflow-hidden flex-shrink-0">
                  <img src={listing.image} alt={listing.title} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-body-md font-semibold text-ink-900 truncate pr-4">{listing.title}</h4>
                  <p className="text-caption text-ink-500">{listing.id}</p>
                </div>
                
                {/* Mobile-only status & actions toggle */}
                <div className="md:hidden ml-auto flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-pill text-[10px] font-bold uppercase tracking-wide ${getStatusBadge(listing.status)}`}>
                    {listing.status}
                  </span>
                  <button className="p-2 text-ink-500 hover:text-ink-900 hover:bg-slate-100 rounded-full">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Format */}
              <div className="col-span-2 hidden md:block">
                <span className={`px-2 py-0.5 rounded-pill text-[10px] font-bold uppercase tracking-wide ${getMethodBadge(listing.method)}`}>
                  {listing.method}
                </span>
              </div>

              {/* Price */}
              <div className="col-span-2 text-sm text-ink-900">
                <span className="md:hidden text-ink-500 mr-2 text-xs">Price:</span>
                {listing.price}
              </div>

              {/* Views */}
              <div className="col-span-1 hidden md:flex justify-center items-center gap-1.5 text-sm text-ink-500">
                <Eye className="w-4 h-4" />
                {listing.views}
              </div>

              {/* Status (Desktop) */}
              <div className="col-span-1 hidden md:flex justify-center">
                <span className={`px-2 py-0.5 rounded-pill text-[10px] font-bold uppercase tracking-wide ${getStatusBadge(listing.status)}`}>
                  {listing.status}
                </span>
              </div>

              {/* Actions (Desktop) */}
              <div className="col-span-1 hidden md:flex justify-end items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-fast">
                <button className="p-1.5 text-ink-500 hover:text-terracotta-600 hover:bg-terracotta-100 rounded-md transition-colors" title="Edit">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="p-1.5 text-ink-500 hover:text-terracotta-600 hover:bg-terracotta-100 rounded-md transition-colors" title="Duplicate">
                  <Copy className="w-4 h-4" />
                </button>
                <button className="p-1.5 text-ink-500 hover:text-urgent-600 hover:bg-urgent-100 rounded-md transition-colors" title="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
          
          {filteredListings.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-body-md text-ink-500">No listings found in this category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
