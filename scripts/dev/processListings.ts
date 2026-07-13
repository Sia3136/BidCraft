import fs from 'fs';
import path from 'path';
import { exploreProducts } from '../lib/exploreProducts';

const newListingsInput = [
  // Anime Merchandise
  { id: "gh-am-0", image: "5f3adde084f08eee2d3375f04d56ba04.jpg", title: "Anime School Bag", descBasis: "anime school bag", buyingMethod: "Buy Now", offersAllowed: true, category: "Gaming & Hobby", subcategory: "Anime Merchandise", price: 1250 },
  { id: "gh-am-1", image: "133ed5c3890f16eeca38eedf3bd059b5.jpg", title: "Anime Keychain Set", descBasis: "anime keychains", buyingMethod: "Buy Now", offersAllowed: false, category: "Gaming & Hobby", subcategory: "Anime Merchandise", price: 450 },
  { id: "gh-am-2", image: "ee616c53d459a38d4c2122653aa94920.jpg", title: "Anime Figure Collectibles Set", descBasis: "anime figure collectibles", buyingMethod: "Auction", category: "Gaming & Hobby", subcategory: "Anime Merchandise", price: 3500 },

  // Board Games
  { id: "gh-bg-0", image: "5139a72a8fd930206d06b40689c6e35c.jpg", title: "Classic Wooden Dominoes Set", descBasis: "classic wooden dominoes", buyingMethod: "Buy Now", offersAllowed: false, category: "Gaming & Hobby", subcategory: "Board Games", price: 850 },
  { id: "gh-bg-1", image: "ab649b70f654625251d0c0a5ff8f6eae.webp", title: "Harry Potter Edition Guess Who", descBasis: "Harry Potter edition guess me who game", buyingMethod: "Buy Now", offersAllowed: true, category: "Gaming & Hobby", subcategory: "Board Games", price: 2100 },
  { id: "gh-bg-2", image: "b355c24663070085652f2205eb853402.webp", title: "Clash of Clans Collector's Board Game", descBasis: "unique Clash of Clans game", buyingMethod: "Auction", category: "Gaming & Hobby", subcategory: "Board Games", price: 4200 },
  { id: "gh-bg-3", image: "p452729_2.jpg", title: "Rare Wooden Chess Set", descBasis: "rare wooden chess set", buyingMethod: "Auction", category: "Gaming & Hobby", subcategory: "Board Games", price: 4800 },

  // Cosplay Props
  { id: "gh-cp-0", image: "3b996e5246d79ef9617231779fe39bfd.webp", title: "Shadowmourne Battle Axe — WoW LED Replica", descBasis: "Shadowmourne battle axe from World of Warcraft, designed by Kamui Cosplay with integrated LED lighting", buyingMethod: "Auction", category: "Gaming & Hobby", subcategory: "Cosplay Props", price: 5000 },
  { id: "gh-cp-1", image: "5c9d92c399c387829d972b3c4dd94ddb.webp", title: "Shimmer Mic Set — Cosplay Performance Pack", descBasis: "pair of 5 colourful shimmer mic set", buyingMethod: "Buy Now", offersAllowed: true, category: "Gaming & Hobby", subcategory: "Cosplay Props", price: 1800 },
  { id: "gh-cp-2", image: "827f63726fb2295f4704e8a2293b8076.webp", title: "Jinx Chomper Grenade — Arcane 3D Print", descBasis: "detailed 3D-printed replica of Jinx's Chomper grenade from Arcane", buyingMethod: "Buy Now", offersAllowed: false, category: "Gaming & Hobby", subcategory: "Cosplay Props", price: 2600 },
  { id: "gh-cp-3", image: "8181163cbbd1df84ebcf1ee68060e86b.jpg", title: "Addams Family Thing Hand Prop", descBasis: "prop for Addams Family", buyingMethod: "Buy Now", offersAllowed: true, category: "Gaming & Hobby", subcategory: "Cosplay Props", price: 1100 },

  // Puzzle Collections
  { id: "gh-pc-0", image: "1a1bf978dcd45523d39f580eee52572f.jpg", title: "Mayhem in the Library — 1000pc Puzzle", descBasis: "mayhem in the library big puzzle", buyingMethod: "Buy Now", offersAllowed: false, category: "Gaming & Hobby", subcategory: "Puzzle Collections", price: 1350 },
  { id: "gh-pc-1", image: "6f125dfb748d013c750f962fec969796.jpg", title: "Pink Edition Collector Puzzle Box", descBasis: "pink huge puzzle box", buyingMethod: "Buy Now", offersAllowed: true, category: "Gaming & Hobby", subcategory: "Puzzle Collections", price: 2200 },
  { id: "gh-pc-2", image: "114dba49a0cb6e275f187ab73b4c71f6.webp", title: "Not Your Ordinary Jigsaw Set", descBasis: "not your ordinary unique jigsaw puzzles set", buyingMethod: "Buy Now", offersAllowed: false, category: "Gaming & Hobby", subcategory: "Puzzle Collections", price: 1750 },

  // Action Figures
  { id: "col-af-0", image: "9b2adcf5396176251f6e5686a1760f48.jpg", title: "Batman Action Figure", descBasis: "Batman action figure", buyingMethod: "Buy Now", offersAllowed: true, category: "Collectibles", subcategory: "Action Figures", price: 2800 },
  { id: "col-af-1", image: "26e31402e0f6f219cb45dfbbaac247bc.jpg", title: "Spider-Man Unique Action Figure", descBasis: "Spider-Man unique action figure", buyingMethod: "Auction", category: "Collectibles", subcategory: "Action Figures", price: 3400 },
  { id: "col-af-2", image: "4256f8dcb8f244ba618721219f550054.jpg", title: "Spider-Man Listening to Music — Rare Figure", descBasis: "Spider-Man listening music rare action figure", buyingMethod: "Auction", category: "Collectibles", subcategory: "Action Figures", price: 4100 },

  // Funko Pops
  { id: "col-fp-0", image: "56f2f37fe6cde13194e0c8795c4b40ae.webp", title: "Spider-Man Rare Funko Pop Set of 4", descBasis: "set of 4 Spider-Man rare Funko Pops", buyingMethod: "Auction", category: "Collectibles", subcategory: "Funko Pops", price: 4500 },
  { id: "col-fp-1", image: "9686ec7e50b85ac5696033ccfae67227.webp", title: "Miranda Priestly Special Edition Funko Pop", descBasis: "Miranda Priestly special Funko Pop", buyingMethod: "Buy Now", offersAllowed: true, category: "Collectibles", subcategory: "Funko Pops", price: 1600 },
  { id: "col-fp-2", image: "dca0a68b8d373d88caafb8802ca64371.webp", title: "Vincent van Gogh Funko Pop", descBasis: "Vincent van Gogh Funko Pop", buyingMethod: "Buy Now", offersAllowed: false, category: "Collectibles", subcategory: "Funko Pops", price: 1550 },
  { id: "col-fp-3", image: "f8606ecbf401957653aa8e767871efa5.jpg", title: "Michael Jackson Funko Pop", descBasis: "Michael Jackson Funko Pop", buyingMethod: "Buy Now", offersAllowed: true, category: "Collectibles", subcategory: "Funko Pops", price: 1900 },

  // Hot Wheels
  { id: "col-hw-0", image: "59c28005f07f951c988868086560ab2e.jpg", title: "Datsun 240Z Pink & Blue Twin Pack", descBasis: "set of 2 pink and blue Hot Wheels Datsun 240Z", buyingMethod: "Buy Now", offersAllowed: true, category: "Collectibles", subcategory: "Hot Wheels", price: 1200 },
  { id: "col-hw-1", image: "586fa4c05a4543d441ec3c2bf877f807.jpg", title: "Rare Blue Hot Wheels Collectible", descBasis: "rare blue Hot Wheels collectible", buyingMethod: "Auction", category: "Collectibles", subcategory: "Hot Wheels", price: 2100 },
  { id: "col-hw-2", image: "82984d988affd58d925369d18cfc6474.jpg", title: "Fast & Furious Special Edition Hot Wheels", descBasis: "Fast & Furious special Hot Wheels", buyingMethod: "Buy Now", offersAllowed: false, category: "Collectibles", subcategory: "Hot Wheels", price: 1450 },
  { id: "col-hw-3", image: "bab649350f00266882bb6a4c5d7c9cd0.jpg", title: "Formula 1 Special Edition Hot Wheels", descBasis: "Formula 1 special Hot Wheels", buyingMethod: "Buy Now", offersAllowed: true, category: "Collectibles", subcategory: "Hot Wheels", price: 1300 },
  { id: "col-hw-4", image: "hw-vintage-corvette.jpg", title: "1999 Treasure Hunt Series Hot Wheels", descBasis: "1999 Treasure Hunt series Hot Wheels", buyingMethod: "Auction", category: "Collectibles", subcategory: "Hot Wheels", price: 3200 },

  // Rare Collectibles
  { id: "col-rc-0", image: "da73bc9b03ca4657978e673c794395f8.jpg", title: "Custom Mechanical Keyboard", descBasis: "custom mechanical keyboard", buyingMethod: "Auction", category: "Collectibles", subcategory: "Rare Collectibles", price: 4900 },
  { id: "col-rc-1", image: "fd65ab6bd2b173fea7adfd27510dd72a.jpg", title: "Hirono Panda Action Figure", descBasis: "Hirono Panda action figure", buyingMethod: "Buy Now", offersAllowed: true, category: "Collectibles", subcategory: "Rare Collectibles", price: 2950 },

  // Trading Cards
  { id: "col-tc-0", image: "3e509945098af056b376472bd2b9c91c.webp", title: "Rare Pokémon Card", descBasis: "Pokémon card rare", buyingMethod: "Auction", category: "Collectibles", subcategory: "Trading Cards", price: 3800 },
  { id: "col-tc-1", image: "4435fad5eacdcf934b4135a6709074ed.jpg", title: "Unique Sabrina Carpenter Trading Card", descBasis: "unique Sabrina Carpenter card", buyingMethod: "Buy Now", offersAllowed: true, category: "Collectibles", subcategory: "Trading Cards", price: 1100 },
  { id: "col-tc-2", image: "66e294a293cc3c416e41028c1f2ce8ed.jpg", title: "Dragon Cards — Set of 6", descBasis: "dragon cards set of 6", buyingMethod: "Buy Now", offersAllowed: false, category: "Collectibles", subcategory: "Trading Cards", price: 850 },
  { id: "col-tc-3", image: "f0624341bbd467383ede272db639ed38.jpg", title: "Rare Pokémon Cards — Set of 12", descBasis: "set of 12 rare Pokémon cards", buyingMethod: "Auction", category: "Collectibles", subcategory: "Trading Cards", price: 4600 }
];

const creators = [
  "Rohan Sharma", "Priya Patel", "Vikram Singh", "Anjali Gupta", 
  "Karthik Nair", "Sneha Iyer", "Rajesh Kumar", "Meera Reddy",
  "Arjun Menon", "Divya Deshmukh", "Siddharth Rao", "Pooja Joshi"
];

const badgesList = ["Top Rated Seller","Fast Shipper","500+ Sales","Verified Creator","Trusted Seller"];

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateDescription(descBasis, title) {
  return `This is a spectacular find for any collector: the ${title}. Based on the incredible ${descBasis}, it stands out as a unique piece in our collection. It has been meticulously preserved and crafted using premium materials to ensure its longevity. The condition is absolutely pristine, making it a highly sought-after item for both new and veteran enthusiasts. Whether you are adding to your personal display or looking for the perfect gift, this item will not disappoint.`;
}

function generateSpecs(subcategory) {
  switch(subcategory) {
    case "Anime Merchandise":
      return { "Type": "Merchandise", "Character/Series": "Various Anime", "Material": "Premium Synthetic", "Dimensions": "Standard Size", "Weight": "200g", "Limited Edition": "Yes", "Ships From": "Mumbai, India" };
    case "Board Games":
      return { "Players": "2-4 Players", "Age Range": "8+", "Play Time": "30-60 Mins", "Components": "Complete Set", "Dimensions": "Standard Box", "Weight": "1.2kg", "Ships From": "Delhi, India" };
    case "Cosplay Props":
      return { "Character/Series": "Various", "Material": "High-Density Foam/Plastic", "Dimensions": "1:1 Scale", "Weight": "500g", "LED": "Yes", "Assembly Required": "No", "Ships From": "Bangalore, India" };
    case "Puzzle Collections":
      return { "Piece Count": "1000", "Dimensions (assembled)": "70x50 cm", "Difficulty": "Advanced", "Material": "Cardboard", "Age Range": "12+", "Ships From": "Chennai, India" };
    case "Action Figures":
      return { "Character/Series": "Hero", "Scale": "1/6", "Material": "PVC", "Articulation Points": "24", "Includes Accessories": "Alternate hands, base", "Ships From": "Pune, India" };
    case "Funko Pops":
      return { "Character": "Special", "Series/Line": "Pop! Vinyl", "Height": "4 inches", "Material": "Vinyl", "Box Condition": "Mint", "Limited Edition": "Yes", "Ships From": "Kolkata, India" };
    case "Hot Wheels":
      return { "Model Name": "Custom", "Series": "Collector Edition", "Scale": "1:64", "Material": "Diecast Metal", "Wheel Type": "Real Riders", "Box Condition": "Mint", "Ships From": "Delhi, India" };
    case "Rare Collectibles":
      return { "Type": "Collectible", "Material": "Mixed Media", "Dimensions": "Various", "Condition": "Excellent", "Rarity": "Rare", "Ships From": "Mumbai, India" };
    case "Trading Cards":
      return { "Card Name": "Special Card", "Set/Series": "Base Set", "Condition": "Near Mint", "Holographic": "Yes", "Ships From": "Bangalore, India" };
    default:
      return { "Ships From": "India" };
  }
}

// Ensure recursively finding a file in a directory
function findFile(dir, filename) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(findFile(file, filename));
    } else {
      if (path.basename(file) === filename) results.push(file);
    }
  });
  return results;
}

const PUBLIC_IMAGES_DIR = path.join(__dirname, '../public/images');
const HANDOFF_DIR = path.join('C:\\Bidcraft\\images');

const skippedFiles = [];
const verifiedIds = ["gh-am-2", "col-af-1"]; // Pick 2 to be verified

const auctionStaggers = [
  "2025-08-01T18:00:00Z", // +18h
  "2025-08-03T00:00:00Z", // +2d
  "2025-08-06T00:00:00Z", // +5d
  "2025-08-08T00:00:00Z"  // +7d
];
let auctionIdx = 0;

const finalNewListings = [];

newListingsInput.forEach(input => {
  // Check if image exists in public/images
  let exists = fs.existsSync(path.join(PUBLIC_IMAGES_DIR, input.image));
  
  if (!exists) {
    // Search in handoff dir
    const found = findFile(HANDOFF_DIR, input.image);
    if (found.length > 0) {
      fs.copyFileSync(found[0], path.join(PUBLIC_IMAGES_DIR, input.image));
      exists = true;
    }
  }

  if (!exists) {
    skippedFiles.push(input.image);
    return;
  }

  const badgeCount = Math.floor(Math.random() * 3) + 1;
  const shuffledBadges = [...badgesList].sort(() => 0.5 - Math.random());
  
  const listing = {
    id: input.id,
    title: input.title,
    creator: randomChoice(creators),
    creatorRating: parseFloat((Math.random() * (5.0 - 4.1) + 4.1).toFixed(2)),
    creatorReviewCount: Math.floor(Math.random() * (800 - 20 + 1)) + 20,
    creatorBadges: shuffledBadges.slice(0, badgeCount),
    verified: verifiedIds.includes(input.id),
    category: input.category,
    subcategory: input.subcategory,
    price: input.price,
    buyingMethod: input.buyingMethod,
    offersAllowed: input.offersAllowed,
    minimumOfferPercent: 70,
    image: `/images/${input.image}`,
    images: Array(6).fill(`/images/${input.image}`),
    description: generateDescription(input.descBasis, input.title),
    specifications: generateSpecs(input.subcategory)
  };

  if (input.buyingMethod === "Auction") {
    listing.currentBid = Math.floor(input.price * 0.8);
    listing.bidCount = Math.floor(Math.random() * 15) + 1;
    listing.auctionEndsAt = auctionStaggers[auctionIdx % auctionStaggers.length];
    listing.offersAllowed = false; // "always false on Auction"
    auctionIdx++;
  }

  finalNewListings.push(listing);
});

let updatedProducts = [...exploreProducts];
updatedProducts.push(...finalNewListings);

// 5. Duplicate removal
// - Duplicate id values — keep the newer one (defined later in the array), delete the earlier
// - Two entries sharing the same image path within the same category — keep the one matching the descriptions in this prompt, delete the older generic one
// - Any listing with a missing/null/empty image field — delete it

const deletedListings = [];
const finalProducts = [];

// Reverse array to keep the "newer" ones easily
updatedProducts.reverse();

const seenIds = new Set();
const seenImagesByCategory = new Set();

updatedProducts.forEach(prod => {
  let deleteReason = null;
  
  if (!prod.image) {
    deleteReason = "Missing/empty image field";
  } else if (seenIds.has(prod.id)) {
    deleteReason = "Duplicate ID (kept newer)";
  } else if (seenImagesByCategory.has(prod.category + '|' + prod.image)) {
    deleteReason = "Duplicate image in same category (kept newer)";
  }

  if (deleteReason) {
    deletedListings.push({ id: prod.id, title: prod.title, reason: deleteReason });
  } else {
    seenIds.add(prod.id);
    seenImagesByCategory.add(prod.category + '|' + prod.image);
    finalProducts.push(prod);
  }
});

// Restore original order
finalProducts.reverse();

const fileOutput = `import { Product } from './dbProducts';

export const exploreProducts: Product[] = ${JSON.stringify(finalProducts, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, '../lib/exploreProducts.ts'), fileOutput);

const summaryPath = path.join(process.cwd(), 'summary.json');
fs.writeFileSync(summaryPath, JSON.stringify({
  added: finalNewListings,
  skipped: skippedFiles,
  deleted: deletedListings
}, null, 2));

console.log("Done");
