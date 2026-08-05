'use client'

import Image, { ImageProps } from 'next/image'
import { useState, useEffect } from 'react'

interface CloudinaryImageProps extends Omit<ImageProps, 'src'> {
  publicId: string
  width: number
  height: number
  alt: string
}

export function CloudinaryImage({ publicId, width, height, alt, ...props }: CloudinaryImageProps) {
  const [src, setSrc] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'duzlsyzwa'
    const fallbackUrl = `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto,w_${width}/${publicId}`

    fetch(`http://localhost:8000/api/images/resolve/${publicId}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to resolve')
        return res.json()
      })
      .then(data => {
        if (!isMounted) return
        if (data.url) {
          // Inject width transformation into backend URL
          const optimizedUrl = data.url.replace('upload/f_auto,q_auto/', `upload/f_auto,q_auto,w_${width}/`)
          setSrc(optimizedUrl)
        } else {
          setSrc(fallbackUrl)
        }
      })
      .catch((err) => {

        if (isMounted) setSrc(fallbackUrl)
      })

    return () => { isMounted = false }
  }, [publicId, width])

  if (!src) {
    return <div style={{ width, height, maxWidth: '100%' }} className="bg-gray-200 animate-pulse" />
  }

  return (
    <Image
      src={src}
      width={width}
      height={height}
      alt={alt}
      {...props}
    />
  )
}
