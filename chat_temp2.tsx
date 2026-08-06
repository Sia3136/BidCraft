'use client'

import React, { useState, useEffect } from 'react'
import { MessageSquare, X, Send } from 'lucide-react'

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="bg-white border border-[var(--color-border-subtle)] rounded-2xl shadow-xl w-80 h-96 mb-4 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-[var(--color-slate-900)] text-white p-4 flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-body-md">BidCraft Assistant</h3>
              <p className="text-xs text-white/70">Typically replies instantly</p>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white transition-colors"
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Messages Area */}
          <div className="flex-1 bg-[var(--color-cream-base)] p-4 overflow-y-auto flex flex-col gap-4">
            <div className="bg-white border border-[var(--color-border-subtle)] rounded-xl rounded-tl-sm p-3 max-w-[85%] self-start shadow-sm text-sm text-[var(--color-ink-900)]">
              Hi there! I'm the BidCraft assistant. How can I help you today?
            </div>
          </div>
          
          {/* Input Area */}
          <div className="p-3 bg-white border-t border-[var(--color-border-subtle)]">
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                placeholder="Type your message..."
                className="flex-1 bg-[var(--color-cream-soft)] border border-[var(--color-border-subtle)] rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-terracotta-600)]"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setMessage('')
                }}
              />
              <button 
                onClick={() => setMessage('')}
                className="w-9 h-9 rounded-full bg-[var(--color-terracotta-600)] text-white flex items-center justify-center hover:bg-[var(--color-terracotta-700)] transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!message.trim()}
                aria-label="Send message"
              >
                <Send size={16} className="-ml-0.5" />
              </button>
            </div>
          </div>
        </div>
      )}
      
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-[var(--color-terracotta-600)] rounded-full text-white shadow-lg flex items-center justify-center hover:bg-[var(--color-terracotta-700)] transition-transform hover:scale-105 active:scale-95 animate-in fade-in zoom-in duration-300"
          aria-label="Open chat"
        >
          <MessageSquare size={24} />
        </button>
      )}
    </div>
  )
}
