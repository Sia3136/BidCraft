'use client'

interface CreatorCardProps {
  name: string
  image: string
  trustScore: number
  rating: number
  followers: number
  products: number
  verified?: boolean
}

export function CreatorCard({
  name,
  image,
  trustScore,
  rating,
  followers,
  products,
  verified = false,
}: CreatorCardProps) {
  return (
    <div className="bg-card rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 text-center hover:-translate-y-1">
      {/* Avatar */}
      <div className="relative mb-4">
        <img
          src={image}
          alt={name}
          className="w-16 h-16 rounded-full mx-auto object-cover border-3 border-primary"
        />
        {verified && (
          <div className="absolute bottom-0 right-1/2 translate-x-1/2 translate-y-1/2 bg-secondary text-white rounded-full p-1">
            <span className="text-xs">✓</span>
          </div>
        )}
      </div>

      {/* Name */}
      <h3 className="font-semibold text-foreground mb-1">{name}</h3>

      {/* Trust & Rating */}
      <div className="flex items-center justify-center gap-2 mb-3">
        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-semibold">
          {trustScore}% Trust
        </span>
        <span className="text-xs text-muted-foreground">
          {rating} ⭐
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 mb-4 py-3 border-y border-border">
        <div>
          <p className="text-lg font-bold text-primary">{followers.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Followers</p>
        </div>
        <div>
          <p className="text-lg font-bold text-secondary">{products}</p>
          <p className="text-xs text-muted-foreground">Items</p>
        </div>
      </div>

      {/* Action */}
      <button className="w-full bg-primary text-white py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
        Follow
      </button>
    </div>
  )
}
