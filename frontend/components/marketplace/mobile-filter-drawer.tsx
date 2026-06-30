'use client'

import * as React from 'react'
import { X, ChevronDown } from 'lucide-react'
import * as Accordion from '@radix-ui/react-accordion'
import { Button } from '@/components/ui/button'
import { PriceSlider } from './price-slider'
import { cn } from '@/lib/utils'

interface MobileFilterDrawerProps {
  isOpen: boolean
  onClose: () => void
  resultCount: number
}

// Custom Checkbox for filters (matching spec: 18px square, terracotta fill when checked)
function FilterCheckbox({ label, count, checked, onChange }: { label: string, count?: number, checked: boolean, onChange: () => void }) {
  return (
    <label className="flex items-center justify-between py-[var(--space-2)] cursor-pointer group">
      <div className="flex items-center gap-[var(--space-3)]">
        <div 
          className={cn(
            "w-[18px] h-[18px] rounded-[var(--radius-sm)] border flex items-center justify-center transition-colors",
            checked ? "bg-[var(--color-terracotta-600)] border-[var(--color-terracotta-600)]" : "border-[var(--color-border-subtle)] bg-transparent group-hover:border-[var(--color-terracotta-600)]"
          )}
        >
          {checked && (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
        <span className="text-body-md text-[var(--color-ink-900)]">{label}</span>
      </div>
      {count !== undefined && (
        <span className="text-caption text-[var(--color-ink-500)]">({count})</span>
      )}
      {/* Hidden native checkbox for accessibility/state if needed, though we manage state via props */}
      <input type="checkbox" className="hidden" checked={checked} onChange={onChange} />
    </label>
  )
}

export function MobileFilterDrawer({ isOpen, onClose, resultCount }: MobileFilterDrawerProps) {
  // Mock state for filters
  const [methods, setMethods] = React.useState<Record<string, boolean>>({ 'Buy Now': true })
  const [priceRange, setPriceRange] = React.useState<[number, number]>([0, 10000])

  const toggleMethod = (method: string) => {
    setMethods(prev => ({ ...prev, [method]: !prev[method] }))
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-opacity duration-base",
          isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        )} 
        onClick={onClose}
      />

      {/* Drawer */}
      <div 
        className={cn(
          "fixed bottom-0 left-0 right-0 bg-[var(--color-cream-base)] rounded-t-[var(--radius-lg)] z-[110] flex flex-col h-[85vh] max-h-[800px] transition-transform duration-base ease-emphasis",
          isOpen ? "translate-y-0" : "translate-y-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-[var(--space-5)] border-b border-[var(--color-border-subtle)] shrink-0">
          <div className="w-[24px]" /> {/* Spacer for centering */}
          <h2 className="text-heading-lg text-[var(--color-ink-900)]">Filters</h2>
          <button onClick={onClose} className="w-[24px] h-[24px] flex items-center justify-center text-[var(--color-ink-900)]">
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-[var(--space-5)]">
          <Accordion.Root type="multiple" defaultValue={['buying-method']} className="flex flex-col gap-[var(--space-2)]">
            
            {/* Buying Method */}
            <Accordion.Item value="buying-method" className="border-b border-[var(--color-border-subtle)] py-[var(--space-3)]">
              <Accordion.Header>
                <Accordion.Trigger className="flex items-center justify-between w-full group">
                  <span className="text-heading-sm text-[var(--color-ink-900)]">Buying Method</span>
                  <ChevronDown size={20} className="text-[var(--color-ink-500)] transition-transform duration-200 ease-out group-data-[state=open]:rotate-180" />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                <div className="pt-[var(--space-3)] flex flex-col">
                  <FilterCheckbox label="Buy Now" count={142} checked={!!methods['Buy Now']} onChange={() => toggleMethod('Buy Now')} />
                  <FilterCheckbox label="Auction" count={89} checked={!!methods['Auction']} onChange={() => toggleMethod('Auction')} />
                  <FilterCheckbox label="Negotiable" count={34} checked={!!methods['Negotiable']} onChange={() => toggleMethod('Negotiable')} />
                  <FilterCheckbox label="Tradeable" count={12} checked={!!methods['Tradeable']} onChange={() => toggleMethod('Tradeable')} />
                </div>
              </Accordion.Content>
            </Accordion.Item>

            {/* Price Range */}
            <Accordion.Item value="price-range" className="border-b border-[var(--color-border-subtle)] py-[var(--space-3)]">
              <Accordion.Header>
                <Accordion.Trigger className="flex items-center justify-between w-full group">
                  <span className="text-heading-sm text-[var(--color-ink-900)]">Price Range</span>
                  <ChevronDown size={20} className="text-[var(--color-ink-500)] transition-transform duration-200 ease-out group-data-[state=open]:rotate-180" />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                <div className="pt-[var(--space-4)] pb-[var(--space-2)] px-1">
                  <PriceSlider min={0} max={20000} step={100} value={priceRange} onValueChange={setPriceRange} />
                </div>
              </Accordion.Content>
            </Accordion.Item>

            {/* Subcategory */}
            <Accordion.Item value="subcategory" className="border-b border-[var(--color-border-subtle)] py-[var(--space-3)]">
              <Accordion.Header>
                <Accordion.Trigger className="flex items-center justify-between w-full group">
                  <span className="text-heading-sm text-[var(--color-ink-900)]">Subcategory</span>
                  <ChevronDown size={20} className="text-[var(--color-ink-500)] transition-transform duration-200 ease-out group-data-[state=open]:rotate-180" />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                <div className="pt-[var(--space-3)] flex flex-col">
                  <FilterCheckbox label="Paintings" count={45} checked={false} onChange={() => {}} />
                  <FilterCheckbox label="Digital Art" count={23} checked={false} onChange={() => {}} />
                </div>
              </Accordion.Content>
            </Accordion.Item>

          </Accordion.Root>
        </div>

        {/* Sticky Footer */}
        <div className="p-[var(--space-5)] border-t border-[var(--color-border-subtle)] bg-[var(--color-cream-base)] shrink-0 flex items-center justify-between">
          <Button variant="ghost" className="text-[var(--color-ink-700)]">
            Clear All
          </Button>
          <Button onClick={onClose}>
            Show {resultCount} Results
          </Button>
        </div>

      </div>
    </>
  )
}
