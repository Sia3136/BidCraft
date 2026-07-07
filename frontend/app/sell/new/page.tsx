'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { uploadListingImage, createListing } from '@/lib/api'
import { X, UploadCloud, CheckCircle } from 'lucide-react'

const CATEGORIES: Record<string, string[]> = {
  'Handmade Jewelry': ['Necklaces', 'Rings', 'Bracelets', 'Earrings'],
  'Vintage Clothing': ['Shirts', 'Dresses', 'Jackets', 'Accessories'],
  'Pottery & Ceramics': ['Mugs', 'Bowls', 'Vases', 'Plates'],
  'Art & Collectibles': ['Paintings', 'Prints', 'Sculptures', 'Digital Art'],
  'Candles & Soaps': ['Scented Candles', 'Bar Soaps', 'Bath Bombs'],
}

export default function CreateListingPage() {
  const router = useRouter()
  const { isAuthenticated, token } = useAuthStore()
  
  if (typeof window !== 'undefined' && !isAuthenticated) {
    router.push('/auth?returnTo=/sell/new')
    return null
  }

  const [step, setStep] = useState(1)
  const [error, setError] = useState('')

  // Form State
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [subcategory, setSubcategory] = useState('')
  const [buyingMethod, setBuyingMethod] = useState('Buy Now')
  const [price, setPrice] = useState('')
  const [auctionEndsAt, setAuctionEndsAt] = useState('')
  const [offersAllowed, setOffersAllowed] = useState(false)
  const [minimumOfferPercent, setMinimumOfferPercent] = useState('70')
  const [description, setDescription] = useState('')
  const [specs, setSpecs] = useState([{ key: '', value: '' }])
  const [images, setImages] = useState<{ url: string; publicId: string; file?: File; uploading: boolean }[]>([])

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleNext = () => {
    setError('')
    if (step === 1) {
      if (title.length < 5) return setError('Title must be at least 5 characters')
      if (!category || !subcategory) return setError('Category and Subcategory are required')
      const p = parseInt(price)
      if (!p || p < 50 || p > 50000) return setError('Price must be between ₹50 and ₹50,000')
      if (buyingMethod === 'Auction') {
        if (!auctionEndsAt) return setError('Auction end date is required')
        if (new Date(auctionEndsAt) <= new Date()) return setError('Auction end date must be in the future')
      }
    } else if (step === 2) {
      if (images.length === 0) return setError('At least one image is required')
      if (images.some(img => img.uploading)) return setError('Please wait for images to finish uploading')
    } else if (step === 3) {
      if (description.length < 200) return setError('Description must be at least 200 characters')
    }
    setStep(s => s + 1)
  }

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (images.length + files.length > 6) return setError('Maximum 6 images allowed')
    
    setError('')
    for (const file of files) {
      const tempId = Math.random().toString()
      setImages(prev => [...prev, { url: URL.createObjectURL(file), publicId: tempId, file, uploading: true }])
      
      try {
        const result = await uploadListingImage(file, token!)
        setImages(prev => prev.map(img => img.publicId === tempId ? { url: result.url, publicId: result.publicId, uploading: false } : img))
      } catch (err) {
        setImages(prev => prev.filter(img => img.publicId !== tempId))
        setError('Failed to upload image. Please try again.')
      }
    }
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handlePublish = async () => {
    setError('')
    try {
      const specifications = specs.reduce((acc, curr) => {
        if (curr.key.trim() && curr.value.trim()) acc[curr.key.trim()] = curr.value.trim()
        return acc
      }, {} as Record<string, string>)

      const res = await createListing({
        title,
        description,
        price: parseInt(price),
        category,
        subcategory,
        buyingMethod,
        offersAllowed: buyingMethod === 'Auction' ? false : offersAllowed,
        minimumOfferPercent: parseInt(minimumOfferPercent) || 70,
        imageUrls: images.map(img => img.url),
        specifications,
        auctionEndsAt: buyingMethod === 'Auction' ? new Date(auctionEndsAt).toISOString() : undefined
      }, token!)

      alert('Your listing is live!')
      router.push(`/product/${res.listingId}`)
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 min-h-screen">
      <h1 className="text-3xl font-display font-bold text-[var(--color-ink-900)] mb-8">Create a New Listing</h1>
      
      {/* Stepper */}
      <div className="flex gap-4 mb-8">
        {[1, 2, 3, 4].map(s => (
          <div key={s} className={`flex-1 h-2 rounded-full ${s <= step ? 'bg-[var(--color-terracotta-600)]' : 'bg-[var(--color-border-subtle)]'}`} />
        ))}
      </div>

      <div className="bg-white border border-[var(--color-border-subtle)] rounded-[var(--radius-lg)] p-8 shadow-sm">
        {error && <div className="mb-6 p-4 bg-[var(--color-urgent-100)] text-[var(--color-urgent-600)] rounded-[var(--radius-md)] text-sm font-medium">{error}</div>}

        {step === 1 && (
          <div className="flex flex-col gap-6">
            <div>
              <label className="block text-sm font-bold text-[var(--color-ink-700)] mb-2">Title</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="E.g., Vintage Leather Jacket" className="w-full h-12 px-4 border border-[var(--color-border-strong)] rounded-[var(--radius-md)]" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-[var(--color-ink-700)] mb-2">Category</label>
                <select value={category} onChange={e => { setCategory(e.target.value); setSubcategory('') }} className="w-full h-12 px-4 border border-[var(--color-border-strong)] rounded-[var(--radius-md)] bg-white">
                  <option value="">Select...</option>
                  {Object.keys(CATEGORIES).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--color-ink-700)] mb-2">Subcategory</label>
                <select value={subcategory} onChange={e => setSubcategory(e.target.value)} disabled={!category} className="w-full h-12 px-4 border border-[var(--color-border-strong)] rounded-[var(--radius-md)] bg-white disabled:opacity-50">
                  <option value="">Select...</option>
                  {category && CATEGORIES[category].map(sc => <option key={sc} value={sc}>{sc}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[var(--color-ink-700)] mb-2">Buying Method</label>
              <div className="flex gap-4">
                {['Buy Now', 'Auction', 'Negotiable'].map(method => (
                  <label key={method} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" checked={buyingMethod === method} onChange={() => setBuyingMethod(method)} className="w-4 h-4 text-[var(--color-terracotta-600)]" />
                    <span className="text-[var(--color-ink-900)] font-medium">{method}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[var(--color-ink-700)] mb-2">Price (₹)</label>
              <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="500" min="50" max="50000" className="w-full h-12 px-4 border border-[var(--color-border-strong)] rounded-[var(--radius-md)]" />
            </div>

            {buyingMethod === 'Auction' && (
              <div>
                <label className="block text-sm font-bold text-[var(--color-ink-700)] mb-2">Auction End Date</label>
                <input type="datetime-local" value={auctionEndsAt} onChange={e => setAuctionEndsAt(e.target.value)} className="w-full h-12 px-4 border border-[var(--color-border-strong)] rounded-[var(--radius-md)]" />
              </div>
            )}

            {buyingMethod !== 'Auction' && (
              <div className="p-4 bg-[var(--color-cream-raised)] rounded-[var(--radius-md)] border border-[var(--color-border-subtle)]">
                <label className="flex items-center gap-2 cursor-pointer mb-4">
                  <input type="checkbox" checked={offersAllowed} onChange={e => setOffersAllowed(e.target.checked)} className="w-4 h-4 text-[var(--color-terracotta-600)]" />
                  <span className="text-[var(--color-ink-900)] font-bold">Accept Offers?</span>
                </label>
                {offersAllowed && (
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-ink-700)] mb-2">Minimum offer (% of price)</label>
                    <input type="number" value={minimumOfferPercent} onChange={e => setMinimumOfferPercent(e.target.value)} min="50" max="100" className="w-full h-12 px-4 border border-[var(--color-border-strong)] rounded-[var(--radius-md)]" />
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-6">
            <div 
              className="border-2 border-dashed border-[var(--color-border-strong)] rounded-[var(--radius-lg)] p-12 flex flex-col items-center justify-center cursor-pointer hover:border-[var(--color-terracotta-600)] transition-colors bg-[var(--color-cream-raised)]"
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadCloud className="w-12 h-12 text-[var(--color-ink-500)] mb-4" />
              <p className="text-[var(--color-ink-900)] font-bold mb-2">Click to upload images</p>
              <p className="text-[var(--color-ink-500)] text-sm">JPG, PNG up to 8MB. Max 6 images.</p>
              <input type="file" multiple accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageSelect} />
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                {images.map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-[var(--radius-md)] overflow-hidden border border-[var(--color-border-subtle)] group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt={`Upload ${i}`} className="w-full h-full object-cover" />
                    {img.uploading && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white text-sm font-medium">Uploading...</span>
                      </div>
                    )}
                    {!img.uploading && (
                      <button 
                        onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                        className="absolute top-2 right-2 w-8 h-8 bg-white text-[var(--color-urgent-600)] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-6">
            <div>
              <label className="block text-sm font-bold text-[var(--color-ink-700)] mb-2">Description</label>
              <textarea 
                value={description} onChange={e => setDescription(e.target.value)} 
                placeholder="Describe your item in detail..." 
                className="w-full min-h-[160px] p-4 border border-[var(--color-border-strong)] rounded-[var(--radius-md)] resize-y" 
              />
              <p className="text-right text-sm mt-1 text-[var(--color-ink-500)]">{description.length} / 200 min chars</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-[var(--color-ink-700)] mb-4">Specifications (Optional)</label>
              <div className="flex flex-col gap-3">
                {specs.map((spec, i) => (
                  <div key={i} className="flex gap-2">
                    <input type="text" value={spec.key} onChange={e => {
                      const newSpecs = [...specs]; newSpecs[i].key = e.target.value; setSpecs(newSpecs);
                    }} placeholder="E.g. Dimensions" className="flex-1 h-12 px-4 border border-[var(--color-border-strong)] rounded-[var(--radius-md)]" />
                    <input type="text" value={spec.value} onChange={e => {
                      const newSpecs = [...specs]; newSpecs[i].value = e.target.value; setSpecs(newSpecs);
                    }} placeholder="E.g. 10x10 cm" className="flex-1 h-12 px-4 border border-[var(--color-border-strong)] rounded-[var(--radius-md)]" />
                    <button onClick={() => setSpecs(specs.filter((_, idx) => idx !== i))} className="w-12 h-12 flex items-center justify-center text-[var(--color-urgent-600)] border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] hover:bg-[var(--color-urgent-100)]">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                {specs.length < 10 && (
                  <button onClick={() => setSpecs([...specs, { key: '', value: '' }])} className="text-left text-[var(--color-terracotta-600)] font-medium text-sm mt-2">
                    + Add row
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="flex flex-col gap-6">
            <h2 className="text-xl font-display font-bold text-[var(--color-ink-900)]">Review your listing</h2>
            
            <div className="bg-[var(--color-cream-raised)] p-6 rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)]">
              <div className="flex gap-6">
                <div className="w-32 h-32 shrink-0 rounded-[var(--radius-md)] overflow-hidden border border-[var(--color-border-subtle)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={images[0]?.url} alt="Cover" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[var(--color-ink-900)] mb-1">{title}</h3>
                  <p className="text-[var(--color-ink-500)] text-sm mb-4">{category} {'>'} {subcategory}</p>
                  <p className="text-2xl font-bold text-[var(--color-terracotta-600)] mb-2">₹{price}</p>
                  <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-ink-700)]">
                    <CheckCircle className="w-4 h-4 text-[var(--color-success-600)]" />
                    {buyingMethod}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-[var(--color-border-subtle)]">
          {step > 1 ? (
            <button onClick={() => setStep(s => s - 1)} className="px-6 h-12 border border-[var(--color-border-strong)] rounded-[var(--radius-md)] font-bold text-[var(--color-ink-700)] hover:bg-[var(--color-cream-raised)] transition-colors">
              Back
            </button>
          ) : <div></div>}
          
          {step < 4 ? (
            <button onClick={handleNext} className="px-8 h-12 bg-[var(--color-ink-900)] text-white rounded-[var(--radius-md)] font-bold hover:bg-[var(--color-terracotta-600)] transition-colors">
              Continue
            </button>
          ) : (
            <button onClick={handlePublish} className="px-8 h-12 bg-[var(--color-terracotta-600)] text-white rounded-[var(--radius-md)] font-bold hover:bg-[var(--color-terracotta-700)] transition-colors">
              Publish Listing
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
