'use client'

interface CategoryCardProps {
  name: string
  count: number
  color: string
}

export function CategoryCard({ name, count, color }: CategoryCardProps) {
  return (
    <button className="group relative overflow-hidden rounded-xl h-32 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* Background */}
      <div className={`absolute inset-0 ${color} opacity-80 group-hover:opacity-100 transition-opacity`}></div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10">
        <h3 className="text-lg font-bold mb-1 group-hover:scale-110 transition-transform">{name}</h3>
        <p className="text-sm opacity-90">{count.toLocaleString()} items</p>
      </div>

      {/* Overlay on hover */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
    </button>
  )
}
