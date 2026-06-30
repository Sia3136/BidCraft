import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { CheckCircle2 } from "lucide-react"

const badgeVariants = cva(
  "inline-flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta-600)] focus:ring-offset-2",
  {
    variants: {
      variant: {
        chip:
          "bg-[var(--color-cream-deep)] text-caption text-[var(--color-ink-900)] rounded-[var(--radius-pill)] px-[14px] py-[8px]",
        tag:
          "bg-[var(--color-slate-100)] text-[var(--color-slate-700)] text-caption font-semibold rounded-[var(--radius-sm)] px-[10px] py-[4px]",
        method:
          "bg-[var(--color-terracotta-100)] text-[var(--color-terracotta-700)] text-[12px] font-semibold uppercase tracking-[0.04em] rounded-[var(--radius-pill)] px-[12px] py-[6px]",
        trust:
          "bg-[var(--color-success-100)] text-[var(--color-success-700)] text-caption rounded-[var(--radius-pill)] px-[12px] py-[6px] gap-[4px]",
        urgent:
          "bg-[var(--color-urgent-100)] text-[var(--color-urgent-700)] text-caption rounded-[var(--radius-pill)] px-[12px] py-[6px] gap-[6px]",
      },
    },
    defaultVariants: {
      variant: "chip",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {variant === "trust" && (
        <CheckCircle2 size={14} className="fill-[var(--color-success-600)] text-[var(--color-white)]" />
      )}
      {variant === "urgent" && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-urgent-600)] opacity-75 duration-[1500ms]"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-urgent-600)]"></span>
        </span>
      )}
      {children}
    </div>
  )
}

export { Badge, badgeVariants }
