import { Navbar } from '@/components/navbar'
import { ContactForm } from '@/components/contact-form'

export const metadata = {
  title: 'Contact Us | BidCraft',
}

export default function ContactPage() {
  return (
    <div className="w-full py-24 px-[var(--space-5)]">
      <div className="max-w-[var(--container-max)] mx-auto flex flex-col lg:flex-row gap-12 lg:gap-16">
        <div className="w-full lg:w-1/2">
            <h1 className="text-display-lg text-[var(--color-ink-900)] mb-8">Contact Us</h1>
            <ContactForm />
          </div>
          
          <div className="w-full lg:w-1/2 flex flex-col justify-center gap-6">
            <div className="p-6 bg-[var(--color-cream-raised)] rounded-[var(--radius-md)]">
              <h3 className="text-heading-md text-[var(--color-ink-900)] mb-1">General</h3>
              <a href="mailto:support@bidcraft.in" className="text-body-lg text-[var(--color-terracotta-600)] font-semibold hover:underline">Support Team</a>
            </div>
            <div className="p-6 bg-[var(--color-cream-raised)] rounded-[var(--radius-md)]">
              <h3 className="text-heading-md text-[var(--color-ink-900)] mb-1">Sellers</h3>
              <a href="mailto:sellers@bidcraft.in" className="text-body-lg text-[var(--color-terracotta-600)] font-semibold hover:underline">Seller Support</a>
            </div>
            <div className="p-6 bg-[var(--color-cream-raised)] rounded-[var(--radius-md)]">
              <h3 className="text-heading-md text-[var(--color-ink-900)] mb-1">Disputes</h3>
              <a href="mailto:disputes@bidcraft.in" className="text-body-lg text-[var(--color-terracotta-600)] font-semibold hover:underline">Resolution Center</a>
            </div>
          </div>
        </div>
      </div>
  )
}
