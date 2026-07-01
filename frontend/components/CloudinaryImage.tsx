'use client'

import Image, { ImageProps } from 'next/image'

interface CloudinaryImageProps extends Omit<ImageProps, 'src'> {
  publicId: string
  width: number
  height: number
  alt: string
}

export function CloudinaryImage({ publicId, width, height, alt, ...props }: CloudinaryImageProps) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'duzlsyzwa'
  
  // Construct the Cloudinary URL using the provided pattern
  const src = `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto,w_${width}/${publicId}`

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
