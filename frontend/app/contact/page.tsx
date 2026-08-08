import { Mail, MessageSquare, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export const metadata = {
  title: 'Contact Us | BidCraft',
}

export default function ContactPage() {
  return (
    <div className="py-[var(--space-10)] md:py-16">
      <div className="max-w-[1200px] mx-auto px-6">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-display-lg text-[var(--color-ink-900)] mb-4">Get in Touch</h1>
          <p className="text-body-lg text-[var(--color-ink-700)]">
            Whether you have a question about a product, need help setting up your storefront, or just want to share feedback, we'd love to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-[var(--space-10)] lg:gap-[var(--space-12)] items-start">
          
          {/* Contact Form */}
          <div className="bg-white p-[var(--space-8)] rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] shadow-sm">
            <h2 className="text-heading-lg text-[var(--color-ink-900)] mb-6">Send a Message</h2>
            <form className="flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-body-sm font-bold text-[var(--color-ink-900)]">First Name</label>
                  <Input type="text" placeholder="Jane" className="bg-[var(--color-cream-base)] h-[44px]" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-body-sm font-bold text-[var(--color-ink-900)]">Last Name</label>
                  <Input type="text" placeholder="Doe" className="bg-[var(--color-cream-base)] h-[44px]" />
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-body-sm font-bold text-[var(--color-ink-900)]">Email Address</label>
                <Input type="email" placeholder="jane@example.com" className="bg-[var(--color-cream-base)] h-[44px]" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-body-sm font-bold text-[var(--color-ink-900)]">Subject</label>
                <select className="flex h-[44px] w-full rounded-[var(--radius-md)] border border-input bg-[var(--color-cream-base)] px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <option>General Inquiry</option>
                  <option>Order Support</option>
                  <option>Seller Support</option>
                  <option>Feedback</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-body-sm font-bold text-[var(--color-ink-900)]">Message</label>
                <textarea 
                  rows={5} 
                  placeholder="How can we help?" 
                  className="flex w-full rounded-[var(--radius-md)] border border-input bg-[var(--color-cream-base)] px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                ></textarea>
              </div>

              <Button size="lg" className="w-full mt-2 bg-[var(--color-ink-900)] hover:bg-[var(--color-terracotta-600)] text-white">Send Message</Button>
            </form>
          </div>

          {/* Support Info */}
          <div className="flex flex-col gap-[var(--space-8)]">
            <div>
              <h2 className="text-heading-lg text-[var(--color-ink-900)] mb-6">Contact Information</h2>
              <div className="flex flex-col gap-6">
                
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-[var(--color-cream-deep)] flex items-center justify-center shrink-0 text-[var(--color-terracotta-600)]">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4 className="text-heading-sm text-[var(--color-ink-900)] mb-1">Email Us</h4>
                    <p className="text-body-md text-[var(--color-ink-700)] mb-2">Our friendly team is here to help.</p>
                    <a href="mailto:support@bidcraft.in" className="text-body-md font-medium text-[var(--color-terracotta-600)] hover:underline">support@bidcraft.in</a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-[var(--color-cream-deep)] flex items-center justify-center shrink-0 text-[var(--color-terracotta-600)]">
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <h4 className="text-heading-sm text-[var(--color-ink-900)] mb-1">Live Chat</h4>
                    <p className="text-body-md text-[var(--color-ink-700)] mb-2">Available Mon-Fri, 9am-5pm IST.</p>
                    <button className="text-body-md font-medium text-[var(--color-terracotta-600)] hover:underline">Start a chat</button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-[var(--color-cream-deep)] flex items-center justify-center shrink-0 text-[var(--color-terracotta-600)]">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="text-heading-sm text-[var(--color-ink-900)] mb-1">Office</h4>
                    <p className="text-body-md text-[var(--color-ink-700)]">
                      BidCraft Headquarters<br />
                      Mumbai, Maharashtra<br />
                      India
                    </p>
                  </div>
                </div>

              </div>
            </div>

            <div className="bg-[var(--color-ink-900)] text-white p-[var(--space-8)] rounded-[var(--radius-lg)] mt-4">
              <h3 className="text-heading-md text-white mb-3">Looking for quick answers?</h3>
              <p className="text-body-md text-white/80 mb-6">
                Check out our FAQ section for immediate answers to common questions about buying, selling, and shipping.
              </p>
              <Button variant="outline" className="bg-white text-[var(--color-ink-900)] hover:bg-[var(--color-cream-base)] border-none">
                Visit Help Center
              </Button>
            </div>

          </div>

        </div>
      </div>
    </div>
  )
}
