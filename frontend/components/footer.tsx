import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-[var(--color-slate-900)] text-[var(--color-white)] pt-16 pb-8 px-[var(--space-5)] xl:px-[var(--space-8)] mt-24">
      <div className="w-full max-w-[var(--container-max)] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-16">
        
        {/* Brand Column */}
        <div className="lg:col-span-1">
          <Link href="/" className="text-display-md font-display text-white mb-4 block">
            BidCraft
          </Link>
          <p className="text-body-md text-white/70 mb-6">
            The premium creator-first marketplace for handmade goods, art, collectibles, auctions, and trades.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-white/70 hover:text-white transition-colors" aria-label="Instagram">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01" />
              </svg>
            </Link>
            <Link href="#" className="text-white/70 hover:text-white transition-colors" aria-label="Twitter">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
              </svg>
            </Link>
            <Link href="#" className="text-white/70 hover:text-white transition-colors" aria-label="Facebook">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Marketplace */}
        <div>
          <h4 className="text-heading-sm font-semibold mb-4">Marketplace</h4>
          <ul className="space-y-3">
            <li><Link href="/category/art" className="text-body-md text-white/70 hover:text-white hover:underline decoration-[var(--color-terracotta-600)] transition-all">Art</Link></li>
            <li><Link href="/category/crafts" className="text-body-md text-white/70 hover:text-white hover:underline decoration-[var(--color-terracotta-600)] transition-all">Crafts</Link></li>
            <li><Link href="/category/collectibles" className="text-body-md text-white/70 hover:text-white hover:underline decoration-[var(--color-terracotta-600)] transition-all">Collectibles</Link></li>
            <li><Link href="/category/hot-wheels" className="text-body-md text-white/70 hover:text-white hover:underline decoration-[var(--color-terracotta-600)] transition-all">Hot Wheels</Link></li>
            <li><Link href="/auctions" className="text-body-md text-white/70 hover:text-white hover:underline decoration-[var(--color-terracotta-600)] transition-all">Live Auctions</Link></li>
          </ul>
        </div>

        {/* Sell */}
        <div>
          <h4 className="text-heading-sm font-semibold mb-4">Sell</h4>
          <ul className="space-y-3">
            <li><Link href="/sell" className="text-body-md text-white/70 hover:text-white hover:underline decoration-[var(--color-terracotta-600)] transition-all">Start Selling</Link></li>
            <li><Link href="/creator-tools" className="text-body-md text-white/70 hover:text-white hover:underline decoration-[var(--color-terracotta-600)] transition-all">Creator Tools</Link></li>
            <li><Link href="/fees" className="text-body-md text-white/70 hover:text-white hover:underline decoration-[var(--color-terracotta-600)] transition-all">Fees & Pricing</Link></li>
            <li><Link href="/community" className="text-body-md text-white/70 hover:text-white hover:underline decoration-[var(--color-terracotta-600)] transition-all">Seller Community</Link></li>
          </ul>
        </div>

        {/* Trust & Support */}
        <div>
          <h4 className="text-heading-sm font-semibold mb-4">Trust & Support</h4>
          <ul className="space-y-3">
            <li><Link href="/escrow" className="text-body-md text-white/70 hover:text-white hover:underline decoration-[var(--color-terracotta-600)] transition-all">How Escrow Works</Link></li>
            <li><Link href="/buyer-protection" className="text-body-md text-white/70 hover:text-white hover:underline decoration-[var(--color-terracotta-600)] transition-all">Buyer Protection</Link></li>
            <li><Link href="/help" className="text-body-md text-white/70 hover:text-white hover:underline decoration-[var(--color-terracotta-600)] transition-all">Help Center</Link></li>
            <li><a href="mailto:hello@bidcraft.in" className="text-body-md text-white/70 hover:text-white hover:underline decoration-[var(--color-terracotta-600)] transition-all">Contact Us</a></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-heading-sm font-semibold mb-4">Company</h4>
          <ul className="space-y-3">
            <li><Link href="/about" className="text-body-md text-white/70 hover:text-white hover:underline decoration-[var(--color-terracotta-600)] transition-all">About Us</Link></li>
            <li><Link href="/careers" className="text-body-md text-white/70 hover:text-white hover:underline decoration-[var(--color-terracotta-600)] transition-all">Careers</Link></li>
            <li><Link href="/press" className="text-body-md text-white/70 hover:text-white hover:underline decoration-[var(--color-terracotta-600)] transition-all">Press</Link></li>
            <li><Link href="/blog" className="text-body-md text-white/70 hover:text-white hover:underline decoration-[var(--color-terracotta-600)] transition-all">Blog</Link></li>
          </ul>
        </div>
      </div>

      <div className="w-full max-w-[var(--container-max)] mx-auto border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-caption text-white/50">
          © {new Date().getFullYear()} BidCraft. All rights reserved.
        </p>
        <p className="text-caption text-white/70 text-center">
          Questions? Email us at <a href="mailto:hello@bidcraft.in" className="hover:text-white hover:underline decoration-[var(--color-terracotta-600)] transition-colors">hello@bidcraft.in</a> · Instagram <a href="#" className="hover:text-white hover:underline decoration-[var(--color-terracotta-600)] transition-colors">@bidcraft.in</a>
        </p>
        <div className="flex gap-6">
          <Link href="/privacy" className="text-caption text-white/50 hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="text-caption text-white/50 hover:text-white transition-colors">Terms of Service</Link>
          <Link href="/cookies" className="text-caption text-white/50 hover:text-white transition-colors">Cookie Settings</Link>
        </div>
      </div>
    </footer>
  )
}
