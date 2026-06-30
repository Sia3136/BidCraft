'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

const Instagram = ({size=20, ...props}: any) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>;
const Twitter = ({size=20, ...props}: any) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>;
const Facebook = ({size=20, ...props}: any) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;
const Youtube = ({size=20, ...props}: any) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>;

const footerLinks = [
  {
    title: 'Marketplace',
    links: [
      { name: 'All Items', href: '#' },
      { name: 'Auctions', href: '#' },
      { name: 'Collections', href: '#' },
      { name: 'Categories', href: '#' },
    ],
  },
  {
    title: 'Sell',
    links: [
      { name: 'Start Selling', href: '#' },
      { name: 'Creator Resources', href: '#' },
      { name: 'Seller Dashboard', href: '#' },
      { name: 'Fees & Pricing', href: '#' },
    ],
  },
  {
    title: 'Trust & Support',
    links: [
      { name: 'How Escrow Works', href: '#' },
      { name: 'Buyer Protection', href: '#' },
      { name: 'Help Center', href: '#' },
      { name: 'Contact Us', href: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { name: 'About', href: '#' },
      { name: 'Blog', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Press', href: '#' },
    ],
  },
]

export function Footer() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }))
  }

  return (
    <footer className="bg-[var(--color-slate-900)] pt-[var(--space-9)] pb-[var(--space-7)] w-full">
      <div className="max-w-[var(--container-max)] mx-auto px-4 md:px-6 xl:px-6">
        
        {/* Top Section - Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-y-[var(--space-6)] gap-x-[var(--space-5)]">
          
          {/* Brand Column */}
          <div className="flex flex-col col-span-1 lg:col-span-1">
            <Link href="/">
              <span className="text-display-md text-white font-semibold tracking-[-0.01em]">BidCraft</span>
            </Link>
            <p className="text-body-md text-white/70 mt-[var(--space-2)]">
              The premier marketplace for unique creations and rare collectibles.
            </p>
            <div className="flex items-center gap-[16px] mt-[var(--space-4)]">
              {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="text-white hover:text-[var(--color-terracotta-600)] transition-colors duration-200"
                  aria-label="Social link"
                >
                  <Icon size={20} strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns (Desktop Grid, Mobile Accordion) */}
          <div className="col-span-1 lg:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-[var(--space-4)] gap-x-[var(--space-5)] lg:pl-12">
            {footerLinks.map((section) => (
              <div key={section.title} className="flex flex-col border-b border-white/10 lg:border-none pb-4 lg:pb-0">
                
                {/* Mobile Accordion Toggle / Desktop Header */}
                <button
                  onClick={() => toggleSection(section.title)}
                  className="flex items-center justify-between w-full lg:cursor-default lg:pointer-events-none"
                  aria-expanded={openSections[section.title]}
                >
                  <h3 className="text-heading-sm text-white font-semibold lg:mb-[var(--space-4)]">
                    {section.title}
                  </h3>
                  <div className="lg:hidden text-white/50">
                    {openSections[section.title] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </button>

                {/* Links List */}
                <ul
                  className={cn(
                    "flex flex-col gap-[12px] overflow-hidden lg:h-auto lg:mt-0 transition-all duration-250 ease-default",
                    openSections[section.title] ? "h-auto mt-4" : "h-0 lg:h-auto"
                  )}
                >
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-body-md text-white/70 hover:text-white hover:opacity-100 hover:underline decoration-[var(--color-terracotta-600)] decoration-2 transition-all duration-200"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-[var(--space-7)] pt-[var(--space-6)] border-t border-white/12 flex flex-col md:flex-row items-center justify-between gap-[var(--space-4)]">
          <p className="text-caption text-white/50">
            &copy; {new Date().getFullYear()} BidCraft. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-[24px]">
            {['Privacy Policy', 'Terms of Service', 'Cookie Settings'].map((item) => (
              <Link
                key={item}
                href="#"
                className="text-caption text-white/50 hover:text-white transition-colors duration-200"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  )
}
