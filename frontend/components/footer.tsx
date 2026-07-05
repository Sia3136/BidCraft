import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-[var(--color-slate-900)] text-[var(--color-cream-base)] pt-16 pb-8 px-[var(--space-5)] xl:px-[var(--space-8)] mt-24">
      
      {/* Contact Block */}
      <div className="w-full max-w-[var(--container-max)] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[var(--color-slate-700)] pb-16 mb-16 gap-8">
        <div>
          <h2 className="text-display-lg font-display mb-4 text-white">
            We're here to help
          </h2>
          <p className="text-body-lg text-white/70 mb-4 max-w-xl">
            For general support, business enquiries, or creator assistance, reach out to us at our single point of contact.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-body-lg text-white/80">
            <span>Email: <a href="mailto:support@bidcraft.in" className="text-white font-semibold hover:text-[var(--color-terracotta-600)] transition-colors">support@bidcraft.in</a></span>
            <span>Instagram: <a href="#" className="text-white font-semibold hover:text-[var(--color-terracotta-600)] transition-colors">@bidcraft.in</a></span>
          </div>
        </div>
        <Link href="/contact" className="h-14 px-8 flex items-center justify-center bg-[var(--color-terracotta-600)] text-white text-body-lg font-bold rounded-[var(--radius-md)] hover:bg-[var(--color-terracotta-700)] transition-colors whitespace-nowrap">
          Open Contact Form
        </Link>
      </div>

      <div className="w-full max-w-[var(--container-max)] mx-auto mb-16 border-b border-[var(--color-slate-700)] pb-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <Link href="/" className="text-display-xl font-display text-white">
            BidCraft
          </Link>
          <p className="text-body-lg text-[var(--color-ink-300)] max-w-md md:text-right">
            The premium creator-first marketplace for handmade goods, art, collectibles, auctions, and trades.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Marketplace */}
          <div>
            <h4 className="text-heading-sm font-semibold mb-6 text-white">Marketplace</h4>
            <ul className="space-y-4">
              <li><Link href="/category/art" className="text-body-md text-[var(--color-ink-300)] hover:text-white transition-colors">Art</Link></li>
              <li><Link href="/category/crafts" className="text-body-md text-[var(--color-ink-300)] hover:text-white transition-colors">Crafts</Link></li>
              <li><Link href="/category/collectibles" className="text-body-md text-[var(--color-ink-300)] hover:text-white transition-colors">Collectibles</Link></li>
              <li><Link href="/category/hot-wheels" className="text-body-md text-[var(--color-ink-300)] hover:text-white transition-colors">Hot Wheels</Link></li>
              <li><Link href="/explore?type=auction" className="text-body-md text-[var(--color-ink-300)] hover:text-white transition-colors">Live Auctions</Link></li>
            </ul>
          </div>

          {/* Sell */}
          <div>
            <h4 className="text-heading-sm font-semibold mb-6 text-white">Sell</h4>
            <ul className="space-y-4">
              <li><Link href="/sell" className="text-body-md text-[var(--color-ink-300)] hover:text-white transition-colors">Start Selling</Link></li>
              <li><Link href="/creator-tools" className="text-body-md text-[var(--color-ink-300)] hover:text-white transition-colors">Creator Tools</Link></li>
              <li><Link href="/fees" className="text-body-md text-[var(--color-ink-300)] hover:text-white transition-colors">Fees & Pricing</Link></li>
              <li><Link href="/community" className="text-body-md text-[var(--color-ink-300)] hover:text-white transition-colors">Seller Community</Link></li>
            </ul>
          </div>

          {/* Trust & Support */}
          <div>
            <h4 className="text-heading-sm font-semibold mb-6 text-white">Trust & Support</h4>
            <ul className="space-y-4">
              <li><Link href="/escrow" className="text-body-md text-[var(--color-ink-300)] hover:text-white transition-colors">How Escrow Works</Link></li>
              <li><Link href="/buyer-protection" className="text-body-md text-[var(--color-ink-300)] hover:text-white transition-colors">Buyer Protection</Link></li>
              <li><Link href="/help" className="text-body-md text-[var(--color-ink-300)] hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="/contact" className="text-body-md text-[var(--color-ink-300)] hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-heading-sm font-semibold mb-6 text-white">Company</h4>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-body-md text-[var(--color-ink-300)] hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="text-body-md text-[var(--color-ink-300)] hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="/press" className="text-body-md text-[var(--color-ink-300)] hover:text-white transition-colors">Press</Link></li>
              <li><Link href="/blog" className="text-body-md text-[var(--color-ink-300)] hover:text-white transition-colors">Blog</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[var(--container-max)] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-caption text-[var(--color-ink-300)]">
          © 2026 BidCraft. All rights reserved.
        </p>
        <p className="text-caption text-[var(--color-ink-300)] text-center">
          Questions? Email <a href="mailto:support@bidcraft.in" className="hover:text-white transition-colors">support@bidcraft.in</a> · Instagram <a href="#" className="hover:text-white transition-colors">@bidcraft.in</a>
        </p>
        <div className="flex gap-6">
          <Link href="/privacy" className="text-caption text-[var(--color-ink-300)] hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="text-caption text-[var(--color-ink-300)] hover:text-white transition-colors">Terms of Service</Link>
          <Link href="/cookies" className="text-caption text-[var(--color-ink-300)] hover:text-white transition-colors">Cookie Settings</Link>
        </div>
      </div>
    </footer>
  )
}
