import React from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[var(--color-cream-base)] min-h-screen">
      <Navbar />
      <main className="max-w-[var(--container-max)] mx-auto px-[var(--space-5)] xl:px-[var(--space-8)] py-24 pt-32">
        <h1 className="text-display-xl font-display text-[var(--color-ink-900)] mb-4">Privacy Policy</h1>
        <p className="text-body-md text-[var(--color-ink-500)] mb-12">Last updated: July 2026</p>
        
        <div className="space-y-12 max-w-3xl">
          <section>
            <h2 className="text-heading-lg text-[var(--color-ink-900)] mb-4">1. What we collect</h2>
            <p className="text-body-lg text-[var(--color-ink-700)]">Name, email, mobile number at signup. Browsing behaviour on the platform (pages visited, listings viewed). Purchase and bid history for logged-in users. Voluntarily submitted content (listings, reviews, messages).</p>
          </section>

          <section>
            <h2 className="text-heading-lg text-[var(--color-ink-900)] mb-4">2. How we use it</h2>
            <p className="text-body-lg text-[var(--color-ink-700)]">To process transactions and manage escrow holds. To show relevant listings and personalised recommendations. To send auction alerts and order updates (opt-in). To detect and prevent fraud.</p>
          </section>

          <section>
            <h2 className="text-heading-lg text-[var(--color-ink-900)] mb-4">3. What we do not do</h2>
            <p className="text-body-lg text-[var(--color-ink-700)]">We do not sell your personal data to third parties. We do not serve third-party ads or allow advertisers to target you on BidCraft. We do not share your data with other users beyond what is needed to complete a transaction (e.g. seller receives buyer's city for shipping, not full address until order confirmed).</p>
          </section>

          <section>
            <h2 className="text-heading-lg text-[var(--color-ink-900)] mb-4">4. Cookies</h2>
            <p className="text-body-lg text-[var(--color-ink-700)]">We use cookies for session management, cart persistence, and analytics. No third-party advertising cookies.</p>
          </section>

          <section>
            <h2 className="text-heading-lg text-[var(--color-ink-900)] mb-4">5. Data retention</h2>
            <p className="text-body-lg text-[var(--color-ink-700)]">Account data is retained while your account is active. Deleted accounts have data removed within 30 days, except transaction records required for legal compliance (retained 7 years per Indian law).</p>
          </section>

          <section>
            <h2 className="text-heading-lg text-[var(--color-ink-900)] mb-4">6. Your rights</h2>
            <p className="text-body-lg text-[var(--color-ink-700)]">You may request a copy of your data, correction of inaccurate data, or deletion of your account by emailing privacy@bidcraft.in.</p>
          </section>

          <section>
            <h2 className="text-heading-lg text-[var(--color-ink-900)] mb-4">7. Security</h2>
            <p className="text-body-lg text-[var(--color-ink-700)]">Payments are processed through Razorpay (PCI-DSS compliant). Escrow funds are held in a designated account. We use HTTPS for all data in transit.</p>
          </section>

          <section>
            <h2 className="text-heading-lg text-[var(--color-ink-900)] mb-4">8. Contact</h2>
            <p className="text-body-lg text-[var(--color-ink-700)]">privacy@bidcraft.in</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
