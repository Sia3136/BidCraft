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

  // --- GREETINGS ---
  {
    keywords: ['hi', 'hello', 'hey', 'greetings', 'morning', 'afternoon', 'evening', 'sup', 'hiya'],
    response: "Hello! Welcome to BidCraft 👋 I can help with orders, shipping, auctions, payments, and more. What would you like to know?",
    chips: ['Track My Order', 'How Bidding Works', 'Selling on BidCraft', 'Payments & Fees']
  },
  {
    keywords: ['thank', 'thanks', 'appreciate', 'helpful', 'great help'],
    response: "You're welcome! Is there anything else I can help you with?",
    chips: ['Explore Listings', 'Contact Support']
  },
  {
    keywords: ['bye', 'goodbye', 'cya', 'see you', 'that\'s all', 'thats all'],
    response: "Goodbye! Happy bidding! 🎉"
  },

  // --- ORDERS & TRACKING ---
  {
    keywords: ['track', 'tracking', 'where is my order', 'where is my package', 'when will my', 'my order', 'order status', 'dispatched'],
    response: 'You can track your order in real time from your Orders page. Once the seller uploads a tracking number, you\'ll see courier and tracking details there.',
    action: { label: 'View My Orders', href: '/orders' },
    chips: ['Shipping Times', 'Item Not Arrived']
  },
  {
    keywords: ['cancel order', 'cancel my order', 'cancel purchase', 'undo buy'],
    response: 'Orders can be cancelled before the seller ships. Once a tracking number is uploaded, cancellation is no longer possible. To request a cancellation, contact our support team.',
    action: { label: 'Contact Support', href: '/contact' },
    chips: ['Returns & Refunds']
  },

  // --- SHIPPING ---
  {
    keywords: ['shipping', 'delivery', 'arrive', 'courier', 'dispatch', 'ship', 'delivery time'],
    response: 'Sellers are required to ship within 3 business days of your order. Standard delivery takes 3–7 business days within India depending on your location.',
    action: { label: 'Track Order', href: '/orders' },
    chips: ['International Shipping', 'Item Not Arrived', 'Returns & Refunds']
  },
  {
    keywords: ['international', 'outside india', 'abroad', 'overseas', 'global shipping', 'foreign'],
    response: 'BidCraft currently supports shipping within India only. International shipping is on our roadmap — stay tuned!',
    chips: ['Contact Support', 'How Bidding Works']
  },
  {
    keywords: ['not arrived', 'late', 'delayed', 'overdue', 'hasn\'t arrived', 'not received', 'missing package'],
    response: 'If your order hasn\'t arrived within the expected window, please contact our support team with your order ID. We\'ll investigate with the seller and courier immediately.',
    action: { label: 'Contact Support', href: '/contact' },
    chips: ['Track My Order', 'Returns & Refunds']
  },
  {
    keywords: ['packaging', 'wrapped', 'gift wrap', 'box', 'packed'],
    response: 'Most BidCraft creators package their items carefully. For special gift wrapping, check the listing description or message the seller directly before purchasing.',
    chips: ['Custom Orders', 'Contact Support']
  },
  {
    keywords: ['cod', 'cash on delivery', 'cash on arrival', 'pay on delivery'],
    response: 'BidCraft does not currently support Cash on Delivery. We accept UPI, credit/debit cards, and net banking via Razorpay. Payments are held securely in escrow.',
    chips: ['Payments & Fees', 'Buyer Protection']
  },

  // --- RETURNS & REFUNDS ---
  {
    keywords: ['return', 'refund', 'exchange', 'money back', 'send back', 'return policy'],
    response: 'Returns are accepted within 7 days of delivery for most items. Custom or made-to-order items are non-refundable. Initiate a return from your Orders page.',
    action: { label: 'Returns Policy', href: '/returns-policy' },
    chips: ['Damaged Item', 'Wrong Item', 'Contact Support']
  },
  {
    keywords: ['damaged', 'broken', 'cracked', 'defective', 'not working', 'item arrived damaged'],
    response: 'We\'re sorry to hear that! If your item arrived damaged, take photos immediately and contact our support team within 48 hours. We\'ll arrange a full refund or replacement.',
    action: { label: 'Contact Support', href: '/contact' },
    chips: ['Returns & Refunds', 'Buyer Protection']
  },
  {
    keywords: ['wrong item', 'wrong order', 'incorrect item', 'not what I ordered', 'sent wrong'],
    response: 'If you received the wrong item, contact support immediately with your order ID and photos. We\'ll resolve this with the seller and arrange return shipping at no cost to you.',
    action: { label: 'Contact Support', href: '/contact' },
    chips: ['Returns & Refunds']
  },
  {
    keywords: ['dispute', 'problem with seller', 'seller not responding', 'resolution', 'complaint', 'escalate'],
    response: 'If you have a dispute with a seller, our team mediates directly. Raise a dispute from your order page or contact support. Funds remain in escrow until the issue is resolved.',
    action: { label: 'Contact Support', href: '/contact' },
    chips: ['Buyer Protection', 'Returns & Refunds']
  },

  // --- PAYMENTS & FEES ---
  {
    keywords: ['payment', 'pay', 'razorpay', 'upi', 'credit card', 'debit card', 'net banking', 'wallet', 'how to pay'],
    response: 'We accept UPI, credit/debit cards, and net banking via Razorpay. Your payment is held securely in escrow and released to the seller only after you confirm delivery.',
    action: { label: 'Buyer Protection', href: '/buyer-protection' },
    chips: ['Escrow Explained', 'Payments Failed', 'COD Available?']
  },
  {
    keywords: ['payment failed', 'payment error', 'payment not going through', 'transaction failed', 'pay again'],
    response: 'If your payment failed, please try again with a different method (UPI, card, or net banking). If the issue persists, contact your bank or reach out to our support team.',
    action: { label: 'Contact Support', href: '/contact' },
    chips: ['Payments & Fees']
  },
  {
    keywords: ['fee', 'commission', 'charge', 'how much does bidcraft take', 'platform fee', 'seller fee', 'cost to sell'],
    response: 'BidCraft charges a small platform commission on successful sales. Detailed fee information for buyers and sellers is available on our Fees page.',
    action: { label: 'View Fees', href: '/fees' },
    chips: ['Selling on BidCraft', 'Payouts for Sellers']
  },
  {
    keywords: ['gst', 'tax', 'invoice', 'receipt', 'bill', 'taxation'],
    response: 'GST and applicable taxes are included in the listed price. You can download your invoice from the Orders page after your purchase is confirmed.',
    action: { label: 'My Orders', href: '/orders' },
    chips: ['Payments & Fees']
  },
  {
    keywords: ['promo', 'coupon', 'discount', 'promo code', 'voucher', 'offer code'],
    response: 'We occasionally run promotions for buyers and sellers. Watch our community page and emails for promo codes. No active promo? Stay tuned!',
    action: { label: 'Community', href: '/community' },
    chips: ['Explore Listings']
  },

  // --- AUCTIONS ---
  {
    keywords: ['auction', 'bid', 'bidding', 'how to bid', 'live auction', 'place a bid'],
    response: 'Live auctions let you bid on rare items in real time. Any bid in the last 2 minutes extends the auction by 2 minutes (anti-sniping). The highest bidder wins when time runs out.',
    action: { label: 'View Live Auctions', href: '/explore?type=auction' },
    chips: ['Minimum Bid Increment', 'Cancel a Bid', 'Auction Duration']
  },
  {
    keywords: ['cancel bid', 'withdraw bid', 'undo bid', 'retract bid'],
    response: 'Bids cannot be cancelled once placed. Please bid only if you intend to purchase. If you win, you are required to complete payment within 24 hours.',
    chips: ['How Bidding Works', 'Contact Support']
  },
  {
    keywords: ['increment', 'minimum bid', 'how much to bid', 'bid increment', 'minimum raise'],
    response: 'Each auction sets its own minimum bid increment (typically 5–10% of the current bid). The required minimum is always shown on the auction page before you bid.',
    action: { label: 'Browse Auctions', href: '/explore?type=auction' },
    chips: ['How Bidding Works']
  },
  {
    keywords: ['reserve', 'reserve price', 'hidden price', 'not met reserve'],
    response: 'Some auctions have a reserve price — the minimum the seller will accept. If the reserve isn\'t met by auction end, the item does not sell and no payment is taken.',
    chips: ['How Bidding Works', 'Contact Support']
  },
  {
    keywords: ['how long', 'auction duration', 'auction end', 'when does auction end', 'auction time'],
    response: 'Auction duration is set by the seller — typically 24 hours to 7 days. The exact end time is shown on the listing. Any last-minute bid extends the auction by 2 minutes.',
    action: { label: 'Browse Auctions', href: '/explore?type=auction' },
    chips: ['How Bidding Works', 'Anti-Sniping']
  },

  // --- MAKE AN OFFER ---
  {
    keywords: ['offer', 'negotiate', 'bargain', 'make an offer', 'counter offer', 'counter'],
    response: 'If a listing shows "Make an Offer", you can propose your price. The seller has 48 hours to accept, decline, or counter. Accepted offers are binding — payment is due immediately.',
    chips: ['How Bidding Works', 'Payments & Fees']
  },

  // --- BUYER PROTECTION & ESCROW ---
  {
    keywords: ['protect', 'safe', 'scam', 'trust', 'authentic', 'real', 'original', 'buyer protection', 'is it safe'],
    response: 'Every seller on BidCraft goes through KYC verification. High-value items include a Certificate of Authenticity. Payments are held in escrow — you only release funds after confirming delivery.',
    action: { label: 'Buyer Protection', href: '/buyer-protection' },
    chips: ['Escrow Explained', 'Report a Seller']
  },
  {
    keywords: ['escrow', 'how escrow works', 'escrow explained', 'money held', 'fund held'],
    response: 'When you pay, funds go to BidCraft escrow — not directly to the seller. The seller ships, you confirm delivery, and then funds are released. This protects both parties.',
    action: { label: 'Escrow Details', href: '/escrow' },
    chips: ['Buyer Protection', 'Returns & Refunds']
  },
  {
    keywords: ['certificate', 'authenticity', 'coa', 'genuine', 'verified item'],
    response: 'High-value and rare items on BidCraft come with a Certificate of Authenticity. This is verified by our team and included with the shipment.',
    action: { label: 'Buyer Protection', href: '/buyer-protection' },
    chips: ['Is BidCraft Safe?']
  },
  {
    keywords: ['report', 'fake', 'fraud', 'suspicious', 'misleading listing', 'counterfeit'],
    response: 'To report a suspicious listing or seller, use the "Report" button on the listing page or contact our support team. We investigate all reports within 24 hours.',
    action: { label: 'Contact Support', href: '/contact' }
  },

  // --- SELLING ---
  {
    keywords: ['sell', 'how to sell', 'creator', 'artisan', 'join as seller', 'become a seller', 'vendor', 'start selling'],
    response: 'Apply to become a BidCraft creator! Once approved after KYC, you get a full seller dashboard to manage listings, auctions, orders, and offers.',
    action: { label: 'Apply to Sell', href: '/creator' },
    chips: ['Seller Fees', 'Seller Payouts', 'Listing an Item']
  },
  {
    keywords: ['list item', 'create listing', 'add listing', 'post item', 'sell an item', 'listing'],
    response: 'Once approved as a seller, go to Sell → New Listing. You can list items as Buy Now, Negotiable, or Auction with photos, descriptions, and category tags.',
    action: { label: 'Create Listing', href: '/sell/new' },
    chips: ['Seller Fees', 'Selling on BidCraft']
  },
  {
    keywords: ['payout', 'seller payout', 'when do i get paid', 'my earnings', 'seller money', 'withdraw'],
    response: 'Payouts are processed 3–5 business days after the buyer confirms delivery. Funds go to your registered bank account. View your payout history in the Seller Dashboard.',
    action: { label: 'Seller Dashboard', href: '/seller/listings' },
    chips: ['Seller Fees', 'Escrow Explained']
  },
  {
    keywords: ['custom', 'custom order', 'personalize', 'personalised', 'customise', 'bespoke', 'made to order'],
    response: 'Many BidCraft creators accept custom orders. Look for "Custom Orders Available" in the listing, or message the seller directly. Custom items are non-refundable once production begins.',
    chips: ['Contact a Seller', 'Returns & Refunds']
  },

  // --- BROWSING & DISCOVERY ---
  {
    keywords: ['browse', 'categories', 'explore', 'shop', 'find items', 'search', 'discover'],
    response: 'Use the Explore page to browse by category, subcategory, price, and buying method. You can also search by keyword using the search bar at the top.',
    action: { label: 'Explore Marketplace', href: '/explore' },
    chips: ['New Arrivals', 'Live Auctions', 'Trending Items']
  },
  {
    keywords: ['new arrival', 'newest', 'latest', 'just listed', 'recently added'],
    response: 'Check out the latest listings on our New Arrivals section. Fresh items are added daily by our creator community.',
    action: { label: 'New Arrivals', href: '/explore?type=new-arrivals' },
    chips: ['Trending Items', 'Browse Categories']
  },
  {
    keywords: ['trending', 'popular', 'best seller', 'top items', 'most popular'],
    response: 'Our Trending section highlights the most viewed and bid-on items this week. Check it out to see what\'s hot right now!',
    action: { label: 'Explore Trending', href: '/explore' },
    chips: ['New Arrivals', 'Live Auctions']
  },
  {
    keywords: ['wishlist', 'save item', 'favourite', 'saved items', 'bookmark'],
    response: 'Tap the heart icon on any listing to save it to your Wishlist. You can view all your saved items from your account.',
    action: { label: 'My Wishlist', href: '/account/wishlist' },
    chips: ['Browse Categories', 'Track My Order']
  },
  {
    keywords: ['cart', 'basket', 'add to cart', 'shopping cart', 'bag'],
    response: 'Add listings to your cart and check out whenever you\'re ready. Note: auction and "Make an Offer" items cannot be added to cart — they require direct purchase.',
    action: { label: 'View Cart', href: '/cart' },
    chips: ['Payments & Fees', 'Buyer Protection']
  },

  // --- ACCOUNT ---
  {
    keywords: ['account', 'profile', 'my account', 'account settings', 'edit profile'],
    response: 'Manage your profile, addresses, notifications, and security settings from your Account page.',
    action: { label: 'Account Settings', href: '/account' },
    chips: ['Change Password', 'Change Address']
  },
  {
    keywords: ['password', 'change password', 'reset password', 'forgot password', 'login', 'sign in', 'can\'t log in'],
    response: 'To reset your password, click "Forgot Password" on the sign-in page. You\'ll receive an OTP by email to set a new password.',
    action: { label: 'Sign In', href: '/auth' },
    chips: ['Account Settings', 'Contact Support']
  },
  {
    keywords: ['address', 'delivery address', 'shipping address', 'change address', 'add address'],
    response: 'You can add or update your delivery addresses from your Account page under Addresses.',
    action: { label: 'Manage Addresses', href: '/account/addresses' },
    chips: ['Track My Order']
  },
  {
    keywords: ['verify', 'email verification', 'verify email', 'otp', 'verification code', 'confirm email'],
    response: 'Check your inbox for a 6-digit verification code from BidCraft. If you didn\'t receive it, click "Resend Code" on the verification screen.',
    action: { label: 'Sign In', href: '/auth' },
    chips: ['Contact Support']
  },
  {
    keywords: ['delete account', 'close account', 'deactivate', 'remove my account'],
    response: 'To delete your account, please contact our support team. Note: accounts with active orders or listings cannot be deleted until they are resolved.',
    action: { label: 'Contact Support', href: '/contact' }
  },
  {
    keywords: ['notification', 'alert', 'email notification', 'push notification', 'notify me'],
    response: 'Manage your notification preferences (email alerts, bid updates, order status) from your Account Settings.',
    action: { label: 'Account Settings', href: '/account' }
  },
  {
    keywords: ['follow', 'following', 'creator', 'seller page', 'subscribe to seller'],
    response: 'You can follow your favourite creators on their profile page. You\'ll get notified when they add new listings or start live auctions.',
    action: { label: 'Explore Creators', href: '/explore' },
    chips: ['Browse Categories']
  },

  // --- SUPPORT ---
  {
    keywords: ['support', 'contact', 'help', 'human', 'agent', 'real person', 'speak to someone'],
    response: 'Our support team is available Monday–Friday, 10am–6pm IST. You can reach us via the Contact page or email us directly.',
    action: { label: 'Contact Support', href: '/contact' },
    chips: ['Returns & Refunds', 'Dispute Resolution']
  }

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
    text: "I didn't quite catch that — here are some popular topics I can help with. Or type a keyword like 'shipping', 'refund', 'auction', or 'seller'.",
    chips: [
      'Track My Order',
      'Returns & Refunds',
      'Payments & Fees',
      'How Bidding Works',
      'Selling on BidCraft',
      'Contact Support'
    ]
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
      chips: [
        'Track My Order',
        'How Bidding Works',
        'Returns & Refunds',
        'Payments & Fees',
        'Selling on BidCraft',
        'Buyer Protection'
      ]
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
