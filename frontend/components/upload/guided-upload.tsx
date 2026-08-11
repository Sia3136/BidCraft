'use client'
import { authenticatedFetch } from '@/lib/api'

import { useState } from 'react'

export type UploadSlot = {
  id: string
  label: string
  description: string
  url: string | null
}

const INITIAL_SLOTS: UploadSlot[] = [
  { id: 'front', label: 'Front View', description: 'Clear, well-lit front angle', url: null },
  { id: 'left', label: 'Left Side', description: 'Show the left profile', url: null },
  { id: 'right', label: 'Right Side', description: 'Show the right profile', url: null },
  { id: 'back', label: 'Back Side', description: 'Complete back view', url: null },
  { id: 'detail', label: 'Detail Close-Up', description: 'Texture, signature, or material', url: null },
  { id: 'scale', label: 'Scale Reference', description: 'Next to a known object (e.g., coin)', url: null },
]

interface GuidedUploadProps {
  onPhotosChange: (photos: string[]) => void
}

export function GuidedUpload({ onPhotosChange }: GuidedUploadProps) {
  const [slots, setSlots] = useState<UploadSlot[]>(INITIAL_SLOTS)
  const [uploading, setUploading] = useState<string | null>(null)

  const handleFileUpload = async (slotId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(slotId)

    try {
      const formData = new FormData()
      formData.append('images', file)

      const token = localStorage.getItem('accessToken')
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api` : ''
      
      const res = await authenticatedFetch(`${apiUrl}/images/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || 'Upload failed')
      }

      const data = await res.json()
      const uploadedUrl = data.urls[0]

      setSlots(prev => {
        const next = prev.map(s => s.id === slotId ? { ...s, url: uploadedUrl } : s)
        
        // Notify parent if all 6 are uploaded
        const allUrls = next.map(s => s.url)
        if (allUrls.every(url => url !== null)) {
          onPhotosChange(allUrls as string[])
        } else {
          onPhotosChange([]) // Invalid unless all 6
        }

        return next
      })
    } catch (err: any) {
      alert(err.message)
    } finally {
      setUploading(null)
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Guided 6-Photo Upload</h3>
      <p className="text-sm text-muted-foreground">
        For escrow protection and fair value discovery, please upload exactly 6 photos following the template.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {slots.map((slot) => (
          <div key={slot.id} className="relative aspect-square border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center text-center p-4 hover:bg-muted/30 transition-colors">
            {slot.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={slot.url} alt={slot.label} className="absolute inset-0 w-full h-full object-cover rounded-xl" />
            ) : (
              <>
                {uploading === slot.id ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2" />
                ) : (
                  <svg className="w-8 h-8 text-muted-foreground mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                )}
                <span className="font-medium text-sm">{slot.label}</span>
                <span className="text-xs text-muted-foreground mt-1">{slot.description}</span>
                
                <input 
                  type="file" 
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => handleFileUpload(slot.id, e)}
                  disabled={uploading !== null}
                />
              </>
            )}
            {slot.url && (
              <button
                onClick={() => {
                  setSlots(prev => {
                    const next = prev.map(s => s.id === slot.id ? { ...s, url: null } : s)
                    onPhotosChange([])
                    return next
                  })
                }}
                className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 shadow-lg hover:bg-destructive/90"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}


