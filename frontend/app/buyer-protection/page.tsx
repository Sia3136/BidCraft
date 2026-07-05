import React from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

export default function BuyerProtectionPage() {
  return (
    <div className="bg-[var(--color-cream-base)] min-h-screen">
      <Navbar />
      <main className="max-w-[var(--container-max)] mx-auto px-[var(--space-5)] xl:px-[var(--space-8)] py-24 pt-32">
        <h1 className="text-display-xl font-display text-[var(--color-ink-900)] mb-12">Buyer Protection</h1>
        
        <div className="space-y-6 max-w-3xl">
          <ul className="list-disc pl-6 space-y-6 text-body-lg text-[var(--color-ink-700)]">
            <li>Every purchase is escrow-protected — you don't lose money if the seller doesn't ship.</li>
            <li>If the item is significantly not as described, you can raise a dispute within 7 days of delivery.</li>
            <li>We do not guarantee authenticity of collectibles at this stage — for items like Trading Cards, Hot Wheels, and Funko Pops, BidCraft relies on seller verification and community reporting.</li>
            <li>BidCraft's "Verified Creator" badge means the seller's identity has been confirmed, not that individual items have been authenticated.</li>
            <li>Contact <a href="mailto:disputes@bidcraft.in" className="text-[var(--color-terracotta-600)] hover:underline font-semibold">disputes@bidcraft.in</a> for any open order issue.</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
}
