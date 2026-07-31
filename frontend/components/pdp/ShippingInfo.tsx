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
    format: (_, props?: ShippingInfoProps) =>
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
  ].filter(r => Boolean(r.value))

  return (
    <div
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      aria-label="Shipping and delivery information"
    >
      {/* Section label */}
      <p
        style={{
          fontSize: 14,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: '#B06A42',
          fontWeight: 600,
          marginBottom: 8,
        }}
      >
        Shipping &amp; Delivery
      </p>

      {/* Thin divider */}
      <div
        aria-hidden
        style={{ borderTop: '1px solid #D8C8BA', marginBottom: 0 }}
      />

      {/* Rows */}
      <dl>
        {rows.map((row, i) => (
          <div
            key={row.label}
            style={{
              display: 'grid',
              gridTemplateColumns: '130px 1fr',
              alignItems: 'start',
              padding: '10px 0',
              borderBottom: i < rows.length - 1 ? '1px solid #F0EBE3' : 'none',
            }}
          >
            <dt
              style={{
                fontSize: 13,
                color: 'rgba(43, 33, 28, 0.55)',
                fontWeight: 500,
              }}
            >
              {row.label}
            </dt>
            <dd
              style={{
                fontSize: 13,
                color: '#2B211C',
                fontWeight: 500,
                margin: 0,
              }}
            >
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
