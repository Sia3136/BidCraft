import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, id, ...props }, ref) => {
    const generatedId = React.useId()
    const inputId = id || generatedId

    return (
      <div className="flex flex-col gap-[var(--space-2)] w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-caption text-[var(--color-ink-700)]"
          >
            {label}
          </label>
        )}
        <input
          type={type}
          id={inputId}
          className={cn(
            "flex h-[44px] w-full rounded-[var(--radius-sm)] border border-[var(--color-border-subtle)] bg-[var(--color-white)] px-3 py-2 text-body-md text-[var(--color-ink-900)] placeholder:text-[var(--color-ink-500)] focus-visible:outline-none focus-visible:border-[1.5px] focus-visible:border-[var(--color-terracotta-600)] disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-250 ease-default",
            "focus-visible:shadow-[0_0_0_3px_rgba(200,100,58,0.12)]",
            error && "border-[var(--color-urgent-600)] focus-visible:border-[var(--color-urgent-600)] focus-visible:shadow-[0_0_0_3px_rgba(188,74,64,0.12)]",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
