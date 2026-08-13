'use client'

import React, { useState } from 'react'
import { DashboardShell } from '@/components/dashboard-shell'
import { Search, Send, Clock, User } from 'lucide-react'

export default function MessagesPage() {
  const [activeThread, setActiveThread] = useState<number>(1)
  
  const threads = [
    { id: 1, name: 'Rahul M.', avatar: 'RM', preview: 'Is the item still available?', time: '2h ago', unread: true },
    { id: 2, name: 'Priya S.', avatar: 'PS', preview: 'Can you do ₹1,200 for the pottery?', time: '5h ago', unread: true },
    { id: 3, name: 'Arjun K.', avatar: 'AK', preview: 'When will this ship?', time: '1d ago', unread: false },
    { id: 4, name: 'Meena R.', avatar: 'MR', preview: 'Just received it, love it!', time: '2d ago', unread: false },
    { id: 5, name: 'Dev P.', avatar: 'DP', preview: 'Do you have more colors?', time: '3d ago', unread: false },
  ]
  
  const messagesData: Record<number, { sender: string, text: string, time: string, isMe: boolean }[]> = {
    1: [
      { sender: 'Rahul M.', text: 'Hi there, I am interested in your vintage table.', time: '10:00 AM', isMe: false },
      { sender: 'Rahul M.', text: 'Is the item still available?', time: '10:02 AM', isMe: false }
    ],
    2: [
      { sender: 'Priya S.', text: 'Hi, beautiful work on the pottery set.', time: 'Yesterday', isMe: false },
      { sender: 'Priya S.', text: 'Can you do ₹1,200 for the pottery?', time: 'Yesterday', isMe: false }
    ],
    3: [
      { sender: 'Arjun K.', text: 'Hello, I just placed an order.', time: '2 days ago', isMe: false },
      { sender: 'You', text: 'Thank you! I will pack it securely today.', time: '2 days ago', isMe: true },
      { sender: 'Arjun K.', text: 'When will this ship?', time: 'Yesterday', isMe: false }
    ],
    4: [
      { sender: 'You', text: 'Hi Meena, I have shipped your order. Tracking is included.', time: '4 days ago', isMe: true },
      { sender: 'Meena R.', text: 'Thank you so much!', time: '3 days ago', isMe: false },
      { sender: 'Meena R.', text: 'Just received it, love it!', time: '2 days ago', isMe: false }
    ],
    5: [
      { sender: 'Dev P.', text: 'Hi, I saw your woven baskets.', time: '4 days ago', isMe: false },
      { sender: 'Dev P.', text: 'Do you have more colors?', time: '3 days ago', isMe: false }
    ]
  }

  const activeMessages = messagesData[activeThread] || []
  const activeUser = threads.find(t => t.id === activeThread)

  return (
    <DashboardShell>
      <div className="max-w-6xl mx-auto flex h-[calc(100vh-120px)] bg-white rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] shadow-sm overflow-hidden">
        
        {/* Threads List */}
        <div className="w-full md:w-1/3 flex flex-col border-r border-[var(--color-border-subtle)] bg-[var(--color-cream-base)] h-full">
          <div className="p-4 border-b border-[var(--color-border-subtle)] bg-white">
            <h1 className="text-heading-sm font-display text-[var(--color-ink-900)] mb-4">Messages</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-ink-500)]" />
              <input 
                type="text" 
                placeholder="Search messages..." 
                className="w-full pl-9 pr-4 py-2 bg-[var(--color-cream-deep)] border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] text-body-sm outline-none focus:border-[var(--color-terracotta-600)] transition-colors"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {threads.map((thread) => (
              <button
                key={thread.id}
                onClick={() => setActiveThread(thread.id)}
                className={`w-full text-left p-4 border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-cream-raised)] transition-colors flex gap-3 ${activeThread === thread.id ? 'bg-white' : ''}`}
              >
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-full bg-[var(--color-terracotta-100)] text-[var(--color-terracotta-700)] flex items-center justify-center font-display font-medium text-lg">
                    {thread.avatar}
                  </div>
                  {thread.unread && (
                    <span className="absolute top-0 right-0 w-3 h-3 bg-[var(--color-terracotta-600)] border-2 border-[var(--color-white)] rounded-full"></span>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className={`text-body-md truncate ${thread.unread ? 'font-bold text-[var(--color-ink-900)]' : 'font-medium text-[var(--color-ink-800)]'}`}>
                      {thread.name}
                    </h3>
                    <span className="text-caption text-[var(--color-ink-500)] whitespace-nowrap ml-2">
                      {thread.time}
                    </span>
                  </div>
                  <p className={`text-body-sm truncate ${thread.unread ? 'font-medium text-[var(--color-ink-900)]' : 'text-[var(--color-ink-600)]'}`}>
                    {thread.preview}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Conversation View */}
        <div className="hidden md:flex w-2/3 flex-col bg-white h-full relative">
          {/* Header */}
          <div className="h-[73px] p-4 border-b border-[var(--color-border-subtle)] flex items-center justify-between bg-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--color-terracotta-100)] text-[var(--color-terracotta-700)] flex items-center justify-center font-display font-medium">
                {activeUser?.avatar}
              </div>
              <h2 className="text-heading-sm font-display text-[var(--color-ink-900)]">{activeUser?.name}</h2>
            </div>
            <button className="text-[var(--color-ink-500)] hover:text-[var(--color-ink-900)] transition-colors px-3 py-1.5 rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] text-body-sm font-medium">
              View Profile
            </button>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="text-center my-4">
              <span className="text-caption font-medium text-[var(--color-ink-500)] bg-[var(--color-cream-base)] px-3 py-1 rounded-full">
                This is a mock conversation
              </span>
            </div>
            
            {activeMessages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col max-w-[75%] ${msg.isMe ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
                <div className={`p-4 rounded-[var(--radius-lg)] ${
                  msg.isMe 
                    ? 'bg-[var(--color-terracotta-600)] text-white rounded-tr-sm' 
                    : 'bg-[var(--color-cream-base)] text-[var(--color-ink-900)] rounded-tl-sm border border-[var(--color-border-subtle)]'
                }`}>
                  <p className="text-body-md whitespace-pre-wrap">{msg.text}</p>
                </div>
                <span className="text-caption text-[var(--color-ink-500)] mt-1.5 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {msg.time}
                </span>
              </div>
            ))}
          </div>
          
          {/* Input Area */}
          <div className="p-4 border-t border-[var(--color-border-subtle)] bg-[var(--color-cream-base)] shrink-0">
            <div className="relative">
              <input 
                type="text" 
                disabled
                placeholder="Messaging coming soon — check back shortly." 
                className="w-full pl-4 pr-12 py-3 bg-white border border-[var(--color-border-subtle)] rounded-[var(--radius-lg)] text-body-md outline-none disabled:bg-[var(--color-cream-deep)] disabled:text-[var(--color-ink-500)] disabled:cursor-not-allowed cursor-not-allowed"
              />
              <button 
                disabled
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-[var(--radius-md)] bg-[var(--color-ink-300)] flex items-center justify-center text-white cursor-not-allowed"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </div>
          </div>
        </div>
        
      </div>
    </DashboardShell>
  )
}
