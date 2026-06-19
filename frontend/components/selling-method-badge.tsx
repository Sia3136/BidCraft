'use client'

interface SellingMethodBadgeProps {
  method: 'AUCTION' | 'BUY_NOW' | 'OFFERS'
  size?: 'sm' | 'md'
}

export function SellingMethodBadge({ method, size = 'md' }: SellingMethodBadgeProps) {
  const baseClasses = size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm'
  
  const styles = {
    AUCTION: 'bg-amber-100 text-amber-800 border border-amber-200',
    BUY_NOW: 'bg-green-100 text-green-800 border border-green-200',
    OFFERS: 'bg-blue-100 text-blue-800 border border-blue-200',
  }

  const labels = {
    AUCTION: 'AUCTION',
    BUY_NOW: 'BUY NOW',
    OFFERS: 'OFFERS',
  }

  return (
    <span className={`inline-block font-medium rounded-full ${baseClasses} ${styles[method]}`}>
      {labels[method]}
    </span>
  )
}
