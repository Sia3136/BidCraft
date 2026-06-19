import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const COLUMNS = [
  {
    title: "Marketplace",
    links: ["Explore", "Live Auctions", "Categories", "Collections"],
  },
  {
    title: "Creators",
    links: ["Start Selling", "Creator Guide", "Trust Score", "Featured Makers"],
  },
  {
    title: "Company",
    links: ["About", "Escrow & Trust", "Careers", "Press"],
  },
  {
    title: "Support",
    links: ["Help Center", "Contact", "Terms", "Privacy"],
  },
]

export function SiteFooter() {
  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_2fr]">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <span className="font-serif text-lg leading-none">B</span>
              </span>
              <span className="font-serif text-2xl">BidCraft</span>
            </div>
            <p className="mt-4 text-pretty leading-relaxed text-background/70">
              A digital exhibition where creativity finds its value. Discover,
              bid on, and sell handmade art and collectibles — protected by
              escrow at every step.
            </p>

            <form className="mt-7 flex max-w-sm flex-col gap-3 sm:flex-row">
              <Input
                type="email"
                required
                placeholder="Your email"
                aria-label="Email address"
                className="rounded-full border-background/20 bg-background/10 text-background placeholder:text-background/50"
              />
              <Button
                type="submit"
                className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Subscribe
              </Button>
            </form>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className="font-serif text-base text-background">
                  {col.title}
                </h3>
                <ul className="mt-4 space-y-3">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-background/65 transition-colors hover:text-background"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-background/15 pt-8 sm:flex-row sm:items-center">
          <p className="text-sm text-background/55">
            © {new Date().getFullYear()} BidCraft. Crafted for creators.
          </p>
          <div className="flex items-center gap-6 text-sm text-background/65">
            <a href="#" className="transition-colors hover:text-background">
              Instagram
            </a>
            <a href="#" className="transition-colors hover:text-background">
              Pinterest
            </a>
            <a href="#" className="transition-colors hover:text-background">
              Twitter
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
