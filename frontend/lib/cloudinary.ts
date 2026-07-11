export function getCloudinaryUrl(publicId: string, transform: string = 'f_auto,q_auto') {
  if (!publicId) return '/placeholder.jpg';
  if (publicId.startsWith('http://') || publicId.startsWith('https://')) {
    return publicId;
  }
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'duzlsyzwa';
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transform}/${publicId}`;
}
