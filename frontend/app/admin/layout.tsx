'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/')
    }
  }, [user, loading, router])

  if (loading || !user || user.role !== 'admin') {
    return <div className="p-8 text-center">Checking permissions...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-card border-b border-border p-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <span className="font-bold text-lg text-primary">Admin Portal</span>
            <a href="/admin/disputes" className="text-sm font-medium hover:text-primary">Disputes</a>
          </div>
          <a href="/" className="text-sm font-medium hover:text-primary">Back to App</a>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-8 px-4">
        {children}
      </main>
    </div>
  )
}
