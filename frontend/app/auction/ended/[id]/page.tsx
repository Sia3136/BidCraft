import Link from 'next/link';

export default async function EndedAuctionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-[var(--color-cream-base)] flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-white p-8 rounded-[var(--radius-lg)] shadow-sm max-w-md w-full border border-[var(--color-border-subtle)]">
        <h1 className="text-display-sm font-display font-bold text-[var(--color-ink-900)] mb-4">
          Auction Closed
        </h1>
        <p className="text-body-md text-[var(--color-ink-700)] mb-8">
          This auction has closed. The winner is being notified.
        </p>
        <Link 
          href="/" 
          className="inline-block bg-[var(--color-terracotta-600)] text-white font-bold py-3 px-6 rounded-[var(--radius-md)] hover:bg-[var(--color-terracotta-700)] transition-colors"
        >
          Explore Other Auctions
        </Link>
      </div>
    </div>
  );
}
