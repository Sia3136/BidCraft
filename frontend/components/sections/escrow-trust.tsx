'use client'

export function EscrowTrustSection() {
  const features = [
    {
      icon: '🔒',
      title: 'Escrow Protection',
      description: 'Your payment is held safely until you confirm receipt of your item.',
    },
    {
      icon: '✓',
      title: 'Verified Sellers',
      description: 'All sellers are verified and have been vetted by our community.',
    },
    {
      icon: '💰',
      title: 'Money Back Guarantee',
      description: 'If your item doesn\'t arrive or isn\'t as described, we refund your money.',
    },
    {
      icon: '🛡️',
      title: 'Buyer Protection',
      description: 'Full protection against disputes, fraud, and unauthorized transactions.',
    },
  ]

  return (
    <section className="py-16 bg-gradient-to-r from-primary/5 to-secondary/5 border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-3">Trust & Security</h2>
          <p className="text-lg text-muted-foreground">
            Buy and sell with confidence on BidCraft
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-card rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 text-center">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="font-bold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
