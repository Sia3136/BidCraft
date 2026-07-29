import React from 'react'

interface FieldErrorProps {
  message?: string | null
}

export function FieldError({ message }: FieldErrorProps) {
  if (!message) return null

  return (
    <p className="text-body-sm text-[var(--color-urgent-600)] mt-1.5 font-medium animate-in fade-in slide-in-from-top-1 duration-200">
      {message}
    </p>
  )
}
