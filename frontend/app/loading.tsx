import { SkeletonGrid } from '@/components/skeleton-grid'

export default function Loading() {
  return (
    <div className="bg-[var(--color-cream-base)] py-24 px-[var(--space-5)] xl:px-[var(--space-8)] min-h-screen flex flex-col">
      <div className="max-w-[var(--container-max)] mx-auto w-full">
        <h2 className="text-display-lg text-[var(--color-ink-900)] mb-12">Loading...</h2>
        <SkeletonGrid count={8} />
      </div>
    </div>
  )
}
