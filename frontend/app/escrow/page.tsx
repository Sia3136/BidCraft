import React from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

export default function EscrowPage() {
  return (
    <div className="bg-[var(--color-cream-base)] min-h-screen">
      <Navbar />
      <main className="max-w-[var(--container-max)] mx-auto px-[var(--space-5)] xl:px-[var(--space-8)] py-24 pt-32">
        <h1 className="text-display-xl font-display text-[var(--color-ink-900)] mb-12">How Escrow Works on BidCraft</h1>
        
        <div className="space-y-12 max-w-3xl">
          <section className="p-8 bg-[var(--color-cream-raised)] rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)]">
            <h2 className="text-heading-lg text-[var(--color-ink-900)] mb-4">Step 1 — Buyer pays</h2>
            <p className="text-body-lg text-[var(--color-ink-700)]">When you Buy Now, Make an Offer, or win an Auction, your payment goes to BidCraft's escrow hold — not to the seller.</p>
          </section>

          <section className="p-8 bg-[var(--color-cream-raised)] rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)]">
            <h2 className="text-heading-lg text-[var(--color-ink-900)] mb-4">Step 2 — Seller ships</h2>
            <p className="text-body-lg text-[var(--color-ink-700)]">The seller is notified to ship and must upload a tracking number within 3 business days. Failure to ship results in a full refund to the buyer.</p>
          </section>

          <section className="p-8 bg-[var(--color-cream-raised)] rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)]">
            <h2 className="text-heading-lg text-[var(--color-ink-900)] mb-4">Step 3 — Delivery</h2>
            <p className="text-body-lg text-[var(--color-ink-700)]">You receive the item. You have 7 days from the tracking-confirmed delivery date to inspect it.</p>
          </section>

          <section className="p-8 bg-[var(--color-cream-raised)] rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)]">
            <h2 className="text-heading-lg text-[var(--color-ink-900)] mb-4">Step 4 — You confirm</h2>
            <p className="text-body-lg text-[var(--color-ink-700)]">You press "Confirm Delivery" in your order dashboard. Funds are released to the seller within 24 hours.</p>
          </section>

          <section className="p-8 bg-[var(--color-cream-raised)] rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)]">
            <h2 className="text-heading-lg text-[var(--color-ink-900)] mb-4">Step 5 — If there's a problem</h2>
            <p className="text-body-lg text-[var(--color-ink-700)]">You raise a dispute within 7 days. BidCraft reviews the case and either extends the hold, issues a partial refund, or issues a full refund. Our decision is final at MVP stage.</p>
          </section>
          
          <div className="p-6 bg-[var(--color-warning-50)] text-[var(--color-warning-900)] rounded-[var(--radius-md)] mt-12 border border-[var(--color-warning-200)]">
            <p className="text-body-md italic">
              Note: BidCraft is an early-stage platform. Our escrow is currently simulated — funds are managed manually by our team and not held by a regulated NBFC or bank. We are working toward a fully regulated escrow model as we grow.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
