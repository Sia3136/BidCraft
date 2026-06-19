import Image from "next/image"
import { ArrowUpRight } from "lucide-react"

const CATEGORIES = [
  { name: "Art", count: "3,200 pieces", src: "/images/cat-art.png" },
  { name: "Crafts", count: "5,800 pieces", src: "/images/cat-crafts.png" },
  {
    name: "Collectibles",
    count: "2,100 pieces",
    src: "/images/cat-collectibles.png",
  },
  { name: "Hot Wheels", count: "940 pieces", src: "/images/cat-hotwheels.png" },
  { name: "Books", count: "1,600 pieces", src: "/images/cat-books.png" },
  {
    name: "Electronics",
    count: "780 pieces",
    src: "/images/cat-electronics.png",
  },
]

export function CategoryShowcase() {
  return (
    <section id="categories" className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
              Browse the gallery
            </span>
            <h2 className="mt-3 max-w-md font-serif text-4xl tracking-tight text-foreground text-balance lg:text-5xl">
              Explore by category
            </h2>
          </div>
          <p className="max-w-sm text-pretty text-muted-foreground">
            From original canvases to rare collectibles, every category is a
            curated room in our digital exhibition.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:gap-6">
          {CATEGORIES.map((cat) => (
            <a
              key={cat.name}
              href="#auctions"
              className="group relative aspect-[4/5] overflow-hidden rounded-3xl bg-secondary"
            >
              <Image
                src={cat.src || "/placeholder.svg"}
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
                <div>
                  <h3 className="font-serif text-xl text-background lg:text-2xl">
                    {cat.name}
                  </h3>
                  <p className="mt-0.5 text-sm text-background/75">
                    {cat.count}
                  </p>
                </div>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-background/90 text-foreground transition-transform duration-300 group-hover:-translate-y-1 group-hover:bg-primary group-hover:text-primary-foreground">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
