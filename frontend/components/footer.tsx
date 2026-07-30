import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-[var(--color-slate-900)] text-[var(--color-cream-base)] pt-16 pb-8 px-[var(--space-5)] xl:px-[var(--space-8)] mt-24">
      

      <div className="w-full max-w-[var(--container-max)] mx-auto mb-16 border-b border-[var(--color-slate-700)] pb-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <Link href="/" className="text-display-xl font-display text-white">
            BidCraft
          </Link>
          <p className="text-body-lg text-[var(--color-ink-300)] max-w-md md:text-right">
            The premium creator-first marketplace for handmade goods, art, collectibles, auctions, and trades.
          </p>
        </div>

        {/* Integrated Help Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 pb-12 border-b border-[var(--color-slate-700)]">
          <div>
            <h3 className="text-heading-sm font-semibold text-white mb-2">We're here to help</h3>
            <p className="text-body-md text-stone-300">For support or creator enquiries, reach out anytime.</p>
          </div>
          <Link href="/contact" className="mt-4 md:mt-0 text-white underline hover:text-[var(--color-terracotta-400)] transition-colors text-body-md font-semibold">
            Open Contact Form &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
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
          Questions? Visit our <Link href="/contact" className="hover:text-white transition-colors">Contact Page</Link>
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
