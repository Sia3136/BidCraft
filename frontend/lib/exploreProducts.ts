import { lifestyleProducts } from "./lifestyleProducts";

export interface Product {
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
  creatorRating?: number;
  creatorReviewCount?: number;
  creatorBadges?: string[];
  minimumOfferPercent?: number;
  images?: string[];
  specifications?: Record<string, string>;
  auctionEndsAt?: string;
}

export const exploreProducts: Product[] = [
  {
    "id": "exp-002",
    "title": "Crochet Flower Pot Cover",
    "creator": "Pixels by Pooja",
    "category": "Handmade & Crafts",
    "subcategory": "Crochet & Knitting",
    "price": 499,
    "buyingMethod": "Buy Now",
    "image": "/images/images.jpeg",
    "description": "Crochet flower pot — this listing belongs to Handmade & Crafts, not Art; move it. Handcrafted with traditional crochet techniques to perfectly fit and enhance your potted plants. Ships securely from local artisan.",
    "verified": false,
    "offersAllowed": true
  },
  {
    "id": "exp-003",
    "title": "Resin Art Mirror",
    "creator": "Divya Sharma",
    "category": "Art",
    "subcategory": "Prints & Posters",
    "price": 2199,
    "buyingMethod": "Buy Now",
    "image": "/images/e0e8112d8f5b16d5612a0e69efbae352.jpg",
    "description": "Resin Art Mirror\\nOriginal Prints & Posters piece on high-quality material. Dimensions: 24x36 inches. Excellent condition.\\nShips from Delhi, India.\\nRecommended for gallery display or living room focal points.",
    "verified": false,
    "offersAllowed": true
  },
  {
    "id": "exp-004",
    "title": "Crochet Flower Pot Cover",
    "creator": "Tanvi Crafts",
    "category": "Handmade & Crafts",
    "subcategory": "Crochet & Knitting",
    "price": 750,
    "buyingMethod": "Buy Now",
    "image": "/images/images.jpeg",
    "description": "Crochet Flower Pot Cover\\nHandcrafted using traditional Crochet & Knitting techniques. Made from natural, locally-sourced materials.\\nShips from Jaipur, India.\\nSuits bohemian or earthy interior aesthetics.",
    "verified": false,
    "offersAllowed": true
  },
  {
    "id": "exp-005",
    "title": "Mini Heart Crochet Keychain – Set of 2",
    "creator": "Loop & Love Studio",
    "category": "Handmade & Crafts",
    "subcategory": "Crochet & Knitting",
    "price": 349,
    "buyingMethod": "Buy Now",
    "image": "/images/80a7c1fdd769cc0d35110a438dfb6503.jpg",
    "description": "Mini Heart Crochet Keychain – Set of 2\\nHandcrafted using traditional Crochet & Knitting techniques. Made from natural, locally-sourced materials.\\nShips from Jaipur, India.\\nSuits bohemian or earthy interior aesthetics.",
    "verified": false,
    "offersAllowed": true
  },
  {
    "id": "exp-006",
    "title": "Crochet Flowers in Blue Pot",
    "creator": "Wool & Wonder",
    "category": "Handmade & Crafts",
    "subcategory": "Crochet & Knitting",
    "price": 1100,
    "buyingMethod": "Buy Now",
    "image": "/images/beautifully-crafted-colorful-crochet-flowers-in-a-blue-pot-on-a-dark-background-free-photo (1).jpeg",
    "description": "Crochet Flowers in Blue Pot\\nHandcrafted using traditional Crochet & Knitting techniques. Made from natural, locally-sourced materials.\\nShips from Jaipur, India.\\nSuits bohemian or earthy interior aesthetics.",
    "verified": false,
    "offersAllowed": true
  },
  {
    "id": "exp-007",
    "title": "Terracotta Vases – Set of 3",
    "creator": "Mitti Studio",
    "category": "Handmade & Crafts",
    "subcategory": "Clay & Pottery",
    "price": 1350,
    "buyingMethod": "Buy Now",
    "image": "/images/d497bf30fec759fddc8ce0890f380f18.jpg",
    "description": "Terracotta Vases – Set of 3\\nHandcrafted using traditional Clay & Pottery techniques. Made from natural, locally-sourced materials.\\nShips from Jaipur, India.\\nSuits bohemian or earthy interior aesthetics.",
    "verified": false,
    "offersAllowed": true
  },
  {
    "id": "exp-008",
    "title": "Handcrafted Shell Jewellery Stand",
    "creator": "Meera Pillai",
    "category": "Handmade & Crafts",
    "subcategory": "Paper Crafts",
    "price": 799,
    "buyingMethod": "Auction",
    "image": "/images/454b1c36b55a7aac07a46dec81f95a6f.jpg",
    "description": "Handcrafted Shell Jewellery Stand\\nHandcrafted using traditional DIY Creations techniques. Made from natural, locally-sourced materials.\\nShips from Jaipur, India.\\nSuits bohemian or earthy interior aesthetics.",
    "verified": false,
    "offersAllowed": true,
    "bidCount": 1,
    "currentBid": 1114
  },
  {
    "id": "exp-009",
    "title": "Rare 1999 Hot Wheels Treasure Hunt",
    "creator": "Rohan Desai",
    "category": "Collectibles",
    "subcategory": "Hot Wheels",
    "price": 1899,
    "buyingMethod": "Auction",
    "image": "/images/hw-vintage-corvette.jpg",
    "description": "Rare 1999 Hot Wheels Treasure Hunt\\nAuthentic vintage Hot Wheels. Preserved in near-mint condition with original packaging where applicable.\\nShips from Bengaluru, India.\\nPerfect for serious collectors and display cabinets.",
    "verified": false,
    "offersAllowed": true,
    "bidCount": 1,
    "currentBid": 2485
  },
  {
    "id": "exp-010",
    "title": "Limited Edition Comic #1",
    "creator": "Rohan Illustrations",
    "category": "Collectibles",
    "subcategory": "Trading Cards",
    "price": 899,
    "buyingMethod": "Buy Now",
    "image": "/images/80891aa6bb34af3854d903c9a40bde21.jpg",
    "description": "Limited Edition Comic #1\\nAuthentic vintage Trading Cards. Preserved in near-mint condition with original packaging where applicable.\\nShips from Bengaluru, India.\\nPerfect for serious collectors and display cabinets.",
    "verified": false,
    "offersAllowed": true
  },
  {
    "id": "exp-011",
    "title": "Vintage Hand-carved Chess Set",
    "creator": "Arjun Mehta",
    "category": "Collectibles",
    "subcategory": "Action Figures",
    "price": 3200,
    "buyingMethod": "Auction",
    "image": "/images/p452729_2.jpg",
    "description": "Vintage Hand-carved Chess Set\\nAuthentic vintage Action Figures. Preserved in near-mint condition with original packaging where applicable.\\nShips from Bengaluru, India.\\nPerfect for serious collectors and display cabinets.",
    "verified": false,
    "offersAllowed": true,
    "bidCount": 6,
    "currentBid": 3314
  },
  {
    "id": "exp-012",
    "title": "Hirono Panda Designer Figure",
    "creator": "Vinyl Vault India",
    "category": "Collectibles",
    "subcategory": "Action Figures",
    "price": 2100,
    "buyingMethod": "Auction",
    "image": "/images/fd65ab6bd2b173fea7adfd27510dd72a.jpg",
    "description": "Hirono Panda Designer Figure\\nAuthentic vintage Action Figures. Preserved in near-mint condition with original packaging where applicable.\\nShips from Bengaluru, India.\\nPerfect for serious collectors and display cabinets.",
    "verified": false,
    "offersAllowed": true,
    "bidCount": 7,
    "currentBid": 2361
  },
  {
    "id": "exp-013",
    "title": "Custom Mechanical Keyboard",
    "creator": "KeyForge India",
    "category": "Gaming & Hobby",
    "subcategory": "Anime Merchandise",
    "price": 4800,
    "buyingMethod": "Negotiable",
    "image": "/images/da73bc9b03ca4657978e673c794395f8.jpg",
    "description": "Custom Mechanical Keyboard\\nPremium Model Kits item. Tested and verified for functionality and completeness.\\nShips from Pune, India.\\nEssential for retro gamers and hobbyists.",
    "verified": false,
    "offersAllowed": true
  },
  {
    "id": "exp-014",
    "title": "Customised Birthday Candle",
    "creator": "Gifting Atelier",
    "category": "Lifestyle & Gifts",
    "subcategory": "Home Decor",
    "price": 1499,
    "buyingMethod": "Buy Now",
    "image": "/images/a344e75529581e9f43f2c00dc233dea4.webp",
    "description": "Custom birthday gift candle. Hand-poured with premium wax and a delightful, long-lasting scent. A perfect personalized gift to celebrate someone's special day.",
    "verified": false,
    "offersAllowed": true
  },
  {
    "id": "exp-015",
    "title": "Anniversary Crochet Bouquet",
    "creator": "Memoria Crafts",
    "category": "Handmade & Crafts",
    "subcategory": "Crochet & Knitting",
    "price": 1899,
    "buyingMethod": "Buy Now",
    "image": "/images/d156289ab52040263f59b16d6f3f5f2c.jpg",
    "description": "Crochet flower bouquet, anniversary themed. Handcrafted with care and premium yarn to serve as a lasting symbol of love. A unique and charming gift for significant milestones.",
    "verified": false,
    "offersAllowed": true
  },
  {
    "id": "exp-016",
    "title": "Designer Wall Clock",
    "creator": "Home & Hearth Co.",
    "category": "Lifestyle & Gifts",
    "subcategory": "Home Decor",
    "price": 2250,
    "buyingMethod": "Buy Now",
    "image": "/images/27c1a7020f1f1ae13757444e6e302582.jpg",
    "description": "Designer wall clock. Featuring a modern, minimalist design that fits seamlessly into any contemporary room decor. Reliable quartz movement ensures completely accurate timekeeping.",
    "verified": false,
    "offersAllowed": true
  },
  {
    "id": "exp-017",
    "title": "Crochet Camera Keychain",
    "creator": "The Thoughtful Box",
    "category": "Lifestyle & Gifts",
    "subcategory": "Stationery",
    "price": 999,
    "buyingMethod": "Buy Now",
    "image": "/images/4472fc60307774b77a3457158adcd98c.webp",
    "description": "Crochet camera keychain. A cute, meticulously handcrafted accessory designed especially for photography enthusiasts. Attaches easily and securely to bags, backpacks, or keys.",
    "verified": false,
    "offersAllowed": true
  },
  {
    "id": "exp-018",
    "title": "Set of 4 Occasion Earrings",
    "creator": "BidCraft Curated",
    "category": "Lifestyle & Gifts",
    "subcategory": "Jewellery & Accessories",
    "price": 499,
    "buyingMethod": "Buy Now",
    "image": "/images/417caba42ec36fd9ba441b33afd74e7c.jpg",
    "description": "Set of 4 earrings for all occasions. Each pair is beautifully crafted with elegant detailing and high-quality finishes. A versatile and essential addition to your daily jewelry box.",
    "verified": false,
    "offersAllowed": true
  },
  {
    "id": "art-001",
    "title": "Lord Ganesha — Intricate Ink Study",
    "creator": "Sneha Agarwal",
    "category": "Art",
    "subcategory": "Sketches & Drawings",
    "price": 6500,
    "buyingMethod": "Auction",
    "image": "/images/5ad309e5bf37d2a19670076e986021fd.webp",
    "description": "Traditional ink drawing of Lord Ganesha with fine detailing. This intricate study captures the essence of the deity with masterful strokes. A perfect addition to any traditional or spiritual collection.",
    "verified": true,
    "offersAllowed": false,
    "bidCount": 14,
    "currentBid": 6800
  },
  {
    "id": "art-002",
    "title": "Pink & White Florals",
    "creator": "Sneha Agarwal",
    "category": "Art",
    "subcategory": "Paintings",
    "price": 4200,
    "buyingMethod": "Buy Now",
    "image": "/images/5b0b8ddfd495bbd0f96f457abbf3bbd8.webp",
    "description": "Painting of pink and white flowers. This vibrant piece brings a gentle touch of nature indoors with delicate brushwork. A beautiful focal point for a living space.",
    "verified": true,
    "offersAllowed": true
  },
  {
    "id": "art-003",
    "title": "The Eye — Abstract Portrait",
    "creator": "Kavita Singh",
    "category": "Art",
    "subcategory": "Paintings",
    "price": 8900,
    "buyingMethod": "Negotiable",
    "image": "/images/31e38d210b5e219cf5831d51863aff83.webp",
    "description": "Bold abstract painting centered on a human eye. The intense, contrasting colors draw the viewer in immediately and evoke deep thought. A striking contemporary piece for a modern aesthetic.",
    "verified": false,
    "offersAllowed": true
  },
  {
    "id": "art-004",
    "title": "Hibiscus in Bloom",
    "creator": "Amit Patel",
    "category": "Art",
    "subcategory": "Paintings",
    "price": 3400,
    "buyingMethod": "Buy Now",
    "image": "/images/864c5ce031b5e77f9a5eb9a8d506f497.jpg",
    "description": "Painting of a hibiscus flower. The vibrant red petals are captured in exquisite detail, showing the natural beauty of the tropics. A beautiful addition to your floral decor.",
    "verified": false,
    "offersAllowed": false
  },
  {
    "id": "art-005",
    "title": "Candlelight",
    "creator": "Priya Nair",
    "category": "Art",
    "subcategory": "Paintings",
    "price": 5500,
    "buyingMethod": "Auction",
    "image": "/images/1289afe396aec8a3225851a4f68bf9ed.webp",
    "description": "Painting featuring a lit candle. The warm, flickering glow creates a cozy and intimate atmosphere that feels incredibly lifelike. A perfect calming piece for a quiet study or bedroom.",
    "verified": false,
    "offersAllowed": false,
    "bidCount": 5,
    "currentBid": 5600
  },
  {
    "id": "art-006",
    "title": "En Pointe & Fighting Back",
    "creator": "Rohit Verma",
    "category": "Art",
    "subcategory": "Paintings",
    "price": 7200,
    "buyingMethod": "Negotiable",
    "image": "/images/a1c8a4582ca82c3995d88befe1464e8e.webp",
    "description": "Painting of a girl in ballet outfit and boxing stance. It beautifully captures the powerful contrast between grace, discipline, and fierce strength. A highly evocative and empowering piece of art.",
    "verified": false,
    "offersAllowed": true
  },
  {
    "id": "art-007",
    "title": "Floral Reverie",
    "creator": "Anjali Gupta",
    "category": "Art",
    "subcategory": "Paintings",
    "price": 4800,
    "buyingMethod": "Buy Now",
    "image": "/images/ae02a7936a96a8d1302dc65047499be9.webp",
    "description": "Painting of flowers. A dreamy composition featuring soft, blended pastel tones that create a peaceful mood. Perfect for adding a gentle touch of tranquility to any room.",
    "verified": false,
    "offersAllowed": true
  },
  {
    "id": "art-008",
    "title": "Noir Cinema",
    "creator": "Priya Nair",
    "category": "Art",
    "subcategory": "Paintings",
    "price": 2800,
    "buyingMethod": "Auction",
    "image": "/images/43d02cac562d82f18e18ed3a0a7266ee.jpg",
    "description": "Painting of a cinema hall showing a black-and-white film to an audience. It evokes a strong sense of nostalgia and classic cinematic storytelling. A great atmospheric piece for film enthusiasts.",
    "verified": false,
    "offersAllowed": false,
    "bidCount": 7,
    "currentBid": 3200
  },
  {
    "id": "art-009",
    "title": "The Tiger",
    "creator": "Sunil Joshi",
    "category": "Art",
    "subcategory": "Paintings",
    "price": 9500,
    "buyingMethod": "Negotiable",
    "image": "/images/968355308d40d83a2e1f59daa61c5089.jpg",
    "description": "Painting of a tiger. This majestic piece captures the raw power and piercing gaze of the big cat in its natural element. A bold and striking statement for any wildlife lover.",
    "verified": false,
    "offersAllowed": true
  },
  {
    "id": "art-010",
    "title": "Vibrant Chaos",
    "creator": "Meera Pillai",
    "category": "Art",
    "subcategory": "Paintings",
    "price": 3100,
    "buyingMethod": "Buy Now",
    "image": "/images/d400a85bd9cd68c5a2d8cda063dac7e0.jpg",
    "description": "Vibrant Chaos\\nOriginal Paintings piece on high-quality material. Dimensions: 24x36 inches. Excellent condition.\\nShips from Delhi, India.\\nRecommended for gallery display or living room focal points.",
    "verified": false,
    "offersAllowed": false
  },
  {
    "id": "art-011",
    "title": "Vintage Retro Poster",
    "creator": "Karan Sethi",
    "category": "Art",
    "subcategory": "Paintings",
    "price": 2500,
    "buyingMethod": "Buy Now",
    "image": "/images/ed2af0776b49fdea863a1ead90dadf19.jpg",
    "description": "Vintage Retro Poster\\nOriginal Paintings piece on high-quality material. Dimensions: 24x36 inches. Excellent condition.\\nShips from Delhi, India.\\nRecommended for gallery display or living room focal points.",
    "verified": false,
    "offersAllowed": true
  },
  {
    "id": "art-012",
    "title": "Charcoal Portrait Sketch",
    "creator": "Vikram Rao",
    "category": "Art",
    "subcategory": "Sketches & Drawings",
    "price": 1800,
    "buyingMethod": "Auction",
    "image": "/images/4cf20961ee9c8dccc7dfb51c2f561af8.jpg",
    "description": "Charcoal Portrait Sketch\\nOriginal Sketches & Drawings piece on high-quality material. Dimensions: 24x36 inches. Excellent condition.\\nShips from Delhi, India.\\nRecommended for gallery display or living room focal points.",
    "verified": true,
    "offersAllowed": false,
    "bidCount": 8,
    "currentBid": 2100
  },
  {
    "id": "art-013",
    "title": "Architectural Wonders",
    "creator": "Divya Sharma",
    "category": "Art",
    "subcategory": "Sketches & Drawings",
    "price": 1200,
    "buyingMethod": "Buy Now",
    "image": "/images/1201e7eabf4c8dd5170b0a2b6203dc42.jpg",
    "description": "Architectural Wonders\\nOriginal Sketches & Drawings piece on high-quality material. Dimensions: 24x36 inches. Excellent condition.\\nShips from Delhi, India.\\nRecommended for gallery display or living room focal points.",
    "verified": false,
    "offersAllowed": false
  },
  {
    "id": "art-014",
    "title": "Palace Stairway — Charcoal Study",
    "creator": "Suresh Menon",
    "category": "Art",
    "subcategory": "Sketches & Drawings",
    "price": 2900,
    "buyingMethod": "Negotiable",
    "image": "/images/2594d9c77a1e73aefd4e50631968e2e0.webp",
    "description": "Charcoal drawing of a palace interior with a grand staircase. The dramatic lighting and deep shadows give it an imposing, historical feel. A masterful architectural study for classic spaces.",
    "verified": false,
    "offersAllowed": true
  },
  {
    "id": "art-015",
    "title": "Metro Station",
    "creator": "Arjun Mehta",
    "category": "Art",
    "subcategory": "Digital Art & Illustrations",
    "price": 900,
    "buyingMethod": "Buy Now",
    "image": "/images/44baf8c7320670cef2659e68cb492255.webp",
    "description": "Digital art of a metro/subway station. The piece captures the quiet, contemplative solitude of urban transit in a modern style. An excellent addition to a contemporary collection.",
    "verified": false,
    "offersAllowed": false
  },
  {
    "id": "art-016",
    "title": "Mandala Study",
    "creator": "Tanvi Crafts",
    "category": "Art",
    "subcategory": "Sketches & Drawings",
    "price": 1500,
    "buyingMethod": "Buy Now",
    "image": "/images/e28037264502713adb183f8523837b47.webp",
    "description": "Mandala art drawing. The highly detailed geometric patterns and symmetrical design offer a mesmerizing viewing experience. Perfect for a meditation space or calm corner.",
    "verified": false,
    "offersAllowed": true
  },
  {
    "id": "art-017",
    "title": "Abstract Digital Composition",
    "creator": "Pixels by Pooja",
    "category": "Art",
    "subcategory": "Digital Art & Illustrations",
    "price": 1100,
    "buyingMethod": "Buy Now",
    "image": "/images/e812c5346c69f143d25ef93ee4411d6b.jpg",
    "description": "Abstract digital art piece. The fluid, intersecting shapes and vivid colors create a dynamic sense of perpetual motion. A truly modern aesthetic choice for creative minds.",
    "verified": false,
    "offersAllowed": false
  },
  {
    "id": "art-018",
    "title": "Cyberpunk Cityscape",
    "creator": "Neo Canvas",
    "category": "Art",
    "subcategory": "Digital Art & Illustrations",
    "price": 3800,
    "buyingMethod": "Auction",
    "image": "/images/013d7240408456110f7fbb438010ac91.webp",
    "description": "Cyberpunk Cityscape\\nOriginal Digital Art piece on high-quality material. Dimensions: 24x36 inches. Excellent condition.\\nShips from Delhi, India.\\nRecommended for gallery display or living room focal points.",
    "verified": false,
    "offersAllowed": false,
    "bidCount": 12,
    "currentBid": 4100
  },
  {
    "id": "art-019",
    "title": "Surreal Dreamscape",
    "creator": "Pixels by Pooja",
    "category": "Art",
    "subcategory": "Digital Art & Illustrations",
    "price": 2200,
    "buyingMethod": "Negotiable",
    "image": "/images/fa4a00e8f54ea6c00ca7181fb7c8c100.webp",
    "description": "Surreal Dreamscape\\nOriginal Digital Art piece on high-quality material. Dimensions: 24x36 inches. Excellent condition.\\nShips from Delhi, India.\\nRecommended for gallery display or living room focal points.",
    "verified": false,
    "offersAllowed": true
  },
  {
    "id": "art-020",
    "title": "City Life",
    "creator": "Rohan Illustrations",
    "category": "Art",
    "subcategory": "Digital Art & Illustrations",
    "price": 1400,
    "buyingMethod": "Buy Now",
    "image": "/images/9ecbeaf48b93b6d50ada2184177af724.webp",
    "description": "Digital art depicting city life. A vibrant portrayal of a bustling urban environment filled with diverse activity. Perfect for those who love the energy of the metropolis.",
    "verified": false,
    "offersAllowed": false
  },
  {
    "id": "art-021",
    "title": "Whimsical Character Illustration",
    "creator": "Rohan Illustrations",
    "category": "Art",
    "subcategory": "Digital Art & Illustrations",
    "price": 1600,
    "buyingMethod": "Buy Now",
    "image": "/images/7a7a73ca6a320d1ee0350ed045b0f27f.webp",
    "description": "Whimsical Character Illustration\\nOriginal Illustrations piece on high-quality material. Dimensions: 24x36 inches. Excellent condition.\\nShips from Delhi, India.\\nRecommended for gallery display or living room focal points.",
    "verified": false,
    "offersAllowed": false
  },
  {
    "id": "art-022",
    "title": "Spider-Man — Illustrated",
    "creator": "Nandini Das",
    "category": "Art",
    "subcategory": "Digital Art & Illustrations",
    "price": 2700,
    "buyingMethod": "Negotiable",
    "image": "/images/dcbc212d2f73919bff59c60b9e8a7b30.jpg",
    "description": "Spider-Man illustration. This dynamic artwork showcases the beloved superhero swinging into action with stylized flair. A must-have centerpiece for any comic book fan.",
    "verified": false,
    "offersAllowed": true
  },
  {
    "id": "art-023",
    "title": "Stranger Things — Poster Art",
    "creator": "Vikram Rao",
    "category": "Art",
    "subcategory": "Prints & Posters",
    "price": 3200,
    "buyingMethod": "Auction",
    "image": "/images/bb790b3ed435f058d2b30f6fe364cacd.webp",
    "description": "Stranger Things fan poster. This stylized print captures the eerie, nostalgic 80s atmosphere of the hit sci-fi show. A fantastic conversation piece for fans and collectors.",
    "verified": true,
    "offersAllowed": false,
    "bidCount": 6,
    "currentBid": 3400
  },
  {
    "id": "art-024",
    "title": "Titanic — Iconic Poster",
    "creator": "Design Haven",
    "category": "Art",
    "subcategory": "Prints & Posters",
    "price": 800,
    "buyingMethod": "Buy Now",
    "image": "/images/8c5c985a4ba083010ee62d84f9fb6577.webp",
    "description": "Titanic movie poster. A beautiful and dramatic tribute to the classic romance and tragedy of the iconic film. A must-have piece of cinematic history for your wall.",
    "verified": false,
    "offersAllowed": false
  },
  {
    "id": "art-025",
    "title": "Spider-Man — Movie Poster",
    "creator": "Karan Sethi",
    "category": "Art",
    "subcategory": "Prints & Posters",
    "price": 1250,
    "buyingMethod": "Negotiable",
    "image": "/images/f06bdeca8c31052b74db04b69bd23718.jpg",
    "description": "Spider-Man movie poster. This classic poster celebrates the epic cinematic adventures of the famous web-slinger. Perfect for a home theater room or entertainment space.",
    "verified": false,
    "offersAllowed": true
  },
  {
    "id": "art-026",
    "title": "Friends — Series Poster",
    "creator": "Karan Sethi",
    "category": "Art",
    "subcategory": "Prints & Posters",
    "price": 1500,
    "buyingMethod": "Buy Now",
    "image": "/images/470b571670ccddef91176aaaee01b23c.webp",
    "description": "Friends TV series poster. Celebrate the beloved 90s sitcom with this nostalgic, high-quality print featuring iconic imagery. A great gift for any avid fan of the show.",
    "verified": false,
    "offersAllowed": true
  },
  {
    "id": "art-027",
    "title": "Modern Abstract Sculpture",
    "creator": "Vikram Rao",
    "category": "Art",
    "subcategory": "Sculptures",
    "price": 8500,
    "buyingMethod": "Auction",
    "image": "/images/3ed6521fdb9726a8cb2da3c33d81c89c.jpg",
    "description": "Modern Abstract Sculpture\\nOriginal Sculptures piece on high-quality material. Dimensions: 24x36 inches. Excellent condition.\\nShips from Delhi, India.\\nRecommended for gallery display or living room focal points.",
    "verified": true,
    "offersAllowed": false,
    "bidCount": 15,
    "currentBid": 9800
  },
  {
    "id": "art-028",
    "title": "Terracotta Figurine",
    "creator": "Mitti Studio",
    "category": "Art",
    "subcategory": "Sculptures",
    "price": 2100,
    "buyingMethod": "Buy Now",
    "image": "/images/f3530f2aa55a74cfe8264c46ce6fe39d.jpg",
    "description": "Terracotta Figurine\\nOriginal Sculptures piece on high-quality material. Dimensions: 24x36 inches. Excellent condition.\\nShips from Delhi, India.\\nRecommended for gallery display or living room focal points.",
    "verified": false,
    "offersAllowed": true
  },
  {
  "id": "hc-cs-0",
  "title": "Natural Bathing Gift Set",
  "creator": "Aditi Sharma",
  "creatorRating": 4.8,
  "creatorReviewCount": 152,
  "creatorBadges": [
    "Top Rated Seller",
    "Verified Creator"
  ],
  "verified": true,
  "category": "Handmade & Crafts",
  "subcategory": "Candles & Soaps",
  "price": 1299,
  "buyingMethod": "Buy Now",
  "offersAllowed": true,
  "minimumOfferPercent": 70,
  "image": "/images/7f5e7d2df12a023b6511de3c74c586eb.jpg",
  "images": [
    "/images/7f5e7d2df12a023b6511de3c74c586eb.jpg",
    "/images/7f5e7d2df12a023b6511de3c74c586eb.jpg",
    "/images/7f5e7d2df12a023b6511de3c74c586eb.jpg",
    "/images/7f5e7d2df12a023b6511de3c74c586eb.jpg",
    "/images/7f5e7d2df12a023b6511de3c74c586eb.jpg",
    "/images/7f5e7d2df12a023b6511de3c74c586eb.jpg"
  ],
  "description": "This customised bathing set gift box includes a natural soap and a refreshing body wash. Each product is carefully handcrafted using 100% natural, skin-loving ingredients to nourish and rejuvenate your body. The elegant packaging makes it a perfect, ready-to-gift surprise for your loved ones on any occasion. What makes it truly special is the complete absence of harsh chemicals, ensuring a gentle and soothing bathing experience. For best results, keep the soap in a well-drained dish and use within six months of opening.",
  "specifications": {
    "Type": "Set",
    "Scent/Fragrance": "Lavender & Chamomile",
    "Dimensions": "10x8x4 inches",
    "Weight": "500g",
    "Ingredients/Materials": "Natural oils, Shea Butter, Essential Oils",
    "Ships From": "Mumbai, India"
  }
},
{
  "id": "hc-cs-1",
  "title": "Loofah Soap Bar",
  "creator": "Vikram Singh",
  "creatorRating": 4.5,
  "creatorReviewCount": 89,
  "creatorBadges": [
    "Fast Shipper"
  ],
  "verified": false,
  "category": "Handmade & Crafts",
  "subcategory": "Candles & Soaps",
  "price": 350,
  "buyingMethod": "Buy Now",
  "offersAllowed": false,
  "image": "/images/17f76ad92cbb557f64169f141176e7b1.jpg",
  "images": [
    "/images/17f76ad92cbb557f64169f141176e7b1.jpg",
    "/images/17f76ad92cbb557f64169f141176e7b1.jpg",
    "/images/17f76ad92cbb557f64169f141176e7b1.jpg",
    "/images/17f76ad92cbb557f64169f141176e7b1.jpg",
    "/images/17f76ad92cbb557f64169f141176e7b1.jpg",
    "/images/17f76ad92cbb557f64169f141176e7b1.jpg"
  ],
  "description": "Experience ultimate exfoliation with this unique soap featuring a built-in loofah. It is meticulously handmade to merge the cleansing power of natural soap with the scrubbing benefits of a natural loofah sponge. Ideal for everyday use, it helps buff away dead skin cells, leaving your skin soft and radiant. Its integrated design saves you the hassle of using a separate scrubber while showering. To prolong the life of this exfoliating bar, allow it to dry completely between uses.",
  "specifications": {
    "Type": "Soap",
    "Scent/Fragrance": "Citrus Burst",
    "Dimensions": "3x3x1 inches",
    "Weight": "120g",
    "Ingredients/Materials": "Glycerin, Natural Loofah, Citrus Essential Oil",
    "Ships From": "Delhi, India"
  }
},
{
  "id": "hc-cs-2",
  "title": "Handcrafted Red Pillar Candle",
  "creator": "Meera Nair",
  "creatorRating": 4.9,
  "creatorReviewCount": 230,
  "creatorBadges": [
    "Top Rated Seller",
    "500+ Sales"
  ],
  "verified": true,
  "category": "Handmade & Crafts",
  "subcategory": "Candles & Soaps",
  "price": 899,
  "buyingMethod": "Auction",
  "auctionEndsAt": "2026-07-07T20:30:35.666Z",
  "currentBid": 450,
  "bidCount": 5,
  "image": "/images/7575cad0c34ec572e59b53061ab42d5d.webp",
  "images": [
    "/images/7575cad0c34ec572e59b53061ab42d5d.webp",
    "/images/7575cad0c34ec572e59b53061ab42d5d.webp",
    "/images/7575cad0c34ec572e59b53061ab42d5d.webp",
    "/images/7575cad0c34ec572e59b53061ab42d5d.webp",
    "/images/7575cad0c34ec572e59b53061ab42d5d.webp",
    "/images/7575cad0c34ec572e59b53061ab42d5d.webp"
  ],
  "description": "A rare and intricately detailed red pillar candle that serves as a stunning centerpiece for any room. Hand-poured using premium paraffin and soy wax blends, the candle showcases ornate traditional patterns carved into its surface. It casts a warm, inviting glow, creating an ambient atmosphere perfect for festive celebrations or romantic dinners. The exceptional craftsmanship ensures a long, clean burn with minimal smoke. Keep the wick trimmed to a quarter-inch and burn on a heat-resistant surface for maximum safety.",
  "specifications": {
    "Type": "Candle",
    "Scent/Fragrance": "Sandalwood Rose",
    "Dimensions": "6x3 inches",
    "Weight": "400g",
    "Burn Time": "45 Hours",
    "Ingredients/Materials": "Soy Wax Blend, Cotton Wick",
    "Ships From": "Jaipur, India"
  }
},
{
  "id": "hc-cs-3",
  "title": "Rose Petal Natural Soap Set",
  "creator": "Neha Kapoor",
  "creatorRating": 4.7,
  "creatorReviewCount": 312,
  "creatorBadges": [
    "Trusted Seller"
  ],
  "verified": false,
  "category": "Handmade & Crafts",
  "subcategory": "Candles & Soaps",
  "price": 599,
  "buyingMethod": "Buy Now",
  "offersAllowed": false,
  "image": "/images/a14b6eac56fde3c0ed4be6117ec5b88b.jpg",
  "images": [
    "/images/a14b6eac56fde3c0ed4be6117ec5b88b.jpg",
    "/images/a14b6eac56fde3c0ed4be6117ec5b88b.jpg",
    "/images/a14b6eac56fde3c0ed4be6117ec5b88b.jpg",
    "/images/a14b6eac56fde3c0ed4be6117ec5b88b.jpg",
    "/images/a14b6eac56fde3c0ed4be6117ec5b88b.jpg",
    "/images/a14b6eac56fde3c0ed4be6117ec5b88b.jpg"
  ],
  "description": "Delight your senses with this set of natural rose-flavoured soaps, adorned with real dried rose petals. These artisanal bars are crafted using the cold-process method, ensuring the retention of hydrating natural glycerin. The rich, floral aroma instantly uplifts your mood while the creamy lather gently cleanses and moisturizes the skin. Each soap is uniquely patterned, making it an excellent addition to your guest bathroom or personal spa routine. Store in a cool, dry place to maintain the vibrant scent and texture.",
  "specifications": {
    "Type": "Set",
    "Scent/Fragrance": "Wild Rose",
    "Dimensions": "3x2x1 inches (each)",
    "Weight": "300g (Set)",
    "Ingredients/Materials": "Olive Oil, Rose Essential Oil, Dried Petals",
    "Ships From": "Bangalore, India"
  }
},
{
  "id": "hc-cs-4",
  "title": "Birthday Celebration Candle",
  "creator": "Rohit Verma",
  "creatorRating": 4.4,
  "creatorReviewCount": 45,
  "creatorBadges": [
    "Fast Shipper"
  ],
  "verified": false,
  "category": "Handmade & Crafts",
  "subcategory": "Candles & Soaps",
  "price": 450,
  "buyingMethod": "Buy Now",
  "offersAllowed": true,
  "minimumOfferPercent": 70,
  "image": "/images/a344e75529581e9f43f2c00dc233dea4.webp",
  "images": [
    "/images/a344e75529581e9f43f2c00dc233dea4.webp",
    "/images/a344e75529581e9f43f2c00dc233dea4.webp",
    "/images/a344e75529581e9f43f2c00dc233dea4.webp",
    "/images/a344e75529581e9f43f2c00dc233dea4.webp",
    "/images/a344e75529581e9f43f2c00dc233dea4.webp",
    "/images/a344e75529581e9f43f2c00dc233dea4.webp"
  ],
  "description": "Make birthdays extra special with this beautifully designed birthday celebration candle. Hand-poured with eco-friendly soy wax, it features vibrant embedded sprinkles and a delightful cake-batter fragrance. The candle serves not only as a perfect festive decor piece but also as an aromatic treat for the celebration. The unique design is carefully crafted to mimic the joy and color of a real birthday cake. Always trim the wick before lighting and never leave a burning candle unattended.",
  "specifications": {
    "Type": "Candle",
    "Scent/Fragrance": "Vanilla Cake",
    "Dimensions": "4x3 inches",
    "Weight": "250g",
    "Burn Time": "30 Hours",
    "Ingredients/Materials": "Soy Wax, Fragrance Oils, Wax Sprinkles",
    "Ships From": "Pune, India"
  }
},
{
  "id": "hc-cp-0",
  "title": "Hand-painted Traditional Vase",
  "creator": "Sanjay Patel",
  "creatorRating": 4.9,
  "creatorReviewCount": 178,
  "creatorBadges": [
    "Top Rated Seller",
    "Trusted Seller"
  ],
  "verified": true,
  "category": "Handmade & Crafts",
  "subcategory": "Clay & Pottery",
  "price": 1800,
  "buyingMethod": "Buy Now",
  "offersAllowed": true,
  "minimumOfferPercent": 70,
  "image": "/images/5f2ab26c880e06709387b842cdd1feef.webp",
  "images": [
    "/images/5f2ab26c880e06709387b842cdd1feef.webp",
    "/images/5f2ab26c880e06709387b842cdd1feef.webp",
    "/images/5f2ab26c880e06709387b842cdd1feef.webp",
    "/images/5f2ab26c880e06709387b842cdd1feef.webp",
    "/images/5f2ab26c880e06709387b842cdd1feef.webp",
    "/images/5f2ab26c880e06709387b842cdd1feef.webp"
  ],
  "description": "This beautiful traditional hand-painted vase brings authentic cultural elegance into your modern living space. Skilfully thrown on a potter's wheel, the vase is adorned with intricate folk art motifs using vibrant, natural pigments. The protective glaze ensures longevity while highlighting the rich details of the brushwork. It acts as a stunning standalone decorative piece or a gorgeous holder for dried floral arrangements. To clean, simply wipe gently with a damp cloth; avoid harsh scrubbing to protect the paint.",
  "specifications": {
    "Type": "Vase",
    "Dimensions": "12x6 inches",
    "Weight": "1.2kg",
    "Finish": "Glazed",
    "Food Safe": "No",
    "Care Instructions": "Wipe with damp cloth",
    "Ships From": "Ahmedabad, India"
  }
},
{
  "id": "hc-cp-1",
  "title": "Traditional Garba Pots",
  "creator": "Kiran Desai",
  "creatorRating": 4.8,
  "creatorReviewCount": 420,
  "creatorBadges": [
    "500+ Sales",
    "Fast Shipper"
  ],
  "verified": false,
  "category": "Handmade & Crafts",
  "subcategory": "Clay & Pottery",
  "price": 1500,
  "buyingMethod": "Auction",
  "auctionEndsAt": "2026-07-09T20:30:35.667Z",
  "currentBid": 600,
  "bidCount": 8,
  "image": "/images/3599c4c65b94b61ec21a8d070cd401fe.jpg",
  "images": [
    "/images/3599c4c65b94b61ec21a8d070cd401fe.jpg",
    "/images/3599c4c65b94b61ec21a8d070cd401fe.jpg",
    "/images/3599c4c65b94b61ec21a8d070cd401fe.jpg",
    "/images/3599c4c65b94b61ec21a8d070cd401fe.jpg",
    "/images/3599c4c65b94b61ec21a8d070cd401fe.jpg",
    "/images/3599c4c65b94b61ec21a8d070cd401fe.jpg"
  ],
  "description": "Celebrate festivities with this exquisite set of traditional Garba pots, perfect for cultural decor. Each pot is handmade from locally sourced terracotta clay, featuring characteristic perforations to allow light to shine through when a diya is placed inside. The rustic finish is achieved through traditional open-fire baking, giving each piece a distinct, earthy character. They beautifully represent the rich heritage of Gujarat and make a striking visual during Navratri. Handle with care as terracotta is fragile, and keep away from moisture.",
  "specifications": {
    "Type": "Decorative Pot",
    "Dimensions": "8x8 inches",
    "Weight": "900g",
    "Finish": "Unglazed",
    "Food Safe": "No",
    "Care Instructions": "Keep dry, dust with soft brush",
    "Ships From": "Surat, India"
  }
},
{
  "id": "hc-cp-2",
  "title": "Ceramic Floral Vase",
  "creator": "Priya Menon",
  "creatorRating": 4.6,
  "creatorReviewCount": 95,
  "creatorBadges": [
    "Trusted Seller"
  ],
  "verified": false,
  "category": "Handmade & Crafts",
  "subcategory": "Clay & Pottery",
  "price": 2200,
  "buyingMethod": "Buy Now",
  "offersAllowed": false,
  "image": "/images/04809f445775b05edf65772b67c139d9.jpg",
  "images": [
    "/images/04809f445775b05edf65772b67c139d9.jpg",
    "/images/04809f445775b05edf65772b67c139d9.jpg",
    "/images/04809f445775b05edf65772b67c139d9.jpg",
    "/images/04809f445775b05edf65772b67c139d9.jpg",
    "/images/04809f445775b05edf65772b67c139d9.jpg",
    "/images/04809f445775b05edf65772b67c139d9.jpg"
  ],
  "description": "A unique ceramic vase meticulously sculpted to mimic the delicate folds of blossoming flowers. Crafted from high-quality stoneware clay, it undergoes a high-temperature firing process ensuring durability and water resistance. The elegant, matte pastel finish brings a soft, contemporary feel to any room setup. Its distinctive design makes it a gorgeous statement piece, even when displayed without flowers. It is fully waterproof; you can wash it with mild soap and water when necessary.",
  "specifications": {
    "Type": "Vase",
    "Dimensions": "10x5 inches",
    "Weight": "1.5kg",
    "Finish": "Hand-painted",
    "Food Safe": "Yes",
    "Care Instructions": "Hand wash recommended",
    "Ships From": "Kochi, India"
  }
},
{
  "id": "hc-cp-3",
  "title": "Abstract Clay Figure Sculpture",
  "creator": "Ananya Gupta",
  "creatorRating": 4.9,
  "creatorReviewCount": 65,
  "creatorBadges": [
    "Top Rated Seller"
  ],
  "verified": false,
  "category": "Handmade & Crafts",
  "subcategory": "Clay & Pottery",
  "price": 4500,
  "buyingMethod": "Auction",
  "auctionEndsAt": "2026-07-05T20:30:35.667Z",
  "currentBid": 1200,
  "bidCount": 14,
  "image": "/images/1572725d1d0bf7fa3ab6b92974a3fdfd.jpg",
  "images": [
    "/images/1572725d1d0bf7fa3ab6b92974a3fdfd.jpg",
    "/images/1572725d1d0bf7fa3ab6b92974a3fdfd.jpg",
    "/images/1572725d1d0bf7fa3ab6b92974a3fdfd.jpg",
    "/images/1572725d1d0bf7fa3ab6b92974a3fdfd.jpg",
    "/images/1572725d1d0bf7fa3ab6b92974a3fdfd.jpg",
    "/images/1572725d1d0bf7fa3ab6b92974a3fdfd.jpg"
  ],
  "description": "This half-figured, unique clay sculpture piece is a profound expression of modern abstract art. Hand-built using coarse grogged clay, the texture adds immense depth and raw emotion to the minimalist silhouette. The artist has intentionally left the surface unglazed to highlight the natural, earthy tones of the fired clay. It is an ideal addition to contemporary art collections or as a focal point on a mantlepiece. Dust gently with a dry cloth to maintain the textured surface without damaging the clay.",
  "specifications": {
    "Type": "Sculpture",
    "Dimensions": "14x7 inches",
    "Weight": "2.2kg",
    "Finish": "Unglazed",
    "Food Safe": "No",
    "Care Instructions": "Dust with dry cloth",
    "Ships From": "New Delhi, India"
  }
},
{
  "id": "hc-cp-4",
  "title": "Floral Clay Teapot Set",
  "creator": "Arun Bose",
  "creatorRating": 4.7,
  "creatorReviewCount": 210,
  "creatorBadges": [
    "500+ Sales"
  ],
  "verified": true,
  "category": "Handmade & Crafts",
  "subcategory": "Clay & Pottery",
  "price": 3200,
  "buyingMethod": "Buy Now",
  "offersAllowed": true,
  "minimumOfferPercent": 70,
  "image": "/images/2371958e0daab9fea35be782cfbcb66c.webp",
  "images": [
    "/images/2371958e0daab9fea35be782cfbcb66c.webp",
    "/images/2371958e0daab9fea35be782cfbcb66c.webp",
    "/images/2371958e0daab9fea35be782cfbcb66c.webp",
    "/images/2371958e0daab9fea35be782cfbcb66c.webp",
    "/images/2371958e0daab9fea35be782cfbcb66c.webp",
    "/images/2371958e0daab9fea35be782cfbcb66c.webp"
  ],
  "description": "Enjoy your evening brew with these charming flower-shaped clay teapots, designed to delight guests. The set is carefully molded and hand-painted with intricate botanical details, covered by a high-gloss, food-safe glaze. Each pour is smooth, thanks to the expertly designed spout and perfectly balanced handle. Beyond utility, this set doubles as a beautiful display piece for your kitchen or dining room. To preserve the vibrant painted details, please hand wash only and avoid the microwave.",
  "specifications": {
    "Type": "Teapot Set",
    "Dimensions": "6x8 inches",
    "Weight": "1.8kg",
    "Finish": "Glazed",
    "Food Safe": "Yes",
    "Care Instructions": "Hand wash only, not microwave safe",
    "Ships From": "Kolkata, India"
  }
},
{
  "id": "hc-cp-5",
  "title": "Terracotta Vase Trio",
  "creator": "Deepak Kumar",
  "creatorRating": 4.5,
  "creatorReviewCount": 134,
  "creatorBadges": [
    "Trusted Seller"
  ],
  "verified": false,
  "category": "Handmade & Crafts",
  "subcategory": "Clay & Pottery",
  "price": 1850,
  "buyingMethod": "Buy Now",
  "offersAllowed": false,
  "image": "/images/d497bf30fec759fddc8ce0890f380f18.jpg",
  "images": [
    "/images/d497bf30fec759fddc8ce0890f380f18.jpg",
    "/images/d497bf30fec759fddc8ce0890f380f18.jpg",
    "/images/d497bf30fec759fddc8ce0890f380f18.jpg",
    "/images/d497bf30fec759fddc8ce0890f380f18.jpg",
    "/images/d497bf30fec759fddc8ce0890f380f18.jpg",
    "/images/d497bf30fec759fddc8ce0890f380f18.jpg"
  ],
  "description": "A cohesive pair of 3 terracotta vases, featuring varying heights that create a perfect asymmetrical display. They are handcrafted using traditional throwing techniques, offering a rustic charm that complements boho and minimalist interiors alike. The raw, unglazed exterior proudly showcases the authentic, warm terracotta hue. Ideal for displaying dry stems like pampas grass or eucalyptus branches. Keep them away from direct water contact, as the porous terracotta is designed primarily for dry arrangements.",
  "specifications": {
    "Type": "Vase Set",
    "Dimensions": "Various Heights (6, 8, 10 inches)",
    "Weight": "2.5kg",
    "Finish": "Unglazed",
    "Food Safe": "No",
    "Care Instructions": "Dry wipe, do not fill with water",
    "Ships From": "Lucknow, India"
  }
},
{
  "id": "hc-ck-0",
  "title": "Heart Crochet Keychain Pair",
  "creator": "Sneha Reddy",
  "creatorRating": 4.8,
  "creatorReviewCount": 56,
  "creatorBadges": [
    "Fast Shipper"
  ],
  "verified": false,
  "category": "Handmade & Crafts",
  "subcategory": "Crochet & Knitting",
  "price": 299,
  "buyingMethod": "Buy Now",
  "offersAllowed": false,
  "image": "/images/80a7c1fdd769cc0d35110a438dfb6503.jpg",
  "images": [
    "/images/80a7c1fdd769cc0d35110a438dfb6503.jpg",
    "/images/80a7c1fdd769cc0d35110a438dfb6503.jpg",
    "/images/80a7c1fdd769cc0d35110a438dfb6503.jpg",
    "/images/80a7c1fdd769cc0d35110a438dfb6503.jpg",
    "/images/80a7c1fdd769cc0d35110a438dfb6503.jpg",
    "/images/80a7c1fdd769cc0d35110a438dfb6503.jpg"
  ],
  "description": "A delightful pair of 2 heart-shaped keychains, meticulously crocheted by hand. Made using premium, colorfast cotton yarn, these keychains are soft, durable, and lightweight. They make a perfect matching gift for couples, best friends, or as a sweet personal accessory for your keys and bags. The tight stitching ensures they retain their shape even with daily use. Hand wash gently with mild soap if they get dirty, and air dry flat.",
  "specifications": {
    "Type": "Keychain Pair",
    "Material/Yarn": "100% Cotton Yarn",
    "Dimensions": "2x2 inches each",
    "Weight": "30g",
    "Care Instructions": "Gentle hand wash",
    "Ships From": "Hyderabad, India"
  }
},
{
  "id": "hc-ck-1",
  "title": "Crochet Camera Keychain",
  "creator": "Manish Tiwari",
  "creatorRating": 4.9,
  "creatorReviewCount": 280,
  "creatorBadges": [
    "Top Rated Seller",
    "500+ Sales"
  ],
  "verified": false,
  "category": "Handmade & Crafts",
  "subcategory": "Crochet & Knitting",
  "price": 350,
  "buyingMethod": "Buy Now",
  "offersAllowed": false,
  "image": "/images/4472fc60307774b77a3457158adcd98c.webp",
  "images": [
    "/images/4472fc60307774b77a3457158adcd98c.webp",
    "/images/4472fc60307774b77a3457158adcd98c.webp",
    "/images/4472fc60307774b77a3457158adcd98c.webp",
    "/images/4472fc60307774b77a3457158adcd98c.webp",
    "/images/4472fc60307774b77a3457158adcd98c.webp",
    "/images/4472fc60307774b77a3457158adcd98c.webp"
  ],
  "description": "Capture attention with this adorable, miniature crochet camera keychain. Every tiny detail, from the lens to the shutter button, is carefully stitched using high-quality acrylic yarn for durability and vibrant color. It serves as an incredibly cute accessory for photography enthusiasts to hang on backpacks or camera bags. Despite its tiny size, the craftsmanship makes it a sturdy and long-lasting charm. Keep it away from sharp objects to prevent the yarn from snagging.",
  "specifications": {
    "Type": "Keychain",
    "Material/Yarn": "Acrylic Yarn",
    "Dimensions": "2.5x1.5 inches",
    "Weight": "25g",
    "Care Instructions": "Spot clean only",
    "Ships From": "Chandigarh, India"
  }
},
{
  "id": "hc-ck-2",
  "title": "Crochet Flower Vase",
  "creator": "Kavita Rao",
  "creatorRating": 4.6,
  "creatorReviewCount": 110,
  "creatorBadges": [
    "Trusted Seller"
  ],
  "verified": false,
  "category": "Handmade & Crafts",
  "subcategory": "Crochet & Knitting",
  "price": 1200,
  "buyingMethod": "Auction",
  "auctionEndsAt": "2026-07-06T20:30:35.667Z",
  "currentBid": 550,
  "bidCount": 6,
  "image": "/images/crochet-flowers-blue-pot.jpeg",
  "images": [
    "/images/crochet-flowers-blue-pot.jpeg",
    "/images/crochet-flowers-blue-pot.jpeg",
    "/images/crochet-flowers-blue-pot.jpeg",
    "/images/crochet-flowers-blue-pot.jpeg",
    "/images/crochet-flowers-blue-pot.jpeg",
    "/images/crochet-flowers-blue-pot.jpeg"
  ],
  "description": "Brighten up your desk or living space with this everlasting crochet vase filled with beautifully crafted colorful crochet flowers. The blue pot and the flowers are all handmade, meaning these blooms will never wilt and require zero watering. Structured with flexible wire stems hidden inside the yarn, you can adjust the flowers to your preferred arrangement. It brings a cozy, cottage-core aesthetic to any environment. Gently dust the petals with a soft brush to keep the colors looking fresh.",
  "specifications": {
    "Type": "Decorative Item",
    "Material/Yarn": "Cotton Blend Yarn, Wire",
    "Dimensions": "8x5 inches",
    "Weight": "200g",
    "Care Instructions": "Dust gently, do not wash",
    "Ships From": "Chennai, India"
  }
},
{
  "id": "hc-ck-3",
  "title": "Anniversary Crochet Bouquet",
  "creator": "Sunita Das",
  "creatorRating": 5,
  "creatorReviewCount": 78,
  "creatorBadges": [
    "Top Rated Seller",
    "Fast Shipper"
  ],
  "verified": true,
  "category": "Handmade & Crafts",
  "subcategory": "Crochet & Knitting",
  "price": 2500,
  "buyingMethod": "Buy Now",
  "offersAllowed": true,
  "minimumOfferPercent": 70,
  "image": "/images/d156289ab52040263f59b16d6f3f5f2c.jpg",
  "images": [
    "/images/d156289ab52040263f59b16d6f3f5f2c.jpg",
    "/images/d156289ab52040263f59b16d6f3f5f2c.jpg",
    "/images/d156289ab52040263f59b16d6f3f5f2c.jpg",
    "/images/d156289ab52040263f59b16d6f3f5f2c.jpg",
    "/images/d156289ab52040263f59b16d6f3f5f2c.jpg",
    "/images/d156289ab52040263f59b16d6f3f5f2c.jpg"
  ],
  "description": "Celebrate milestones with this anniversary special crochet flower bouquet that lasts a lifetime. Handcrafted with incredibly detailed stitches, the bouquet features an assortment of roses, daisies, and lavender mimicking real flora. The arrangement is wrapped beautifully, making it an instantly ready, heartfelt gift for your significant other. It stands as a beautiful, sustainable alternative to fresh flowers that will serve as a constant reminder of your special day. Keep out of prolonged direct sunlight to prevent the yarn colors from fading.",
  "specifications": {
    "Type": "Bouquet",
    "Material/Yarn": "Premium Milk Cotton Yarn",
    "Dimensions": "15x10 inches",
    "Weight": "450g",
    "Care Instructions": "Keep away from direct sunlight",
    "Ships From": "Pune, India"
  }
},
{
  "id": "hc-ck-4",
  "title": "Handmade Crochet Jacket",
  "creator": "Riya Sen",
  "creatorRating": 4.8,
  "creatorReviewCount": 190,
  "creatorBadges": [
    "Verified Creator",
    "500+ Sales"
  ],
  "verified": true,
  "category": "Handmade & Crafts",
  "subcategory": "Crochet & Knitting",
  "price": 3800,
  "buyingMethod": "Auction",
  "auctionEndsAt": "2026-07-08T20:30:35.667Z",
  "currentBid": 1800,
  "bidCount": 12,
  "image": "/images/f428f0473bba1ebaf8b0bf015d7d4e7b.jpg",
  "images": [
    "/images/f428f0473bba1ebaf8b0bf015d7d4e7b.jpg",
    "/images/f428f0473bba1ebaf8b0bf015d7d4e7b.jpg",
    "/images/f428f0473bba1ebaf8b0bf015d7d4e7b.jpg",
    "/images/f428f0473bba1ebaf8b0bf015d7d4e7b.jpg",
    "/images/f428f0473bba1ebaf8b0bf015d7d4e7b.jpg",
    "/images/f428f0473bba1ebaf8b0bf015d7d4e7b.jpg"
  ],
  "description": "Make a bold fashion statement with this stunning, wearable art piece — a fully handmade crochet jacket. Constructed from soft, breathable wool blend yarn, it features an intricate granny square pattern that exudes a trendy, vintage vibe. The relaxed fit makes it an ideal layering piece for chilly evenings or stylish outings. Countless hours of careful hand-stitching guarantee warmth and unmatched uniqueness. To maintain its shape, hand wash in cold water and lay it flat to dry.",
  "specifications": {
    "Type": "Apparel",
    "Material/Yarn": "Wool Blend Yarn",
    "Dimensions": "Free Size (Medium to Large)",
    "Weight": "800g",
    "Care Instructions": "Hand wash cold, dry flat",
    "Ships From": "Darjeeling, India"
  }
},
{
  "id": "hc-ck-5",
  "title": "Crochet Sunflower Pot",
  "creator": "Anita Desai",
  "creatorRating": 4.7,
  "creatorReviewCount": 145,
  "creatorBadges": [
    "Trusted Seller"
  ],
  "verified": false,
  "category": "Handmade & Crafts",
  "subcategory": "Crochet & Knitting",
  "price": 850,
  "buyingMethod": "Buy Now",
  "offersAllowed": false,
  "image": "/images/crochet-sunflower-pot.jpeg",
  "images": [
    "/images/crochet-sunflower-pot.jpeg",
    "/images/crochet-sunflower-pot.jpeg",
    "/images/crochet-sunflower-pot.jpeg",
    "/images/crochet-sunflower-pot.jpeg",
    "/images/crochet-sunflower-pot.jpeg",
    "/images/crochet-sunflower-pot.jpeg"
  ],
  "description": "Add a touch of sunshine to your room with this cheerful crochet sunflower pot. Lovingly made using bright yellow and brown cotton yarns, the sunflower stands tall in a neat, crocheted base. It is the perfect maintenance-free desk companion that will bring a smile to your face every day. The internal wire allows you to gently pose the flower head to face any direction. Simply spot clean or use a lint roller to keep it looking pristine and vibrant.",
  "specifications": {
    "Type": "Decorative Item",
    "Material/Yarn": "Cotton Yarn, Wire",
    "Dimensions": "7x4 inches",
    "Weight": "150g",
    "Care Instructions": "Spot clean only",
    "Ships From": "Ahmedabad, India"
  }
},
{
  "id": "hc-pc-0",
  "title": "Handcrafted Paper Bookmark",
  "creator": "Vikas Joshi",
  "creatorRating": 4.4,
  "creatorReviewCount": 34,
  "creatorBadges": [],
  "verified": false,
  "category": "Handmade & Crafts",
  "subcategory": "Paper Crafts",
  "price": 150,
  "buyingMethod": "Buy Now",
  "offersAllowed": false,
  "image": "/images/1bfd66dfc3b8642a56f32f8ed543cc3a.jpg",
  "images": [
    "/images/1bfd66dfc3b8642a56f32f8ed543cc3a.jpg",
    "/images/1bfd66dfc3b8642a56f32f8ed543cc3a.jpg",
    "/images/1bfd66dfc3b8642a56f32f8ed543cc3a.jpg",
    "/images/1bfd66dfc3b8642a56f32f8ed543cc3a.jpg",
    "/images/1bfd66dfc3b8642a56f32f8ed543cc3a.jpg",
    "/images/1bfd66dfc3b8642a56f32f8ed543cc3a.jpg"
  ],
  "description": "A beautifully paper-crafted bookmark that makes reading an even more delightful experience. Designed using high-quality textured cardstock and detailed quilling techniques, it features elegant floral motifs. It is laminated lightly to ensure durability and prevent the edges from fraying with regular use. This makes an excellent, thoughtful gift for the bookworms in your life. Handle gently and avoid bending to keep the 3D quilled details intact.",
  "specifications": {
    "Type": "Bookmark",
    "Dimensions": "6x2 inches",
    "Material/Paper Weight": "300gsm Cardstock",
    "Finish": "Matte Laminated",
    "Ships From": "Indore, India"
  }
},
{
  "id": "hc-pc-1",
  "title": "Paper Craft Flower Pot",
  "creator": "Pooja Singh",
  "creatorRating": 4.8,
  "creatorReviewCount": 220,
  "creatorBadges": [
    "Top Rated Seller",
    "500+ Sales"
  ],
  "verified": true,
  "category": "Handmade & Crafts",
  "subcategory": "Paper Crafts",
  "price": 950,
  "buyingMethod": "Buy Now",
  "offersAllowed": true,
  "minimumOfferPercent": 70,
  "image": "/images/2d45e55d6a95ae07c38891e3887618a2.jpg",
  "images": [
    "/images/2d45e55d6a95ae07c38891e3887618a2.jpg",
    "/images/2d45e55d6a95ae07c38891e3887618a2.jpg",
    "/images/2d45e55d6a95ae07c38891e3887618a2.jpg",
    "/images/2d45e55d6a95ae07c38891e3887618a2.jpg",
    "/images/2d45e55d6a95ae07c38891e3887618a2.jpg",
    "/images/2d45e55d6a95ae07c38891e3887618a2.jpg"
  ],
  "description": "An incredibly intricate paper-crafted flower pot that showcases the magic of origami and paper folding. Each flower and leaf is meticulously cut, folded, and assembled by hand to create a stunning, lifelike 3D arrangement. Made entirely from premium eco-friendly paper, it serves as a gorgeous centerpiece that requires absolutely no maintenance. It brings a pop of color to spaces where real plants might not thrive. Ensure it is kept strictly away from water and direct, harsh sunlight to prevent damage and fading.",
  "specifications": {
    "Type": "Decorative Item",
    "Dimensions": "9x6 inches",
    "Material/Paper Weight": "150gsm Craft Paper",
    "Finish": "Natural Paper",
    "Ships From": "Jaipur, India"
  }
},
{
  "id": "hc-pc-2",
  "title": "Floral Paper Craft Card",
  "creator": "Nitin Sharma",
  "creatorRating": 4.6,
  "creatorReviewCount": 112,
  "creatorBadges": [
    "Trusted Seller"
  ],
  "verified": false,
  "category": "Handmade & Crafts",
  "subcategory": "Paper Crafts",
  "price": 400,
  "buyingMethod": "Buy Now",
  "offersAllowed": false,
  "image": "/images/5d25e6472904da283141b4dc037eda2d.webp",
  "images": [
    "/images/5d25e6472904da283141b4dc037eda2d.webp",
    "/images/5d25e6472904da283141b4dc037eda2d.webp",
    "/images/5d25e6472904da283141b4dc037eda2d.webp",
    "/images/5d25e6472904da283141b4dc037eda2d.webp",
    "/images/5d25e6472904da283141b4dc037eda2d.webp",
    "/images/5d25e6472904da283141b4dc037eda2d.webp"
  ],
  "description": "Send your warmest wishes with this exquisite paper-craft flower designed greeting card. The front of the card features a stunning 3D floral arrangement created using advanced paper quilling techniques. The inside is left blank, providing ample space on premium, smooth cardstock for your personalized handwritten message. It is more than just a card; it is a keepsake piece of art that the recipient will treasure. It comes with a protective custom envelope to ensure the delicate design arrives safely.",
  "specifications": {
    "Type": "Greeting Card",
    "Dimensions": "5x7 inches",
    "Material/Paper Weight": "250gsm Art Card",
    "Finish": "Textured",
    "Ships From": "Noida, India"
  }
},
{
  "id": "hc-ra-0",
  "title": "Resin Pendant Necklace",
  "creator": "Shruti Das",
  "creatorRating": 4.7,
  "creatorReviewCount": 165,
  "creatorBadges": [
    "Top Rated Seller"
  ],
  "verified": false,
  "category": "Handmade & Crafts",
  "subcategory": "Resin Art",
  "price": 750,
  "buyingMethod": "Buy Now",
  "offersAllowed": true,
  "minimumOfferPercent": 70,
  "image": "/images/90340c0fe5f04ef94056bb544a98ad79.jpg",
  "images": [
    "/images/90340c0fe5f04ef94056bb544a98ad79.jpg",
    "/images/90340c0fe5f04ef94056bb544a98ad79.jpg",
    "/images/90340c0fe5f04ef94056bb544a98ad79.jpg",
    "/images/90340c0fe5f04ef94056bb544a98ad79.jpg",
    "/images/90340c0fe5f04ef94056bb544a98ad79.jpg",
    "/images/90340c0fe5f04ef94056bb544a98ad79.jpg"
  ],
  "description": "Carry a piece of nature with you with this beautiful resin necklace enclosing real dried flowers. Hand-poured using crystal clear UV resin, the pendant brilliantly magnifies the delicate floral details within. It is strung on a durable, hypoallergenic metal alloy chain, making it perfect for sensitive skin. This piece effortlessly adds a touch of bohemian elegance to any everyday outfit. Store it in a jewelry box away from direct sunlight to prevent the resin from yellowing over time.",
  "specifications": {
    "Type": "Jewelry",
    "Dimensions": "1.5 inch pendant, 18 inch chain",
    "Weight": "15g",
    "Resin Type": "UV Resin",
    "Finish": "Glossy",
    "Ships From": "Goa, India"
  }
},
{
  "id": "hc-ra-1",
  "title": "Resin Wall Art Hanging",
  "creator": "Karthik Iyer",
  "creatorRating": 4.9,
  "creatorReviewCount": 305,
  "creatorBadges": [
    "Verified Creator",
    "500+ Sales"
  ],
  "verified": true,
  "category": "Handmade & Crafts",
  "subcategory": "Resin Art",
  "price": 4500,
  "buyingMethod": "Auction",
  "auctionEndsAt": "2026-07-10T20:30:35.667Z",
  "currentBid": 2100,
  "bidCount": 18,
  "image": "/images/6825197426036f192e947bf86984bbb3.webp",
  "images": [
    "/images/6825197426036f192e947bf86984bbb3.webp",
    "/images/6825197426036f192e947bf86984bbb3.webp",
    "/images/6825197426036f192e947bf86984bbb3.webp",
    "/images/6825197426036f192e947bf86984bbb3.webp",
    "/images/6825197426036f192e947bf86984bbb3.webp",
    "/images/6825197426036f192e947bf86984bbb3.webp"
  ],
  "description": "Transform your wall space with this mesmerizing abstract resin art piece designed for hanging. The artist has masterfully blended oceanic blue pigments, shimmering gold flakes, and crystal-clear epoxy to create a striking geode effect on a sturdy wooden panel. Multiple layers of resin give the artwork a glass-like finish with incredible depth and dimension. It arrives ready to hang, immediately elevating the aesthetic of a modern living room or office. Clean gently with a microfiber cloth to maintain the high-gloss shine.",
  "specifications": {
    "Type": "Wall Art",
    "Dimensions": "24x18 inches",
    "Weight": "3kg",
    "Resin Type": "Epoxy Resin",
    "Finish": "Glossy",
    "Ships From": "Bangalore, India"
  }
},
{
  "id": "hc-ra-2",
  "title": "Beachy Resin Earrings Set",
  "creator": "Alia Khan",
  "creatorRating": 4.5,
  "creatorReviewCount": 88,
  "creatorBadges": [
    "Fast Shipper"
  ],
  "verified": false,
  "category": "Handmade & Crafts",
  "subcategory": "Resin Art",
  "price": 600,
  "buyingMethod": "Buy Now",
  "offersAllowed": false,
  "image": "/images/ce4c6e8df736e34bd96ca50c3c6cfb11.jpg",
  "images": [
    "/images/ce4c6e8df736e34bd96ca50c3c6cfb11.jpg",
    "/images/ce4c6e8df736e34bd96ca50c3c6cfb11.jpg",
    "/images/ce4c6e8df736e34bd96ca50c3c6cfb11.jpg",
    "/images/ce4c6e8df736e34bd96ca50c3c6cfb11.jpg",
    "/images/ce4c6e8df736e34bd96ca50c3c6cfb11.jpg",
    "/images/ce4c6e8df736e34bd96ca50c3c6cfb11.jpg"
  ],
  "description": "Capture the essence of summer with this beachy resin earrings set, featuring miniature seashells and ocean-colored tints. Each earring is meticulously crafted to resemble a tiny slice of the sea, cast in lightweight epoxy resin. The hooks are made from tarnish-resistant sterling silver, ensuring comfortable wear throughout the day. They make the perfect accessory for beach vacations or a fun, vibrant everyday look. Wipe clean with a soft cloth and avoid exposing them to harsh chemicals like perfumes.",
  "specifications": {
    "Type": "Jewelry",
    "Dimensions": "2 inch drop",
    "Weight": "10g",
    "Resin Type": "Epoxy Resin",
    "Finish": "Glossy",
    "Ships From": "Mumbai, India"
  }
},
{
  "id": "hc-ra-3",
  "title": "Resin Blue Mirror",
  "creator": "Rajeev Menon",
  "creatorRating": 4.8,
  "creatorReviewCount": 140,
  "creatorBadges": [
    "Trusted Seller"
  ],
  "verified": true,
  "category": "Handmade & Crafts",
  "subcategory": "Resin Art",
  "price": 3500,
  "buyingMethod": "Buy Now",
  "offersAllowed": true,
  "minimumOfferPercent": 70,
  "image": "/images/e0e8112d8f5b16d5612a0e69efbae352.jpg",
  "images": [
    "/images/e0e8112d8f5b16d5612a0e69efbae352.jpg",
    "/images/e0e8112d8f5b16d5612a0e69efbae352.jpg",
    "/images/e0e8112d8f5b16d5612a0e69efbae352.jpg",
    "/images/e0e8112d8f5b16d5612a0e69efbae352.jpg",
    "/images/e0e8112d8f5b16d5612a0e69efbae352.jpg",
    "/images/e0e8112d8f5b16d5612a0e69efbae352.jpg"
  ],
  "description": "Enhance your home decor with this exquisitely designed round mirror, decorated with a flowing blue resin border. The artist has used advanced resin pouring techniques to mimic the crashing waves of the ocean around the mirror's edge. The integration of crushed glass and metallic pigments adds a luxurious sparkle that catches the light beautifully. It serves as both a functional mirror and a captivating piece of contemporary art. Use standard glass cleaner for the center, and a soft cloth for the resin border.",
  "specifications": {
    "Type": "Home Decor",
    "Dimensions": "20 inches diameter",
    "Weight": "4kg",
    "Resin Type": "Epoxy Resin",
    "Finish": "Glossy",
    "Ships From": "Kochi, India"
  }
},
{
  "id": "hc-ra-4",
  "title": "Resin Art Bookmarks Set",
  "creator": "Sneha Reddy",
  "creatorRating": 4.6,
  "creatorReviewCount": 92,
  "creatorBadges": [],
  "verified": false,
  "category": "Handmade & Crafts",
  "subcategory": "Resin Art",
  "price": 850,
  "buyingMethod": "Buy Now",
  "offersAllowed": false,
  "image": "/images/f41872e1978e36adfa877aff0029dcad.webp",
  "images": [
    "/images/f41872e1978e36adfa877aff0029dcad.webp",
    "/images/f41872e1978e36adfa877aff0029dcad.webp",
    "/images/f41872e1978e36adfa877aff0029dcad.webp",
    "/images/f41872e1978e36adfa877aff0029dcad.webp",
    "/images/f41872e1978e36adfa877aff0029dcad.webp",
    "/images/f41872e1978e36adfa877aff0029dcad.webp"
  ],
  "description": "Make your reading sessions more magical with this stunning set of resin art bookmarks. Each piece is uniquely cast with swirls of vibrant colors and elegant gold leaf flakes suspended in crystal-clear resin. Finished with a complementing silky tassel, they easily slip between the pages of your favorite book without causing damage. The sturdy resin construction guarantees they will never bend or tear like traditional paper bookmarks. Keep away from extreme heat to ensure the resin maintains its rigid structure.",
  "specifications": {
    "Type": "Bookmark Set",
    "Dimensions": "5.5x1 inches",
    "Weight": "40g",
    "Resin Type": "UV Resin",
    "Finish": "Glossy",
    "Ships From": "Hyderabad, India"
  }
},
  ...lifestyleProducts
];
