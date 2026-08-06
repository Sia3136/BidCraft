# BidCraft Design Baseline

## Typography
- **Heading Font:** Playfair Display, Georgia, serif (`var(--font-display)`)
- **Body Font:** Plus Jakarta Sans (`var(--font-ui)`)

### Heading Styles
- `text-display-xl`: 56px, line-height 64px, font-weight 600
- `text-display-lg`: 40px, line-height 48px, font-weight 600
- `text-display-md`: 28px, line-height 36px, font-weight 500
- `text-heading-lg`: 20px, line-height 28px, font-weight 600
- `text-heading-sm`: 16px, line-height 24px, font-weight 600

### Body Styles
- `text-body-lg`: 16px, line-height 26px, font-weight 400
- `text-body-md`: 14px, line-height 22px, font-weight 400
- `text-caption`: 12px, line-height 18px, font-weight 500, letter-spacing 0.02em

## Colours

### Backgrounds
- `cream-base`: #FDFBF7 (`var(--color-cream-base)`) - primary page background
- `cream-raised`: #F7F3EB (`var(--color-cream-raised)`) - sections, light contrast
- `cream-deep`: #F0EBE0 (`var(--color-cream-deep)`) - cards, heavy contrast

### Ink (Text)
- `ink-900`: #2B2A28 (`var(--color-ink-900)`) - primary text
- `ink-700`: #56524A (`var(--color-ink-700)`) - secondary text
- `ink-500`: #8A8478 (`var(--color-ink-500)`) - muted text
- `ink-300`: #C9C2B4 (`var(--color-ink-300)`) - subtle/disabled text

### Terracotta (Primary Accent)
- `terracotta-700`: #B5562E (`var(--color-terracotta-700)`) - active/hover buttons
- `terracotta-600`: #C8643A (`var(--color-terracotta-600)`) - primary buttons, badges
- `terracotta-100`: #F4E3D7 (`var(--color-terracotta-100)`) - subtle backgrounds, badges

### Borders
- `border-subtle`: #E8E1D3 (`var(--color-border-subtle)`)
- `border-strong`: #D8CFBC (`var(--color-border-strong)`)

## Spacing & Radius
- `radius-sm`: 6px (`var(--radius-sm)`)
- `radius-md`: 12px (`var(--radius-md)`)
- `radius-lg`: 20px (`var(--radius-lg)`)
- `radius-pill`: 999px (`var(--radius-pill)`)

### Shadows
- `shadow-card`: `0 1px 2px rgba(43,42,40,0.04), 0 4px 12px rgba(43,42,40,0.06)`
- `shadow-card-hover`: `0 4px 8px rgba(43,42,40,0.06), 0 12px 24px rgba(43,42,40,0.10)`

## Reusable Components
- **Buttons (Primary):** bg-[var(--color-terracotta-600)] text-white hover:bg-[var(--color-terracotta-700)] rounded-[var(--radius-md)] or pill
- **Buttons (Secondary):** border border-[var(--color-border-subtle)] hover:border-[var(--color-terracotta-600)]
- **Cards:** bg-[var(--color-white)] or bg-[var(--color-cream-deep)] with `var(--shadow-card)`, `rounded-[var(--radius-lg)]`
- **Badges:** bg-[var(--color-terracotta-100)] text-[var(--color-terracotta-700)] rounded-[var(--radius-pill)] text-caption font-bold tracking-wider uppercase
