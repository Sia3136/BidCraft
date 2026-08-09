'use client'

import React, { useState } from 'react'
import { CheckCircle } from 'lucide-react'
import type { SellerReputation } from '@/lib/api'

interface SellerReputationBlockProps {
  sellerName: string
  verified: boolean
  location?: string
  reputation?: SellerReputation
  badges?: string[]
}

function StarFill({ rating }: { rating: number }) {
  return (
    <span aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map(s => (
        <span key={s} className={`text-[13px] ${s <= rating ? 'text-[var(--color-terracotta-600)]' : 'text-[var(--color-border-strong)]'}`}>
          ★
        </span>
      ))}
    </span>
  )
}

export function SellerReputationBlock({
  sellerName,
  verified,
  location,
  reputation,
  badges,
}: SellerReputationBlockProps) {
  const [expanded, setExpanded] = useState(false)

  const initial = sellerName?.charAt(0)?.toUpperCase() ?? '?'
  const avg = reputation?.averageRating ?? 0
  const total = reputation?.totalReviews ?? 0

  return (
    <div
      className="font-[family-name:var(--font-ui)]"
      aria-label="Seller reputation"
    >
      {/* ── Seller header row ── */}
      <div className="flex items-center gap-3 mb-5">
        {/* Avatar */}
        <div
          aria-hidden
          className="w-11 h-11 rounded-full bg-[var(--color-terracotta-600)] text-white flex items-center justify-center font-bold text-lg shrink-0"
        >
          {initial}
        </div>

        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-[15px] text-[var(--color-ink-900)]">
              {sellerName}
            </span>
            {verified && (
              <span className="text-[10px] border border-[var(--color-terracotta-600)] text-[var(--color-terracotta-600)] rounded px-1.5 py-[1px] font-semibold tracking-widest">
                Verified
              </span>
            )}
          </div>

          {badges && badges.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-1">
              {badges.map(badge => (
                <span key={badge} className="text-[10px] bg-[var(--color-cream-deep)] text-[var(--color-ink-700)] rounded px-1.5 py-[1px] font-semibold tracking-wide">
                  {badge}
                </span>
              ))}
            </div>
          )}

          {total > 0 && (
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[13px] text-[var(--color-terracotta-600)] font-bold">
                ★ {avg.toFixed(1)}
              </span>
              <span className="text-[13px] text-[var(--color-ink-700)]">
                ({total.toLocaleString()} Reviews)
              </span>
            </div>
          )}

          {location && (
            <div className="text-xs text-[var(--color-ink-500)] mt-0.5">
              {location}
            </div>
          )}
        </div>
      </div>

      {/* ── "What buyers say" block ── */}
      {reputation && total > 0 && (
        <div>
          <h3 className="text-heading-md font-[family-name:var(--font-display)] text-[var(--color-ink-900)] mb-3.5">
            What buyers say
          </h3>

          {/* Star breakdown rows */}
          <div className="flex flex-col gap-2 mb-5">
            {([5, 4, 3, 2, 1] as const).map(star => {
              const count = reputation.breakdown[star] ?? 0
              const pct = total > 0 ? (count / total) * 100 : 0
              const names = reputation.bucketNames?.[star] ?? []
              const extra = count - names.length

              return (
                <div
                  key={star}
                  className="grid grid-cols-[56px_1fr_36px_auto] items-center gap-2"
                >
                  {/* Star label */}
                  <span className="text-xs text-[var(--color-terracotta-600)]">
                    {'★'.repeat(star)}{'☆'.repeat(5 - star)}
                  </span>

                  {/* Progress bar */}
                  <div
                    className="h-1 rounded-sm bg-[var(--color-border-subtle)] overflow-hidden"
                    role="progressbar"
                    aria-valuenow={pct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${star} star: ${count} reviews`}
                  >
                    <div
                      style={{ width: `${pct}%` }}
                      className="h-full bg-[var(--color-terracotta-600)] rounded-sm"
                    />
                  </div>

                  {/* Count */}
                  <span className="text-xs text-[var(--color-ink-900)] font-semibold text-right">
                    {count}
                  </span>

                  {/* Name preview */}
                  <span className="text-[11px] text-[var(--color-ink-500)] whitespace-nowrap">
                    {names.length > 0
                      ? names.join(', ') + (extra > 0 ? `, +${extra} more` : '')
                      : ''}
                  </span>
                </div>
              )
            })}
          </div>

          {/* ── Recent reviews list ── */}
          {reputation.recentReviews.length > 0 && (
            <div>
              {/* Show first 3, rest expandable */}
              {(expanded ? reputation.recentReviews : reputation.recentReviews.slice(0, 3)).map(
                (rev, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 py-2.5 border-b border-[var(--color-border-subtle)]"
                  >
                    {/* Avatar initial */}
                    <div
                      aria-hidden
                      className="w-8 h-8 rounded-full bg-[var(--color-cream-deep)] text-[var(--color-terracotta-600)] flex items-center justify-center font-bold text-[13px] shrink-0"
                    >
                      {rev.name?.charAt(0)}
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="text-[13px] font-semibold text-[var(--color-ink-900)]">
                          {rev.name}
                        </span>
                        <StarFill rating={rev.rating} />
                      </div>
                      <div className="text-[11px] text-[var(--color-ink-500)]">
                        {new Date(rev.date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </div>
                    </div>
                  </div>
                )
              )}

              {total > 3 && (
                <button
                  onClick={() => setExpanded(e => !e)}
                  className="mt-3 text-[13px] text-[var(--color-terracotta-600)] font-semibold bg-transparent border-none cursor-pointer p-0 flex items-center gap-1 hover:text-[var(--color-terracotta-700)] transition-colors"
                  aria-expanded={expanded}
                >
                  {expanded
                    ? 'Show fewer reviews'
                    : `Show all ${total.toLocaleString()} reviews →`}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {(!reputation || total === 0) && (
        <p className="text-[13px] text-[var(--color-ink-500)] italic">
          No reviews yet for this seller.
        </p>
      )}
    </div>
  )
}
