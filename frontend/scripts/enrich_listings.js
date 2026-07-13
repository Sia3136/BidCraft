const fs = require('fs');
const path = require('path');

// Read the previously cleaned exploreProducts file
const fileContent = fs.readFileSync(path.join(__dirname, 'lib/exploreProducts.ts'), 'utf-8');
// It exports the array directly. Let's parse it.
const jsonStrMatch = fileContent.match(/export const exploreProducts: Product\[\] = (\[.*\]);/s);

if (!jsonStrMatch) {
  console.error("Failed to parse exploreProducts.ts");
  process.exit(1);
}

let products = JSON.parse(jsonStrMatch[1]);

// Helpers
const indianNames = ["Amit Patel", "Priya Sharma", "Ravi Kumar", "Neha Gupta", "Vikram Singh", "Anjali Desai", "Rajesh Reddy", "Kavita Rao", "Sanjay Nair", "Meera Menon"];
const badgesOptions = ["Verified Creator", "Top Rated Seller", "Fast Shipper", "Trusted Seller", "100+ Sales", "500+ Sales"];

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function expandDescription(desc, title) {
  if (!desc) desc = `${title} is a beautifully crafted item.`;
  
  let sentences = desc.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 5);
  
  const fillers = [
    "It has been meticulously designed with attention to every detail.",
    "This piece serves as an excellent addition to any personal collection.",
    "The craftsmanship guarantees a durable and long-lasting finish.",
    "It brings an authentic charm that stands out in any setting.",
    "Perfect for gifting to a loved one or keeping for yourself.",
    "The vibrant materials used are sourced ethically to ensure high quality.",
    "Every aspect of this item reflects true artistic dedication."
  ];

  while (sentences.length < 5) {
    // add filler sentences
    sentences.push(fillers.pop() || "A wonderful item to cherish for years.");
  }
  
  return sentences.join('. ') + '.';
}

for (let p of products) {
  // Description: min 5 sentences
  p.description = expandDescription(p.description, p.title);

  // Specifications: min 4 fields
  if (!p.specifications || Object.keys(p.specifications).length < 4) {
    p.specifications = {
      ...(p.specifications || {}),
      "Material": "Premium Quality Material",
      "Dimensions": "Standard Size",
      "Weight": "Varies",
      "Ships From": getRandom(["Mumbai, India", "Delhi, India", "Bangalore, India", "Jaipur, India", "Chennai, India"])
    };
  }

  // Creator Rating: max 2 decimals
  if (p.creatorRating === undefined || p.creatorRating === null) {
    p.creatorRating = parseFloat((Math.random() * 1 + 4).toFixed(2)); // 4.0 to 5.0
  } else {
    p.creatorRating = parseFloat(p.creatorRating.toFixed(2));
  }

  // Creator Review Count
  if (p.creatorReviewCount === undefined || p.creatorReviewCount === null) {
    p.creatorReviewCount = Math.floor(Math.random() * 500) + 10;
  }

  // Creator Badges
  if (!p.creatorBadges || p.creatorBadges.length === 0) {
    let numBadges = Math.floor(Math.random() * 3) + 1; // 1 to 3
    let bgs = new Set();
    while(bgs.size < numBadges) {
      bgs.add(getRandom(badgesOptions));
    }
    p.creatorBadges = Array.from(bgs);
  }

  // Creator Name
  if (!p.creator || p.creator.trim() === '') {
    p.creator = getRandom(indianNames);
  } else {
    // If it is just a brand name or not Indian, maybe leave it, but the prompt says:
    // "creator: full Indian person name". Let's force it if it doesn't look like a person's name.
    if (!p.creator.includes(' ')) {
      p.creator = getRandom(indianNames);
    }
  }

  // Set auctionEndsAt if it's an auction
  if (p.buyingMethod === 'Auction' && !p.auctionEndsAt) {
    // Fixed reference point: 2025-08-01T00:00:00Z
    // Add random days between 1 and 7
    const baseDate = new Date("2025-08-01T00:00:00Z");
    baseDate.setHours(baseDate.getHours() + (Math.random() * 168)); // up to 7 days
    p.auctionEndsAt = baseDate.toISOString();
  }
}

let newFileContent = `import { Product } from './dbProducts';\n\nexport const exploreProducts: Product[] = ` + JSON.stringify(products, null, 2) + `;\n`;
fs.writeFileSync(path.join(__dirname, 'lib/exploreProducts.ts'), newFileContent, 'utf-8');

console.log("Enriched all listings with required fields.");
