'use client'

const TESTIMONIALS = [
  {
    id: 1,
    quote: "BidCraft completely changed how I discover art. I found a rare 19th-century sketch that now hangs in my living room. The experience feels like walking through a high-end gallery.",
    author: "Elena R.",
    role: "Collector",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: 2,
    quote: "As a ceramic artist, finding the right audience was always my biggest challenge. Here, my work is presented beautifully and respected. It's a true community of creators.",
    author: "Marcus T.",
    role: "Verified Creator",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: 3,
    quote: "The auction experience is incredibly smooth, but what I love most is just browsing the categories. It's curated to perfection.",
    author: "Sarah L.",
    role: "Buyer",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
  }
]

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-[#FAF9F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-brand font-medium tracking-wide text-foreground">Community Stories</h2>
          <p className="text-muted-foreground mt-4 text-[15px] max-w-xl mx-auto">Hear from the collectors and creators who make this marketplace unique.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t) => (
            <div key={t.id} className="bg-white p-8 rounded-2xl shadow-sm border border-border flex flex-col">
              <div className="flex-1">
                <svg className="w-8 h-8 text-border mb-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-foreground/80 font-serif italic text-[16px] leading-relaxed mb-8">
                  "{t.quote}"
                </p>
              </div>
              <div className="flex items-center gap-4 border-t border-border pt-6">
                <img src={t.image} alt={t.author} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <p className="font-semibold text-foreground text-[14px]">{t.author}</p>
                  <p className="text-muted-foreground text-[13px]">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
