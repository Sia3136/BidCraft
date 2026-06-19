import Image from "next/image"
import { ArrowRight, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CraftOfDay() {
  return (
    <section id="craft" className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
          <div className="grid lg:grid-cols-2">
            <div className="relative min-h-[340px] lg:min-h-[560px]">
              <Image
                src="/images/craft-of-day.png"
                alt="Handcrafted terracotta teapot, Craft of the Day"
                fill
                className="object-cover"
              />
              <span className="absolute left-6 top-6 rounded-full bg-background/90 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-foreground backdrop-blur">
                Craft of the day
              </span>
            </div>

            <div className="flex flex-col justify-center p-8 lg:p-14">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
                Featured creation
              </p>
              <h2 className="mt-4 font-serif text-4xl leading-tight tracking-tight text-foreground text-balance lg:text-5xl">
                The Amber Ridge Teapot
              </h2>

              <div className="mt-6 flex items-start gap-3">
                <Quote className="mt-1 h-6 w-6 shrink-0 text-primary/40" />
                <p className="text-lg leading-relaxed text-muted-foreground text-pretty">
                  &ldquo;I threw this teapot during the first cold week of
                  autumn, glazing it in the colour of the light through my
                  studio window. Every curve is meant to be held.&rdquo;
                </p>
              </div>

              <div className="mt-8 flex items-center gap-4">
                <div className="relative h-12 w-12 overflow-hidden rounded-full ring-2 ring-secondary">
                  <Image
                    src="/images/creator-1.png"
                    alt="Mara Ellison"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-serif text-lg text-foreground">
                    Mara Ellison
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Ceramic Artist · Portland, OR
                  </p>
                </div>
              </div>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Button
                  size="lg"
                  className="group rounded-full bg-primary px-7 text-primary-foreground hover:bg-primary/90"
                >
                  Bid from $320
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <span className="text-sm text-muted-foreground">
                  Auction closes in 4h 18m
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
