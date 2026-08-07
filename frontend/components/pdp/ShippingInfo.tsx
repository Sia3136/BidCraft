import React from 'react'

interface ShippingInfoProps {
  shipsFrom?: string
  dispatchDays?: number
  estimatedMin?: number
  estimatedMax?: number
  returnsPolicy?: string
  packagingNote?: string
}

const ROWS: Array<{
  label: string
  key: keyof ShippingInfoProps
  format?: (v: unknown) => string
}> = [
  { label: 'Ships From', key: 'shipsFrom' },
  {
    label: 'Est. Delivery',
    key: 'estimatedMin',
    format: (_: any, props?: ShippingInfoProps) =>
      props?.estimatedMin && props?.estimatedMax
        ? `${props.estimatedMin}–${props.estimatedMax} business days`
        : '',
  } as any,
  {
    label: 'Dispatch Time',
    key: 'dispatchDays',
    format: (v: unknown) =>
      v ? `Within ${v} business day${Number(v) !== 1 ? 's' : ''}` : '',
  },
  { label: 'Packaging', key: 'packagingNote' },
  { label: 'Returns', key: 'returnsPolicy' },
]

export function ShippingInfo(props: ShippingInfoProps) {
  const { shipsFrom, dispatchDays, estimatedMin, estimatedMax, packagingNote } = props

  // Only render if we have at least some shipping data
  const hasData = shipsFrom || dispatchDays || estimatedMin

  if (!hasData) return null

  const rows = [
    { label: 'Ships From', value: shipsFrom },
    {
      label: 'Est. Delivery',
      value:
        estimatedMin && estimatedMax
          ? `${estimatedMin}–${estimatedMax} business days`
          : undefined,
    },
    {
      label: 'Dispatch Time',
      value: dispatchDays
        ? `Within ${dispatchDays} business day${dispatchDays !== 1 ? 's' : ''}`
        : undefined,
    },
    { label: 'Packaging', value: packagingNote },
    { label: 'Returns', value: props.returnsPolicy },
  ].filter(r => Boolean(r.value))

  return (
    <div
      className="font-[family-name:var(--font-ui)]"
      aria-label="Shipping and delivery information"
    >
      {/* Section label */}
      <p
        className="text-[11px] tracking-[0.2em] uppercase text-[var(--color-terracotta-600)] font-semibold mb-2"
      >
        Shipping &amp; Delivery
      </p>

      {/* Thin divider */}
      <div
        aria-hidden
        className="border-t border-[var(--color-border-strong)] mb-0"
      />

      {/* Rows */}
      <dl>
        {rows.map((row, i) => (
          <div
            key={row.label}
            className={`grid grid-cols-[130px_1fr] items-start py-2.5 ${i < rows.length - 1 ? 'border-b border-[var(--color-border-subtle)]' : ''}`}
          >
            <dt className="text-[13px] text-[var(--color-ink-500)] font-medium">
              {row.label}
            </dt>
            <dd className="text-[13px] text-[var(--color-ink-900)] font-medium m-0">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
