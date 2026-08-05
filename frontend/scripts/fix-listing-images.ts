import { prisma } from '../lib/prisma'

// Generate 6 angle/crop variants from a single Cloudinary URL
function generateVariants(baseUrl: string): string[] {
  // Extract the base path before any existing transformation
  // Cloudinary URL format: https://res.cloudinary.com/[cloud]/image/upload/[transforms]/[path]
  const uploadMarker = '/upload/'
  const idx = baseUrl.indexOf(uploadMarker)
  if (idx === -1) return Array(6).fill(baseUrl) // fallback if not Cloudinary

  const prefix = baseUrl.slice(0, idx + uploadMarker.length)
  const suffix = baseUrl.slice(idx + uploadMarker.length)

  // Remove any existing transformation prefix from suffix
  // (transformations look like "w_800,c_fill/" — they contain commas or underscores before a slash)
  const cleanSuffix = suffix.includes(',') || suffix.match(/^[a-z]_/)
    ? suffix.slice(suffix.indexOf('/') + 1)
    : suffix

  // 6 distinct crop/angle transformations
  const transforms = [
    'w_800,h_800,c_fill,g_center,q_auto,f_auto',           // 1. Full centered square
    'w_800,h_800,c_fill,g_north,q_auto,f_auto',            // 2. Top crop (zoom upper detail)
    'w_800,h_800,c_fill,g_south,q_auto,f_auto',            // 3. Bottom crop
    'w_800,h_800,c_fill,g_west,q_auto,f_auto',             // 4. Left crop
    'w_800,h_800,c_fill,g_east,q_auto,f_auto',             // 5. Right crop
    'w_800,h_800,c_crop,g_center,zoom_1.4,q_auto,f_auto',  // 6. Zoomed in center
  ]

  return transforms.map(t => `${prefix}${t}/${cleanSuffix}`)
}

async function main() {
  const listings = await prisma.listing.findMany({
    select: { id: true, title: true, image_urls: true }
  })

  let fixed = 0

  for (const listing of listings) {
    const raw = listing.image_urls
    const imgs: string[] = Array.isArray(raw)
      ? (raw as string[]).filter(Boolean)
      : typeof raw === 'string' && raw
        ? [raw]
        : []

    if (imgs.length === 0) continue

    const unique = [...new Set(imgs)]
    const baseImage = unique[0]

    // Fix if: only 1 unique image, OR all images are identical, OR fewer than 6 unique
    if (unique.length < 6) {
      const variants = generateVariants(baseImage)
      // If listing already has some unique images, preserve them and fill the rest
      const merged = [...unique]
      for (const v of variants) {
        if (merged.length >= 6) break
        if (!merged.includes(v)) merged.push(v)
      }

      await prisma.listing.update({
        where: { id: listing.id },
        data: { image_urls: merged.slice(0, 6) }
      })
      fixed++
    }
  }

  console.log(`Fixed ${fixed} listings`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
