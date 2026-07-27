import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ui',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'BidCraft - Creator Marketplace',
  description: 'The premier marketplace for creators. Buy, auction, and make offers on unique products from verified creators worldwide.',
  generator: 'v0.app',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FDFBF7' },
    { media: '(prefers-color-scheme: dark)', color: '#2B2F3A' },
  ],
}

import { AuthProvider } from '@/lib/auth-context'
import { PrefetchRoutes } from '@/components/prefetch-routes'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { AuthRehydrator } from '@/components/AuthRehydrator'
import { Suspense } from 'react'
import { SkeletonGrid } from '@/components/skeleton-grid'
import { SocketProvider } from '@/components/SocketProvider'
import { Toaster } from 'react-hot-toast'
import { ChatWidget } from '@/components/chat/ChatWidget'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${jakarta.variable}`}>
      <body className="font-sans antialiased">
        <AuthProvider>
          <SocketProvider>
            <PrefetchRoutes />
            <AuthRehydrator />
            <div className="min-h-screen bg-[var(--color-cream-base)] flex flex-col">
              <Suspense fallback={<div className="h-[64px] bg-[var(--color-cream-base)] border-b border-[var(--color-border-subtle)]" />}>
                <Navbar />
              </Suspense>
              <main className="flex-1 w-full">
                <Suspense fallback={
                  <div className="w-full max-w-[var(--container-max)] mx-auto px-[var(--space-4)] md:px-[var(--space-6)] xl:px-[var(--space-8)] py-[var(--space-8)]">
                    <SkeletonGrid count={8} />
                  </div>
                }>
                  {children}
                </Suspense>
              </main>
              <Footer />
            </div>
            <Toaster />
            <ChatWidget />
          </SocketProvider>
        </AuthProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
