'use client'

import React, { useEffect, useState } from 'react'

export function BuyerDisputes() {
  const [disputes, setDisputes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDisputes()
  }, [])

  const loadDisputes = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/disputes`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      })
      if (res.ok) {
        const data = await res.json()
        setDisputes(data.disputes || [])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading disputes...</div>
  if (disputes.length === 0) return <div className="p-8 text-center text-muted-foreground bg-card border border-border rounded-xl">No active disputes.</div>

  return (
    <div className="space-y-4">
      {disputes.map(dispute => (
        <div key={dispute.id} className="p-6 bg-card border border-border rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg text-foreground">Dispute for Order #{dispute.order_id}</h3>
            <span className="px-2 py-1 text-xs font-semibold rounded-md uppercase tracking-wider bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
              {dispute.status}
            </span>
          </div>
          <p className="text-sm font-medium mb-1">Reason: {dispute.reason}</p>
          <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg border border-border mt-3">
            {dispute.description}
          </p>
        </div>
      ))}
    </div>
  )
}
