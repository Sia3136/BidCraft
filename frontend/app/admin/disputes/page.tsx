'use client'

import { useState, useEffect } from 'react'
import { adminApi } from '@/lib/api'

export default function AdminDisputesPage() {
  const [disputes, setDisputes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDisputes()
  }, [])

  const loadDisputes = async () => {
    try {
      const data = await adminApi.getDisputes()
      setDisputes(data || [])
    } catch (err: any) {
      console.error(err)
      alert('Failed to load disputes: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleResolve = async (id: string, action: 'refund' | 'release' | 'dismiss') => {
    const resolution = prompt('Enter resolution notes for this action:')
    if (!resolution) return

    try {
      await adminApi.resolveDispute(id, resolution, action)
      alert('Dispute resolved successfully')
      loadDisputes()
    } catch (err: any) {
      alert('Action failed: ' + err.message)
    }
  }

  if (loading) return <div>Loading disputes...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Disputes Management</h1>
      
      {disputes.length === 0 ? (
        <div className="text-center p-12 bg-card rounded-xl border border-border">
          <p className="text-muted-foreground">No disputes found.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {disputes.map((dispute) => (
            <div key={dispute.id} className="bg-card border border-border rounded-xl p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">Order #{dispute.order_id}</h3>
                  <p className="text-sm text-muted-foreground">Status: <span className="font-medium text-foreground">{dispute.status}</span></p>
                  <p className="text-sm text-muted-foreground">Initiator: {dispute.initiator_name} ({dispute.initiator_email})</p>
                  <p className="text-sm text-muted-foreground">Amount: ₹{Number(dispute.total_amount).toLocaleString()}</p>
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(dispute.created_at).toLocaleString()}
                </div>
              </div>
              
              <div className="mb-4 p-4 bg-muted/30 rounded-lg">
                <p className="text-sm font-medium mb-1">Reason for Dispute:</p>
                <p className="text-sm">{dispute.reason}</p>
              </div>

              {dispute.evidence_urls && (
                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">Evidence:</p>
                  <div className="flex gap-2 overflow-x-auto">
                    {JSON.parse(dispute.evidence_urls).map((url: string, idx: number) => (
                      <a key={idx} href={url} target="_blank" rel="noreferrer" className="flex-shrink-0">
                        <img src={url} alt="Evidence" className="w-24 h-24 object-cover rounded-md border border-border" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {dispute.status === 'open' || dispute.status === 'under_review' ? (
                <div className="flex gap-3 mt-6">
                  <button onClick={() => handleResolve(dispute.id, 'refund')} className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700">
                    Resolve & Refund Buyer
                  </button>
                  <button onClick={() => handleResolve(dispute.id, 'release')} className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700">
                    Dismiss & Release to Seller
                  </button>
                </div>
              ) : (
                <div className="mt-4 p-4 bg-primary/10 text-primary rounded-lg text-sm">
                  <p className="font-medium mb-1">Resolution: {dispute.resolution}</p>
                  <p>Resolved By Admin ID: {dispute.resolved_by}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
