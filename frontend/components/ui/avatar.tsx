import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden rounded-[var(--radius-pill)]",
  {
    variants: {
      size: {
        small: "h-[32px] w-[32px]",
        default: "h-[48px] w-[48px]",
        large: "h-[96px] w-[96px]",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  src?: string
  alt?: string
  initials?: string
  verified?: boolean
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size, src, alt, initials, verified, ...props }, ref) => {
    return (
      <div className="relative inline-flex">
        <div
          ref={ref}
          className={cn(avatarVariants({ size }), className)}
          {...props}
        >
          {src ? (
            <img
              src={src}
              alt={alt}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[var(--color-slate-100)] text-[var(--color-slate-700)] text-heading-sm">
              {initials}
            </div>
          )}
        </div>
        {verified && (
          <div className="absolute bottom-0 right-0 flex h-[16px] w-[16px] items-center justify-center rounded-[var(--radius-pill)] bg-[var(--color-terracotta-600)] ring-2 ring-[var(--color-white)]">
            <Check className="h-[10px] w-[10px] text-[var(--color-white)]" strokeWidth={3} />
          </div>
        )}
      </div>
    )
  }
)
Avatar.displayName = "Avatar"

export { Avatar, avatarVariants }
