'use client'

import React from 'react'
import { Button } from '@/components/ui/button'

export function ChatButton() {
  return (
    <Button 
      variant="outline" 
      className="bg-white text-[var(--color-ink-900)] hover:bg-[var(--color-cream-base)] border-none"
      onClick={() => window.dispatchEvent(new CustomEvent('open-chat'))}
    >
      Start Chatting
    </Button>
  )
}
