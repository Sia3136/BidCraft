import { ShieldCheck, BadgeCheck, Lock, Eye } from "lucide-react"

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Secure Escrow",
    desc: "Funds are held safely and only released once your piece arrives exactly as described.",
  },
  {
    icon: BadgeCheck,
    title: "Verified Sellers",
    desc: "Every creator is identity-verified and rated, so you always know who you're buying from.",
  },
  {
    icon: Lock,
    title: "Protected Payments",
    desc: "Encrypted, fraud-monitored transactions with full buyer and seller protection.",
  },
  {
    icon: Eye,
    title: "Transparent Bidding",
    desc: "Real-time bid history and clear pricing — no hidden fees, no surprises at checkout.",
  },
]

export function TrustSection() {
  return (
    <section className="bg-accent py-20 text-accent-foreground lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-accent-foreground/70">
            Built on trust
          </span>
          <h2 className="mt-3 font-serif text-4xl tracking-tight text-balance lg:text-5xl">
            Buy and sell with complete confidence
          </h2>
          <p className="mt-4 text-pretty text-accent-foreground/80">
            BidCraft protects every step of the journey so creators get fair
            value and collectors get exactly what they paid for.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-3xl border border-accent-foreground/15 bg-accent-foreground/5 p-7 backdrop-blur-sm"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-foreground/10">
                <f.icon className="h-6 w-6 text-accent-foreground" />
              </span>
              <h3 className="mt-5 font-serif text-xl">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-accent-foreground/75">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
