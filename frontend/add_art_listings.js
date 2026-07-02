const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'lib', 'exploreProducts.ts');
let content = fs.readFileSync(filePath, 'utf8');

const newListings = [
  // Paintings
  { id: "art-001", title: "Monsoon Showers in Pune", creator: "Sneha Agarwal", category: "Art", subcategory: "Paintings", price: 6500, buyingMethod: "Auction", image: "/images/5ad309e5bf37d2a19670076e986021fd.webp", description: "An oil painting capturing the lively spirit of Pune streets during monsoon.", verified: true, offersAllowed: false, bidCount: 14, currentBid: 6800 },
  { id: "art-002", title: "Golden Marigolds", creator: "Sneha Agarwal", category: "Art", subcategory: "Paintings", price: 4200, buyingMethod: "Buy Now", image: "/images/5b0b8ddfd495bbd0f96f457abbf3bbd8.webp", description: "A vibrant watercolour piece focusing on traditional Indian marigold garlands.", verified: true, offersAllowed: true },
  { id: "art-003", title: "Abstract Serenity", creator: "Kavita Singh", category: "Art", subcategory: "Paintings", price: 8900, buyingMethod: "Negotiable", image: "/images/31e38d210b5e219cf5831d51863aff83.webp", description: "Large canvas abstract piece with soothing oceanic tones.", verified: false, offersAllowed: true },
  { id: "art-004", title: "Rural Landscape", creator: "Amit Patel", category: "Art", subcategory: "Paintings", price: 3400, buyingMethod: "Buy Now", image: "/images/864c5ce031b5e77f9a5eb9a8d506f497.jpg", description: "A beautiful acrylic landscape depicting the peaceful countryside.", verified: false, offersAllowed: false },
  { id: "art-005", title: "Midnight Bloom", creator: "Priya Nair", category: "Art", subcategory: "Paintings", price: 5500, buyingMethod: "Auction", image: "/images/1289afe396aec8a3225851a4f68bf9ed.webp", description: "A dramatic floral study set against a deep midnight background.", verified: false, offersAllowed: false, bidCount: 5, currentBid: 5600 },
  { id: "art-006", title: "Urban Rhythms", creator: "Rohit Verma", category: "Art", subcategory: "Paintings", price: 7200, buyingMethod: "Negotiable", image: "/images/a1c8a4582ca82c3995d88befe1464e8e.webp", description: "A cubist-inspired piece portraying the chaotic yet rhythmic energy of a city.", verified: false, offersAllowed: true },
  { id: "art-007", title: "Whispering Woods", creator: "Anjali Gupta", category: "Art", subcategory: "Paintings", price: 4800, buyingMethod: "Buy Now", image: "/images/ae02a7936a96a8d1302dc65047499be9.webp", description: "A calm and detailed representation of an ancient forest.", verified: false, offersAllowed: true },
  { id: "art-008", title: "Abstract Oil Painting \"Monsoon\"", creator: "Priya Nair", category: "Art", subcategory: "Paintings", price: 2800, buyingMethod: "Auction", image: "/images/43d02cac562d82f18e18ed3a0a7266ee.jpg", description: "A textural oil painting that evokes the feeling of heavy monsoon rain.", verified: false, offersAllowed: false, bidCount: 7, currentBid: 3200 },
  { id: "art-009", title: "Traditional Heritage", creator: "Sunil Joshi", category: "Art", subcategory: "Paintings", price: 9500, buyingMethod: "Negotiable", image: "/images/968355308d40d83a2e1f59daa61c5089.jpg", description: "A large heritage-themed artwork with intricate details and gold leaf accents.", verified: false, offersAllowed: true },
  { id: "art-010", title: "Vibrant Chaos", creator: "Meera Pillai", category: "Art", subcategory: "Paintings", price: 3100, buyingMethod: "Buy Now", image: "/images/d400a85bd9cd68c5a2d8cda063dac7e0.jpg", description: "An explosive expressionist piece full of bold colours.", verified: false, offersAllowed: false },
  { id: "art-011", title: "Vintage Retro Poster", creator: "Karan Sethi", category: "Art", subcategory: "Paintings", price: 2500, buyingMethod: "Buy Now", image: "/images/ed2af0776b49fdea863a1ead90dadf19.jpg", description: "A classic retro-style artwork, carefully restored and framed.", verified: false, offersAllowed: true },

  // Sketches & Drawings
  { id: "art-012", title: "Charcoal Portrait Sketch", creator: "Vikram Rao", category: "Art", subcategory: "Sketches & Drawings", price: 1800, buyingMethod: "Auction", image: "/images/4cf20961ee9c8dccc7dfb51c2f561af8.jpg", description: "A deeply expressive charcoal portrait highlighting emotion and shadow.", verified: true, offersAllowed: false, bidCount: 8, currentBid: 2100 },
  { id: "art-013", title: "Architectural Wonders", creator: "Divya Sharma", category: "Art", subcategory: "Sketches & Drawings", price: 1200, buyingMethod: "Buy Now", image: "/images/1201e7eabf4c8dd5170b0a2b6203dc42.jpg", description: "A fine-liner ink sketch of historical architecture.", verified: false, offersAllowed: false },
  { id: "art-014", title: "Wildlife Study: Tiger", creator: "Suresh Menon", category: "Art", subcategory: "Sketches & Drawings", price: 2900, buyingMethod: "Negotiable", image: "/images/2594d9c77a1e73aefd4e50631968e2e0.webp", description: "An incredibly detailed graphite sketch of a Bengal tiger.", verified: false, offersAllowed: true },
  { id: "art-015", title: "Minimalist Figure", creator: "Arjun Mehta", category: "Art", subcategory: "Sketches & Drawings", price: 900, buyingMethod: "Buy Now", image: "/images/44baf8c7320670cef2659e68cb492255.webp", description: "A minimalist continuous line drawing of a human figure.", verified: false, offersAllowed: false },
  { id: "art-016", title: "Botanical Ink Drawing", creator: "Tanvi Crafts", category: "Art", subcategory: "Sketches & Drawings", price: 1500, buyingMethod: "Buy Now", image: "/images/e28037264502713adb183f8523837b47.webp", description: "A delicate pen and ink illustration of native flora.", verified: false, offersAllowed: true },

  // Digital Art
  { id: "art-017", title: "Digital Art Print — Abstract Botanicals", creator: "Pixels by Pooja", category: "Art", subcategory: "Digital Art", price: 1100, buyingMethod: "Buy Now", image: "/images/e812c5346c69f143d25ef93ee4411d6b.jpg", description: "A high-resolution digital print featuring abstract botanical shapes.", verified: false, offersAllowed: false },
  { id: "art-018", title: "Cyberpunk Cityscape", creator: "Neo Canvas", category: "Art", subcategory: "Digital Art", price: 3800, buyingMethod: "Auction", image: "/images/013d7240408456110f7fbb438010ac91.webp", description: "A vivid digital painting of a futuristic cyberpunk city.", verified: false, offersAllowed: false, bidCount: 12, currentBid: 4100 },
  { id: "art-019", title: "Surreal Dreamscape", creator: "Pixels by Pooja", category: "Art", subcategory: "Digital Art", price: 2200, buyingMethod: "Negotiable", image: "/images/fa4a00e8f54ea6c00ca7181fb7c8c100.webp", description: "A surreal digital composition blending nature and cosmic elements.", verified: false, offersAllowed: true },
  { id: "art-020", title: "Geometric Abstraction", creator: "Rohan Illustrations", category: "Art", subcategory: "Digital Art", price: 1400, buyingMethod: "Buy Now", image: "/images/9ecbeaf48b93b6d50ada2184177af724.webp", description: "A sharp geometric digital artwork focusing on symmetry and color.", verified: false, offersAllowed: false },

  // Illustrations
  { id: "art-021", title: "Whimsical Character Illustration", creator: "Rohan Illustrations", category: "Art", subcategory: "Illustrations", price: 1600, buyingMethod: "Buy Now", image: "/images/7a7a73ca6a320d1ee0350ed045b0f27f.webp", description: "A charming, hand-drawn digital illustration of an original character.", verified: false, offersAllowed: false },
  { id: "art-022", title: "Storybook Scene", creator: "Nandini Das", category: "Art", subcategory: "Illustrations", price: 2700, buyingMethod: "Negotiable", image: "/images/dcbc212d2f73919bff59c60b9e8a7b30.jpg", description: "A richly detailed illustration fit for a fantasy storybook.", verified: false, offersAllowed: true },
  { id: "art-023", title: "Editorial Illustration", creator: "Vikram Rao", category: "Art", subcategory: "Illustrations", price: 3200, buyingMethod: "Auction", image: "/images/bb790b3ed435f058d2b30f6fe364cacd.webp", description: "A striking, conceptual editorial illustration.", verified: true, offersAllowed: false, bidCount: 6, currentBid: 3400 },

  // Prints & Posters
  { id: "art-024", title: "Typography Art Print", creator: "Design Haven", category: "Art", subcategory: "Prints & Posters", price: 800, buyingMethod: "Buy Now", image: "/images/8c5c985a4ba083010ee62d84f9fb6577.webp", description: "A bold, modern typography poster printed on premium matte paper.", verified: false, offersAllowed: false },
  { id: "art-025", title: "Minimalist Movie Poster", creator: "Karan Sethi", category: "Art", subcategory: "Prints & Posters", price: 1250, buyingMethod: "Negotiable", image: "/images/f06bdeca8c31052b74db04b69bd23718.jpg", description: "A minimalist re-imagining of a classic cinema poster.", verified: false, offersAllowed: true },
  { id: "art-026", title: "Vintage Travel Print", creator: "Karan Sethi", category: "Art", subcategory: "Prints & Posters", price: 1500, buyingMethod: "Buy Now", image: "/images/470b571670ccddef91176aaaee01b23c.webp", description: "A beautifully restored vintage travel poster.", verified: false, offersAllowed: true },

  // Sculptures
  { id: "art-027", title: "Modern Abstract Sculpture", creator: "Vikram Rao", category: "Art", subcategory: "Sculptures", price: 8500, buyingMethod: "Auction", image: "/images/3ed6521fdb9726a8cb2da3c33d81c89c.jpg", description: "A sleek, modern abstract sculpture crafted from reclaimed stone.", verified: true, offersAllowed: false, bidCount: 15, currentBid: 9800 },
  { id: "art-028", title: "Terracotta Figurine", creator: "Mitti Studio", category: "Art", subcategory: "Sculptures", price: 2100, buyingMethod: "Buy Now", image: "/images/f3530f2aa55a74cfe8264c46ce6fe39d.jpg", description: "A traditional handcrafted terracotta figurine depicting local folklore.", verified: false, offersAllowed: true }
];

// Compile TS to JS to evaluate it
const compilerOptions = { module: 'commonjs', target: 'es2018' };
const ts = require('typescript');
const jsCode = ts.transpile(content, compilerOptions);
const mod = { exports: {} };
const fn = new Function('module', 'exports', 'require', jsCode);
fn(mod, mod.exports, require);

let existingProducts = mod.exports.exploreProducts || [];

let uniqueProducts = [];
let seenIds = new Set();
let removed = [];

const allProducts = [...existingProducts, ...newListings];

allProducts.forEach(p => {
  if (seenIds.has(p.id)) {
    removed.push({ id: p.id, title: p.title, reason: 'Duplicate ID' });
    return;
  }
  
  if (!p.image || typeof p.image !== 'string' || p.image.trim() === '') {
    removed.push({ id: p.id, title: p.title, reason: 'Missing image' });
    return;
  }

  const imagePath = path.join(__dirname, 'public', p.image);
  if (!fs.existsSync(imagePath)) {
     removed.push({ id: p.id, title: p.title, reason: 'Image file does not exist locally: ' + p.image });
     return;
  }

  seenIds.add(p.id);
  uniqueProducts.push(p);
});

let outputTS = `export interface Product {
  id: string;
  title: string;
  creator: string;
  category: string;
  subcategory: string;
  price: number;
  buyingMethod: "Buy Now" | "Auction" | "Negotiable";
  image: string;
  description: string;
  verified: boolean;
  offersAllowed: boolean;
  bidCount?: number;
  currentBid?: number;
}

export const exploreProducts: Product[] = ${JSON.stringify(uniqueProducts, null, 2)};
`;

fs.writeFileSync(filePath, outputTS, 'utf8');

console.log("Removed listings:");
console.table(removed);
console.log("Total products now:", uniqueProducts.length);
