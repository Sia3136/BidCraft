const fs = require('fs');
const path = require('path');

const clientHomePath = path.join('C:', 'Bidcraft', 'frontend', 'components', 'client-home.tsx');
let clientHome = fs.readFileSync(clientHomePath, 'utf8');

// 1. "Our Story" section
// Replace Trust & Process section
const trustProcessStart = clientHome.indexOf('{/* 5. NEW: Trust & Process */}');
const trustProcessEnd = clientHome.indexOf('</section>', trustProcessStart) + '</section>'.length;

const ourStoryContent = `        {/* 5. Our Story */}
        <section id="our-story" className="w-full min-h-[480px] flex flex-col md:flex-row bg-[var(--color-slate-900)]">
          <div className="w-full md:w-1/2 h-[240px] md:h-auto relative bg-[var(--color-cream-deep)]">
            <Image src="/images/5f2ab26c880e06709387b842cdd1feef.webp" fill style={{ objectFit: 'cover', borderRadius: '0' }} alt="Our Story" />
          </div>
          <div className="w-full md:w-1/2 p-12 lg:p-24 flex flex-col justify-center text-left">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="max-w-md mx-auto md:mx-0">
              <h2 className="text-display-lg text-[var(--color-cream-base)] mb-6">Our Story</h2>
              <p className="text-body-lg text-[var(--color-cream-base)]/80 mb-6">
                BidCraft was built because a gap existed that no one in India had filled. Student creators, independent artists, and hobbyist collectors had nowhere safe to transact. Instagram generated interest but no trust. OLX and Facebook Marketplace moved money but enabled fraud. Etsy ignored the Indian context entirely. And every auction house in the country was designed for established names, not emerging ones.
              </p>
              <p className="text-body-lg text-[var(--color-cream-base)]/80 mb-6">
                India's creator economy is projected to cross $1 trillion in consumer spending influence by 2030. Yet fewer than 10% of India's 3.5 to 4.5 million creators are monetizing effectively today — compared to 40% or more in mature markets. The under-served segment is not a niche. It is the majority. BidCraft exists to close that gap: a trust-first, auction-capable, escrow-protected marketplace built specifically for the ₹200–₹5,000 price range where most Indian creators actually operate.
              </p>
              <p className="text-body-lg text-[var(--color-cream-base)]/80 mb-10">
                Our single biggest moat is not features. It is trust. Escrow-protected payments, verified creator profiles, buyer-confirmed delivery — these are not add-ons. They are the foundation. Everything else is built on top of them.
              </p>
              <Link href="/our-story" className="inline-block bg-[var(--color-terracotta-600)] text-white text-body-md font-semibold px-8 py-3.5 rounded-[var(--radius-md)] hover:bg-[var(--color-terracotta-700)] transition-colors duration-fast">
                Read Our Full Story
              </Link>
            </motion.div>
          </div>
        </section>`;

clientHome = clientHome.substring(0, trustProcessStart) + ourStoryContent + clientHome.substring(trustProcessEnd);

// 6. Remove Collector Spotlight - add "Explore by Category" section
const collectorSpotlightStart = clientHome.indexOf('{/* 9. Collector Spotlight */}');
const collectorSpotlightEnd = clientHome.indexOf('</section>', collectorSpotlightStart) + '</section>'.length;

const exploreByCategoryContent = `        {/* 9. Explore by Category */}
        <section className="py-[var(--space-8)] px-[var(--space-5)] xl:px-[var(--space-8)] bg-[var(--color-cream-raised)] overflow-hidden">
          <div className="max-w-[var(--container-max)] mx-auto">
            <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant} className="text-display-lg text-[var(--color-ink-900)] text-center mb-12">
              Explore by Category
            </motion.h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { name: 'Art', img: '/images/4cf20961ee9c8dccc7dfb51c2f561af8.jpg', slug: 'art', count: '5 subcategories' },
                { name: 'Handmade & Crafts', img: '/images/04809f445775b05edf65772b67c139d9.jpg', slug: 'handmade-crafts', count: '5 subcategories' },
                { name: 'Collectibles', img: '/images/4256f8dcb8f244ba618721219f550054.jpg', slug: 'collectibles', count: '5 subcategories' },
                { name: 'Gaming & Hobby', img: '/images/5139a72a8fd930206d06b40689c6e35c.jpg', slug: 'gaming-hobby', count: '4 subcategories' },
                { name: 'Lifestyle & Gifts', img: '/images/7f69e85a737d75f85a041d457c9be525.jpg', slug: 'lifestyle-gifts', count: '4 subcategories' }
              ].map((cat) => (
                <Link key={cat.name} href={\`/explore?category=\${cat.slug}\`} className="group relative h-[220px] rounded-[var(--radius-lg)] overflow-hidden block transition-transform duration-200 ease-in-out hover:scale-[1.02]">
                  <Image src={cat.img} fill style={{ objectFit: 'cover' }} alt={cat.name} className="z-0" />
                  <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(to top, rgba(43,42,40,0.55) 0%, rgba(43,42,40,0) 100%)' }} />
                  <div className="absolute bottom-4 left-4 z-20">
                    <h3 className="text-heading-md font-[var(--font-display)] text-white mb-1">{cat.name}</h3>
                    <p className="text-caption font-[var(--font-ui)] text-[var(--color-ink-300)]">{cat.count}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>`;

clientHome = clientHome.substring(0, collectorSpotlightStart) + exploreByCategoryContent + clientHome.substring(collectorSpotlightEnd);

// 7. Community Voices - larger circular images
clientHome = clientHome.replace(/width=\{64\}/g, 'width={96}');
clientHome = clientHome.replace(/height=\{64\}/g, 'height={96}');
clientHome = clientHome.replace(/w-\[64px\] h-\[64px\] min-w-\[64px\]/g, 'w-[96px] h-[96px] min-w-[96px]');

// 8. "Turn your craft into a livelihood" - Start Selling redirect
clientHome = clientHome.replace(/href="\/seller\/register"/g, 'href="/sell"');

// 9. Contact Us replacing newsletter
// We'll append Contact Us to the end of the sections in client-home.tsx
const mainEnd = clientHome.lastIndexOf('</main>');

const contactUsContent = `
        {/* 14. Contact Us */}
        <section id="contact" className="py-24 px-[var(--space-5)] xl:px-[var(--space-8)] bg-[var(--color-cream-base)]">
          <div className="max-w-[var(--container-max)] mx-auto flex flex-col lg:flex-row gap-12 lg:gap-16">
            <div className="w-full lg:w-1/2">
              <h2 className="text-display-lg text-[var(--color-ink-900)] mb-8">Contact Us</h2>
              <form className="flex flex-col gap-4">
                <div>
                  <label className="block text-body-md font-semibold text-[var(--color-ink-900)] mb-2">Name</label>
                  <input type="text" className="w-full h-12 px-4 border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] outline-none focus:border-[var(--color-terracotta-600)]" required />
                </div>
                <div>
                  <label className="block text-body-md font-semibold text-[var(--color-ink-900)] mb-2">Email</label>
                  <input type="email" className="w-full h-12 px-4 border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] outline-none focus:border-[var(--color-terracotta-600)]" required />
                </div>
                <div>
                  <label className="block text-body-md font-semibold text-[var(--color-ink-900)] mb-2">Subject</label>
                  <select className="w-full h-12 px-4 border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] outline-none focus:border-[var(--color-terracotta-600)] bg-white cursor-pointer" required>
                    <option value="" disabled selected>Select an option</option>
                    <option>General Enquiry</option>
                    <option>Seller Support</option>
                    <option>Buyer Issue</option>
                    <option>Report a Listing</option>
                    <option>Press & Media</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-body-md font-semibold text-[var(--color-ink-900)] mb-2">Message</label>
                  <textarea rows="4" className="w-full p-4 border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] outline-none focus:border-[var(--color-terracotta-600)] resize-none" required></textarea>
                </div>
                <button type="submit" className="mt-2 h-12 bg-[var(--color-terracotta-600)] text-white font-bold rounded-[var(--radius-md)] hover:bg-[var(--color-terracotta-700)] transition-colors">
                  Send Message
                </button>
              </form>
            </div>
            
            <div className="w-full lg:w-1/2 flex flex-col justify-center gap-6">
              <div className="p-6 bg-[var(--color-cream-raised)] rounded-[var(--radius-md)]">
                <h3 className="text-heading-md text-[var(--color-ink-900)] mb-1">General</h3>
                <a href="mailto:support@bidcraft.in" className="text-body-lg text-[var(--color-terracotta-600)] font-semibold hover:underline">support@bidcraft.in</a>
              </div>
              <div className="p-6 bg-[var(--color-cream-raised)] rounded-[var(--radius-md)]">
                <h3 className="text-heading-md text-[var(--color-ink-900)] mb-1">Sellers</h3>
                <a href="mailto:sellers@bidcraft.in" className="text-body-lg text-[var(--color-terracotta-600)] font-semibold hover:underline">sellers@bidcraft.in</a>
              </div>
              <div className="p-6 bg-[var(--color-cream-raised)] rounded-[var(--radius-md)]">
                <h3 className="text-heading-md text-[var(--color-ink-900)] mb-1">Disputes</h3>
                <a href="mailto:disputes@bidcraft.in" className="text-body-lg text-[var(--color-terracotta-600)] font-semibold hover:underline">disputes@bidcraft.in</a>
              </div>
            </div>
          </div>
        </section>
`;
clientHome = clientHome.substring(0, mainEnd) + contactUsContent + clientHome.substring(mainEnd);

fs.writeFileSync(clientHomePath, clientHome);
console.log('client-home.tsx updated.');

// Rewrite footer.tsx
const footerPath = path.join('C:', 'Bidcraft', 'frontend', 'components', 'footer.tsx');
const footerContent = `import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-[var(--color-slate-900)] text-[var(--color-cream-base)] pt-16 pb-8 px-[var(--space-5)] xl:px-[var(--space-8)] mt-24">
      
      {/* Newsletter Block */}
      <div className="w-full max-w-[var(--container-max)] mx-auto text-center border-b border-[var(--color-slate-700)] pb-16 mb-16">
        <h2 className="text-display-lg font-display mb-4 text-white">
          Never miss a masterpiece
        </h2>
        <p className="text-body-md text-white/70 mb-8 max-w-xl mx-auto">
          Weekly curated drops, live auction alerts, and creator interviews.
        </p>
        <form className="flex gap-2 max-w-md mx-auto mb-4">
          <input type="email" placeholder="Email address" className="flex-1 h-12 rounded-[var(--radius-md)] px-4 bg-white/10 border border-[var(--color-slate-700)] text-white placeholder:text-white/40 outline-none focus:border-[var(--color-terracotta-600)] focus:bg-white/15 transition-all" required />
          <button type="submit" className="h-12 px-6 bg-[var(--color-terracotta-600)] text-white text-body-md font-semibold rounded-[var(--radius-md)] hover:bg-[var(--color-terracotta-700)] transition-colors whitespace-nowrap">
            Subscribe
          </button>
        </form>
        <p className="text-caption text-white/50">
          By subscribing, you agree to our Privacy Policy and consent to receive updates.
        </p>
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
              <li><a href="mailto:hello@bidcraft.in" className="text-body-md text-[var(--color-ink-300)] hover:text-white transition-colors">Contact Us</a></li>
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
          Questions? Email <a href="mailto:hello@bidcraft.in" className="hover:text-white transition-colors">hello@bidcraft.in</a> · Instagram <a href="#" className="hover:text-white transition-colors">@bidcraft.in</a>
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
`;
fs.writeFileSync(footerPath, footerContent);
console.log('footer.tsx updated.');
