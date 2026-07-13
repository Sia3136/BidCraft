const fs = require('fs');
const path = require('path');

const clientHomePath = path.join('C:', 'Bidcraft', 'frontend', 'components', 'client-home.tsx');
let clientHome = fs.readFileSync(clientHomePath, 'utf8');

// 1. Update featuredCreators stats
const oldCreators = `const featuredCreators = [
  { id: 1, name: 'Sneha Agarwal', specialty: 'Oil & Watercolour Paintings · Pune', bio: 'Capturing monsoons, marigolds, and memories through layered oil and watercolour canvases.', rating: '4.8', reviews: 91, followers: '634', verified: true, avatarInitials: 'SA', avatarBg: 'bg-[var(--color-terracotta-600)]', cover: '/images/dd5d9d9aaf49d3fac48af9d1b80001bb.jpg' },
  { id: 2, name: 'Vikram Rao', specialty: 'Stone & Clay Sculpture · Jaipur', bio: 'Shaping raw stone and clay into forms that carry the weight of Indian craft traditions.', rating: '4.6', reviews: 43, followers: '312', verified: true, avatarInitials: 'VR', avatarBg: 'bg-[var(--color-slate-700)]', cover: '/images/8891723f370ddd55a88b322a622406a2.jpg' },
  { id: 3, name: 'Aisha Malik', specialty: 'Handmade Jewellery · Hyderabad', bio: 'Crafting delicate silver and beadwork pieces rooted in Hyderabadi craft heritage.', rating: '4.7', reviews: 118, followers: '827', verified: true, avatarInitials: 'AM', avatarBg: 'bg-[var(--color-success-600)]', cover: '/images/d00d6edd9a33d14ce95b39d402b4e865.jpg' },
  { id: 4, name: 'Karan Sethi', specialty: 'Rare Collectibles & Vintage Finds · Mumbai', bio: 'Sourcing forgotten treasures — from vintage die-cast cars to first-edition comics — for serious collectors.', rating: '4.5', reviews: 67, followers: '489', verified: false, avatarInitials: 'KS', avatarBg: 'bg-[var(--color-ink-700)]', cover: '/images/1f92888deb74023c26ec86c954a18188.jpg' }
]`;
const newCreators = `const featuredCreators = [
  { id: 1, name: 'Sneha Agarwal', specialty: 'Oil & Watercolour Paintings · Pune', bio: 'Capturing monsoons, marigolds, and memories through layered oil and watercolour canvases.', rating: '4.9', reviews: 91, followers: '142', verified: true, avatarInitials: 'SA', avatarBg: 'bg-[var(--color-terracotta-600)]', cover: '/images/dd5d9d9aaf49d3fac48af9d1b80001bb.jpg' },
  { id: 2, name: 'Vikram Rao', specialty: 'Stone & Clay Sculpture · Jaipur', bio: 'Shaping raw stone and clay into forms that carry the weight of Indian craft traditions.', rating: '4.8', reviews: 43, followers: '89', verified: true, avatarInitials: 'VR', avatarBg: 'bg-[var(--color-slate-700)]', cover: '/images/8891723f370ddd55a88b322a622406a2.jpg' },
  { id: 3, name: 'Aisha Malik', specialty: 'Handmade Jewellery · Hyderabad', bio: 'Crafting delicate silver and beadwork pieces rooted in Hyderabadi craft heritage.', rating: '5.0', reviews: 118, followers: '175', verified: true, avatarInitials: 'AM', avatarBg: 'bg-[var(--color-success-600)]', cover: '/images/d00d6edd9a33d14ce95b39d402b4e865.jpg' },
  { id: 4, name: 'Karan Sethi', specialty: 'Rare Collectibles & Vintage Finds · Mumbai', bio: 'Sourcing forgotten treasures — from vintage die-cast cars to first-edition comics — for serious collectors.', rating: '4.7', reviews: 67, followers: '112', verified: false, avatarInitials: 'KS', avatarBg: 'bg-[var(--color-ink-700)]', cover: '/images/1f92888deb74023c26ec86c954a18188.jpg' }
]`;
clientHome = clientHome.replace(oldCreators, newCreators);

// 2. Update Our Story text
const oldStoryText1 = `BidCraft was built because a gap existed that no one in India had filled. Student creators, independent artists, and hobbyist collectors had nowhere safe to transact. Instagram generated interest but no trust. OLX and Facebook Marketplace moved money but enabled fraud. Etsy ignored the Indian context entirely. And every auction house in the country was designed for established names, not emerging ones.`;
const oldStoryText2 = `India's creator economy is projected to cross $1 trillion in consumer spending influence by 2030. Yet fewer than 10% of India's 3.5 to 4.5 million creators are monetizing effectively today — compared to 40% or more in mature markets. The under-served segment is not a niche. It is the majority. BidCraft exists to close that gap: a trust-first, auction-capable, escrow-protected marketplace built specifically for the ₹200–₹5,000 price range where most Indian creators actually operate.`;
const oldStoryText3 = `Our single biggest moat is not features. It is trust. Escrow-protected payments, verified creator profiles, buyer-confirmed delivery — these are not add-ons. They are the foundation. Everything else is built on top of them.`;

const newStoryText = `Every creation has a story. Every creator deserves a platform that values it.
              </p>
              <p className="text-body-lg text-[var(--color-cream-base)]/80 mb-6">
                BidCraft was built to bridge the gap between talented creators and people who truly appreciate their work. In a world where selling online often means uncertainty, we envisioned a marketplace where creativity is backed by trust, transparency, and opportunity—not risk.
              </p>
              <p className="text-body-lg text-[var(--color-cream-base)]/80 mb-6">
                Whether it's an artist's first handmade piece, a student's passion project, or a collector searching for something rare, BidCraft brings them together in one secure ecosystem. With verified creators, protected transactions, and a marketplace designed for discovery, we make buying, selling, and auctioning unique creations simple and reliable.
              </p>
              <p className="text-body-lg text-[var(--color-cream-base)]/80 mb-10">
                Our vision is to become the home of India's creative economy—where every creator, regardless of size or experience, has the confidence to showcase their talent, build their identity, and turn passion into lasting opportunity.`;

// We replace the block spanning the three old paragraphs.
const startStoryIdx = clientHome.indexOf(oldStoryText1);
const endStoryIdx = clientHome.indexOf(oldStoryText3) + oldStoryText3.length;
clientHome = clientHome.substring(0, startStoryIdx) + newStoryText + clientHome.substring(endStoryIdx);

// 3. Update New Arrivals
const oldNewArrivalsGrid = `<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-6 lg:gap-8 mb-10">
              {newArrivals.map((p, idx) => (
                <motion.div key={p.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariant}>
                  <ProductCard product={p} priority={idx < 4} />
                </motion.div>
              ))}
            </div>`;
const newNewArrivalsGrid = `<div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-4 sm:gap-6 lg:gap-8 pb-8 -mx-[var(--space-5)] px-[var(--space-5)] xl:mx-0 xl:px-0 mb-10">
              {newArrivals.map((p, idx) => (
                <div key={p.id} className="snap-start shrink-0 w-[280px] sm:w-[320px] lg:w-[calc(25%-24px)] min-w-[280px]">
                  <ProductCard product={p} priority={idx < 4} />
                </div>
              ))}
            </div>`;
clientHome = clientHome.replace(oldNewArrivalsGrid, newNewArrivalsGrid);

clientHome = clientHome.replace(
  'Explore All New Arrivals <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />',
  'Explore More Live Auctions'
);

// 4. Remove Duplicate Explore by Category
// It is section 9.
const exploreCatRegex = /\{\/\*\s*9\.\s*Explore by Category\s*\*\/\}\s*<section className="py-\[var\(--space-8\)\] px-\[var\(--space-5\)\] xl:px-\[var\(--space-8\)\] bg-\[var\(--color-cream-raised\)\] overflow-hidden">[\s\S]*?<\/section>\s*/;
clientHome = clientHome.replace(exploreCatRegex, '');

// 5. Remove Contact Us section
// It is section 14.
const contactRegex = /\{\/\*\s*14\.\s*Contact Us\s*\*\/\}\s*<section id="contact" className="py-24 px-\[var\(--space-5\)\] xl:px-\[var\(--space-8\)\] bg-\[var\(--color-cream-base\)\]">[\s\S]*?<\/section>\s*/;
clientHome = clientHome.replace(contactRegex, '');

// Remove unused import if necessary (ContactForm)
clientHome = clientHome.replace(/import { ContactForm } from '@\/components\/contact-form'[\r\n]+/, '');

fs.writeFileSync(clientHomePath, clientHome);
console.log('client-home.tsx updated');
