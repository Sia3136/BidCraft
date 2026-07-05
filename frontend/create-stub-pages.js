const fs = require('fs');
const path = require('path');

const pages = {
  'sell': {
    title: 'Start Selling on BidCraft',
    content: `
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-display-lg font-display text-[var(--color-ink-900)] mb-8">Ready to start selling on BidCraft?</h1>
        <p className="text-body-lg text-[var(--color-ink-700)] mb-10">
          Join a community of Indian artisans, creators, and collectors who value authentic craftsmanship.
        </p>
        <div className="flex flex-col items-center gap-6">
          <Link href="/auth" className="bg-[var(--color-terracotta-600)] text-white text-body-lg font-bold px-10 py-4 rounded-[var(--radius-md)] hover:bg-[var(--color-terracotta-700)] transition-colors inline-block">
            Sign In to Start Selling
          </Link>
          <Link href="/auth?tab=register" className="text-body-md text-[var(--color-terracotta-600)] font-medium hover:underline">
            Don't have an account? Create one →
          </Link>
        </div>
      </div>
    `
  },
  'our-story': {
    title: 'Our Story',
    content: `
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-display-lg font-display text-[var(--color-ink-900)] mb-6">Our Story</h1>
        <p className="text-body-lg text-[var(--color-ink-700)]">
          This page will share the founding journey of BidCraft, exploring how we identified the gap in the Indian creator economy for a trust-first marketplace. It will detail our mission to empower artisans and collectors with secure, escrow-protected transactions and a platform designed specifically for emerging talent.
        </p>
      </div>
    `
  },
  'creator-tools': {
    title: 'Creator Tools',
    content: `
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-display-lg font-display text-[var(--color-ink-900)] mb-6">Creator Tools</h1>
        <p className="text-body-lg text-[var(--color-ink-700)]">
          Here you will find a comprehensive suite of tools designed to help sellers manage their inventory, track analytics, and optimize their listings. We are building powerful features to make running your creative business on BidCraft seamless and efficient.
        </p>
      </div>
    `
  },
  'fees': {
    title: 'Fees & Pricing',
    content: `
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-display-lg font-display text-[var(--color-ink-900)] mb-6">Fees & Pricing</h1>
        <p className="text-body-lg text-[var(--color-ink-700)]">
          This section will break down BidCraft's transparent fee structure, including listing fees, final value fees, and payment processing charges. We believe in keeping costs clear and fair so creators can maximize their earnings without hidden surprises.
        </p>
      </div>
    `
  },
  'community': {
    title: 'Seller Community',
    content: `
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-display-lg font-display text-[var(--color-ink-900)] mb-6">Seller Community</h1>
        <p className="text-body-lg text-[var(--color-ink-700)]">
          Welcome to the BidCraft Seller Community hub. This page will host forums, best practice guides, and peer-to-peer support networks where creators can share insights, collaborate, and learn how to grow their businesses together.
        </p>
      </div>
    `
  },
  'escrow': {
    title: 'How Escrow Works',
    content: `
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-display-lg font-display text-[var(--color-ink-900)] mb-6">How Escrow Works</h1>
        <p className="text-body-lg text-[var(--color-ink-700)]">
          Learn about our secure escrow payment system that protects both buyers and sellers. This page will explain the step-by-step process of how funds are held safely until the item is delivered and approved, ensuring total peace of mind for every transaction.
        </p>
      </div>
    `
  },
  'buyer-protection': {
    title: 'Buyer Protection',
    content: `
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-display-lg font-display text-[var(--color-ink-900)] mb-6">Buyer Protection</h1>
        <p className="text-body-lg text-[var(--color-ink-700)]">
          BidCraft's Buyer Protection policy ensures you get what you pay for. This page will detail the conditions under which you are eligible for a refund, the dispute resolution process, and our commitment to maintaining a fraud-free marketplace.
        </p>
      </div>
    `
  },
  'help': {
    title: 'Help Center',
    content: `
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-display-lg font-display text-[var(--color-ink-900)] mb-6">Help Center</h1>
        <p className="text-body-lg text-[var(--color-ink-700)]">
          Our Help Center is your go-to resource for frequently asked questions, troubleshooting guides, and customer support contact options. Whether you need help with an order, a listing, or your account, this section will provide the answers.
        </p>
      </div>
    `
  },
  'careers': {
    title: 'Careers',
    content: `
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-display-lg font-display text-[var(--color-ink-900)] mb-6">Careers at BidCraft</h1>
        <p className="text-body-lg text-[var(--color-ink-700)]">
          Join our mission to revolutionize the Indian creator economy. This page will list current job openings across engineering, design, marketing, and operations, and offer a glimpse into our company culture and core values.
        </p>
      </div>
    `
  },
  'press': {
    title: 'Press & Media',
    content: `
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-display-lg font-display text-[var(--color-ink-900)] mb-6">Press & Media</h1>
        <p className="text-body-lg text-[var(--color-ink-700)]">
          Access our latest press releases, media kits, and brand assets here. This section is designed for journalists and media professionals looking for official company news, statistics, and high-resolution logos.
        </p>
      </div>
    `
  },
  'blog': {
    title: 'BidCraft Blog',
    content: `
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-display-lg font-display text-[var(--color-ink-900)] mb-6">BidCraft Blog</h1>
        <p className="text-body-lg text-[var(--color-ink-700)]">
          Discover stories from our community, curated collections, and expert tips on collecting and crafting. The blog will feature deep dives into artisanal techniques, market trends, and creator spotlights to inspire your next purchase or project.
        </p>
      </div>
    `
  },
  'privacy': {
    title: 'Privacy Policy',
    content: `
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-display-lg font-display text-[var(--color-ink-900)] mb-6">Privacy Policy</h1>
        <p className="text-body-lg text-[var(--color-ink-700)]">
          We take your privacy seriously. This document will outline how we collect, use, and protect your personal data, detailing your rights and our obligations under applicable data protection laws.
        </p>
      </div>
    `
  },
  'terms': {
    title: 'Terms of Service',
    content: `
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-display-lg font-display text-[var(--color-ink-900)] mb-6">Terms of Service</h1>
        <p className="text-body-lg text-[var(--color-ink-700)]">
          These are the rules and guidelines that govern your use of BidCraft. The Terms of Service will define user responsibilities, acceptable use policies, and the legal agreement between you and the platform.
        </p>
      </div>
    `
  },
  'cookies': {
    title: 'Cookie Settings',
    content: `
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-display-lg font-display text-[var(--color-ink-900)] mb-6">Cookie Settings</h1>
        <p className="text-body-lg text-[var(--color-ink-700)]">
          Manage your cookie preferences and understand how we use tracking technologies. This page will allow you to opt in or out of specific non-essential cookies used for analytics and personalized experiences.
        </p>
      </div>
    `
  }
};

const baseDir = path.join('C:', 'Bidcraft', 'frontend', 'app');

for (const [route, data] of Object.entries(pages)) {
  const dirPath = path.join(baseDir, route);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  const pagePath = path.join(dirPath, 'page.tsx');
  const pageContent = `import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import Link from 'next/link'

export const metadata = {
  title: '${data.title} | BidCraft',
}

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-cream-base)]">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-24 px-[var(--space-5)]">
        ${data.content}
      </main>
      <Footer />
    </div>
  )
}
`;
  fs.writeFileSync(pagePath, pageContent);
}

// Redirect page for /category/hot-wheels
const hotWheelsDir = path.join(baseDir, 'category', 'hot-wheels');
if (!fs.existsSync(hotWheelsDir)) {
  fs.mkdirSync(hotWheelsDir, { recursive: true });
}
const hotWheelsPagePath = path.join(hotWheelsDir, 'page.tsx');
const hotWheelsContent = `import { redirect } from 'next/navigation'

export default function HotWheelsRedirect() {
  redirect('/explore?category=collectibles&subcategory=hot-wheels')
}
`;
fs.writeFileSync(hotWheelsPagePath, hotWheelsContent);

console.log('Stub pages created successfully.');
