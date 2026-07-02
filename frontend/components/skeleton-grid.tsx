export function SkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col gap-3">
          {/* Image skeleton */}
          <div
            className="w-full rounded-xl overflow-hidden"
            style={{ aspectRatio: '4/5' }}
          >
            <div className="w-full h-full skeleton-shimmer" />
          </div>
          {/* Creator name skeleton */}
          <div className="h-3 w-24 rounded-full skeleton-shimmer" />
          {/* Title skeleton */}
          <div className="h-4 w-full rounded-full skeleton-shimmer" />
          <div className="h-4 w-3/4 rounded-full skeleton-shimmer" />
          {/* Price skeleton */}
          <div className="h-4 w-20 rounded-full skeleton-shimmer" />
          {/* Button skeleton */}
          <div className="h-9 w-full rounded-lg skeleton-shimmer" />
        </div>
      ))}
    </div>
  );
}
