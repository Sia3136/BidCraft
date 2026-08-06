import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-[14px] leading-[22px] font-semibold transition-all duration-250 ease-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--color-terracotta-600)] text-white hover:bg-[var(--color-terracotta-700)] rounded-[var(--radius-md)]",
        secondary:
          "bg-transparent border-[1.5px] border-[var(--color-slate-700)] text-[var(--color-slate-900)] hover:bg-[var(--color-cream-deep)] rounded-[var(--radius-md)]",
        ghost:
          "bg-transparent text-[var(--color-ink-700)] hover:underline rounded-[var(--radius-md)]",
        destructive:
          "bg-transparent border-[1.5px] border-[var(--color-urgent-600)] text-[var(--color-urgent-700)] hover:bg-[var(--color-urgent-100)] rounded-[var(--radius-md)]",
        icon:
          "bg-transparent text-[var(--color-ink-700)] hover:bg-[var(--color-cream-deep)] rounded-[var(--radius-sm)]",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-[44px] px-[28px]",
        compact: "h-[36px] px-[20px]",
        large: "h-[52px] px-[32px] text-[16px]",
        icon: "h-[44px] w-[44px] p-[8px]",
        iconSm: "h-[36px] w-[36px] p-[6px]",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
      },
    },
    compoundVariants: [
      {
        variant: "ghost",
        size: "default",
        className: "px-[20px] py-[12px]",
      }
    ],
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
