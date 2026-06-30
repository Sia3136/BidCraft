'use client'

import React, { useState } from 'react'

// Custom Pill Switch Component
function PillSwitch({ checked, onChange, label }: { checked: boolean, onChange: (val: boolean) => void, label: string }) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-body-md text-ink-900 font-medium">{label}</span>
      <button 
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-fast ease-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-600 ${
          checked ? 'bg-terracotta-600' : 'bg-cream-deep'
        }`}
      >
        <span className="sr-only">Toggle {label}</span>
        <span
          aria-hidden="true"
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform duration-fast ease-default ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  )
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('Profile')
  
  // Notification States
  const [notifBids, setNotifBids] = useState(true)
  const [notifMessages, setNotifMessages] = useState(true)
  const [notifOrders, setNotifOrders] = useState(true)
  const [notifMarketing, setNotifMarketing] = useState(false)

  const tabs = ['Profile', 'Account', 'Payments', 'Notifications', 'Privacy']

  return (
    <div className="animate-in fade-in duration-500 max-w-[880px] mx-auto">
      <div className="mb-8 border-b border-border-subtle pb-6">
        <h1 className="text-display-md text-foreground mb-2">Settings</h1>
        <p className="text-body-md text-ink-500">Manage your account preferences and personal details.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left Tab List */}
        <div className="w-full md:w-48 shrink-0">
          <nav className="flex md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0 border-b md:border-b-0 border-border-subtle">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-left px-3 py-2 text-sm font-semibold whitespace-nowrap transition-colors rounded-md relative ${
                  activeTab === tab 
                    ? 'text-terracotta-700 bg-terracotta-100/50' 
                    : 'text-ink-500 hover:text-ink-900 hover:bg-slate-50'
                }`}
              >
                {activeTab === tab && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-terracotta-600 rounded-r-md hidden md:block" />
                )}
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Right Content Area */}
        <div className="flex-1">
          {activeTab === 'Profile' && (
            <div className="bg-white p-6 rounded-md border border-border-subtle shadow-card">
              <h2 className="text-heading-lg mb-6">Profile Information</h2>
              
              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 overflow-hidden">
                  <span className="text-body-lg">JD</span>
                </div>
                <button className="bg-cream-raised text-ink-900 border border-border-subtle hover:bg-slate-100 px-4 py-2 rounded-md font-semibold text-sm transition-colors">
                  Change Avatar
                </button>
              </div>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="block text-sm font-semibold text-ink-900">First Name</label>
                    <input id="firstName" type="text" defaultValue="John" className="w-full bg-white border border-border-subtle rounded-md px-3 py-2 text-ink-900 focus:outline-none focus:border-terracotta-600 focus:ring-1 focus:ring-terracotta-600 transition-shadow" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="block text-sm font-semibold text-ink-900">Last Name</label>
                    <input id="lastName" type="text" defaultValue="Doe" className="w-full bg-white border border-border-subtle rounded-md px-3 py-2 text-ink-900 focus:outline-none focus:border-terracotta-600 focus:ring-1 focus:ring-terracotta-600 transition-shadow" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="bio" className="block text-sm font-semibold text-ink-900">Bio</label>
                  <textarea id="bio" rows={4} className="w-full bg-white border border-border-subtle rounded-md px-3 py-2 text-ink-900 focus:outline-none focus:border-terracotta-600 focus:ring-1 focus:ring-terracotta-600 transition-shadow resize-y" placeholder="Tell the community about yourself..."></textarea>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-border-subtle">
                  <button type="button" className="text-ink-500 hover:text-ink-900 px-4 py-2 font-semibold transition-colors">Cancel</button>
                  <button type="button" className="bg-terracotta-600 text-white hover:bg-terracotta-700 px-6 py-2 rounded-md font-semibold transition-colors">Save Changes</button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'Notifications' && (
            <div className="bg-white p-6 rounded-md border border-border-subtle shadow-card">
              <h2 className="text-heading-lg mb-2">Notification Preferences</h2>
              <p className="text-body-md text-ink-500 mb-6 pb-6 border-b border-border-subtle">Choose what updates you want to receive via email and push.</p>
              
              <div className="space-y-2 divide-y divide-border-subtle">
                <PillSwitch label="Bids & Auctions (Outbid alerts, auction end)" checked={notifBids} onChange={setNotifBids} />
                <PillSwitch label="Direct Messages" checked={notifMessages} onChange={setNotifMessages} />
                <PillSwitch label="Order Updates (Shipping, delivery, escrow)" checked={notifOrders} onChange={setNotifOrders} />
                <PillSwitch label="Marketing & Promotions" checked={notifMarketing} onChange={setNotifMarketing} />
              </div>

              <div className="pt-8 flex justify-end gap-3">
                <button type="button" className="bg-terracotta-600 text-white hover:bg-terracotta-700 px-6 py-2 rounded-md font-semibold transition-colors">Save Preferences</button>
              </div>
            </div>
          )}

          {/* Placeholder for other tabs */}
          {['Account', 'Payments', 'Privacy'].includes(activeTab) && (
            <div className="bg-white p-6 rounded-md border border-border-subtle shadow-card flex items-center justify-center min-h-[300px]">
              <p className="text-ink-500 font-medium">This section is currently under construction.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
