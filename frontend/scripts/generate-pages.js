const fs = require('fs');
const path = require('path');

const writePage = (dir, content) => {
  const dirPath = path.join('C:', 'Bidcraft', 'frontend', 'app', dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  fs.writeFileSync(path.join(dirPath, 'page.tsx'), content);
};

// 1. Privacy Policy
writePage('privacy', `import React from 'react';
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
`);

// 2. Terms of Service
writePage('terms', `import React from 'react';
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
`);

// 3. Cookie Settings
writePage('cookies', `'use client'
import React, { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { cn } from '@/lib/utils';

export default function CookiesPage() {
  const [analytics, setAnalytics] = useState(true);
  const [preferences, setPreferences] = useState(true);

  return (
    <div className="bg-[var(--color-cream-base)] min-h-screen flex flex-col">
      <Navbar />
      <main className="max-w-[var(--container-max)] mx-auto px-[var(--space-5)] xl:px-[var(--space-8)] py-24 pt-32 flex-1">
        <h1 className="text-display-xl font-display text-[var(--color-ink-900)] mb-6">Cookie Settings</h1>
        <p className="text-body-lg text-[var(--color-ink-700)] mb-12 max-w-2xl">BidCraft uses the following types of cookies:</p>
        
        <div className="space-y-8 max-w-2xl">
          {/* Essential */}
          <div className="flex items-start justify-between gap-6 p-6 bg-[var(--color-cream-raised)] rounded-[var(--radius-md)] border border-[var(--color-border-subtle)]">
            <div>
              <h2 className="text-heading-md text-[var(--color-ink-900)] mb-2">Essential cookies</h2>
              <p className="text-body-md text-[var(--color-ink-700)]">Required for login sessions, cart, and security. Cannot be disabled.</p>
            </div>
            <div className="shrink-0 pt-1">
              <div className="w-12 h-6 rounded-full bg-[var(--color-ink-300)] opacity-50 relative cursor-not-allowed">
                <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-white transition-all" />
              </div>
            </div>
          </div>

          {/* Analytics */}
          <div className="flex items-start justify-between gap-6 p-6 bg-[var(--color-cream-raised)] rounded-[var(--radius-md)] border border-[var(--color-border-subtle)]">
            <div>
              <h2 className="text-heading-md text-[var(--color-ink-900)] mb-2">Analytics cookies</h2>
              <p className="text-body-md text-[var(--color-ink-700)]">We use anonymised analytics to understand which features are used and improve the platform. No personal data is shared.</p>
            </div>
            <div className="shrink-0 pt-1">
              <button 
                onClick={() => setAnalytics(!analytics)}
                className={cn("w-12 h-6 rounded-full relative transition-colors duration-200", analytics ? "bg-[var(--color-success-600)]" : "bg-[var(--color-ink-300)]")}
              >
                <div className={cn("absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-200", analytics ? "left-[26px]" : "left-1")} />
              </button>
            </div>
          </div>

          {/* Preference */}
          <div className="flex items-start justify-between gap-6 p-6 bg-[var(--color-cream-raised)] rounded-[var(--radius-md)] border border-[var(--color-border-subtle)]">
            <div>
              <h2 className="text-heading-md text-[var(--color-ink-900)] mb-2">Preference cookies</h2>
              <p className="text-body-md text-[var(--color-ink-700)]">Remembers your filter settings and recently viewed items.</p>
            </div>
            <div className="shrink-0 pt-1">
              <button 
                onClick={() => setPreferences(!preferences)}
                className={cn("w-12 h-6 rounded-full relative transition-colors duration-200", preferences ? "bg-[var(--color-success-600)]" : "bg-[var(--color-ink-300)]")}
              >
                <div className={cn("absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-200", preferences ? "left-[26px]" : "left-1")} />
              </button>
            </div>
          </div>

          <div className="pt-8">
            <button className="bg-[var(--color-terracotta-600)] text-white text-body-lg font-bold px-8 py-3 rounded-[var(--radius-md)] hover:bg-[var(--color-terracotta-700)] transition-colors">
              Save Preferences
            </button>
            <p className="text-caption text-[var(--color-ink-500)] mt-4">
              Note: Your preferences are saved in your browser. Clearing your browser data will reset these settings.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
`);

// 4. Escrow
writePage('escrow', `import React from 'react';
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
`);

// 5. Buyer Protection
writePage('buyer-protection', `import React from 'react';
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
`);

console.log("Pages generated successfully.");
