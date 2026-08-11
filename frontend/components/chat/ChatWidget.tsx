'use client'

import React, { useState, useRef, useEffect } from 'react'
import { MessageSquare, X, Send, User, Bot, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

interface Message {
  id: string
  type: 'user' | 'bot'
  text: string
  action?: {
    label: string
    href: string
  }
  chips?: string[]
}

const FAQS = [
  { keywords: ['hi', 'hello', 'hey', 'greetings', 'morning', 'afternoon'], response: 'Hello there! How can I help you today?', chips: ['Shipping', 'Returns', 'Auctions'] },
  { keywords: ['thank', 'thanks', 'appreciate'], response: "You're very welcome! Let me know if there's anything else you need.", chips: ['Explore Marketplace'] },
  { keywords: ['bye', 'goodbye', 'cya', 'see you'], response: "Goodbye! Have a great day!" },
  { keywords: ['shipping', 'delivery', 'track', 'when will my', 'arrive', 'courier', 'dispatch'], response: 'Shipping typically takes 3-7 business days depending on your location. You can track your order in your dashboard.', action: { label: 'Track Order', href: '/orders' } },
  { keywords: ['return', 'refund', 'exchange', 'back', 'money back'], response: 'We accept returns within 14 days for most items. Custom and made-to-order items are non-refundable. Please review our full policy.', action: { label: 'Returns Policy', href: '/returns' } },
  { keywords: ['payment', 'pay', 'razorpay', 'emi', 'credit card', 'upi', 'wallet'], response: 'We accept all major credit cards, UPI, and net banking via Razorpay. Your payment is held securely in escrow until you confirm delivery.', chips: ['Buyer Protection'] },
  { keywords: ['auction', 'bid', 'bidding', 'win', 'snipe', 'sniping'], response: 'Live auctions allow you to bid on rare items in real-time. We use anti-sniping protection, meaning any bid in the last 2 minutes extends the auction by 2 minutes.', action: { label: 'View Live Auctions', href: '/explore?type=auction' } },
  { keywords: ['offer', 'negotiate', 'bargain', 'discount'], response: 'If an item has "Make an Offer" enabled, you can propose a price to the creator. They have 48 hours to accept, decline, or counter.', chips: ['Auctions', 'Payments'] },
  { keywords: ['protect', 'safe', 'scam', 'escrow', 'trust', 'authentic', 'real', 'original'], response: 'Every artisan on BidCraft undergoes a strict KYC process. High-value items come with a Certificate of Authenticity. Your funds are held securely in escrow until delivery is confirmed.', action: { label: 'Buyer Protection', href: '/buyer-protection' } },
  { keywords: ['sell', 'creator', 'artisan', 'how to sell', 'join', 'vendor', 'dashboard', 'listing'], response: 'We are always looking for talented creators! Once approved, you get access to a full dashboard to manage listings, orders, and auctions.', action: { label: 'Apply to Sell', href: '/creator' } },
  { keywords: ['account', 'login', 'password', 'email', 'profile'], response: 'You can manage your account settings, including password and email, from your profile page.', action: { label: 'Account Settings', href: '/account' } },
  { keywords: ['support', 'contact', 'help', 'human', 'agent'], response: 'Need more help? Our support team is available Monday through Friday.', action: { label: 'Contact Support', href: '/contact' } }
]

function getBotResponse(query: string, history: Message[]) {
  const normalizedQuery = query.toLowerCase()
  
  for (const faq of FAQS) {
    if (faq.keywords.some(kw => normalizedQuery.includes(kw))) {
      return {
        text: faq.response,
        action: faq.action,
        chips: faq.chips
      }
    }
  }

  return {
    text: "I'm here to help with orders, shipping, returns, auctions, seller support, and payments. You can choose one of the suggestions below or ask another question.",
    chips: ['Shipping', 'Returns', 'Auctions', 'Payments', 'Contact Support']
  }
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      text: 'Hello! I am the BidCraft Assistant. How can I help you today?',
      chips: ['Shipping Info', 'Returns & Refunds', 'How Bidding Works']
    }
  ])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isOpen])

  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true)
    window.addEventListener('open-chat', handleOpenChat)
    return () => window.removeEventListener('open-chat', handleOpenChat)
  }, [])

  const handleSendText = (text: string) => {
    if (!text.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: text.trim()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')

    setTimeout(() => {
      setMessages(prev => {
        const response = getBotResponse(userMessage.text, prev)
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          text: response.text,
          action: response.action,
          chips: response.chips
        }
        return [...prev, botMessage]
      })
    }, 500)
  }

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    handleSendText(input)
  }

  if (!mounted) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white border border-[var(--color-border-subtle)] rounded-2xl shadow-xl w-80 sm:w-96 h-[500px] max-h-[80vh] mb-4 flex flex-col overflow-hidden"
          >
            <div className="bg-[var(--color-slate-900)] text-white p-4 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--color-terracotta-600)] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-body-md font-[family-name:var(--font-jakarta)]">BidCraft Assistant</h3>
                  <p className="text-xs text-white/70 font-[family-name:var(--font-jakarta)]">Typically replies instantly</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white transition-colors"
                aria-label="Close chat"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[var(--color-cream-base)] scrollbar-hide">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex max-w-[85%] gap-2 ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    
                    <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center mt-1"
                      style={{ 
                        backgroundColor: msg.type === 'user' ? 'var(--color-cream-deep)' : 'var(--color-white)',
                        border: msg.type === 'bot' ? '1px solid var(--color-border-subtle)' : 'none'
                      }}
                    >
                      {msg.type === 'user' ? <User className="w-4 h-4 text-[var(--color-ink-500)]" /> : <Bot className="w-4 h-4 text-[var(--color-terracotta-600)]" />}
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <div className={`p-3 rounded-2xl text-body-sm font-[family-name:var(--font-jakarta)] leading-relaxed ${
                        msg.type === 'user' 
                          ? 'bg-[var(--color-ink-900)] text-white rounded-tr-sm' 
                          : 'bg-white text-[var(--color-ink-900)] border border-[var(--color-border-subtle)] rounded-tl-sm shadow-sm'
                      }`}>
                        {msg.text}
                      </div>

                      {msg.action && (
                        <Link 
                          href={msg.action.href}
                          className="self-start inline-flex items-center gap-1.5 text-xs font-semibold font-[family-name:var(--font-jakarta)] text-[var(--color-terracotta-600)] bg-[var(--color-terracotta-50)] px-3 py-2 rounded-full border border-[var(--color-terracotta-200)] hover:bg-[var(--color-terracotta-100)] transition-colors"
                        >
                          {msg.action.label}
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      )}

                      {msg.chips && msg.chips.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-1">
                          {msg.chips.map(chip => (
                            <button
                              key={chip}
                              onClick={() => handleSendText(chip)}
                              className="text-xs font-medium font-[family-name:var(--font-jakarta)] bg-white border border-[var(--color-border-subtle)] text-[var(--color-ink-700)] px-3 py-1.5 rounded-full hover:bg-[var(--color-cream-soft)] transition-colors text-left"
                            >
                              {chip}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 bg-white border-t border-[var(--color-border-subtle)] shrink-0">
              <form onSubmit={handleSend} className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question..."
                  className="flex-1 bg-[var(--color-cream-soft)] font-[family-name:var(--font-jakarta)] border border-[var(--color-border-subtle)] rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[var(--color-terracotta-600)] focus:ring-1 focus:ring-[var(--color-terracotta-600)] transition-all"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="w-9 h-9 bg-[var(--color-terracotta-600)] text-white rounded-full flex items-center justify-center hover:bg-[var(--color-terracotta-700)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-[var(--color-terracotta-600)] rounded-full text-white shadow-lg flex items-center justify-center hover:bg-[var(--color-terracotta-700)] transition-transform hover:scale-105 active:scale-95 z-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-terracotta-600)]"
          aria-label="Open chat"
        >
          <MessageSquare size={24} />
        </motion.button>
      )}
    </div>
  )
}
