'use client'

import { HOW_IT_WORKS } from '@/lib/mock-data'

export function HowItWorksSection() {
  const icons = {
    search: '🔍',
    target: '🎯',
    lock: '🔒',
    truck: '🚚',
    star: '⭐',
  }

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-3">How BidCraft Works</h2>
          <p className="text-lg text-muted-foreground">
            Get started in just 5 simple steps
          </p>
        </div>

        {/* Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {HOW_IT_WORKS.map((item, idx) => (
            <div key={idx} className="relative">
              {/* Card */}
              <div className="bg-card rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 text-center">
                <div className="text-4xl mb-4">{icons[item.icon as keyof typeof icons]}</div>
                <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>

              {/* Step Number */}
              <div className="absolute -top-3 -left-3 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md">
                {item.step}
              </div>

              {/* Connector Line */}
              {idx < HOW_IT_WORKS.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-2 w-4 h-1 bg-primary/30 -translate-y-1/2 transform"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
