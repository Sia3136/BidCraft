export function ContactForm() {
  return (
    <form className="flex flex-col gap-4">
      <div>
        <label className="block text-body-md font-semibold text-[var(--color-ink-900)] mb-2">Name</label>
        <input type="text" className="w-full h-12 px-4 border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] outline-none focus:border-[var(--color-terracotta-600)]" required />
      </div>
      <div>
        <label className="block text-body-md font-semibold text-[var(--color-ink-900)] mb-2">Email</label>
        <input type="email" className="w-full h-12 px-4 border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] outline-none focus:border-[var(--color-terracotta-600)]" required />
      </div>
      <div>
        <label className="block text-body-md font-semibold text-[var(--color-ink-900)] mb-2">Subject</label>
        <select className="w-full h-12 px-4 border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] outline-none focus:border-[var(--color-terracotta-600)] bg-white cursor-pointer" required defaultValue="">
          <option value="" disabled>Select an option</option>
          <option>General Enquiry</option>
          <option>Seller Support</option>
          <option>Buyer Issue</option>
          <option>Report a Listing</option>
          <option>Press & Media</option>
          <option>Other</option>
        </select>
      </div>
      <div>
        <label className="block text-body-md font-semibold text-[var(--color-ink-900)] mb-2">Message</label>
        <textarea rows={4} className="w-full p-4 border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] outline-none focus:border-[var(--color-terracotta-600)] resize-none" required></textarea>
      </div>
      <button type="submit" className="mt-2 h-12 bg-[var(--color-terracotta-600)] text-white font-bold rounded-[var(--radius-md)] hover:bg-[var(--color-terracotta-700)] transition-colors">
        Send Message
      </button>
    </form>
  )
}
