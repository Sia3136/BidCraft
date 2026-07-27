// app/wishlist/page.tsx
import { getServerSession, authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getCloudinaryUrl } from '@/lib/cloudinary'  // your URL builder
import { getProductRoute } from '@/lib/routes'

export default async function WishlistPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    redirect('/auth?redirect=/wishlist')
  }

  const userId = parseInt(String(session.user.id), 10)

  const result = await db.query(
    `SELECT 
      w.id as wishlist_id,
      l.id,
      l.title,
      l.slug,
      l.price,
      l.listing_type,
      l.photos->>0 as cloudinary_public_id,
      l.category,
      l.category as subcategory
     FROM wishlist w
     JOIN listings l ON l.id = w.listing_id
     WHERE w.user_id = $1
       AND l.status = 'active'`,
    [userId]
  )

  const items = result.rows

  return (
    <main className="px-6 lg:px-16 py-12 min-h-screen bg-[#F5F0E8]">
      <h1 className="text-4xl font-bold font-playfair text-[#1C1C1C] mb-8">
        Your Wishlist
        <span className="text-lg font-normal text-gray-500 ml-3">({items.length} items)</span>
      </h1>

      {items.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-xl font-semibold text-[#1C1C1C] mb-2">Your wishlist is empty</p>
          <p className="text-gray-500 mb-6">Save pieces you love while browsing</p>
          <Link href="/explore" className="bg-[#C4501A] text-white px-8 py-3 rounded-lg font-medium">
            Start Exploring
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <Link key={item.wishlist_id} href={getProductRoute(item)} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
              <div className="relative aspect-square">
                <Image
                  src={getCloudinaryUrl(item.cloudinary_public_id, 'f_auto,q_auto,w_400')}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <span className={`absolute top-2 left-2 text-xs font-bold px-2 py-1 rounded-full text-white ${
                  item.listing_type === 'auction' ? 'bg-orange-500' : 'bg-emerald-600'
                }`}>
                  {item.listing_type === 'auction' ? 'AUCTION' : 'BUY NOW'}
                </span>
              </div>
              <div className="p-4">
                <p className="font-semibold text-[#1C1C1C] truncate">{item.title}</p>
                <p className="text-[#C4501A] font-bold mt-1">₹{item.price?.toLocaleString('en-IN')}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
