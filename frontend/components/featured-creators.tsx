import Image from "next/image"
import { Star, BadgeCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

const CREATORS = [
  {
    name: "Mara Ellison",
    craft: "Ceramic Artist",
    rating: "4.9",
    trust: 98,
    avatar: "/images/creator-1.png",
    work: "/images/auction-1.png",
    workTitle: "Sage Stoneware Vase",
  },
  {
    name: "Theo Vance",
    craft: "Abstract Painter",
    rating: "4.8",
    trust: 95,
    avatar: "/images/creator-2.png",
    work: "/images/auction-2.png",
    workTitle: "Untitled No. 12",
  },
  {
    name: "Iris Bloom",
    craft: "Fiber Artist",
    rating: "5.0",
    trust: 99,
    avatar: "/images/creator-3.png",
    work: "/images/auction-3.png",
    workTitle: "Woven Dawn Hanging",
  },
]

export function FeaturedCreators() {
  return (
    <section id="creators" className="bg-secondary/50 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
              The makers
            </span>
            <h2 className="mt-3 max-w-md font-serif text-4xl tracking-tight text-foreground text-balance lg:text-5xl">
              Featured creators
            </h2>
          </div>
          <Button
            variant="outline"
            className="rounded-full border-foreground/20 bg-background"
          >
            View all creators
          </Button>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {CREATORS.map((c) => (
            <article
              key={c.name}
              className="group overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="relative aspect-[3/2] overflow-hidden">
                <Image
                  src={c.work || "/placeholder.svg"}
                  alt={c.workTitle}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1 text-xs font-medium text-foreground backdrop-blur">
                  {c.workTitle}
                </span>
              </div>

              <div className="flex items-center gap-4 p-5">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full ring-2 ring-background">
                  <Image
                    src={c.avatar || "/placeholder.svg"}
                    alt={c.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="truncate font-serif text-lg text-foreground">
                      {c.name}
                    </h3>
                    <BadgeCheck className="h-4 w-4 shrink-0 text-accent" />
                  </div>
                  <p className="text-sm text-muted-foreground">{c.craft}</p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-border px-5 py-4">
                <div className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span className="text-sm font-medium text-foreground">
                    {c.rating}
                  </span>
                  <span className="text-sm text-muted-foreground">rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Trust score
                  </span>
                  <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-sm font-semibold text-accent">
                    {c.trust}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
