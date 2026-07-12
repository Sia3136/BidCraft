import { getServerSession, authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getCloudinaryUrl } from '@/lib/cloudinary'

export default async function CartPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    redirect('/auth?redirect=/cart')
  }

  const userId = parseInt(String(session.user.id), 10)

  const result = await db.query(
    `SELECT 
      c.id as cart_item_id,
      1 as quantity,
      l.id,
      l.title,
      l.price,
      l.photos->>0 as cloudinary_public_id,
      l.listing_type,
      l.category
     FROM cart_items c
     JOIN listings l ON l.id = c.listing_id
     WHERE c.user_id = $1
       AND l.status = 'active'
       AND l.listing_type != 'AUCTION'`,
    [userId]
  )

  const items = result.rows
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0)

  return (
    <main className="px-6 lg:px-16 py-12 min-h-screen bg-[#F5F0E8]">
      <h1 className="text-4xl font-bold font-playfair text-[#1C1C1C] mb-8">
        Your Cart
        <span className="text-lg font-normal text-gray-500 ml-3">({items.length} items)</span>
      </h1>

      {items.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-xl font-semibold text-[#1C1C1C] mb-2">Your cart is empty</p>
          <p className="text-gray-500 mb-6">Explore the marketplace to find pieces you love</p>
          <Link href="/explore" className="bg-[#C4501A] text-white px-8 py-3 rounded-lg font-medium">
            Start Exploring
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-6">
            {items.map((item) => (
              <div key={item.cart_item_id} className="bg-white p-4 rounded-xl flex gap-6 items-center shadow-sm">
                <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0">
                  <Image
                    src={getCloudinaryUrl(item.cloudinary_public_id, 'f_auto,q_auto,w_200')}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="100px"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[#1C1C1C]">{item.title}</h3>
                  <p className="text-gray-500 text-sm mt-1">Quantity: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#C4501A]">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="w-full lg:w-80">
            <div className="bg-white p-6 rounded-xl shadow-sm sticky top-24">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
              <div className="flex justify-between mb-4 text-gray-600">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-4 mb-6">
                <span>Total</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <button className="w-full bg-[#C4501A] text-white py-3 rounded-lg font-semibold hover:bg-[#A34316] transition">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
