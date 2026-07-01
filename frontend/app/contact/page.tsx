'use client'

import React, { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Mail, Store, Shield, CheckCircle2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-[var(--color-cream-base)]">
      <Navbar />

      <main className="pt-[var(--space-9)] pb-[var(--space-10)] px-[var(--space-5)] w-full max-w-[var(--container-max)] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-12 lg:gap-16">
          
          {/* Left Column - Form / Success State */}
          <div>
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h1 className="text-display-md font-display text-[var(--color-ink-900)] mb-2">
                    Get in touch.
                  </h1>
                  <p className="text-body-lg text-[var(--color-ink-700)] mb-[var(--space-6)]">
                    We're a small team and we read every message.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-body-md text-[var(--color-ink-900)] font-medium mb-1.5">Name</label>
                      <input
                        type="text"
                        required
                        className="w-full h-[48px] bg-[var(--color-white)] border border-[var(--color-border-subtle)] rounded-[var(--radius-sm)] px-4 text-body-md text-[var(--color-ink-900)] focus:border-[var(--color-terracotta-600)] focus:shadow-[0_0_0_3px_rgba(200,100,58,0.12)] outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-body-md text-[var(--color-ink-900)] font-medium mb-1.5">Email</label>
                      <input
                        type="email"
                        required
                        className="w-full h-[48px] bg-[var(--color-white)] border border-[var(--color-border-subtle)] rounded-[var(--radius-sm)] px-4 text-body-md text-[var(--color-ink-900)] focus:border-[var(--color-terracotta-600)] focus:shadow-[0_0_0_3px_rgba(200,100,58,0.12)] outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-body-md text-[var(--color-ink-900)] font-medium mb-1.5">Subject</label>
                      <div className="relative">
                        <select
                          required
                          className="w-full h-[48px] bg-[var(--color-white)] border border-[var(--color-border-subtle)] rounded-[var(--radius-sm)] px-4 pr-10 text-body-md text-[var(--color-ink-900)] focus:border-[var(--color-terracotta-600)] focus:shadow-[0_0_0_3px_rgba(200,100,58,0.12)] outline-none transition-all appearance-none cursor-pointer"
                        >
                          <option value="" disabled selected hidden>Select a topic</option>
                          <option value="general">General Enquiry</option>
                          <option value="order">Order Issue</option>
                          <option value="seller">Seller Support</option>
                          <option value="report">Report a Listing</option>
                          <option value="press">Press & Partnerships</option>
                          <option value="other">Other</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-ink-500)]">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m6 9 6 6 6-6"/>
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-body-md text-[var(--color-ink-900)] font-medium mb-1.5">Message</label>
                      <textarea
                        required
                        className="w-full min-h-[140px] bg-[var(--color-white)] border border-[var(--color-border-subtle)] rounded-[var(--radius-sm)] p-4 text-body-md text-[var(--color-ink-900)] focus:border-[var(--color-terracotta-600)] focus:shadow-[0_0_0_3px_rgba(200,100,58,0.12)] outline-none transition-all resize-y"
                        placeholder="How can we help?"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full h-[48px] bg-[var(--color-terracotta-600)] text-white text-body-lg font-semibold rounded-[var(--radius-sm)] hover:bg-[var(--color-terracotta-700)] transition-colors mt-2"
                    >
                      Send Message
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center text-center py-12 px-6 h-full bg-[var(--color-white)] rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] shadow-sm"
                >
                  <CheckCircle2 className="w-16 h-16 text-[var(--color-success-600)] mb-4" strokeWidth={1.5} />
                  <h2 className="text-display-md font-display text-[var(--color-ink-900)] mb-2">Message received.</h2>
                  <p className="text-body-lg text-[var(--color-ink-700)] mb-[var(--space-6)] max-w-[320px]">
                    We'll get back to you within 24 hours. Keep an eye on your inbox.
                  </p>
                  <Link 
                    href="/"
                    className="px-6 py-3 border-[1.5px] border-[var(--color-border-subtle)] text-[var(--color-ink-900)] text-body-md font-semibold rounded-[var(--radius-md)] hover:bg-[var(--color-cream-raised)] hover:border-[var(--color-ink-300)] transition-colors"
                  >
                    Back to Home
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column - Info Cards */}
          <div className="flex flex-col gap-[var(--space-4)] lg:mt-[72px]">
            
            <div className="bg-[var(--color-cream-raised)] rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-[var(--space-5)] border border-[var(--color-border-subtle)]/50">
              <Mail className="w-[24px] h-[24px] text-[var(--color-terracotta-600)] mb-3" strokeWidth={1.5} />
              <h3 className="text-heading-sm text-[var(--color-ink-900)] mb-1">Email Support</h3>
              <p className="text-body-md text-[var(--color-ink-700)]">
                support@bidcraft.in <br/>
                Typically replies within 24 hours.
              </p>
            </div>

            <div className="bg-[var(--color-cream-raised)] rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-[var(--space-5)] border border-[var(--color-border-subtle)]/50">
              <Store className="w-[24px] h-[24px] text-[var(--color-terracotta-600)] mb-3" strokeWidth={1.5} />
              <h3 className="text-heading-sm text-[var(--color-ink-900)] mb-1">Seller Queries</h3>
              <p className="text-body-md text-[var(--color-ink-700)]">
                sellers@bidcraft.in <br/>
                For listing, payouts, and account questions.
              </p>
            </div>

            <div className="bg-[var(--color-cream-raised)] rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-[var(--space-5)] border border-[var(--color-border-subtle)]/50">
              <Shield className="w-[24px] h-[24px] text-[var(--color-terracotta-600)] mb-3" strokeWidth={1.5} />
              <h3 className="text-heading-sm text-[var(--color-ink-900)] mb-1">Dispute Resolution</h3>
              <p className="text-body-md text-[var(--color-ink-700)]">
                disputes@bidcraft.in <br/>
                Escrow and order disputes prioritised.
              </p>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
