'use client'

import { 
  ShieldCheck, 
  Package, 
  Truck, 
  MapPinCheck, 
  HandCoins 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type EscrowStage = 0 | 1 | 2 | 3 | 4
export type EscrowStatus = 'active' | 'completed' | 'disputed'

interface EscrowTrackerProps {
  currentStage: EscrowStage
  status?: EscrowStatus
  disputeMessage?: string
  className?: string
}

const STAGES = [
  { label: 'Payment Held', icon: ShieldCheck },
  { label: 'Seller Shipped', icon: Package },
  { label: 'In Transit', icon: Truck },
  { label: 'Delivered', icon: MapPinCheck },
  { label: 'Funds Released', icon: HandCoins },
]

export function EscrowTracker({ 
  currentStage, 
  status = 'active', 
  disputeMessage,
  className 
}: EscrowTrackerProps) {
  return (
    <div className={cn("flex flex-col w-full", className)}>
      
      {/* Stepper Container */}
      <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-[var(--space-6)] md:gap-0">
        
        {STAGES.map((stage, index) => {
          const isCompleted = index < currentStage || (index === currentStage && status === 'completed')
          const isActive = index === currentStage && status === 'active'
          const isDisputed = index === currentStage && status === 'disputed'
          const isFuture = index > currentStage

          // Determine line states (connecting to the NEXT stage)
          const isLineCompleted = index < currentStage && status !== 'disputed'
          
          return (
            <div key={stage.label} className="relative flex flex-row md:flex-col items-center gap-[var(--space-3)] md:gap-[var(--space-2)] flex-1 w-full md:w-auto">
              
              {/* Background Connecting Line (Mobile Vertical / Desktop Horizontal) */}
              {index < STAGES.length - 1 && (
                <div className="absolute top-[16px] left-[16px] md:top-[16px] md:left-[50%] w-[2px] h-full md:w-[100%] md:h-[2px] bg-[var(--color-ink-300)] -z-10" />
              )}
              
              {/* Foreground Connecting Line */}
              {index < STAGES.length - 1 && isLineCompleted && (
                <div className="absolute top-[16px] left-[16px] md:top-[16px] md:left-[50%] w-[2px] h-full md:w-[100%] md:h-[2px] bg-[var(--color-success-600)] transition-all duration-400 ease-default -z-10" />
              )}

              {/* Circle Icon Container */}
              <div 
                className={cn(
                  "relative z-10 flex shrink-0 items-center justify-center w-[32px] h-[32px] rounded-full transition-colors duration-400 ease-default",
                  isCompleted && "bg-[var(--color-success-600)]",
                  isActive && "bg-white border-2 border-[var(--color-terracotta-600)]",
                  isDisputed && "bg-[var(--color-urgent-600)]",
                  isFuture && "bg-[var(--color-cream-deep)]"
                )}
              >
                {/* Active Pulse Effect */}
                {isActive && (
                  <div className="absolute inset-[-4px] rounded-full border border-[var(--color-terracotta-600)] animate-[pulse_2s_ease-in-out_infinite] opacity-60 pointer-events-none" />
                )}

                <stage.icon 
                  size={16} 
                  strokeWidth={2}
                  className={cn(
                    "transition-colors duration-400 ease-default",
                    isCompleted && "text-white",
                    isActive && "text-[var(--color-terracotta-600)]",
                    isDisputed && "text-white",
                    isFuture && "text-[var(--color-ink-300)]"
                  )}
                />
              </div>

              {/* Label */}
              <span 
                className={cn(
                  "text-caption md:text-center md:absolute md:top-[40px] md:left-1/2 md:-translate-x-1/2 md:w-max",
                  (isCompleted || isActive || isDisputed) ? "text-[var(--color-ink-900)] font-medium" : "text-[var(--color-ink-500)]"
                )}
              >
                {stage.label}
              </span>
            </div>
          )
        })}
      </div>

      {/* Spacing for absolute labels on desktop */}
      <div className="hidden md:block h-[40px]" />

      {/* Dispute Banner */}
      {status === 'disputed' && (
        <div className="mt-[var(--space-6)] bg-[var(--color-urgent-100)] rounded-[var(--radius-md)] p-[var(--space-4)] flex flex-col md:flex-row md:items-center justify-between gap-[var(--space-3)] animate-fade-up">
          <p className="text-body-md text-[var(--color-urgent-700)] font-medium">
            {disputeMessage || "There is an active dispute on this transaction."}
          </p>
          <Button variant="secondary" className="border-[var(--color-urgent-200)] hover:bg-[var(--color-urgent-200)] text-[var(--color-urgent-700)] shrink-0">
            View Dispute Details
          </Button>
        </div>
      )}

      {/* Current Stage Detail Card */}
      {status !== 'disputed' && (
        <div className="mt-[var(--space-6)] bg-[var(--color-cream-raised)] rounded-[var(--radius-md)] p-[var(--space-5)] animate-fade-up">
          {currentStage === 0 && (
            <div className="flex flex-col gap-2">
              <h4 className="text-heading-sm text-[var(--color-ink-900)]">Payment Secured</h4>
              <p className="text-body-md text-[var(--color-ink-700)]">We have secured your payment. The seller has 3 days to ship your item.</p>
            </div>
          )}
          {currentStage === 1 && (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-[var(--space-4)]">
              <div className="flex flex-col gap-1">
                <h4 className="text-heading-sm text-[var(--color-ink-900)]">Item Shipped</h4>
                <p className="text-body-md text-[var(--color-ink-700)]">
                  Carrier: FedEx<br/>
                  Tracking: <span className="font-mono text-[var(--color-terracotta-600)]">FX-10294857</span>
                </p>
              </div>
              <Button>Track Package</Button>
            </div>
          )}
          {currentStage === 2 && (
            <div className="flex flex-col gap-2">
              <h4 className="text-heading-sm text-[var(--color-ink-900)]">In Transit</h4>
              <p className="text-body-md text-[var(--color-ink-700)]">Your item is currently moving through the carrier network. Estimated delivery is tomorrow.</p>
            </div>
          )}
          {currentStage === 3 && (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-[var(--space-4)]">
              <div className="flex flex-col gap-2">
                <h4 className="text-heading-sm text-[var(--color-ink-900)]">Confirm Delivery</h4>
                <p className="text-body-md text-[var(--color-ink-700)] max-w-[480px]">
                  The carrier reported this as delivered. Please inspect the item. Only mark it as delivered if it matches the description.
                </p>
              </div>
              <div className="flex flex-col md:flex-row gap-3 shrink-0">
                <Button variant="ghost" className="text-[var(--color-urgent-600)]">Open Dispute</Button>
                <Button>Mark as Delivered</Button>
              </div>
            </div>
          )}
          {currentStage === 4 && (
            <div className="flex flex-col gap-2">
              <h4 className="text-heading-sm text-[var(--color-success-700)] flex items-center gap-2">
                <ShieldCheck size={20} /> Transaction Complete
              </h4>
              <p className="text-body-md text-[var(--color-ink-700)]">Funds have been released to the seller. Thank you for using BidCraft!</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
