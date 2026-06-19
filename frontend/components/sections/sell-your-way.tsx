'use client'

export function SellYourWaySection() {
  const methods = [
    {
      title: 'Auction',
      description: 'Let buyers compete for your item. Auctions create buzz and often drive higher prices.',
      icon: '🔨',
      color: 'from-amber-400 to-orange-500',
    },
    {
      title: 'Buy Now',
      description: 'Set a fixed price. Buyers can purchase immediately without waiting for an auction to end.',
      icon: '🛒',
      color: 'from-green-400 to-emerald-500',
    },
    {
      title: 'Make Offer',
      description: 'Let buyers suggest prices. Negotiate directly and find the best deal for both sides.',
      icon: '💬',
      color: 'from-blue-400 to-cyan-500',
    },
  ]

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-3">Sell Your Way</h2>
          <p className="text-lg text-muted-foreground">
            Choose the selling method that works best for your items
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {methods.map((method, idx) => (
            <div
              key={idx}
              className="bg-card rounded-xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center"
            >
              <div className={`text-5xl mb-4`}>{method.icon}</div>
              <h3 className="text-2xl font-bold text-foreground mb-3">{method.title}</h3>
              <p className="text-muted-foreground mb-6">{method.description}</p>
              <button className="px-6 py-2 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors">
                Learn More
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
