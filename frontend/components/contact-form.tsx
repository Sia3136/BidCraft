'use client'

import { useState } from 'react'
import { Loader2, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateField = (name: string, value: string) => {
    let error = ''
    switch (name) {
      case 'name':
        if (!value.trim() || value.trim().length < 2) error = 'Please provide your name (min 2 characters).'
        break
      case 'email':
        // Basic fallback for react state if html validation passes but needs double check
        if (!value.trim() || !/^\S+@\S+\.\S+$/.test(value)) error = 'Please provide a valid email address.'
        break
      case 'phone':
        if (value.trim() && !/^[6-9]\d{9}$/.test(value.trim())) error = 'Please provide a valid 10-digit Indian mobile number.'
        break
      case 'subject':
        if (!value) error = 'Please select a topic.'
        break
      case 'message':
        if (!value.trim() || value.trim().length < 20) error = 'Please provide more details in your message (min 20 characters).'
        break
    }
    return error
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    const error = validateField(name, value)
    setErrors(prev => ({
      ...prev,
      [name]: error
    }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors({})
    
    const formData = new FormData(e.currentTarget)
    const newErrors: Record<string, string> = {}
    
    ;['name', 'email', 'phone', 'subject', 'message'].forEach(field => {
      const value = formData.get(field) as string
      const error = validateField(field, value)
      if (error) newErrors[field] = error
    })
    
    if (Object.values(newErrors).some(err => err)) {
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
      <div className="p-8 border border-[var(--color-terracotta-200)] bg-[var(--color-cream-deep)] rounded-[var(--radius-md)] flex flex-col items-center text-center">
        <CheckCircle2 className="w-12 h-12 text-[var(--color-terracotta-600)] mb-6" />
        <h3 className="text-display-sm font-[family-name:var(--font-playfair)] text-[var(--color-ink-900)] mb-4">Message received</h3>
        <p className="text-body-lg text-[var(--color-ink-700)] font-[family-name:var(--font-jakarta)] leading-relaxed max-w-sm mb-8">
          Thank you for reaching out. We've received your message and will get back to you shortly. In the meantime, explore what our creators have been making.
        </p>
        <Link href="/" className="inline-flex items-center justify-center h-12 px-6 bg-[var(--color-terracotta-600)] text-white font-bold rounded-[var(--radius-md)] hover:bg-[var(--color-terracotta-700)] transition-colors font-[family-name:var(--font-jakarta)]">
          Back to Home
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" aria-live="polite">
      <div>
        <label htmlFor="contact-name" className="block text-body-md font-semibold text-[var(--color-ink-900)] mb-2 font-[family-name:var(--font-jakarta)]">Name</label>
        <input 
          id="contact-name" 
          name="name" 
          type="text"
          required
          minLength={2}
          onBlur={handleBlur}
          disabled={isSubmitting}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          className={`w-full h-12 px-4 border rounded-[var(--radius-md)] outline-none transition-colors font-[family-name:var(--font-jakarta)] disabled:opacity-50 disabled:cursor-not-allowed ${errors.name ? 'border-[var(--color-error)] focus:border-[var(--color-error)] focus:ring-1 focus:ring-[var(--color-error)]' : 'border-[var(--color-border-subtle)] focus:border-[var(--color-terracotta-600)] focus:ring-1 focus:ring-[var(--color-terracotta-600)] hover:border-[var(--color-ink-300)]'}`} 
        />
        {errors.name && <p id="name-error" className="text-sm text-[var(--color-error)] mt-2 font-[family-name:var(--font-jakarta)]" role="alert">{errors.name}</p>}
      </div>
      <div>
        <label htmlFor="contact-email" className="block text-body-md font-semibold text-[var(--color-ink-900)] mb-2 font-[family-name:var(--font-jakarta)]">Email</label>
        <input 
          id="contact-email" 
          name="email" 
          type="email" 
          required
          onBlur={handleBlur}
          disabled={isSubmitting}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={`w-full h-12 px-4 border rounded-[var(--radius-md)] outline-none transition-colors font-[family-name:var(--font-jakarta)] disabled:opacity-50 disabled:cursor-not-allowed ${errors.email ? 'border-[var(--color-error)] focus:border-[var(--color-error)] focus:ring-1 focus:ring-[var(--color-error)]' : 'border-[var(--color-border-subtle)] focus:border-[var(--color-terracotta-600)] focus:ring-1 focus:ring-[var(--color-terracotta-600)] hover:border-[var(--color-ink-300)]'}`} 
        />
        {errors.email && <p id="email-error" className="text-sm text-[var(--color-error)] mt-2 font-[family-name:var(--font-jakarta)]" role="alert">{errors.email}</p>}
      </div>
      <div>
        <label htmlFor="contact-phone" className="block text-body-md font-semibold text-[var(--color-ink-900)] mb-2 font-[family-name:var(--font-jakarta)]">Phone (Optional)</label>
        <input 
          id="contact-phone" 
          name="phone" 
          type="tel" 
          pattern="[6-9][0-9]{9}"
          onBlur={handleBlur}
          disabled={isSubmitting}
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? "phone-error" : undefined}
          className={`w-full h-12 px-4 border rounded-[var(--radius-md)] outline-none transition-colors font-[family-name:var(--font-jakarta)] disabled:opacity-50 disabled:cursor-not-allowed ${errors.phone ? 'border-[var(--color-error)] focus:border-[var(--color-error)] focus:ring-1 focus:ring-[var(--color-error)]' : 'border-[var(--color-border-subtle)] focus:border-[var(--color-terracotta-600)] focus:ring-1 focus:ring-[var(--color-terracotta-600)] hover:border-[var(--color-ink-300)]'}`} 
        />
        {errors.phone && <p id="phone-error" className="text-sm text-[var(--color-error)] mt-2 font-[family-name:var(--font-jakarta)]" role="alert">{errors.phone}</p>}
      </div>
      <div>
        <label htmlFor="contact-subject" className="block text-body-md font-semibold text-[var(--color-ink-900)] mb-2 font-[family-name:var(--font-jakarta)]">Subject</label>
        <select 
          id="contact-subject" 
          name="subject"
          required
          onBlur={handleBlur}
          disabled={isSubmitting}
          aria-invalid={!!errors.subject}
          aria-describedby={errors.subject ? "subject-error" : undefined}
          className={`w-full h-12 px-4 border rounded-[var(--radius-md)] outline-none transition-colors bg-white cursor-pointer font-[family-name:var(--font-jakarta)] disabled:opacity-50 disabled:cursor-not-allowed ${errors.subject ? 'border-[var(--color-error)] focus:border-[var(--color-error)] focus:ring-1 focus:ring-[var(--color-error)]' : 'border-[var(--color-border-subtle)] focus:border-[var(--color-terracotta-600)] focus:ring-1 focus:ring-[var(--color-terracotta-600)] hover:border-[var(--color-ink-300)]'}`} 
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
          required
          minLength={20}
          onBlur={handleBlur}
          disabled={isSubmitting}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={`w-full p-4 border rounded-[var(--radius-md)] outline-none transition-colors resize-none font-[family-name:var(--font-jakarta)] disabled:opacity-50 disabled:cursor-not-allowed ${errors.message ? 'border-[var(--color-error)] focus:border-[var(--color-error)] focus:ring-1 focus:ring-[var(--color-error)]' : 'border-[var(--color-border-subtle)] focus:border-[var(--color-terracotta-600)] focus:ring-1 focus:ring-[var(--color-terracotta-600)] hover:border-[var(--color-ink-300)]'}`} 
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
