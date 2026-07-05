import React from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

export default function TermsOfServicePage() {
  return (
    <div className="bg-[var(--color-cream-base)] min-h-screen">
      <Navbar />
      <main className="max-w-[var(--container-max)] mx-auto px-[var(--space-5)] xl:px-[var(--space-8)] py-24 pt-32">
        <h1 className="text-display-xl font-display text-[var(--color-ink-900)] mb-4">Terms of Service</h1>
        <p className="text-body-md text-[var(--color-ink-500)] mb-12">Last updated: July 2026</p>
        
        <div className="space-y-12 max-w-3xl">
          <section>
            <h2 className="text-heading-lg text-[var(--color-ink-900)] mb-4">1. Who we are</h2>
            <p className="text-body-lg text-[var(--color-ink-700)]">BidCraft is an online marketplace connecting independent creators, artists, and collectors in India. We facilitate transactions but are not a party to the sale contract between buyer and seller.</p>
          </section>

          <section>
            <h2 className="text-heading-lg text-[var(--color-ink-900)] mb-4">2. Eligibility</h2>
            <p className="text-body-lg text-[var(--color-ink-700)]">Users must be 18 or older. By creating an account you confirm you are 18+.</p>
          </section>

          <section>
            <h2 className="text-heading-lg text-[var(--color-ink-900)] mb-4">3. Listings</h2>
            <p className="text-body-lg text-[var(--color-ink-700)]">Sellers are responsible for the accuracy of their listings. Prohibited items include: counterfeit goods, items violating intellectual property rights, illegal items under Indian law, live animals, weapons, alcohol, and tobacco. BidCraft reserves the right to remove any listing at its discretion.</p>
          </section>

          <section>
            <h2 className="text-heading-lg text-[var(--color-ink-900)] mb-4">4. Auctions</h2>
            <p className="text-body-lg text-[var(--color-ink-700)]">Placing a bid is a binding commitment. If you win an auction, you are obligated to complete the purchase. Bid retraction is not permitted except in cases of clear clerical error, subject to admin approval.</p>
          </section>

          <section>
            <h2 className="text-heading-lg text-[var(--color-ink-900)] mb-4">5. Escrow</h2>
            <p className="text-body-lg text-[var(--color-ink-700)]">Funds paid by the buyer are held by BidCraft in escrow until the buyer confirms delivery. If no confirmation is given within 7 days of the tracking showing delivered, funds are automatically released to the seller. Disputes must be raised within 7 days of the expected delivery date.</p>
          </section>

          <section>
            <h2 className="text-heading-lg text-[var(--color-ink-900)] mb-4">6. Fees</h2>
            <p className="text-body-lg text-[var(--color-ink-700)]">BidCraft charges a 5% platform fee on completed transactions, deducted from the seller's payout. Listing is free. No fee is charged on failed auctions.</p>
          </section>

          <section>
            <h2 className="text-heading-lg text-[var(--color-ink-900)] mb-4">7. Prohibited conduct</h2>
            <p className="text-body-lg text-[var(--color-ink-700)]">Creating fake listings, bid shilling, harassment of other users, and circumventing escrow by transacting off-platform are all grounds for permanent account suspension.</p>
          </section>

          <section>
            <h2 className="text-heading-lg text-[var(--color-ink-900)] mb-4">8. Limitation of liability</h2>
            <p className="text-body-lg text-[var(--color-ink-700)]">BidCraft is not liable for the quality, safety, or legality of listed items. Our liability is limited to the transaction value held in escrow at the time of a dispute.</p>
          </section>

          <section>
            <h2 className="text-heading-lg text-[var(--color-ink-900)] mb-4">9. Governing law</h2>
            <p className="text-body-lg text-[var(--color-ink-700)]">These terms are governed by the laws of India. Disputes will be subject to the jurisdiction of courts in Mumbai, Maharashtra.</p>
          </section>

          <section>
            <h2 className="text-heading-lg text-[var(--color-ink-900)] mb-4">10. Contact</h2>
            <p className="text-body-lg text-[var(--color-ink-700)]">legal@bidcraft.in</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
