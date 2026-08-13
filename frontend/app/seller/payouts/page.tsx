'use client'

import React, { useEffect, useState } from 'react'
import { DashboardShell } from '@/components/dashboard-shell'
import { authenticatedFetch } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { DollarSign, PlusCircle, Info } from 'lucide-react'

export default function PayoutsPage() {
  const { token } = useAuthStore()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await authenticatedFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/seller/orders`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const data = await res.json()
        setOrders(data.orders || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    if (token) fetchOrders()
  }, [token])

  const availableBalance = orders.reduce((acc, order) => acc + (order.total_amount ? Number(order.total_amount) : 0), 0)
  
  const payoutHistory = [
    { id: 'PAY_mock_001', date: '15 Jul 2025', amount: 4500, status: 'Paid' },
    { id: 'PAY_mock_002', date: '2 Jun 2025', amount: 2800, status: 'Paid' },
    { id: 'PAY_mock_003', date: '18 May 2025', amount: 6200, status: 'Paid' }
  ]

  if (loading) {
    return <DashboardShell><div className="p-8 text-center text-[var(--color-ink-500)]">Loading payouts...</div></DashboardShell>
  }

  return (
    <DashboardShell>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-display-sm font-display text-[var(--color-ink-900)]">Payouts</h1>
          <p className="text-[var(--color-ink-500)] mt-1">Manage your earnings and bank accounts.</p>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-[var(--radius-lg)] p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-body-sm text-blue-800">
            Payouts are processed within 3–5 business days after order completion and buyer confirmation.
          </p>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[var(--color-ink-900)] p-6 rounded-[var(--radius-lg)] text-white shadow-md">
            <h3 className="text-body-md font-medium text-[var(--color-ink-300)] mb-2">Available for Payout</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-display-lg font-display">₹{availableBalance.toLocaleString()}</span>
            </div>
            <button className="mt-6 w-full py-2.5 bg-white text-[var(--color-ink-900)] font-semibold rounded-[var(--radius-md)] hover:bg-[var(--color-cream-base)] transition-colors">
              Withdraw Funds
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-body-md font-medium text-[var(--color-ink-500)] mb-2">Pending Balance</h3>
              <p className="text-display-md font-display text-[var(--color-ink-900)]">₹0</p>
            </div>
            <p className="text-caption text-[var(--color-ink-500)] mt-4">Funds held in escrow</p>
          </div>

          <div className="bg-white p-6 rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-body-md font-medium text-[var(--color-ink-500)] mb-2">Total Withdrawn</h3>
              <p className="text-display-md font-display text-[var(--color-ink-900)]">₹13,500</p>
            </div>
            <p className="text-caption text-[var(--color-ink-500)] mt-4">Lifetime earnings</p>
          </div>
        </div>

        {/* Bank Account */}
        <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[var(--color-border-subtle)] flex items-center justify-between">
            <h2 className="text-heading-sm font-display text-[var(--color-ink-900)]">Bank Account</h2>
          </div>
          <div className="p-8 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-[var(--color-cream-base)] rounded-full flex items-center justify-center mb-4 text-[var(--color-ink-400)]">
              <DollarSign className="w-8 h-8" />
            </div>
            <p className="text-body-md text-[var(--color-ink-700)] mb-6">
              No bank account linked. Add one to receive payouts.
            </p>
            <button disabled className="flex items-center gap-2 px-6 py-2.5 bg-[var(--color-ink-200)] text-[var(--color-ink-500)] rounded-[var(--radius-md)] font-medium cursor-not-allowed">
              <PlusCircle className="w-5 h-5" />
              Add Bank Account
            </button>
          </div>
        </div>

        {/* Payout History */}
        <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[var(--color-border-subtle)]">
            <h2 className="text-heading-sm font-display text-[var(--color-ink-900)]">Payout History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--color-cream-base)] border-b border-[var(--color-border-subtle)]">
                  <th className="px-6 py-4 text-caption font-bold text-[var(--color-ink-500)] uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-caption font-bold text-[var(--color-ink-500)] uppercase tracking-wider">Reference</th>
                  <th className="px-6 py-4 text-caption font-bold text-[var(--color-ink-500)] uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-caption font-bold text-[var(--color-ink-500)] uppercase tracking-wider text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border-subtle)]">
                {payoutHistory.map((payout, idx) => (
                  <tr key={idx} className="hover:bg-[var(--color-cream-base)] transition-colors">
                    <td className="px-6 py-4 text-body-sm text-[var(--color-ink-900)]">
                      {payout.date}
                    </td>
                    <td className="px-6 py-4 text-body-sm font-mono text-[var(--color-ink-600)]">
                      {payout.id}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {payout.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-body-sm font-medium text-[var(--color-ink-900)] text-right">
                      ₹{payout.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </DashboardShell>
  )
}
