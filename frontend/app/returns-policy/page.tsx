import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export const metadata = {
  title: 'Returns & Refunds | BidCraft',
  description: 'How BidCraft protects your purchase with escrow, dispute windows, and secure refunds.',
}

export default function ReturnsPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-cream-base)]">
      <Navbar />
      <main className="flex-1">
        <section className="py-24 px-[var(--space-5)]">
          <div className="max-w-3xl mx-auto space-y-16">
            
            <div>
              <h1 className="text-display-xl font-display text-[var(--color-ink-900)] mb-6">Returns & Refunds</h1>
              
              <div className="space-y-10">
                <div>
                  <p className="text-[11px] tracking-[0.2em] uppercase text-[#B06A42] font-semibold mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    How BidCraft Protects Your Purchase
                  </p>
                  <div aria-hidden className="border-t border-[#D8C8BA] mb-6" />

                  <div className="space-y-8 text-body-lg text-[var(--color-ink-700)]">
                    <div>
                      <h3 className="font-semibold text-[var(--color-ink-900)] mb-2">Escrow Payment</h3>
                      <p>Your payment is held securely until you confirm receipt of your order. The seller is paid only after delivery is confirmed.</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-[var(--color-ink-900)] mb-2">48-Hour Dispute Window</h3>
                      <p>After delivery, you have 48 hours to raise a dispute if the item does not match the listing description.</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-[var(--color-ink-900)] mb-2">BidCraft Review Process</h3>
                      <p>Our team reviews all disputes within 2 business days. We examine listing photos, seller claims, and buyer evidence.</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-[var(--color-ink-900)] mb-2">Refunds</h3>
                      <p>Approved refunds are returned to your original payment method within 5–7 business days.</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-[var(--color-ink-900)] mb-2">No Refund: Change of Mind</h3>
                      <p>We do not process refunds for change-of-mind purchases. Please review listings carefully before purchasing.</p>
                    </div>
                  </div>
                </div>

                <div aria-hidden className="border-t border-[#D8C8BA] mb-6" />
                <p className="text-body-lg text-[var(--color-ink-700)]">
                  For disputes or questions: <a href="mailto:support@bidcraft.in" className="text-[#B06A42] hover:underline">support@bidcraft.in</a>
                </p>
              </div>
            </div>

          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
