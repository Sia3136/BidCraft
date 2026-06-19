'use client'

interface CollectionCardProps {
  title: string
  description: string
  image: string
  itemCount: number
}

export function CollectionCard({ title, description, image, itemCount }: CollectionCardProps) {
  return (
    <div className="group bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
      {/* Image */}
      <div className="relative overflow-hidden h-40 bg-muted">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-2">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{description}</p>
        <p className="text-xs text-primary font-semibold">{itemCount.toLocaleString()} items</p>
      </div>
    </div>
  )
}
