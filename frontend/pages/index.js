import Link from 'next/link'

const CATEGORIES = [
  'Made With MagicArt', 'Crafts', 'Crochet', 'Resin Art', 'Handmade Creations', 'Aesthetic FindsCandles',
  'Home Decor', 'Desk Decor', 'Lifestyle Products', "Collector's VaultHot Wheels", 'Rare Collectibles',
  'Vintage Items', 'Trading Cards', 'One-of-a-KindCustom Products', 'Personalized Creations',
  'Limited Editions', 'Creator Exclusives', 'Hidden TreasuresBooks', 'Miscellaneous Finds',
  'New Product Types', 'Uncategorized Items'
];

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-4xl font-bold mb-4">BidCraft — Alpha</h1>
      <p className="mb-6">Creators-first auction & marketplace (MVP)</p>
      <section>
        <h2 className="text-2xl font-semibold mb-2">Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {CATEGORIES.map((c) => (
            <Link key={c} href={`/search?category=${encodeURIComponent(c)}`} className="p-3 bg-white rounded shadow-sm hover:shadow">
              {c}
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
