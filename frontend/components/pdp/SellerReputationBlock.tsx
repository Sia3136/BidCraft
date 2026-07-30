'use client'

import React, { useState } from 'react'
import { CheckCircle } from 'lucide-react'
import type { SellerReputation } from '@/lib/api'

interface SellerReputationBlockProps {
  sellerName: string
  verified: boolean
  location?: string
  reputation?: SellerReputation
}

function StarFill({ rating }: { rating: number }) {
  return (
    <span aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map(s => (
        <span key={s} style={{ color: s <= rating ? '#B06A42' : '#D8C8BA', fontSize: '13px' }}>
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
}: SellerReputationBlockProps) {
  const [expanded, setExpanded] = useState(false)

  const initial = sellerName?.charAt(0)?.toUpperCase() ?? '?'
  const avg = reputation?.averageRating ?? 0
  const total = reputation?.totalReviews ?? 0

  return (
    <div
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      aria-label="Seller reputation"
    >
      {/* ── Seller header row ── */}
      <div className="flex items-center gap-3 mb-5">
        {/* Avatar */}
        <div
          aria-hidden
          style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: '#B06A42',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: 18,
            flexShrink: 0,
          }}
        >
          {initial}
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontWeight: 700, fontSize: 15, color: '#2B211C' }}>
              {sellerName}
            </span>
            {verified && (
              <span
                style={{
                  fontSize: 10,
                  border: '1px solid #B06A42',
                  color: '#B06A42',
                  borderRadius: 4,
                  padding: '1px 6px',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                }}
              >
                Verified
              </span>
            )}
          </div>

          {total > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
              <span style={{ fontSize: 13, color: '#B06A42', fontWeight: 700 }}>
                ★ {avg.toFixed(1)}
              </span>
              <span style={{ fontSize: 13, color: '#5C4033' }}>
                ({total.toLocaleString()} Reviews)
              </span>
            </div>
          )}

          {location && (
            <div style={{ fontSize: 12, color: '#8A7566', marginTop: 2 }}>
              {location}
            </div>
          )}
        </div>
      </div>

      {/* ── "What buyers say" block ── */}
      {reputation && total > 0 && (
        <div>
          <h3
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 18,
              fontWeight: 600,
              color: '#2B211C',
              marginBottom: 14,
            }}
          >
            What buyers say
          </h3>

          {/* Star breakdown rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
            {([5, 4, 3, 2, 1] as const).map(star => {
              const count = reputation.breakdown[star] ?? 0
              const pct = total > 0 ? (count / total) * 100 : 0
              const names = reputation.bucketNames?.[star] ?? []
              const extra = count - names.length

              return (
                <div
                  key={star}
                  style={{ display: 'grid', gridTemplateColumns: '56px 1fr 36px auto', alignItems: 'center', gap: 8 }}
                >
                  {/* Star label */}
                  <span style={{ fontSize: 12, color: '#B06A42' }}>
                    {'★'.repeat(star)}{'☆'.repeat(5 - star)}
                  </span>

                  {/* Progress bar */}
                  <div
                    style={{ height: 4, borderRadius: 2, background: '#E8DDD5', overflow: 'hidden' }}
                    role="progressbar"
                    aria-valuenow={pct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${star} star: ${count} reviews`}
                  >
                    <div
                      style={{ width: `${pct}%`, height: '100%', background: '#B06A42', borderRadius: 2 }}
                    />
                  </div>

                  {/* Count */}
                  <span
                    style={{ fontSize: 12, color: '#2B211C', fontWeight: 600, textAlign: 'right' }}
                  >
                    {count}
                  </span>

                  {/* Name preview */}
                  <span style={{ fontSize: 11, color: '#8A7566', whiteSpace: 'nowrap' }}>
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
              {/* Show first 5, rest expandable */}
              {(expanded ? reputation.recentReviews : reputation.recentReviews.slice(0, 5)).map(
                (rev, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 10,
                      padding: '10px 0',
                      borderBottom: '1px solid #F0EBE3',
                    }}
                  >
                    {/* Avatar initial */}
                    <div
                      aria-hidden
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: '#F0EBE3',
                        color: '#B06A42',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: 13,
                        flexShrink: 0,
                      }}
                    >
                      {rev.name?.charAt(0)}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#2B211C' }}>
                          {rev.name}
                        </span>
                        <StarFill rating={rev.rating} />
                      </div>
                      <div style={{ fontSize: 11, color: '#8A7566' }}>
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

              {total > 5 && (
                <button
                  onClick={() => setExpanded(e => !e)}
                  style={{
                    marginTop: 12,
                    fontSize: 13,
                    color: '#B06A42',
                    fontWeight: 600,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
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
        <p style={{ fontSize: 13, color: '#8A7566', fontStyle: 'italic' }}>
          No reviews yet for this seller.
        </p>
      )}
    </div>
  )
}
