import { Client } from 'pg'
import * as dotenv from 'dotenv'

dotenv.config({ path: '../backend/.env' })
dotenv.config({ path: '.env.local' })
dotenv.config({ path: '.env' })

const client = new Client({ 
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

function extractBaseId(url: string) {
  const match = url.match(/\/upload\/(?:[a-z_0-9.,]+\/)?(v\d+\/.*)$/i)
  if (match) return match[1]
  return url 
}

async function main() {
  await client.connect()
  console.log('Starting image deduplication...')
  
  const res = await client.query('SELECT id, photos, image_urls FROM listings')
  const listings = res.rows
  let updatedCount = 0

  for (const listing of listings) {
    let images = []
    if (Array.isArray(listing.image_urls) && listing.image_urls.length > 0) {
      images = listing.image_urls
    } else if (Array.isArray(listing.photos)) {
      images = listing.photos
    } else if (typeof listing.photos === 'string') {
      try {
        images = JSON.parse(listing.photos)
      } catch (e) {
        images = [listing.photos]
      }
    }

    if (!Array.isArray(images) || images.length <= 1) continue

    const uniqueBases = new Set()
    const finalImages = []

    for (const url of images) {
      if (typeof url !== 'string') continue
      const base = extractBaseId(url)
      if (!uniqueBases.has(base)) {
        uniqueBases.add(base)
        finalImages.push(url)
      }
    }

    if (finalImages.length < images.length) {
      console.log(`Listing ${listing.id}: Deduplicated from ${images.length} to ${finalImages.length}`)
      await client.query(
        'UPDATE listings SET image_urls = $1, photos = $2 WHERE id = $3',
        [finalImages, JSON.stringify(finalImages), listing.id]
      )
      updatedCount++
    }
  }

  console.log(`Finished. Updated ${updatedCount} listings.`)
  await client.end()
}

main().catch(console.error)
