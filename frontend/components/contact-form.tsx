'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors({})
    
    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const subject = formData.get('subject') as string
    const message = formData.get('message') as string
    
    const newErrors: Record<string, string> = {}
    if (!name.trim()) newErrors.name = 'Please provide your name.'
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) newErrors.email = 'Please provide a valid email address.'
    if (!subject) newErrors.subject = 'Please select a topic.'
    if (!message.trim() || message.length < 10) newErrors.message = 'Please provide more details in your message.'
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)
    }, 1500)
  }

  if (isSuccess) {
    return (
      <div className="p-8 border border-[var(--color-terracotta-200)] bg-[var(--color-cream-deep)] rounded-[var(--radius-md)]">
        <h3 className="text-[28px] font-[family-name:var(--font-playfair)] text-[var(--color-ink-900)] mb-4">Your message is in our hands.</h3>
        <p className="text-body-lg text-[var(--color-ink-700)] font-[family-name:var(--font-jakarta)] leading-relaxed">
          An artisan from our support team will review your inquiry and reach out shortly. We appreciate your patience.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      <div>
        <label htmlFor="contact-name" className="block text-body-md font-semibold text-[var(--color-ink-900)] mb-2 font-[family-name:var(--font-jakarta)]">Name</label>
        <input 
          id="contact-name" 
          name="name" 
          type="text" 
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          className={`w-full h-12 px-4 border rounded-[var(--radius-md)] outline-none transition-colors font-[family-name:var(--font-jakarta)] ${errors.name ? 'border-[var(--color-error)] focus:border-[var(--color-error)]' : 'border-[var(--color-border-subtle)] focus:border-[var(--color-terracotta-600)]'}`} 
        />
        {errors.name && <p id="name-error" className="text-sm text-[var(--color-error)] mt-2 font-[family-name:var(--font-jakarta)]" role="alert">{errors.name}</p>}
      </div>
      <div>
        <label htmlFor="contact-email" className="block text-body-md font-semibold text-[var(--color-ink-900)] mb-2 font-[family-name:var(--font-jakarta)]">Email</label>
        <input 
          id="contact-email" 
          name="email" 
          type="email" 
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={`w-full h-12 px-4 border rounded-[var(--radius-md)] outline-none transition-colors font-[family-name:var(--font-jakarta)] ${errors.email ? 'border-[var(--color-error)] focus:border-[var(--color-error)]' : 'border-[var(--color-border-subtle)] focus:border-[var(--color-terracotta-600)]'}`} 
        />
        {errors.email && <p id="email-error" className="text-sm text-[var(--color-error)] mt-2 font-[family-name:var(--font-jakarta)]" role="alert">{errors.email}</p>}
      </div>
      <div>
        <label htmlFor="contact-subject" className="block text-body-md font-semibold text-[var(--color-ink-900)] mb-2 font-[family-name:var(--font-jakarta)]">Subject</label>
        <select 
          id="contact-subject" 
          name="subject" 
          aria-invalid={!!errors.subject}
          aria-describedby={errors.subject ? "subject-error" : undefined}
          className={`w-full h-12 px-4 border rounded-[var(--radius-md)] outline-none transition-colors bg-white cursor-pointer font-[family-name:var(--font-jakarta)] ${errors.subject ? 'border-[var(--color-error)] focus:border-[var(--color-error)]' : 'border-[var(--color-border-subtle)] focus:border-[var(--color-terracotta-600)]'}`} 
          defaultValue=""
        >
          <option value="" disabled>Select an option</option>
          <option>General Enquiry</option>
          <option>Seller Support</option>
          <option>Buyer Issue</option>
          <option>Report a Listing</option>
          <option>Press & Media</option>
          <option>Other</option>
        </select>
        {errors.subject && <p id="subject-error" className="text-sm text-[var(--color-error)] mt-2 font-[family-name:var(--font-jakarta)]" role="alert">{errors.subject}</p>}
      </div>
      <div>
        <label htmlFor="contact-message" className="block text-body-md font-semibold text-[var(--color-ink-900)] mb-2 font-[family-name:var(--font-jakarta)]">Message</label>
        <textarea 
          id="contact-message" 
          name="message" 
          rows={5} 
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={`w-full p-4 border rounded-[var(--radius-md)] outline-none transition-colors resize-none font-[family-name:var(--font-jakarta)] ${errors.message ? 'border-[var(--color-error)] focus:border-[var(--color-error)]' : 'border-[var(--color-border-subtle)] focus:border-[var(--color-terracotta-600)]'}`} 
        ></textarea>
        {errors.message && <p id="message-error" className="text-sm text-[var(--color-error)] mt-2 font-[family-name:var(--font-jakarta)]" role="alert">{errors.message}</p>}
      </div>
      <button 
        type="submit" 
        disabled={isSubmitting}
        className="mt-2 h-14 bg-[var(--color-terracotta-600)] text-white text-body-lg font-bold rounded-[var(--radius-md)] hover:bg-[var(--color-terracotta-700)] transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed font-[family-name:var(--font-jakarta)]"
      >
        {isSubmitting ? (
          <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Sending...</>
        ) : (
          'Send Message'
        )}
      </button>
    </form>
  )
}
