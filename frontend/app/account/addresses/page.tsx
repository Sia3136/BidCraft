'use client'

import React, { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Plus, MapPin, Trash2, Edit2, CheckCircle2, XCircle } from 'lucide-react'

type Address = {
  id: string
  type: string
  full_name: string
  phone: string
  street_address: string
  city: string
  state: string
  postal_code: string
  country: string
  is_default: boolean
}

export default function AddressesPage() {
  const { token } = useAuthStore()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Form state
  const [formData, setFormData] = useState<Partial<Address>>({
    type: 'shipping',
    full_name: '',
    phone: '',
    street_address: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'India',
    is_default: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchAddresses = async () => {
    if (!token) return
    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile/addresses`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setAddresses(data.addresses || [])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAddresses()
  }, [token])

  const handleEdit = (addr: Address) => {
    setFormData(addr)
    setIsEditing(addr.id)
    setIsAdding(false)
  }

  const handleAddNew = () => {
    setFormData({
      type: 'shipping',
      full_name: '',
      phone: '',
      street_address: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'India',
      is_default: addresses.length === 0
    })
    setIsAdding(true)
    setIsEditing(null)
  }

  const handleCancel = () => {
    setIsAdding(false)
    setIsEditing(null)
    setFormData({})
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return
    setIsSubmitting(true)
    setMessage(null)

    const url = isEditing 
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/profile/addresses/${isEditing}`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/profile/addresses`
      
    const method = isEditing ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        setMessage({ type: 'success', text: isEditing ? 'Address updated.' : 'Address added.' })
        handleCancel()
        fetchAddresses()
        setTimeout(() => setMessage(null), 3000)
      } else {
        const err = await res.json()
        throw new Error(err.error || 'Failed to save address.')
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!token || !window.confirm('Are you sure you want to delete this address?')) return
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile/addresses/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        setMessage({ type: 'success', text: 'Address deleted.' })
        fetchAddresses()
        setTimeout(() => setMessage(null), 3000)
      } else {
        throw new Error('Failed to delete')
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message })
    }
  }

  const handleSetDefault = async (addr: Address) => {
    if (!token || addr.is_default) return
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile/addresses/${addr.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ is_default: true })
      })
      if (res.ok) {
        fetchAddresses()
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-display-sm text-[var(--color-ink-900)] flex items-center gap-3">
          <MapPin className="w-8 h-8 text-[var(--color-terracotta-600)]" /> Addresses
        </h1>
        {(!isAdding && !isEditing) && (
          <Button onClick={handleAddNew} className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add New Address
          </Button>
        )}
      </div>

      {message && (
        <div className={`p-4 rounded-[var(--radius-md)] text-body-md flex items-center gap-2 ${
          message.type === 'success' 
            ? 'bg-[var(--color-success-50)] text-[var(--color-success-700)] border border-[var(--color-success-200)]' 
            : 'bg-[var(--color-urgent-50)] text-[var(--color-urgent-700)] border border-[var(--color-urgent-200)]'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <XCircle className="w-5 h-5 shrink-0" />}
          {message.text}
        </div>
      )}

      {(isAdding || isEditing) ? (
        <Card>
          <CardHeader>
            <CardTitle>{isEditing ? 'Edit Address' : 'Add New Address'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-body-md font-medium text-[var(--color-ink-900)]">Full Name</label>
                  <Input 
                    required 
                    value={formData.full_name || ''} 
                    onChange={e => setFormData({...formData, full_name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-body-md font-medium text-[var(--color-ink-900)]">Phone Number</label>
                  <Input 
                    required 
                    value={formData.phone || ''} 
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-body-md font-medium text-[var(--color-ink-900)]">Street Address</label>
                <Input 
                  required 
                  value={formData.street_address || ''} 
                  onChange={e => setFormData({...formData, street_address: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-body-md font-medium text-[var(--color-ink-900)]">City</label>
                  <Input 
                    required 
                    value={formData.city || ''} 
                    onChange={e => setFormData({...formData, city: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-body-md font-medium text-[var(--color-ink-900)]">State</label>
                  <Input 
                    required 
                    value={formData.state || ''} 
                    onChange={e => setFormData({...formData, state: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-body-md font-medium text-[var(--color-ink-900)]">Postal Code</label>
                  <Input 
                    required 
                    value={formData.postal_code || ''} 
                    onChange={e => setFormData({...formData, postal_code: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="is_default"
                  checked={formData.is_default || false}
                  onChange={e => setFormData({...formData, is_default: e.target.checked})}
                  className="w-4 h-4 text-[var(--color-terracotta-600)]"
                />
                <label htmlFor="is_default" className="text-body-md text-[var(--color-ink-900)] cursor-pointer">
                  Set as default address
                </label>
              </div>

              <div className="flex gap-4 pt-4 border-t border-[var(--color-border-subtle)]">
                <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Save Address
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--color-terracotta-600)]" />
        </div>
      ) : addresses.length === 0 ? (
        <Card>
          <CardContent className="py-16 flex flex-col items-center justify-center text-center">
            <MapPin className="w-12 h-12 text-[var(--color-ink-300)] mb-4" />
            <h3 className="text-heading-lg text-[var(--color-ink-900)] mb-2">No addresses saved</h3>
            <p className="text-body-md text-[var(--color-ink-700)] mb-6 max-w-md">
              Add your shipping addresses to make the checkout process faster and easier.
            </p>
            <Button onClick={handleAddNew} className="flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Your First Address
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((addr) => (
            <Card key={addr.id} className={`relative ${addr.is_default ? 'border-[var(--color-terracotta-600)] ring-1 ring-[var(--color-terracotta-600)]' : ''}`}>
              {addr.is_default && (
                <div className="absolute top-0 right-0 bg-[var(--color-terracotta-600)] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-[var(--radius-md)] rounded-tr-[var(--radius-md)]">
                  Default
                </div>
              )}
              <CardHeader className="pb-3">
                <CardTitle className="text-heading-md">{addr.full_name}</CardTitle>
                <CardDescription>{addr.phone}</CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                <p className="text-body-md text-[var(--color-ink-700)] leading-relaxed">
                  {addr.street_address}<br />
                  {addr.city}, {addr.state} {addr.postal_code}<br />
                  {addr.country}
                </p>
              </CardContent>
              <CardFooter className="pt-4 border-t border-[var(--color-border-subtle)] flex items-center justify-between bg-[var(--color-cream-base)] rounded-b-[var(--radius-md)]">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(addr)} className="text-body-sm h-8">
                    <Edit2 className="w-3 h-3 mr-1.5" /> Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(addr.id)} className="text-body-sm h-8 text-[var(--color-urgent-600)] hover:text-[var(--color-urgent-700)] hover:bg-[var(--color-urgent-50)] border-[var(--color-urgent-200)]">
                    <Trash2 className="w-3 h-3 mr-1.5" /> Delete
                  </Button>
                </div>
                {!addr.is_default && (
                  <button onClick={() => handleSetDefault(addr)} className="text-caption font-medium text-[var(--color-terracotta-600)] hover:underline">
                    Set Default
                  </button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
