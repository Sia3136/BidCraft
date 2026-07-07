'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export default function AddressPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const listingId = searchParams.get('listing_id')
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    pinCode: ''
  })

  // For this sprint MVP we can just store this locally or skip it
  // and pass to the payment step, or hit a generic user_addresses endpoint.
  // Since the endpoint might not be wired in the frontend store yet, we will
  // proceed to payment and potentially store address via localStorage for now.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Ideally save to DB here. For now, move to payment.
    localStorage.setItem('checkout_address', JSON.stringify(formData))
    router.push(`/checkout/payment?listing_id=${listingId}`)
  }

  return (
    <div className="min-h-screen bg-[var(--color-cream-base)] flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-[600px] mx-auto w-full px-[var(--space-4)] py-[var(--space-6)]">
        <h1 className="text-display-sm font-display mb-6">Delivery Address</h1>
        
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] flex flex-col gap-4">
          <div>
            <label className="block text-sm font-bold mb-1">Full Name</label>
            <input required type="text" className="w-full h-12 px-4 rounded-[var(--radius-sm)] border border-[var(--color-border-strong)]"
                   value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Phone Number</label>
            <input required type="tel" className="w-full h-12 px-4 rounded-[var(--radius-sm)] border border-[var(--color-border-strong)]"
                   value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Address Line 1</label>
            <input required type="text" className="w-full h-12 px-4 rounded-[var(--radius-sm)] border border-[var(--color-border-strong)]"
                   value={formData.address1} onChange={e => setFormData({...formData, address1: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-1">City</label>
              <input required type="text" className="w-full h-12 px-4 rounded-[var(--radius-sm)] border border-[var(--color-border-strong)]"
                     value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">PIN Code</label>
              <input required type="text" className="w-full h-12 px-4 rounded-[var(--radius-sm)] border border-[var(--color-border-strong)]"
                     value={formData.pinCode} onChange={e => setFormData({...formData, pinCode: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">State</label>
            <input required type="text" className="w-full h-12 px-4 rounded-[var(--radius-sm)] border border-[var(--color-border-strong)]"
                   value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} />
          </div>
          
          <button type="submit" className="w-full mt-6 h-12 bg-[var(--color-terracotta-600)] text-white rounded-[var(--radius-pill)] font-bold text-lg hover:bg-[var(--color-terracotta-700)] transition-colors">
            Continue to Payment
          </button>
        </form>
      </main>
      <Footer />
    </div>
  )
}
