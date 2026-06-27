'use client'

import React, { useEffect, useState } from 'react'
import { Navbar } from '@/components/navbar'
import { useAuth } from '@/lib/auth-context'

export default function ModerationPage() {
  const { user } = useAuth()
  const [users, setUsers] = useState<any[]>([])
  const [listings, setListings] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'users' | 'listings'>('users')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.role === 'admin') {
      loadData()
    }
  }, [user])

  const loadData = async () => {
    setLoading(true)
    try {
      const [usersRes, listingsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/users`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/listings`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
        })
      ])
      
      if (usersRes.ok) setUsers(await usersRes.json())
      if (listingsRes.ok) setListings(await listingsRes.json())
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      })
      setUsers(users.filter(u => u.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteListing = async (id: number) => {
    if (!confirm('Are you sure you want to delete this listing?')) return
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/listings/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      })
      setListings(listings.filter(l => l.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  if (!user || user.role !== 'admin') {
    return <div className="p-16 text-center text-red-500 font-bold">Unauthorized. Admins only.</div>
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="max-w-7xl mx-auto w-full px-4 py-12 flex-1">
        <h1 className="text-3xl font-bold mb-8">Moderation Tools</h1>

        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-2 rounded-lg font-semibold text-sm transition-colors ${
              activeTab === 'users' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80 text-muted-foreground'
            }`}
          >
            Manage Users
          </button>
          <button
            onClick={() => setActiveTab('listings')}
            className={`px-6 py-2 rounded-lg font-semibold text-sm transition-colors ${
              activeTab === 'listings' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80 text-muted-foreground'
            }`}
          >
            Manage Listings
          </button>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading data...</p>
        ) : (
          <div>
            {activeTab === 'users' && (
              <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="px-6 py-4 font-semibold text-muted-foreground">ID</th>
                      <th className="px-6 py-4 font-semibold text-muted-foreground">Email</th>
                      <th className="px-6 py-4 font-semibold text-muted-foreground">Role</th>
                      <th className="px-6 py-4 font-semibold text-muted-foreground">Joined</th>
                      <th className="px-6 py-4 font-semibold text-muted-foreground text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4">{u.id}</td>
                        <td className="px-6 py-4 font-medium">{u.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => handleDeleteUser(u.id)} className="text-red-500 hover:text-red-700 font-medium text-xs">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'listings' && (
              <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="px-6 py-4 font-semibold text-muted-foreground">ID</th>
                      <th className="px-6 py-4 font-semibold text-muted-foreground">Title</th>
                      <th className="px-6 py-4 font-semibold text-muted-foreground">Status</th>
                      <th className="px-6 py-4 font-semibold text-muted-foreground">Seller ID</th>
                      <th className="px-6 py-4 font-semibold text-muted-foreground text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {listings.map(l => (
                      <tr key={l.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4">{l.id}</td>
                        <td className="px-6 py-4 font-medium">{l.title}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-[10px] font-bold uppercase">
                            {l.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">#{l.seller_id}</td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => handleDeleteListing(l.id)} className="text-red-500 hover:text-red-700 font-medium text-xs">
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
