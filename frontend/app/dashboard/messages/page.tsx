'use client'

import React, { useState } from 'react'
import { Paperclip, Send, User } from 'lucide-react'

// Mock Data
const mockConversations = [
  {
    id: 'conv-1',
    user: { name: 'Alex M.', avatar: 'https://i.pravatar.cc/150?u=1' },
    lastMessage: 'Great, I will ship it tomorrow morning.',
    timestamp: '10:42 AM',
    unread: true,
  },
  {
    id: 'conv-2',
    user: { name: 'Sarah K.', avatar: 'https://i.pravatar.cc/150?u=2' },
    lastMessage: 'Is the price negotiable?',
    timestamp: 'Yesterday',
    unread: false,
  },
  {
    id: 'conv-3',
    user: { name: 'David R.', avatar: 'https://i.pravatar.cc/150?u=3' },
    lastMessage: 'Thank you! The package arrived safely.',
    timestamp: 'Mon',
    unread: false,
  }
]

const mockMessages = [
  { id: 'm1', type: 'system', text: 'Offer accepted for ₹4,500', time: 'Yesterday 10:00 AM' },
  { id: 'm2', type: 'other', text: 'Hi, I just accepted your offer. When can you ship it?', time: 'Yesterday 10:05 AM' },
  { id: 'm3', type: 'own', text: 'Thanks! I will get it packed today and ship it out tomorrow morning via Bluedart.', time: 'Yesterday 11:30 AM' },
  { id: 'm4', type: 'other', text: 'Perfect. Let me know the tracking number once you have it.', time: 'Yesterday 11:45 AM' },
  { id: 'm5', type: 'system', text: 'Item shipped. Tracking: BD123456789', time: 'Today 10:40 AM' },
  { id: 'm6', type: 'own', text: 'Just dropped it off. Tracking info should update in a few hours.', time: '10:41 AM' },
  { id: 'm7', type: 'other', text: 'Great, I will ship it tomorrow morning.', time: '10:42 AM' },
]

export default function MessagesPage() {
  const [activeConv, setActiveConv] = useState(mockConversations[0].id)
  const [inputText, setInputText] = useState('')

  const activeUser = mockConversations.find(c => c.id === activeConv)?.user

  return (
    <div className="animate-in fade-in duration-500 h-[calc(100vh-100px)] flex flex-col md:flex-row bg-white rounded-md border border-border-subtle shadow-card overflow-hidden">
      
      {/* Left Pane: Conversation List */}
      <div className="w-full md:w-[320px] lg:w-[380px] flex flex-col border-r border-border-subtle bg-slate-50 shrink-0">
        <div className="p-4 border-b border-border-subtle bg-white">
          <h2 className="text-heading-lg text-ink-900">Messages</h2>
        </div>
        <div className="overflow-y-auto flex-1">
          {mockConversations.map((conv) => (
            <div 
              key={conv.id}
              onClick={() => setActiveConv(conv.id)}
              className={`flex items-start gap-3 p-4 cursor-pointer transition-colors border-b border-border-subtle last:border-b-0 ${
                activeConv === conv.id ? 'bg-terracotta-100/30' : 'bg-white hover:bg-cream-raised'
              }`}
            >
              <div className="relative">
                {conv.user.avatar ? (
                  <img src={conv.user.avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center">
                    <User className="w-6 h-6 text-slate-500" />
                  </div>
                )}
                {conv.unread && (
                  <div className="absolute top-0 right-0 w-3 h-3 bg-terracotta-600 rounded-full border-2 border-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className={`text-body-md truncate ${conv.unread ? 'font-bold text-ink-900' : 'font-semibold text-ink-900'}`}>
                    {conv.user.name}
                  </h4>
                  <span className={`text-[10px] whitespace-nowrap ml-2 ${conv.unread ? 'font-bold text-terracotta-600' : 'font-medium text-ink-500'}`}>
                    {conv.timestamp}
                  </span>
                </div>
                <p className={`text-sm truncate ${conv.unread ? 'font-semibold text-ink-900' : 'text-ink-500'}`}>
                  {conv.lastMessage}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Pane: Active Thread */}
      <div className="flex-1 flex flex-col min-w-0 bg-cream-base relative h-full">
        {/* Header */}
        <div className="p-4 border-b border-border-subtle bg-white flex items-center gap-3 shrink-0">
          <img src={activeUser?.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
          <div>
            <h3 className="text-body-lg font-semibold text-ink-900">{activeUser?.name}</h3>
            <p className="text-xs text-ink-500 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-success-600 inline-block" /> Online
            </p>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {mockMessages.map((msg) => {
            if (msg.type === 'system') {
              return (
                <div key={msg.id} className="relative flex justify-center py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border-subtle"></div>
                  </div>
                  <div className="relative bg-cream-base px-4 text-caption text-ink-500 text-center">
                    {msg.text} <span className="block text-[10px] mt-0.5 opacity-70">{msg.time}</span>
                  </div>
                </div>
              )
            }

            const isOwn = msg.type === 'own'
            return (
              <div key={msg.id} className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
                <div 
                  className={`max-w-[80%] md:max-w-[70%] px-4 py-2.5 shadow-sm text-body-md ${
                    isOwn 
                      ? 'bg-terracotta-600 text-white rounded-t-xl rounded-bl-xl rounded-br-sm' 
                      : 'bg-cream-raised text-ink-900 border border-border-subtle rounded-t-xl rounded-br-xl rounded-bl-sm'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-ink-500 mt-1 px-1">{msg.time}</span>
              </div>
            )
          })}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-border-subtle shrink-0">
          <div className="flex items-center gap-2 bg-slate-50 border border-border-subtle rounded-md p-2 focus-within:ring-1 focus-within:ring-terracotta-600 focus-within:border-terracotta-600 transition-shadow">
            <button className="p-2 text-ink-500 hover:text-ink-900 transition-colors rounded-full hover:bg-slate-200">
              <Paperclip className="w-5 h-5" />
            </button>
            <input 
              type="text" 
              placeholder="Type a message..." 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-transparent border-none focus:outline-none text-ink-900 placeholder:text-ink-300"
            />
            <button 
              className={`p-2 rounded-full transition-colors flex items-center justify-center ${
                inputText.trim() ? 'bg-terracotta-600 text-white hover:bg-terracotta-700' : 'bg-slate-200 text-ink-300'
              }`}
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </div>
        </div>
      </div>
      
    </div>
  )
}
