export function SkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col h-full border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] overflow-hidden bg-white shadow-sm">
          {/* Image skeleton */}
          <div
            className="w-full relative bg-[var(--color-cream-deep)]"
            style={{ aspectRatio: '4/5' }}
          >
            <div className="w-full h-full skeleton-shimmer" />
          </div>
          
          <div className="p-4 flex flex-col flex-1">
            {/* Creator name skeleton */}
            <div className="h-3 w-20 rounded-full skeleton-shimmer mb-2" />
            {/* Title skeleton */}
            <div className="h-4 w-full rounded-full skeleton-shimmer mb-1" />
            <div className="h-4 w-3/4 rounded-full skeleton-shimmer mb-3" />
            
            <div className="mt-auto pt-2 border-t border-[var(--color-border-subtle)]">
              {/* Price skeleton */}
              <div className="h-2 w-10 rounded-full skeleton-shimmer mb-1" />
              <div className="h-5 w-24 rounded-full skeleton-shimmer" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
