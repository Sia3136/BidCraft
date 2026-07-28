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
  src?: string | null
  alt?: string | null
  initials?: string | null
  name?: string | null
  identifier?: string | null
  verified?: boolean
}

function getInitials(name?: string | null) {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function stringToColor(str?: string | null, lightness = 80) {
  if (!str) return `hsl(0, 0%, ${lightness}%)`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360;
  return `hsl(${h}, 70%, ${lightness}%)`;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size, src, alt, initials, name, identifier, verified, ...props }, ref) => {
    const displayInitials = initials || getInitials(name);
    const colorSeed = identifier || name || "default";
    const bgColor = stringToColor(colorSeed, 85);
    const textColor = stringToColor(colorSeed, 25);

    return (
      <div className="relative inline-flex shrink-0">
        <div
          ref={ref}
          className={cn(avatarVariants({ size }), className)}
          {...props}
        >
          {src ? (
            <img
              src={src}
              alt={alt || name || "Avatar"}
              className="h-full w-full object-cover"
            />
          ) : (
            <div 
              className="flex h-full w-full items-center justify-center font-bold"
              style={{ backgroundColor: bgColor, color: textColor, fontSize: size === 'small' ? '12px' : size === 'large' ? '32px' : '16px' }}
            >
              {displayInitials}
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
