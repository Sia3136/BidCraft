'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { GuidedUpload } from '@/components/upload/guided-upload'
import { listingsApi } from '@/lib/api'

export default function CreateListingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [photos, setPhotos] = useState<string[]>([])
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: 1, // Default Art category
    condition: 'new',
    listing_type: 'fixed',
    price: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (photos.length !== 6) {
      alert('Please upload all 6 required photos.')
      return
    }

    try {
      setLoading(true)
      const res = await listingsApi.create({
        ...formData,
        price: formData.price ? Number(formData.price) : null,
        photos,
      })
      alert('Listing created successfully!')
      router.push(`/listings/${res.listing.id}`)
    } catch (err: any) {
      alert('Failed to create listing: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-16">
        <h1 className="text-3xl font-bold mb-8">Create New Listing</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="E.g., Vintage Handcrafted Vase"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                required
                rows={4}
                className="w-full px-4 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your item's history, materials, and unique features..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  className="w-full px-4 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={formData.category_id}
                  onChange={e => setFormData({ ...formData, category_id: Number(e.target.value) })}
                >
                  <option value={1}>Art</option>
                  <option value={2}>Crafts</option>
                  <option value={3}>Antiques</option>
                  <option value={4}>Jewelry</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Condition</label>
                <select
                  className="w-full px-4 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={formData.condition}
                  onChange={e => setFormData({ ...formData, condition: e.target.value })}
                >
                  <option value="new">New</option>
                  <option value="like_new">Like New</option>
                  <option value="good">Good</option>
                  <option value="vintage">Vintage</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Listing Type</label>
                <select
                  className="w-full px-4 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={formData.listing_type}
                  onChange={e => setFormData({ ...formData, listing_type: e.target.value })}
                >
                  <option value="fixed">Fixed Price</option>
                  <option value="auction">Auction</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Price {formData.listing_type === 'auction' ? '(Starting Bid)' : '(₹)'}
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  className="w-full px-4 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={formData.price}
                  onChange={e => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-8">
            <GuidedUpload onPhotosChange={setPhotos} />
          </div>

          <div className="pt-8 border-t border-border flex justify-end">
            <button
              type="submit"
              disabled={loading || photos.length !== 6}
              className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Publish Listing'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
