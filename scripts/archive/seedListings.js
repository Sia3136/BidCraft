
require('dotenv').config();
const db = require('../src/utils/db');

const products = [] = [
  {
    "id": "exp-003", "occasions": ["birthdays"], "collections": ["vintage-retro"],
    "title": "Resin Art Mirror",
    "creator": "Divya Sharma",
    "category": "Art",
    "subcategory": "Prints & Posters",
    "price": 2199,
    "buyingMethod": "Buy Now",
    "image": "/images/e0e8112d8f5b16d5612a0e69efbae352.jpg",
    "description": "This stunning Resin Art Mirror represents the pinnacle of craftsmanship in the Prints & Posters category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "verified": false,
    "offersAllowed": true,
    "specifications": {
      "Medium": "Mixed Media",
      "Dimensions": "24x36 inches",
      "Weight": "1.5 kg",
      "Framed": "Yes",
      "Ships From": "Mumbai, India"
    },
    "creatorRating": 4.24,
    "creatorReviewCount": 129,
    "creatorBadges": [
      "100+ Sales",
      "500+ Sales",
      "Verified Creator"
    ],
    "images": [
      "/images/e0e8112d8f5b16d5612a0e69efbae352.jpg"
    ],
    "newArrival": true,
    "collections": [
      "Vintage & Retro"
    ],
    "occasions": [
      "Birthdays"
    ]
  },
  {
    "id": "exp-008", "occasions": ["birthdays"], "collections": ["traditional-arts"],
    "title": "Handcrafted Shell Jewellery Stand",
    "creator": "Meera Pillai",
    "category": "Handmade & Crafts",
    "subcategory": "Paper Crafts",
    "price": 799,
    "buyingMethod": "Auction",
    "auctionEndsAt": "2026-07-05T17:52:17.143Z",
    "image": "/images/454b1c36b55a7aac07a46dec81f95a6f.jpg",
    "description": "This stunning Handcrafted Shell Jewellery Stand represents the pinnacle of craftsmanship in the Paper Crafts category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "verified": false,
    "offersAllowed": true,
    "bidCount": 1,
    "currentBid": 1114,
    "specifications": {
      "Material": "Eco-friendly",
      "Dimensions": "10x10x5 cm",
      "Weight": "450 g",
      "Care": "Handle with care",
      "Ships From": "Jaipur, India"
    },
    "creatorRating": 4.24,
    "creatorReviewCount": 126,
    "creatorBadges": [
      "Trusted Seller",
      "Verified Creator"
    ],
    "images": [
      "/images/454b1c36b55a7aac07a46dec81f95a6f.jpg"
    ],
    "newArrival": true,
    "collections": [
      "Modern Minimalist"
    ],
    "occasions": [
      "Anniversaries"
    ]
  },
  {
    "id": "exp-010", "occasions": ["birthdays"],
    "title": "Limited Edition Comic #1",
    "creator": "Rohan Illustrations",
    "category": "Collectibles",
    "subcategory": "Trading Cards",
    "price": 899,
    "buyingMethod": "Buy Now",
    "image": "/images/80891aa6bb34af3854d903c9a40bde21.jpg",
    "description": "This stunning Limited Edition Comic #1 represents the pinnacle of craftsmanship in the Trading Cards category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "verified": false,
    "offersAllowed": true,
    "specifications": {
      "Card Name": "Special Card",
      "Set/Series": "Base Set",
      "Condition": "Near Mint",
      "Holographic": "Yes",
      "Ships From": "Bangalore, India"
    },
    "creatorRating": 4.72,
    "creatorReviewCount": 80,
    "creatorBadges": [
      "Verified Creator",
      "500+ Sales"
    ],
    "images": [
      "/images/80891aa6bb34af3854d903c9a40bde21.jpg"
    ],
    "newArrival": true,
    "collections": [
      "Traditional Arts"
    ],
    "occasions": [
      "Housewarming"
    ]
  },
  {
    "id": "exp-011", "occasions": ["birthdays"], "collections": ["vintage-retro"],
    "title": "Vintage Hand-carved Chess Set",
    "creator": "Arjun Mehta",
    "category": "Collectibles",
    "subcategory": "Action Figures",
    "price": 3200,
    "buyingMethod": "Auction",
    "auctionEndsAt": "2026-07-05T20:03:15.445Z",
    "image": "/images/p452729_2.jpg",
    "description": "This stunning Vintage Hand-carved Chess Set represents the pinnacle of craftsmanship in the Action Figures category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "verified": false,
    "offersAllowed": true,
    "bidCount": 6,
    "currentBid": 3314,
    "specifications": {
      "Character/Series": "Hero",
      "Scale": "1/6",
      "Material": "PVC",
      "Articulation Points": "24",
      "Includes Accessories": "Alternate hands, base",
      "Ships From": "Pune, India"
    },
    "creatorRating": 4.76,
    "creatorReviewCount": 251,
    "creatorBadges": [
      "100+ Sales",
      "Fast Shipper"
    ],
    "images": [
      "/images/p452729_2.jpg"
    ],
    "newArrival": true,
    "collections": [
      "Vintage & Retro"
    ],
    "occasions": [
      "Just Because"
    ]
  },
  {
    "id": "exp-013", "occasions": ["birthdays"],
    "title": "Custom Mechanical Keyboard",
    "creator": "Divya Deshmukh",
    "category": "Gaming & Hobby",
    "subcategory": "Anime Merchandise",
    "price": 4800,
    "buyingMethod": "Negotiable",
    "image": "/images/da73bc9b03ca4657978e673c794395f8.jpg",
    "description": "This stunning Custom Mechanical Keyboard represents the pinnacle of craftsmanship in the Anime Merchandise category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "verified": false,
    "offersAllowed": true,
    "specifications": {
      "Type": "Merchandise",
      "Character/Series": "Various Anime",
      "Material": "Premium Synthetic",
      "Dimensions": "15x10 cm",
      "Weight": "200 g",
      "Limited Edition": "Yes",
      "Ships From": "Mumbai, India"
    },
    "creatorRating": 4.76,
    "creatorReviewCount": 295,
    "creatorBadges": [
      "Verified Creator"
    ],
    "images": [
      "/images/da73bc9b03ca4657978e673c794395f8.jpg"
    ],
    "newArrival": true,
    "collections": [
      "Modern Minimalist"
    ],
    "occasions": [
      "All Occasions"
    ]
  },
  {
    "id": "exp-014", "occasions": ["birthdays"], "collections": ["modern-minimalist"],
    "title": "Customised Birthday Candle",
    "creator": "Arjun Menon",
    "category": "Lifestyle & Gifts",
    "subcategory": "Home Decor",
    "price": 1499,
    "buyingMethod": "Buy Now",
    "image": "/images/a344e75529581e9f43f2c00dc233dea4.webp",
    "description": "This stunning Customised Birthday Candle represents the pinnacle of craftsmanship in the Home Decor category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "verified": false,
    "offersAllowed": true,
    "specifications": {
      "Material": "Premium",
      "Dimensions": "15x15 cm",
      "Weight": "300 g",
      "Ships From": "Delhi, India"
    },
    "creatorRating": 4.88,
    "creatorReviewCount": 200,
    "creatorBadges": [
      "Verified Creator",
      "500+ Sales"
    ],
    "images": [
      "/images/a344e75529581e9f43f2c00dc233dea4.webp"
    ],
    "newArrival": true,
    "collections": [
      "Traditional Arts"
    ],
    "occasions": [
      "Birthdays"
    ]
  },
  {
    "id": "exp-016", "occasions": ["birthdays"], "collections": ["modern-minimalist"],
    "title": "Designer Wall Clock",
    "creator": "Neha Kapoor",
    "category": "Lifestyle & Gifts",
    "subcategory": "Home Decor",
    "price": 2250,
    "buyingMethod": "Buy Now",
    "image": "/images/27c1a7020f1f1ae13757444e6e302582.jpg",
    "description": "This stunning Designer Wall Clock represents the pinnacle of craftsmanship in the Home Decor category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "verified": false,
    "offersAllowed": true,
    "specifications": {
      "Material": "Premium",
      "Dimensions": "15x15 cm",
      "Weight": "300 g",
      "Ships From": "Delhi, India"
    },
    "creatorRating": 4.52,
    "creatorReviewCount": 207,
    "creatorBadges": [
      "Trusted Seller",
      "100+ Sales",
      "Verified Creator"
    ],
    "images": [
      "/images/27c1a7020f1f1ae13757444e6e302582.jpg"
    ],
    "newArrival": true,
    "collections": [
      "Vintage & Retro"
    ],
    "occasions": [
      "Anniversaries"
    ]
  },
  {
    "id": "exp-017", "occasions": ["birthdays"], "collections": ["modern-minimalist"],
    "title": "Crochet Camera Keychain",
    "creator": "The Thoughtful Box",
    "category": "Lifestyle & Gifts",
    "subcategory": "Stationery",
    "price": 999,
    "buyingMethod": "Buy Now",
    "image": "/images/4472fc60307774b77a3457158adcd98c.webp",
    "description": "This stunning Crochet Camera Keychain represents the pinnacle of craftsmanship in the Stationery category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "verified": false,
    "offersAllowed": true,
    "specifications": {
      "Material": "Premium",
      "Dimensions": "15x15 cm",
      "Weight": "300 g",
      "Ships From": "Delhi, India"
    },
    "creatorRating": 4.94,
    "creatorReviewCount": 337,
    "creatorBadges": [
      "500+ Sales"
    ],
    "images": [
      "/images/4472fc60307774b77a3457158adcd98c.webp"
    ],
    "newArrival": true,
    "collections": [
      "Modern Minimalist"
    ],
    "occasions": [
      "Housewarming"
    ]
  },
  {
    "id": "art-001", "occasions": ["birthdays"], "collections": ["vintage-retro"],
    "title": "Lord Ganesha — Intricate Ink Study",
    "creator": "Sneha Agarwal",
    "category": "Art",
    "subcategory": "Sketches & Drawings",
    "price": 6500,
    "buyingMethod": "Auction",
    "auctionEndsAt": "2026-07-05T21:37:43.899Z",
    "image": "/images/5ad309e5bf37d2a19670076e986021fd.webp",
    "description": "This stunning Lord Ganesha — Intricate Ink Study represents the pinnacle of craftsmanship in the Sketches & Drawings category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "verified": true,
    "offersAllowed": false,
    "bidCount": 14,
    "currentBid": 6800,
    "specifications": {
      "Medium": "Mixed Media",
      "Dimensions": "24x36 inches",
      "Weight": "1.5 kg",
      "Framed": "Yes",
      "Ships From": "Mumbai, India"
    },
    "creatorRating": 4.57,
    "creatorReviewCount": 61,
    "creatorBadges": [
      "500+ Sales",
      "Verified Creator",
      "Fast Shipper"
    ],
    "images": [
      "/images/5ad309e5bf37d2a19670076e986021fd.webp"
    ],
    "newArrival": true,
    "collections": [
      "Traditional Arts"
    ],
    "occasions": [
      "Just Because"
    ]
  },
  {
    "id": "art-002", "occasions": ["birthdays"], "collections": ["vintage-retro"],
    "title": "Pink & White Florals",
    "creator": "Sneha Agarwal",
    "category": "Art",
    "subcategory": "Paintings",
    "price": 4200,
    "buyingMethod": "Buy Now",
    "image": "/images/5b0b8ddfd495bbd0f96f457abbf3bbd8.webp",
    "description": "This stunning Pink & White Florals represents the pinnacle of craftsmanship in the Paintings category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "verified": true,
    "offersAllowed": true,
    "specifications": {
      "Medium": "Mixed Media",
      "Dimensions": "24x36 inches",
      "Weight": "1.5 kg",
      "Framed": "Yes",
      "Ships From": "Mumbai, India"
    },
    "creatorRating": 4.17,
    "creatorReviewCount": 415,
    "creatorBadges": [
      "Verified Creator",
      "100+ Sales",
      "Top Rated Seller"
    ],
    "images": [
      "/images/5b0b8ddfd495bbd0f96f457abbf3bbd8.webp"
    ],
    "newArrival": true,
    "collections": [
      "Vintage & Retro"
    ],
    "occasions": [
      "All Occasions"
    ]
  },
  {
    "id": "art-003", "occasions": ["birthdays","anniversaries"], "collections": ["vintage-retro"],
    "title": "The Eye — Abstract Portrait",
    "creator": "Kavita Singh",
    "category": "Art",
    "subcategory": "Paintings",
    "price": 8900,
    "buyingMethod": "Negotiable",
    "image": "/images/31e38d210b5e219cf5831d51863aff83.webp",
    "description": "This stunning The Eye — Abstract Portrait represents the pinnacle of craftsmanship in the Paintings category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "verified": false,
    "offersAllowed": true,
    "specifications": {
      "Medium": "Mixed Media",
      "Dimensions": "24x36 inches",
      "Weight": "1.5 kg",
      "Framed": "Yes",
      "Ships From": "Mumbai, India"
    },
    "creatorRating": 4.59,
    "creatorReviewCount": 126,
    "creatorBadges": [
      "500+ Sales",
      "Fast Shipper"
    ],
    "images": [
      "/images/31e38d210b5e219cf5831d51863aff83.webp"
    ],
    "newArrival": true,
    "collections": [
      "Modern Minimalist"
    ],
    "occasions": [
      "Birthdays"
    ]
  },
  {
    "id": "art-004", "occasions": ["birthdays","anniversaries"], "collections": ["vintage-retro"],
    "title": "Hibiscus in Bloom",
    "creator": "Amit Patel",
    "category": "Art",
    "subcategory": "Paintings",
    "price": 3400,
    "buyingMethod": "Buy Now",
    "image": "/images/864c5ce031b5e77f9a5eb9a8d506f497.jpg",
    "description": "This stunning Hibiscus in Bloom represents the pinnacle of craftsmanship in the Paintings category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "verified": false,
    "offersAllowed": false,
    "specifications": {
      "Medium": "Mixed Media",
      "Dimensions": "24x36 inches",
      "Weight": "1.5 kg",
      "Framed": "Yes",
      "Ships From": "Mumbai, India"
    },
    "creatorRating": 4.18,
    "creatorReviewCount": 112,
    "creatorBadges": [
      "Verified Creator"
    ],
    "images": [
      "/images/864c5ce031b5e77f9a5eb9a8d506f497.jpg"
    ],
    "newArrival": true,
    "collections": [
      "Traditional Arts"
    ],
    "occasions": [
      "Anniversaries"
    ]
  },
  {
    "id": "art-005", "occasions": ["birthdays","anniversaries"], "collections": ["vintage-retro"],
    "title": "Candlelight",
    "creator": "Priya Nair",
    "category": "Art",
    "subcategory": "Paintings",
    "price": 5500,
    "buyingMethod": "Auction",
    "auctionEndsAt": "2026-07-05T23:54:28.345Z",
    "image": "/images/1289afe396aec8a3225851a4f68bf9ed.webp",
    "description": "This stunning Candlelight represents the pinnacle of craftsmanship in the Paintings category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "verified": false,
    "offersAllowed": false,
    "bidCount": 5,
    "currentBid": 5600,
    "specifications": {
      "Medium": "Mixed Media",
      "Dimensions": "24x36 inches",
      "Weight": "1.5 kg",
      "Framed": "Yes",
      "Ships From": "Mumbai, India"
    },
    "creatorRating": 4.71,
    "creatorReviewCount": 33,
    "creatorBadges": [
      "Verified Creator",
      "Trusted Seller"
    ],
    "images": [
      "/images/1289afe396aec8a3225851a4f68bf9ed.webp"
    ],
    "newArrival": true,
    "collections": [
      "Vintage & Retro"
    ],
    "occasions": [
      "Housewarming"
    ]
  },
  {
    "id": "art-006", "occasions": ["birthdays","anniversaries"], "collections": ["vintage-retro"],
    "title": "En Pointe & Fighting Back",
    "creator": "Rohit Verma",
    "category": "Art",
    "subcategory": "Paintings",
    "price": 7200,
    "buyingMethod": "Negotiable",
    "image": "/images/a1c8a4582ca82c3995d88befe1464e8e.webp",
    "description": "This stunning En Pointe & Fighting Back represents the pinnacle of craftsmanship in the Paintings category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "verified": false,
    "offersAllowed": true,
    "specifications": {
      "Medium": "Mixed Media",
      "Dimensions": "24x36 inches",
      "Weight": "1.5 kg",
      "Framed": "Yes",
      "Ships From": "Mumbai, India"
    },
    "creatorRating": 4.87,
    "creatorReviewCount": 97,
    "creatorBadges": [
      "Verified Creator",
      "Trusted Seller",
      "Top Rated Seller"
    ],
    "images": [
      "/images/a1c8a4582ca82c3995d88befe1464e8e.webp"
    ],
    "collections": [
      "Modern Minimalist"
    ],
    "occasions": [
      "Just Because"
    ]
  },
  {
    "id": "art-007", "occasions": ["birthdays","anniversaries"], "collections": ["vintage-retro"],
    "title": "Floral Reverie",
    "creator": "Anjali Gupta",
    "category": "Art",
    "subcategory": "Paintings",
    "price": 4800,
    "buyingMethod": "Buy Now",
    "image": "/images/ae02a7936a96a8d1302dc65047499be9.webp",
    "description": "This stunning Floral Reverie represents the pinnacle of craftsmanship in the Paintings category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "verified": false,
    "offersAllowed": true,
    "specifications": {
      "Medium": "Mixed Media",
      "Dimensions": "24x36 inches",
      "Weight": "1.5 kg",
      "Framed": "Yes",
      "Ships From": "Mumbai, India"
    },
    "creatorRating": 4.11,
    "creatorReviewCount": 163,
    "creatorBadges": [
      "100+ Sales",
      "Verified Creator"
    ],
    "images": [
      "/images/ae02a7936a96a8d1302dc65047499be9.webp"
    ],
    "collections": [
      "Traditional Arts"
    ],
    "occasions": [
      "All Occasions"
    ]
  },
  {
    "id": "art-008", "occasions": ["anniversaries"], "collections": ["vintage-retro"],
    "title": "Noir Cinema",
    "creator": "Priya Nair",
    "category": "Art",
    "subcategory": "Paintings",
    "price": 2800,
    "buyingMethod": "Auction",
    "auctionEndsAt": "2026-07-06T01:24:26.247Z",
    "image": "/images/43d02cac562d82f18e18ed3a0a7266ee.jpg",
    "description": "This stunning Noir Cinema represents the pinnacle of craftsmanship in the Paintings category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "verified": false,
    "offersAllowed": false,
    "bidCount": 7,
    "currentBid": 3200,
    "specifications": {
      "Medium": "Mixed Media",
      "Dimensions": "24x36 inches",
      "Weight": "1.5 kg",
      "Framed": "Yes",
      "Ships From": "Mumbai, India"
    },
    "creatorRating": 4.79,
    "creatorReviewCount": 319,
    "creatorBadges": [
      "Trusted Seller",
      "Top Rated Seller",
      "Fast Shipper"
    ],
    "images": [
      "/images/43d02cac562d82f18e18ed3a0a7266ee.jpg"
    ],
    "collections": [
      "Vintage & Retro"
    ],
    "occasions": [
      "Birthdays"
    ]
  },
  {
    "id": "art-009", "occasions": ["anniversaries"],
    "title": "The Tiger",
    "creator": "Sunil Joshi",
    "category": "Art",
    "subcategory": "Paintings",
    "price": 9500,
    "buyingMethod": "Negotiable",
    "image": "/images/968355308d40d83a2e1f59daa61c5089.jpg",
    "description": "This stunning The Tiger represents the pinnacle of craftsmanship in the Paintings category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "verified": false,
    "offersAllowed": true,
    "specifications": {
      "Medium": "Mixed Media",
      "Dimensions": "24x36 inches",
      "Weight": "1.5 kg",
      "Framed": "Yes",
      "Ships From": "Mumbai, India"
    },
    "creatorRating": 4.79,
    "creatorReviewCount": 343,
    "creatorBadges": [
      "Fast Shipper",
      "500+ Sales",
      "100+ Sales"
    ],
    "images": [
      "/images/968355308d40d83a2e1f59daa61c5089.jpg"
    ],
    "collections": [
      "Modern Minimalist"
    ],
    "occasions": [
      "Anniversaries"
    ]
  },
  {
    "id": "art-010", "occasions": ["anniversaries"],
    "title": "Vibrant Chaos",
    "creator": "Meera Pillai",
    "category": "Art",
    "subcategory": "Paintings",
    "price": 3100,
    "buyingMethod": "Buy Now",
    "image": "/images/d400a85bd9cd68c5a2d8cda063dac7e0.jpg",
    "description": "This stunning Vibrant Chaos represents the pinnacle of craftsmanship in the Paintings category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "verified": false,
    "offersAllowed": false,
    "specifications": {
      "Medium": "Mixed Media",
      "Dimensions": "24x36 inches",
      "Weight": "1.5 kg",
      "Framed": "Yes",
      "Ships From": "Mumbai, India"
    },
    "creatorRating": 4.8,
    "creatorReviewCount": 146,
    "creatorBadges": [
      "500+ Sales",
      "Fast Shipper",
      "Top Rated Seller"
    ],
    "images": [
      "/images/d400a85bd9cd68c5a2d8cda063dac7e0.jpg"
    ],
    "collections": [
      "Traditional Arts"
    ],
    "occasions": [
      "Housewarming"
    ]
  },
  {
    "id": "art-011", "occasions": ["anniversaries"],
    "title": "Vintage Retro Poster",
    "creator": "Karan Sethi",
    "category": "Art",
    "subcategory": "Paintings",
    "price": 2500,
    "buyingMethod": "Buy Now",
    "image": "/images/ed2af0776b49fdea863a1ead90dadf19.jpg",
    "description": "This stunning Vintage Retro Poster represents the pinnacle of craftsmanship in the Paintings category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "verified": false,
    "offersAllowed": true,
    "specifications": {
      "Medium": "Mixed Media",
      "Dimensions": "24x36 inches",
      "Weight": "1.5 kg",
      "Framed": "Yes",
      "Ships From": "Mumbai, India"
    },
    "creatorRating": 4.17,
    "creatorReviewCount": 360,
    "creatorBadges": [
      "Fast Shipper",
      "Trusted Seller"
    ],
    "images": [
      "/images/ed2af0776b49fdea863a1ead90dadf19.jpg"
    ],
    "collections": [
      "Vintage & Retro"
    ],
    "occasions": [
      "Just Because"
    ]
  },
  {
    "id": "art-012", "occasions": ["anniversaries"],
    "title": "Charcoal Portrait Sketch",
    "creator": "Vikram Rao",
    "category": "Art",
    "subcategory": "Sketches & Drawings",
    "price": 1800,
    "buyingMethod": "Auction",
    "auctionEndsAt": "2026-07-06T03:16:37.057Z",
    "image": "/images/4cf20961ee9c8dccc7dfb51c2f561af8.jpg",
    "description": "This stunning Charcoal Portrait Sketch represents the pinnacle of craftsmanship in the Sketches & Drawings category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "verified": true,
    "offersAllowed": false,
    "bidCount": 8,
    "currentBid": 2100,
    "specifications": {
      "Medium": "Mixed Media",
      "Dimensions": "24x36 inches",
      "Weight": "1.5 kg",
      "Framed": "Yes",
      "Ships From": "Mumbai, India"
    },
    "creatorRating": 4.25,
    "creatorReviewCount": 406,
    "creatorBadges": [
      "100+ Sales",
      "Trusted Seller"
    ],
    "images": [
      "/images/4cf20961ee9c8dccc7dfb51c2f561af8.jpg"
    ],
    "collections": [
      "Modern Minimalist"
    ],
    "occasions": [
      "All Occasions"
    ]
  },
  {
    "id": "art-013", "occasions": ["anniversaries","housewarming"],
    "title": "Architectural Wonders",
    "creator": "Divya Sharma",
    "category": "Art",
    "subcategory": "Sketches & Drawings",
    "price": 1200,
    "buyingMethod": "Buy Now",
    "image": "/images/1201e7eabf4c8dd5170b0a2b6203dc42.jpg",
    "description": "This stunning Architectural Wonders represents the pinnacle of craftsmanship in the Sketches & Drawings category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "verified": false,
    "offersAllowed": false,
    "specifications": {
      "Medium": "Mixed Media",
      "Dimensions": "24x36 inches",
      "Weight": "1.5 kg",
      "Framed": "Yes",
      "Ships From": "Mumbai, India"
    },
    "creatorRating": 4.75,
    "creatorReviewCount": 241,
    "creatorBadges": [
      "100+ Sales"
    ],
    "images": [
      "/images/1201e7eabf4c8dd5170b0a2b6203dc42.jpg"
    ],
    "collections": [
      "Traditional Arts"
    ],
    "occasions": [
      "Birthdays"
    ]
  },
  {
    "id": "art-014", "occasions": ["anniversaries","housewarming"],
    "title": "Palace Stairway — Charcoal Study",
    "creator": "Suresh Menon",
    "category": "Art",
    "subcategory": "Sketches & Drawings",
    "price": 2900,
    "buyingMethod": "Negotiable",
    "image": "/images/2594d9c77a1e73aefd4e50631968e2e0.webp",
    "description": "This stunning Palace Stairway — Charcoal Study represents the pinnacle of craftsmanship in the Sketches & Drawings category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "verified": false,
    "offersAllowed": true,
    "specifications": {
      "Medium": "Mixed Media",
      "Dimensions": "24x36 inches",
      "Weight": "1.5 kg",
      "Framed": "Yes",
      "Ships From": "Mumbai, India"
    },
    "creatorRating": 4.3,
    "creatorReviewCount": 20,
    "creatorBadges": [
      "500+ Sales",
      "Top Rated Seller"
    ],
    "images": [
      "/images/2594d9c77a1e73aefd4e50631968e2e0.webp"
    ],
    "collections": [
      "Vintage & Retro"
    ],
    "occasions": [
      "Anniversaries"
    ]
  },
  {
    "id": "art-015", "occasions": ["anniversaries","housewarming"],
    "title": "Metro Station",
    "creator": "Arjun Mehta",
    "category": "Art",
    "subcategory": "Digital Art & Illustrations",
    "price": 900,
    "buyingMethod": "Buy Now",
    "image": "/images/44baf8c7320670cef2659e68cb492255.webp",
    "description": "This stunning Metro Station represents the pinnacle of craftsmanship in the Digital Art & Illustrations category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "verified": false,
    "offersAllowed": false,
    "specifications": {
      "Material": "Premium",
      "Dimensions": "15x15 cm",
      "Weight": "300 g",
      "Ships From": "Delhi, India"
    },
    "creatorRating": 4.47,
    "creatorReviewCount": 166,
    "creatorBadges": [
      "Trusted Seller",
      "Verified Creator",
      "Fast Shipper"
    ],
    "images": [
      "/images/44baf8c7320670cef2659e68cb492255.webp"
    ],
    "collections": [
      "Modern Minimalist"
    ],
    "occasions": [
      "Housewarming"
    ]
  },
  {
    "id": "art-016", "occasions": ["anniversaries","housewarming"],
    "title": "Mandala Study",
    "creator": "Rajesh Kumar",
    "category": "Art",
    "subcategory": "Sketches & Drawings",
    "price": 1500,
    "buyingMethod": "Buy Now",
    "image": "/images/e28037264502713adb183f8523837b47.webp",
    "description": "This stunning Mandala Study represents the pinnacle of craftsmanship in the Sketches & Drawings category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "verified": false,
    "offersAllowed": true,
    "specifications": {
      "Medium": "Mixed Media",
      "Dimensions": "24x36 inches",
      "Weight": "1.5 kg",
      "Framed": "Yes",
      "Ships From": "Mumbai, India"
    },
    "creatorRating": 4.99,
    "creatorReviewCount": 239,
    "creatorBadges": [
      "Trusted Seller",
      "Verified Creator"
    ],
    "images": [
      "/images/e28037264502713adb183f8523837b47.webp"
    ],
    "collections": [
      "Traditional Arts"
    ],
    "occasions": [
      "Just Because"
    ]
  },
  {
    "id": "art-017", "occasions": ["anniversaries","housewarming"],
    "title": "Abstract Digital Composition",
    "creator": "Pixels by Pooja",
    "category": "Art",
    "subcategory": "Digital Art & Illustrations",
    "price": 1100,
    "buyingMethod": "Buy Now",
    "image": "/images/e812c5346c69f143d25ef93ee4411d6b.jpg",
    "description": "This stunning Abstract Digital Composition represents the pinnacle of craftsmanship in the Digital Art & Illustrations category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "verified": false,
    "offersAllowed": false,
    "specifications": {
      "Material": "Premium",
      "Dimensions": "15x15 cm",
      "Weight": "300 g",
      "Ships From": "Delhi, India"
    },
    "creatorRating": 4.97,
    "creatorReviewCount": 202,
    "creatorBadges": [
      "Top Rated Seller"
    ],
    "images": [
      "/images/e812c5346c69f143d25ef93ee4411d6b.jpg"
    ],
    "collections": [
      "Vintage & Retro"
    ],
    "occasions": [
      "All Occasions"
    ]
  },
  {
    "id": "art-018", "occasions": ["housewarming"],
    "title": "Cyberpunk Cityscape",
    "creator": "Neo Canvas",
    "category": "Art",
    "subcategory": "Digital Art & Illustrations",
    "price": 3800,
    "buyingMethod": "Auction",
    "auctionEndsAt": "2026-07-06T05:27:50.070Z",
    "image": "/images/013d7240408456110f7fbb438010ac91.webp",
    "description": "This stunning Cyberpunk Cityscape represents the pinnacle of craftsmanship in the Digital Art & Illustrations category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "verified": false,
    "offersAllowed": false,
    "bidCount": 12,
    "currentBid": 4100,
    "specifications": {
      "Material": "Premium",
      "Dimensions": "15x15 cm",
      "Weight": "300 g",
      "Ships From": "Delhi, India"
    },
    "creatorRating": 4.66,
    "creatorReviewCount": 63,
    "creatorBadges": [
      "Trusted Seller",
      "Top Rated Seller"
    ],
    "images": [
      "/images/013d7240408456110f7fbb438010ac91.webp"
    ],
    "collections": [
      "Modern Minimalist"
    ],
    "occasions": [
      "Birthdays"
    ]
  },
  {
    "id": "art-019", "occasions": ["housewarming"],
    "title": "Surreal Dreamscape",
    "creator": "Pixels by Pooja",
    "category": "Art",
    "subcategory": "Digital Art & Illustrations",
    "price": 2200,
    "buyingMethod": "Negotiable",
    "image": "/images/fa4a00e8f54ea6c00ca7181fb7c8c100.webp",
    "description": "This stunning Surreal Dreamscape represents the pinnacle of craftsmanship in the Digital Art & Illustrations category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "verified": false,
    "offersAllowed": true,
    "specifications": {
      "Material": "Premium",
      "Dimensions": "15x15 cm",
      "Weight": "300 g",
      "Ships From": "Delhi, India"
    },
    "creatorRating": 4.21,
    "creatorReviewCount": 302,
    "creatorBadges": [
      "Trusted Seller",
      "Fast Shipper"
    ],
    "images": [
      "/images/fa4a00e8f54ea6c00ca7181fb7c8c100.webp"
    ],
    "collections": [
      "Traditional Arts"
    ],
    "occasions": [
      "Anniversaries"
    ]
  },
  {
    "id": "art-020", "occasions": ["housewarming"],
    "title": "City Life",
    "creator": "Rohan Illustrations",
    "category": "Art",
    "subcategory": "Digital Art & Illustrations",
    "price": 1400,
    "buyingMethod": "Buy Now",
    "image": "/images/9ecbeaf48b93b6d50ada2184177af724.webp",
    "description": "This stunning City Life represents the pinnacle of craftsmanship in the Digital Art & Illustrations category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "verified": false,
    "offersAllowed": false,
    "specifications": {
      "Material": "Premium",
      "Dimensions": "15x15 cm",
      "Weight": "300 g",
      "Ships From": "Delhi, India"
    },
    "creatorRating": 4.13,
    "creatorReviewCount": 282,
    "creatorBadges": [
      "Trusted Seller"
    ],
    "images": [
      "/images/9ecbeaf48b93b6d50ada2184177af724.webp"
    ],
    "collections": [
      "Vintage & Retro"
    ],
    "occasions": [
      "Housewarming"
    ]
  },
  {
    "id": "art-021", "occasions": ["housewarming"],
    "title": "Whimsical Character Illustration",
    "creator": "Rohan Illustrations",
    "category": "Art",
    "subcategory": "Digital Art & Illustrations",
    "price": 1600,
    "buyingMethod": "Buy Now",
    "image": "/images/7a7a73ca6a320d1ee0350ed045b0f27f.webp",
    "description": "This stunning Whimsical Character Illustration represents the pinnacle of craftsmanship in the Digital Art & Illustrations category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "verified": false,
    "offersAllowed": false,
    "specifications": {
      "Material": "Premium",
      "Dimensions": "15x15 cm",
      "Weight": "300 g",
      "Ships From": "Delhi, India"
    },
    "creatorRating": 4.19,
    "creatorReviewCount": 158,
    "creatorBadges": [
      "Trusted Seller"
    ],
    "images": [
      "/images/7a7a73ca6a320d1ee0350ed045b0f27f.webp"
    ],
    "collections": [
      "Modern Minimalist"
    ],
    "occasions": [
      "Just Because"
    ]
  },
  {
    "id": "art-022", "occasions": ["housewarming"],
    "title": "Spider-Man — Illustrated",
    "creator": "Nandini Das",
    "category": "Art",
    "subcategory": "Digital Art & Illustrations",
    "price": 2700,
    "buyingMethod": "Negotiable",
    "image": "/images/dcbc212d2f73919bff59c60b9e8a7b30.jpg",
    "description": "This stunning Spider-Man — Illustrated represents the pinnacle of craftsmanship in the Digital Art & Illustrations category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "verified": false,
    "offersAllowed": true,
    "specifications": {
      "Material": "Premium",
      "Dimensions": "15x15 cm",
      "Weight": "300 g",
      "Ships From": "Delhi, India"
    },
    "creatorRating": 4.5,
    "creatorReviewCount": 409,
    "creatorBadges": [
      "Fast Shipper"
    ],
    "images": [
      "/images/dcbc212d2f73919bff59c60b9e8a7b30.jpg"
    ],
    "collections": [
      "Traditional Arts"
    ],
    "occasions": [
      "All Occasions"
    ]
  },
  {
    "id": "art-023", "occasions": ["housewarming","just-because"],
    "title": "Stranger Things — Poster Art",
    "creator": "Vikram Rao",
    "category": "Art",
    "subcategory": "Prints & Posters",
    "price": 3200,
    "buyingMethod": "Auction",
    "auctionEndsAt": "2026-07-06T07:27:57.154Z",
    "image": "/images/bb790b3ed435f058d2b30f6fe364cacd.webp",
    "description": "This stunning Stranger Things — Poster Art represents the pinnacle of craftsmanship in the Prints & Posters category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "verified": true,
    "offersAllowed": false,
    "bidCount": 6,
    "currentBid": 3400,
    "specifications": {
      "Medium": "Mixed Media",
      "Dimensions": "24x36 inches",
      "Weight": "1.5 kg",
      "Framed": "Yes",
      "Ships From": "Mumbai, India"
    },
    "creatorRating": 4.21,
    "creatorReviewCount": 76,
    "creatorBadges": [
      "100+ Sales",
      "500+ Sales"
    ],
    "images": [
      "/images/bb790b3ed435f058d2b30f6fe364cacd.webp"
    ],
    "collections": [
      "Vintage & Retro"
    ],
    "occasions": [
      "Birthdays"
    ]
  },
  {
    "id": "art-024", "occasions": ["housewarming","just-because"],
    "title": "Titanic — Iconic Poster",
    "creator": "Pooja Joshi",
    "category": "Art",
    "subcategory": "Prints & Posters",
    "price": 800,
    "buyingMethod": "Buy Now",
    "image": "/images/8c5c985a4ba083010ee62d84f9fb6577.webp",
    "description": "This stunning Titanic — Iconic Poster represents the pinnacle of craftsmanship in the Prints & Posters category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "verified": false,
    "offersAllowed": false,
    "specifications": {
      "Medium": "Mixed Media",
      "Dimensions": "24x36 inches",
      "Weight": "1.5 kg",
      "Framed": "Yes",
      "Ships From": "Mumbai, India"
    },
    "creatorRating": 4.69,
    "creatorReviewCount": 84,
    "creatorBadges": [
      "Verified Creator"
    ],
    "images": [
      "/images/8c5c985a4ba083010ee62d84f9fb6577.webp"
    ],
    "collections": [
      "Modern Minimalist"
    ],
    "occasions": [
      "Anniversaries"
    ]
  },
  {
    "id": "art-025", "occasions": ["housewarming","just-because"],
    "title": "Spider-Man — Movie Poster",
    "creator": "Karan Sethi",
    "category": "Art",
    "subcategory": "Prints & Posters",
    "price": 1250,
    "buyingMethod": "Negotiable",
    "image": "/images/f06bdeca8c31052b74db04b69bd23718.jpg",
    "description": "This stunning Spider-Man — Movie Poster represents the pinnacle of craftsmanship in the Prints & Posters category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "verified": false,
    "offersAllowed": true,
    "specifications": {
      "Medium": "Mixed Media",
      "Dimensions": "24x36 inches",
      "Weight": "1.5 kg",
      "Framed": "Yes",
      "Ships From": "Mumbai, India"
    },
    "creatorRating": 4.29,
    "creatorReviewCount": 250,
    "creatorBadges": [
      "100+ Sales"
    ],
    "images": [
      "/images/f06bdeca8c31052b74db04b69bd23718.jpg"
    ],
    "collections": [
      "Traditional Arts"
    ],
    "occasions": [
      "Housewarming"
    ]
  },
  {
    "id": "art-026", "occasions": ["housewarming","just-because"],
    "title": "Friends — Series Poster",
    "creator": "Karan Sethi",
    "category": "Art",
    "subcategory": "Prints & Posters",
    "price": 1500,
    "buyingMethod": "Buy Now",
    "image": "/images/470b571670ccddef91176aaaee01b23c.webp",
    "description": "This stunning Friends — Series Poster represents the pinnacle of craftsmanship in the Prints & Posters category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "verified": false,
    "offersAllowed": true,
    "specifications": {
      "Medium": "Mixed Media",
      "Dimensions": "24x36 inches",
      "Weight": "1.5 kg",
      "Framed": "Yes",
      "Ships From": "Mumbai, India"
    },
    "creatorRating": 4.15,
    "creatorReviewCount": 139,
    "creatorBadges": [
      "100+ Sales"
    ],
    "images": [
      "/images/470b571670ccddef91176aaaee01b23c.webp"
    ],
    "collections": [
      "Vintage & Retro"
    ],
    "occasions": [
      "Just Because"
    ]
  },
  {
    "id": "art-027", "occasions": ["housewarming","just-because"], "collections": ["modern-minimalist"],
    "title": "Modern Abstract Sculpture",
    "creator": "Vikram Rao",
    "category": "Art",
    "subcategory": "Sculptures",
    "price": 8500,
    "buyingMethod": "Auction",
    "auctionEndsAt": "2026-07-06T09:13:55.375Z",
    "image": "/images/3ed6521fdb9726a8cb2da3c33d81c89c.jpg",
    "description": "This stunning Modern Abstract Sculpture represents the pinnacle of craftsmanship in the Sculptures category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "verified": true,
    "offersAllowed": false,
    "bidCount": 15,
    "currentBid": 9800,
    "specifications": {
      "Medium": "Mixed Media",
      "Dimensions": "24x36 inches",
      "Weight": "1.5 kg",
      "Framed": "Yes",
      "Ships From": "Mumbai, India"
    },
    "creatorRating": 4.77,
    "creatorReviewCount": 132,
    "creatorBadges": [
      "Top Rated Seller",
      "Trusted Seller",
      "Verified Creator"
    ],
    "images": [
      "/images/3ed6521fdb9726a8cb2da3c33d81c89c.jpg"
    ],
    "collections": [
      "Modern Minimalist"
    ],
    "occasions": [
      "All Occasions"
    ]
  },
  {
    "id": "art-028", "occasions": ["just-because"],
    "title": "Terracotta Figurine",
    "creator": "Aakash Verma",
    "category": "Art",
    "subcategory": "Sculptures",
    "price": 2100,
    "buyingMethod": "Buy Now",
    "image": "/images/f3530f2aa55a74cfe8264c46ce6fe39d.jpg",
    "description": "This stunning Terracotta Figurine represents the pinnacle of craftsmanship in the Sculptures category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "verified": false,
    "offersAllowed": true,
    "specifications": {
      "Medium": "Mixed Media",
      "Dimensions": "24x36 inches",
      "Weight": "1.5 kg",
      "Framed": "Yes",
      "Ships From": "Mumbai, India"
    },
    "creatorRating": 4.49,
    "creatorReviewCount": 32,
    "creatorBadges": [
      "500+ Sales"
    ],
    "images": [
      "/images/f3530f2aa55a74cfe8264c46ce6fe39d.jpg"
    ],
    "collections": [
      "Traditional Arts"
    ],
    "occasions": [
      "Birthdays"
    ]
  },
  {
    "id": "hc-cs-0", "occasions": ["just-because"], "collections": ["traditional-arts"],
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
      "/images/7f5e7d2df12a023b6511de3c74c586eb.jpg"
    ],
    "description": "This stunning Natural Bathing Gift Set represents the pinnacle of craftsmanship in the Candles & Soaps category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "specifications": {
      "Type": "Set",
      "Scent/Fragrance": "Lavender & Chamomile",
      "Dimensions": "10x8x4 inches",
      "Weight": "500g",
      "Ingredients/Materials": "Natural oils, Shea Butter, Essential Oils",
      "Ships From": "Mumbai, India"
    },
    "newArrival": true,
    "collections": [
      "Vintage & Retro"
    ],
    "occasions": [
      "Anniversaries"
    ]
  },
  {
    "id": "hc-cs-1", "occasions": ["just-because"], "collections": ["traditional-arts"],
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
      "/images/17f76ad92cbb557f64169f141176e7b1.jpg"
    ],
    "description": "This stunning Loofah Soap Bar represents the pinnacle of craftsmanship in the Candles & Soaps category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "specifications": {
      "Type": "Soap",
      "Scent/Fragrance": "Citrus Burst",
      "Dimensions": "3x3x1 inches",
      "Weight": "120g",
      "Ingredients/Materials": "Glycerin, Natural Loofah, Citrus Essential Oil",
      "Ships From": "Delhi, India"
    },
    "collections": [
      "Modern Minimalist"
    ],
    "occasions": [
      "Housewarming"
    ]
  },
  {
    "id": "hc-cs-2", "occasions": ["just-because"], "collections": ["traditional-arts"],
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
    "auctionEndsAt": "2026-07-06T11:13:16.555Z",
    "currentBid": 450,
    "bidCount": 5,
    "image": "/images/7575cad0c34ec572e59b53061ab42d5d.webp",
    "images": [
      "/images/7575cad0c34ec572e59b53061ab42d5d.webp"
    ],
    "description": "This stunning Handcrafted Red Pillar Candle represents the pinnacle of craftsmanship in the Candles & Soaps category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "specifications": {
      "Type": "Candle",
      "Scent/Fragrance": "Sandalwood Rose",
      "Dimensions": "6x3 inches",
      "Weight": "400g",
      "Burn Time": "45 Hours",
      "Ingredients/Materials": "Soy Wax Blend, Cotton Wick",
      "Ships From": "Jaipur, India"
    },
    "collections": [
      "Traditional Arts"
    ],
    "occasions": [
      "Just Because"
    ]
  },
  {
    "id": "hc-cs-3", "occasions": ["just-because"], "collections": ["traditional-arts"],
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
      "/images/a14b6eac56fde3c0ed4be6117ec5b88b.jpg"
    ],
    "description": "This stunning Rose Petal Natural Soap Set represents the pinnacle of craftsmanship in the Candles & Soaps category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "specifications": {
      "Type": "Set",
      "Scent/Fragrance": "Wild Rose",
      "Dimensions": "3x2x1 inches (each)",
      "Weight": "300g (Set)",
      "Ingredients/Materials": "Olive Oil, Rose Essential Oil, Dried Petals",
      "Ships From": "Bangalore, India"
    },
    "collections": [
      "Vintage & Retro"
    ],
    "occasions": [
      "All Occasions"
    ]
  },
  {
    "id": "hc-cs-4", "occasions": ["just-because","all-occasions"], "collections": ["traditional-arts"],
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
      "/images/a344e75529581e9f43f2c00dc233dea4.webp"
    ],
    "description": "This stunning Birthday Celebration Candle represents the pinnacle of craftsmanship in the Candles & Soaps category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "specifications": {
      "Type": "Candle",
      "Scent/Fragrance": "Vanilla Cake",
      "Dimensions": "4x3 inches",
      "Weight": "250g",
      "Burn Time": "30 Hours",
      "Ingredients/Materials": "Soy Wax, Fragrance Oils, Wax Sprinkles",
      "Ships From": "Pune, India"
    },
    "collections": [
      "Modern Minimalist"
    ],
    "occasions": [
      "Birthdays"
    ]
  },
  {
    "id": "hc-cp-0", "occasions": ["just-because","all-occasions"], "collections": ["traditional-arts"],
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
      "/images/5f2ab26c880e06709387b842cdd1feef.webp"
    ],
    "description": "This stunning Hand-painted Traditional Vase represents the pinnacle of craftsmanship in the Clay & Pottery category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "specifications": {
      "Type": "Vase",
      "Dimensions": "12x6 inches",
      "Weight": "1.2kg",
      "Finish": "Glazed",
      "Food Safe": "No",
      "Care Instructions": "Wipe with damp cloth",
      "Ships From": "Ahmedabad, India"
    },
    "collections": [
      "Traditional Arts"
    ],
    "occasions": [
      "Anniversaries"
    ]
  },
  {
    "id": "hc-cp-1", "occasions": ["just-because","all-occasions"], "collections": ["traditional-arts"],
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
    "auctionEndsAt": "2026-07-06T13:09:02.350Z",
    "currentBid": 600,
    "bidCount": 8,
    "image": "/images/3599c4c65b94b61ec21a8d070cd401fe.jpg",
    "images": [
      "/images/3599c4c65b94b61ec21a8d070cd401fe.jpg"
    ],
    "description": "This stunning Traditional Garba Pots represents the pinnacle of craftsmanship in the Clay & Pottery category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "specifications": {
      "Type": "Decorative Pot",
      "Dimensions": "8x8 inches",
      "Weight": "900g",
      "Finish": "Unglazed",
      "Food Safe": "No",
      "Care Instructions": "Keep dry, dust with soft brush",
      "Ships From": "Surat, India"
    },
    "collections": [
      "Vintage & Retro"
    ],
    "occasions": [
      "Housewarming"
    ]
  },
  {
    "id": "hc-cp-2", "occasions": ["just-because","all-occasions"], "collections": ["traditional-arts"],
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
      "/images/04809f445775b05edf65772b67c139d9.jpg"
    ],
    "description": "This stunning Ceramic Floral Vase represents the pinnacle of craftsmanship in the Clay & Pottery category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "specifications": {
      "Type": "Vase",
      "Dimensions": "10x5 inches",
      "Weight": "1.5kg",
      "Finish": "Hand-painted",
      "Food Safe": "Yes",
      "Care Instructions": "Hand wash recommended",
      "Ships From": "Kochi, India"
    },
    "collections": [
      "Modern Minimalist"
    ],
    "occasions": [
      "Just Because"
    ]
  },
  {
    "id": "hc-cp-3", "occasions": ["just-because","all-occasions"], "collections": ["traditional-arts"],
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
    "auctionEndsAt": "2026-07-06T15:08:56.398Z",
    "currentBid": 1200,
    "bidCount": 14,
    "image": "/images/1572725d1d0bf7fa3ab6b92974a3fdfd.jpg",
    "images": [
      "/images/1572725d1d0bf7fa3ab6b92974a3fdfd.jpg"
    ],
    "description": "This stunning Abstract Clay Figure Sculpture represents the pinnacle of craftsmanship in the Clay & Pottery category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "specifications": {
      "Type": "Sculpture",
      "Dimensions": "14x7 inches",
      "Weight": "2.2kg",
      "Finish": "Unglazed",
      "Food Safe": "No",
      "Care Instructions": "Dust with dry cloth",
      "Ships From": "New Delhi, India"
    },
    "collections": [
      "Traditional Arts"
    ],
    "occasions": [
      "All Occasions"
    ]
  },
  {
    "id": "hc-cp-4", "occasions": ["all-occasions"],
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
      "/images/2371958e0daab9fea35be782cfbcb66c.webp"
    ],
    "description": "This stunning Floral Clay Teapot Set represents the pinnacle of craftsmanship in the Clay & Pottery category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "specifications": {
      "Type": "Teapot Set",
      "Dimensions": "6x8 inches",
      "Weight": "1.8kg",
      "Finish": "Glazed",
      "Food Safe": "Yes",
      "Care Instructions": "Hand wash only, not microwave safe",
      "Ships From": "Kolkata, India"
    },
    "collections": [
      "Vintage & Retro"
    ],
    "occasions": [
      "Birthdays"
    ]
  },
  {
    "id": "hc-cp-5", "occasions": ["all-occasions"],
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
      "/images/d497bf30fec759fddc8ce0890f380f18.jpg"
    ],
    "description": "This stunning Terracotta Vase Trio represents the pinnacle of craftsmanship in the Clay & Pottery category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "specifications": {
      "Type": "Vase Set",
      "Dimensions": "Various Heights (6, 8, 10 inches)",
      "Weight": "2.5kg",
      "Finish": "Unglazed",
      "Food Safe": "No",
      "Care Instructions": "Dry wipe, do not fill with water",
      "Ships From": "Lucknow, India"
    },
    "collections": [
      "Modern Minimalist"
    ],
    "occasions": [
      "Anniversaries"
    ]
  },
  {
    "id": "hc-ck-0", "occasions": ["all-occasions"],
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
      "/images/80a7c1fdd769cc0d35110a438dfb6503.jpg"
    ],
    "description": "This stunning Heart Crochet Keychain Pair represents the pinnacle of craftsmanship in the Crochet & Knitting category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "specifications": {
      "Type": "Keychain Pair",
      "Material/Yarn": "100% Cotton Yarn",
      "Dimensions": "2x2 inches each",
      "Weight": "30g",
      "Care Instructions": "Gentle hand wash",
      "Ships From": "Hyderabad, India"
    },
    "collections": [
      "Traditional Arts"
    ],
    "occasions": [
      "Housewarming"
    ]
  },
  {
    "id": "hc-ck-1", "occasions": ["all-occasions"],
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
      "/images/4472fc60307774b77a3457158adcd98c.webp"
    ],
    "description": "This stunning Crochet Camera Keychain represents the pinnacle of craftsmanship in the Crochet & Knitting category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "specifications": {
      "Type": "Keychain",
      "Material/Yarn": "Acrylic Yarn",
      "Dimensions": "2.5x1.5 inches",
      "Weight": "25g",
      "Care Instructions": "Spot clean only",
      "Ships From": "Chandigarh, India"
    },
    "collections": [
      "Vintage & Retro"
    ],
    "occasions": [
      "Just Because"
    ]
  },
  {
    "id": "hc-ck-2", "occasions": ["all-occasions"],
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
    "auctionEndsAt": "2026-07-06T17:04:03.153Z",
    "currentBid": 550,
    "bidCount": 6,
    "image": "/images/crochet-flowers-blue-pot.jpeg",
    "images": [
      "/images/crochet-flowers-blue-pot.jpeg"
    ],
    "description": "This stunning Crochet Flower Vase represents the pinnacle of craftsmanship in the Crochet & Knitting category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "specifications": {
      "Type": "Decorative Item",
      "Material/Yarn": "Cotton Blend Yarn, Wire",
      "Dimensions": "8x5 inches",
      "Weight": "200g",
      "Care Instructions": "Dust gently, do not wash",
      "Ships From": "Chennai, India"
    },
    "collections": [
      "Modern Minimalist"
    ],
    "occasions": [
      "All Occasions"
    ]
  },
  {
    "id": "hc-ck-3", "occasions": ["all-occasions"],
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
      "/images/d156289ab52040263f59b16d6f3f5f2c.jpg"
    ],
    "description": "This stunning Anniversary Crochet Bouquet represents the pinnacle of craftsmanship in the Crochet & Knitting category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "specifications": {
      "Type": "Bouquet",
      "Material/Yarn": "Premium Milk Cotton Yarn",
      "Dimensions": "15x10 inches",
      "Weight": "450g",
      "Care Instructions": "Keep away from direct sunlight",
      "Ships From": "Pune, India"
    },
    "collections": [
      "Traditional Arts"
    ],
    "occasions": [
      "Birthdays"
    ]
  },
  {
    "id": "hc-ck-4", "occasions": ["all-occasions"],
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
    "auctionEndsAt": "2026-07-06T18:57:35.627Z",
    "currentBid": 1800,
    "bidCount": 12,
    "image": "/images/f428f0473bba1ebaf8b0bf015d7d4e7b.jpg",
    "images": [
      "/images/f428f0473bba1ebaf8b0bf015d7d4e7b.jpg"
    ],
    "description": "This stunning Handmade Crochet Jacket represents the pinnacle of craftsmanship in the Crochet & Knitting category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "specifications": {
      "Type": "Apparel",
      "Material/Yarn": "Wool Blend Yarn",
      "Dimensions": "Free Size (Medium to Large)",
      "Weight": "800g",
      "Care Instructions": "Hand wash cold, dry flat",
      "Ships From": "Darjeeling, India"
    },
    "collections": [
      "Vintage & Retro"
    ],
    "occasions": [
      "Anniversaries"
    ]
  },
  {
    "id": "hc-ck-5", "occasions": ["all-occasions"],
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
      "/images/crochet-sunflower-pot.jpeg"
    ],
    "description": "This stunning Crochet Sunflower Pot represents the pinnacle of craftsmanship in the Crochet & Knitting category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "specifications": {
      "Type": "Decorative Item",
      "Material/Yarn": "Cotton Yarn, Wire",
      "Dimensions": "7x4 inches",
      "Weight": "150g",
      "Care Instructions": "Spot clean only",
      "Ships From": "Ahmedabad, India"
    },
    "collections": [
      "Modern Minimalist"
    ],
    "occasions": [
      "Housewarming"
    ]
  },
  {
    "id": "hc-pc-0", "occasions": ["all-occasions"],
    "title": "Handcrafted Paper Bookmark",
    "creator": "Vikas Joshi",
    "creatorRating": 4.4,
    "creatorReviewCount": 34,
    "creatorBadges": [
      "Fast Shipper",
      "500+ Sales"
    ],
    "verified": false,
    "category": "Handmade & Crafts",
    "subcategory": "Paper Crafts",
    "price": 150,
    "buyingMethod": "Buy Now",
    "offersAllowed": false,
    "image": "/images/1bfd66dfc3b8642a56f32f8ed543cc3a.jpg",
    "images": [
      "/images/1bfd66dfc3b8642a56f32f8ed543cc3a.jpg"
    ],
    "description": "This stunning Handcrafted Paper Bookmark represents the pinnacle of craftsmanship in the Paper Crafts category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "specifications": {
      "Type": "Bookmark",
      "Dimensions": "6x2 inches",
      "Material/Paper Weight": "300gsm Cardstock",
      "Finish": "Matte Laminated",
      "Ships From": "Indore, India"
    },
    "collections": [
      "Traditional Arts"
    ],
    "occasions": [
      "Just Because"
    ]
  },
  {
    "id": "hc-pc-1", "occasions": ["all-occasions"],
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
      "/images/2d45e55d6a95ae07c38891e3887618a2.jpg"
    ],
    "description": "This stunning Paper Craft Flower Pot represents the pinnacle of craftsmanship in the Paper Crafts category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "specifications": {
      "Type": "Decorative Item",
      "Dimensions": "9x6 inches",
      "Material/Paper Weight": "150gsm Craft Paper",
      "Finish": "Natural Paper",
      "Ships From": "Jaipur, India"
    },
    "collections": [
      "Vintage & Retro"
    ],
    "occasions": [
      "All Occasions"
    ]
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
      "/images/5d25e6472904da283141b4dc037eda2d.webp"
    ],
    "description": "This stunning Floral Paper Craft Card represents the pinnacle of craftsmanship in the Paper Crafts category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "specifications": {
      "Type": "Greeting Card",
      "Dimensions": "5x7 inches",
      "Material/Paper Weight": "250gsm Art Card",
      "Finish": "Textured",
      "Ships From": "Noida, India"
    },
    "collections": [
      "Modern Minimalist"
    ],
    "occasions": [
      "Birthdays"
    ]
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
      "/images/90340c0fe5f04ef94056bb544a98ad79.jpg"
    ],
    "description": "This stunning Resin Pendant Necklace represents the pinnacle of craftsmanship in the Resin Art category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "specifications": {
      "Type": "Jewelry",
      "Dimensions": "1.5 inch pendant, 18 inch chain",
      "Weight": "15g",
      "Resin Type": "UV Resin",
      "Finish": "Glossy",
      "Ships From": "Goa, India"
    },
    "collections": [
      "Traditional Arts"
    ],
    "occasions": [
      "Anniversaries"
    ]
  },
  {
    "id": "hc-ra-1",
    "title": "Resin Wall Art Hanging",
    "creator": "Pooja Joshi",
    "creatorRating": 4.9,
    "creatorReviewCount": 305,
    "creatorBadges": [
      "Verified Creator",
      "500+ Sales"
    ],
    "verified": false,
    "category": "Handmade & Crafts",
    "subcategory": "Resin Art",
    "price": 4500,
    "buyingMethod": "Auction",
    "auctionEndsAt": "2026-07-06T20:40:59.628Z",
    "currentBid": 2100,
    "bidCount": 18,
    "image": "/images/6825197426036f192e947bf86984bbb3.webp",
    "images": [
      "/images/6825197426036f192e947bf86984bbb3.webp"
    ],
    "description": "This stunning Resin Wall Art Hanging represents the pinnacle of craftsmanship in the Resin Art category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "specifications": {
      "Type": "Wall Art",
      "Dimensions": "24x18 inches",
      "Weight": "3kg",
      "Resin Type": "Epoxy Resin",
      "Finish": "Glossy",
      "Ships From": "Bangalore, India"
    },
    "collections": [
      "Vintage & Retro"
    ],
    "occasions": [
      "Housewarming"
    ]
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
      "/images/ce4c6e8df736e34bd96ca50c3c6cfb11.jpg"
    ],
    "description": "This stunning Beachy Resin Earrings Set represents the pinnacle of craftsmanship in the Resin Art category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "specifications": {
      "Type": "Jewelry",
      "Dimensions": "2 inch drop",
      "Weight": "10g",
      "Resin Type": "Epoxy Resin",
      "Finish": "Glossy",
      "Ships From": "Mumbai, India"
    },
    "collections": [
      "Modern Minimalist"
    ],
    "occasions": [
      "Just Because"
    ]
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
    "verified": false,
    "category": "Handmade & Crafts",
    "subcategory": "Resin Art",
    "price": 3500,
    "buyingMethod": "Buy Now",
    "offersAllowed": true,
    "minimumOfferPercent": 70,
    "image": "/images/e0e8112d8f5b16d5612a0e69efbae352.jpg",
    "images": [
      "/images/e0e8112d8f5b16d5612a0e69efbae352.jpg"
    ],
    "description": "This stunning Resin Blue Mirror represents the pinnacle of craftsmanship in the Resin Art category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "specifications": {
      "Type": "Home Decor",
      "Dimensions": "20 inches diameter",
      "Weight": "4kg",
      "Resin Type": "Epoxy Resin",
      "Finish": "Glossy",
      "Ships From": "Kochi, India"
    },
    "collections": [
      "Traditional Arts"
    ],
    "occasions": [
      "All Occasions"
    ]
  },
  {
    "id": "hc-ra-4",
    "title": "Resin Art Bookmarks Set",
    "creator": "Sneha Reddy",
    "creatorRating": 4.6,
    "creatorReviewCount": 92,
    "creatorBadges": [
      "Verified Creator"
    ],
    "verified": false,
    "category": "Handmade & Crafts",
    "subcategory": "Resin Art",
    "price": 850,
    "buyingMethod": "Buy Now",
    "offersAllowed": false,
    "image": "/images/f41872e1978e36adfa877aff0029dcad.webp",
    "images": [
      "/images/f41872e1978e36adfa877aff0029dcad.webp"
    ],
    "description": "This stunning Resin Art Bookmarks Set represents the pinnacle of craftsmanship in the Resin Art category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "specifications": {
      "Type": "Bookmark Set",
      "Dimensions": "5.5x1 inches",
      "Weight": "40g",
      "Resin Type": "UV Resin",
      "Finish": "Glossy",
      "Ships From": "Hyderabad, India"
    },
    "collections": [
      "Vintage & Retro"
    ],
    "occasions": [
      "Birthdays"
    ]
  },
  {
    "id": "ls-hd-0", "collections": ["modern-minimalist"],
    "title": "Soft Floral Cushion",
    "creator": "Vivek Shetty",
    "creatorRating": 4.1,
    "creatorReviewCount": 20,
    "creatorBadges": [
      "Top Rated Seller",
      "Fast Shipper"
    ],
    "verified": false,
    "category": "Lifestyle & Gifts",
    "subcategory": "Home Decor",
    "price": 1200,
    "buyingMethod": "Buy Now",
    "offersAllowed": true,
    "minimumOfferPercent": 70,
    "image": "/images/7caa33bf8eca070ee8a1dd20f86723ec.webp",
    "images": [
      "/images/7caa33bf8eca070ee8a1dd20f86723ec.webp"
    ],
    "description": "This stunning Soft Floral Cushion represents the pinnacle of craftsmanship in the Home Decor category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "specifications": {
      "Dimensions": "30 cm x 20 cm",
      "Material": "Mixed",
      "Finish": "Matte",
      "Weight": "500g",
      "Care Instructions": "Wipe with dry cloth",
      "Ships From": "Jaipur"
    },
    "collections": [
      "Modern Minimalist"
    ],
    "occasions": [
      "Anniversaries"
    ]
  },
  {
    "id": "ls-hd-2", "collections": ["modern-minimalist"],
    "title": "Chess Set Wall Storage",
    "creator": "Karthik Nair",
    "creatorRating": 4.3,
    "creatorReviewCount": 70,
    "creatorBadges": [
      "Verified Creator"
    ],
    "verified": false,
    "category": "Lifestyle & Gifts",
    "subcategory": "Home Decor",
    "price": 900,
    "buyingMethod": "Buy Now",
    "offersAllowed": false,
    "minimumOfferPercent": 70,
    "image": "/images/a5f4ca975a91906c04d6f284ddb53aca.jpg",
    "images": [
      "/images/a5f4ca975a91906c04d6f284ddb53aca.jpg"
    ],
    "description": "This stunning Chess Set Wall Storage represents the pinnacle of craftsmanship in the Home Decor category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "specifications": {
      "Dimensions": "30 cm x 20 cm",
      "Material": "Mixed",
      "Finish": "Matte",
      "Weight": "500g",
      "Care Instructions": "Wipe with dry cloth",
      "Ships From": "Jaipur"
    },
    "collections": [
      "Traditional Arts"
    ],
    "occasions": [
      "Housewarming"
    ]
  },
  {
    "id": "ls-hd-3", "collections": ["modern-minimalist"],
    "title": "Glass Bottle with Glasswork",
    "creator": "Rahul Chawla",
    "creatorRating": 4.4,
    "creatorReviewCount": 95,
    "creatorBadges": [
      "Top Rated Seller",
      "Fast Shipper"
    ],
    "verified": false,
    "category": "Lifestyle & Gifts",
    "subcategory": "Home Decor",
    "price": 650,
    "buyingMethod": "Buy Now",
    "offersAllowed": true,
    "minimumOfferPercent": 70,
    "image": "/images/b2577665a29cbe1b2263e4c0b1a4ee29.webp",
    "images": [
      "/images/b2577665a29cbe1b2263e4c0b1a4ee29.webp"
    ],
    "description": "This stunning Glass Bottle with Glasswork represents the pinnacle of craftsmanship in the Home Decor category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "specifications": {
      "Dimensions": "30 cm x 20 cm",
      "Material": "Mixed",
      "Finish": "Matte",
      "Weight": "500g",
      "Care Instructions": "Wipe with dry cloth",
      "Ships From": "Jaipur"
    },
    "collections": [
      "Vintage & Retro"
    ],
    "occasions": [
      "Just Because"
    ]
  },
  {
    "id": "ls-hd-4", "collections": ["modern-minimalist"],
    "title": "Sculptural Home Décor Piece",
    "creator": "Priya Patel",
    "creatorRating": 4.5,
    "creatorReviewCount": 120,
    "creatorBadges": [
      "Verified Creator"
    ],
    "verified": false,
    "category": "Lifestyle & Gifts",
    "subcategory": "Home Decor",
    "price": 1800,
    "buyingMethod": "Auction",
    "auctionEndsAt": "2026-07-06T22:38:46.570Z",
    "offersAllowed": false,
    "minimumOfferPercent": 70,
    "image": "/images/c3f27a4077f7d8474444c2c129199224.webp",
    "images": [
      "/images/c3f27a4077f7d8474444c2c129199224.webp"
    ],
    "description": "This stunning Sculptural Home Décor Piece represents the pinnacle of craftsmanship in the Home Decor category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "specifications": {
      "Dimensions": "30 cm x 20 cm",
      "Material": "Mixed",
      "Finish": "Matte",
      "Weight": "500g",
      "Care Instructions": "Wipe with dry cloth",
      "Ships From": "Jaipur"
    },
    "currentBid": 1850,
    "bidCount": 2,
    "collections": [
      "Modern Minimalist"
    ],
    "occasions": [
      "All Occasions"
    ]
  },
  {
    "id": "ls-hd-5", "collections": ["modern-minimalist"],
    "title": "Custom Sword Wall Hanging",
    "creator": "Sneha Handmades",
    "creatorRating": 4.6,
    "creatorReviewCount": 145,
    "creatorBadges": [
      "Verified Creator"
    ],
    "verified": false,
    "category": "Lifestyle & Gifts",
    "subcategory": "Home Decor",
    "price": 450,
    "buyingMethod": "Buy Now",
    "offersAllowed": false,
    "minimumOfferPercent": 70,
    "image": "/images/e2174f2cb5f931e40766c959c4adc809.jpg",
    "images": [
      "/images/e2174f2cb5f931e40766c959c4adc809.jpg"
    ],
    "description": "This stunning Custom Sword Wall Hanging represents the pinnacle of craftsmanship in the Home Decor category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "specifications": {
      "Dimensions": "30 cm x 20 cm",
      "Material": "Mixed",
      "Finish": "Matte",
      "Weight": "500g",
      "Care Instructions": "Wipe with dry cloth",
      "Ships From": "Jaipur"
    },
    "collections": [
      "Traditional Arts"
    ],
    "occasions": [
      "Birthdays"
    ]
  },
  {
    "id": "ls-ja-0", "collections": ["modern-minimalist"],
    "title": "Gold Arm Cuff",
    "creator": "Neha Curations",
    "creatorRating": 4.7,
    "creatorReviewCount": 170,
    "creatorBadges": [
      "Top Rated Seller",
      "Fast Shipper"
    ],
    "verified": false,
    "category": "Lifestyle & Gifts",
    "subcategory": "Jewellery & Accessories",
    "price": 850,
    "buyingMethod": "Buy Now",
    "offersAllowed": true,
    "minimumOfferPercent": 70,
    "image": "/images/1f986eedcf59a21d3352b5cc6bee2244.jpg",
    "images": [
      "/images/1f986eedcf59a21d3352b5cc6bee2244.jpg"
    ],
    "description": "This stunning Gold Arm Cuff represents the pinnacle of craftsmanship in the Jewellery & Accessories category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "specifications": {
      "Metal/Material": "Silver/Brass",
      "Stone/Embellishment": "None",
      "Clasp Type": "Lobster",
      "Dimensions": "Adjustable",
      "Weight": "15g",
      "Finish": "Polished",
      "Ships From": "Delhi"
    },
    "collections": [
      "Vintage & Retro"
    ],
    "occasions": [
      "Anniversaries"
    ]
  },
  {
    "id": "ls-ja-1",
    "title": "Crochet Case Cover",
    "creator": "Aditya Collections",
    "creatorRating": 4.8,
    "creatorReviewCount": 195,
    "creatorBadges": [
      "Verified Creator"
    ],
    "verified": false,
    "category": "Lifestyle & Gifts",
    "subcategory": "Stationery",
    "price": 1100,
    "buyingMethod": "Auction",
    "auctionEndsAt": "2026-07-07T00:38:05.529Z",
    "offersAllowed": false,
    "minimumOfferPercent": 70,
    "image": "/images/5cf84872e9e0ed2dcee303bf9e245b28.jpg",
    "images": [
      "/images/5cf84872e9e0ed2dcee303bf9e245b28.jpg"
    ],
    "description": "This stunning Crochet Case Cover represents the pinnacle of craftsmanship in the Stationery category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "specifications": {
      "Metal/Material": "Silver/Brass",
      "Stone/Embellishment": "None",
      "Clasp Type": "Lobster",
      "Dimensions": "Adjustable",
      "Weight": "15g",
      "Finish": "Polished",
      "Ships From": "Delhi"
    },
    "currentBid": 1200,
    "bidCount": 3,
    "collections": [
      "Modern Minimalist"
    ],
    "occasions": [
      "Housewarming"
    ]
  },
  {
    "id": "ls-ja-2",
    "title": "Handcrafted Beaded Bracelet",
    "creator": "Sneha Iyer",
    "creatorRating": 4.9,
    "creatorReviewCount": 220,
    "creatorBadges": [
      "Verified Creator"
    ],
    "verified": false,
    "category": "Lifestyle & Gifts",
    "subcategory": "Jewellery & Accessories",
    "price": 300,
    "buyingMethod": "Buy Now",
    "offersAllowed": false,
    "minimumOfferPercent": 70,
    "image": "/images/7f69e85a737d75f85a041d457c9be525.jpg",
    "images": [
      "/images/7f69e85a737d75f85a041d457c9be525.jpg"
    ],
    "description": "This stunning Handcrafted Beaded Bracelet represents the pinnacle of craftsmanship in the Jewellery & Accessories category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "specifications": {
      "Metal/Material": "Silver/Brass",
      "Stone/Embellishment": "None",
      "Clasp Type": "Lobster",
      "Dimensions": "Adjustable",
      "Weight": "15g",
      "Finish": "Polished",
      "Ships From": "Delhi"
    },
    "collections": [
      "Traditional Arts"
    ],
    "occasions": [
      "Just Because"
    ]
  },
  {
    "id": "ls-ja-3",
    "title": "Gold-Plated Minimalist Ring",
    "creator": "Priya Elements",
    "creatorRating": 5,
    "creatorReviewCount": 245,
    "creatorBadges": [
      "Top Rated Seller",
      "Fast Shipper"
    ],
    "verified": false,
    "category": "Lifestyle & Gifts",
    "subcategory": "Jewellery & Accessories",
    "price": 500,
    "buyingMethod": "Buy Now",
    "offersAllowed": true,
    "minimumOfferPercent": 70,
    "image": "/images/417caba42ec36fd9ba441b33afd74e7c.jpg",
    "images": [
      "/images/417caba42ec36fd9ba441b33afd74e7c.jpg"
    ],
    "description": "This stunning Gold-Plated Minimalist Ring represents the pinnacle of craftsmanship in the Jewellery & Accessories category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "specifications": {
      "Metal/Material": "Silver/Brass",
      "Stone/Embellishment": "None",
      "Clasp Type": "Lobster",
      "Dimensions": "Adjustable",
      "Weight": "15g",
      "Finish": "Polished",
      "Ships From": "Delhi"
    },
    "collections": [
      "Vintage & Retro"
    ],
    "occasions": [
      "All Occasions"
    ]
  },
  {
    "id": "ls-ja-4",
    "title": "Shell Jewellery Stand",
    "creator": "Rahul Chawla",
    "creatorRating": 4.1,
    "creatorReviewCount": 270,
    "creatorBadges": [
      "Verified Creator"
    ],
    "verified": false,
    "category": "Lifestyle & Gifts",
    "subcategory": "Home Decor",
    "price": 750,
    "buyingMethod": "Buy Now",
    "offersAllowed": false,
    "minimumOfferPercent": 70,
    "image": "/images/454b1c36b55a7aac07a46dec81f95a6f.jpg",
    "images": [
      "/images/454b1c36b55a7aac07a46dec81f95a6f.jpg"
    ],
    "description": "This stunning Shell Jewellery Stand represents the pinnacle of craftsmanship in the Home Decor category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "specifications": {
      "Metal/Material": "Silver/Brass",
      "Stone/Embellishment": "None",
      "Clasp Type": "Lobster",
      "Dimensions": "Adjustable",
      "Weight": "15g",
      "Finish": "Polished",
      "Ships From": "Delhi"
    },
    "collections": [
      "Modern Minimalist"
    ],
    "occasions": [
      "Birthdays"
    ]
  },
  {
    "id": "ls-ja-5",
    "title": "Set of 3 Cute Rings",
    "creator": "Neha Kapoor",
    "creatorRating": 4.2,
    "creatorReviewCount": 295,
    "creatorBadges": [
      "Verified Creator"
    ],
    "verified": false,
    "category": "Lifestyle & Gifts",
    "subcategory": "Jewellery & Accessories",
    "price": 2500,
    "buyingMethod": "Auction",
    "auctionEndsAt": "2026-07-07T02:42:14.109Z",
    "offersAllowed": false,
    "minimumOfferPercent": 70,
    "image": "/images/629babcd420c53e76b891e70f45966ee.jpg",
    "images": [
      "/images/629babcd420c53e76b891e70f45966ee.jpg"
    ],
    "description": "This stunning Set of 3 Cute Rings represents the pinnacle of craftsmanship in the Jewellery & Accessories category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "specifications": {
      "Metal/Material": "Silver/Brass",
      "Stone/Embellishment": "None",
      "Clasp Type": "Lobster",
      "Dimensions": "Adjustable",
      "Weight": "15g",
      "Finish": "Polished",
      "Ships From": "Delhi"
    },
    "currentBid": 2800,
    "bidCount": 6,
    "collections": [
      "Traditional Arts"
    ],
    "occasions": [
      "Anniversaries"
    ]
  },
  {
    "id": "ls-mn-0",
    "title": "Miniature Pottery Set with Florals",
    "creator": "Suresh Pillai",
    "creatorRating": 4.3,
    "creatorReviewCount": 320,
    "creatorBadges": [
      "Top Rated Seller",
      "Fast Shipper"
    ],
    "verified": false,
    "category": "Lifestyle & Gifts",
    "subcategory": "Miniatures",
    "price": 1500,
    "buyingMethod": "Auction",
    "auctionEndsAt": "2026-07-07T04:30:46.947Z",
    "offersAllowed": false,
    "minimumOfferPercent": 70,
    "image": "/images/2057d7b98e01e6d4671c8652e542bfbb.jpg",
    "images": [
      "/images/2057d7b98e01e6d4671c8652e542bfbb.jpg"
    ],
    "description": "This stunning Miniature Pottery Set with Florals represents the pinnacle of craftsmanship in the Miniatures category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "specifications": {
      "Scale": "1:12",
      "Dimensions": "5 cm x 5 cm",
      "Material": "Clay/Wood",
      "Finish": "Painted",
      "Display Base": "Yes",
      "Ships From": "Pune"
    },
    "currentBid": 1600,
    "bidCount": 5,
    "collections": [
      "Vintage & Retro"
    ],
    "occasions": [
      "Housewarming"
    ]
  },
  {
    "id": "ls-mn-1",
    "title": "Wooden Miniature House",
    "creator": "Swati Kulkarni",
    "creatorRating": 4.4,
    "creatorReviewCount": 345,
    "creatorBadges": [
      "Verified Creator"
    ],
    "verified": false,
    "category": "Lifestyle & Gifts",
    "subcategory": "Miniatures",
    "price": 400,
    "buyingMethod": "Buy Now",
    "offersAllowed": true,
    "minimumOfferPercent": 70,
    "image": "/images/9780ce408b0eeacb2b478b53e49472f3.webp",
    "images": [
      "/images/9780ce408b0eeacb2b478b53e49472f3.webp"
    ],
    "description": "This stunning Wooden Miniature House represents the pinnacle of craftsmanship in the Miniatures category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "specifications": {
      "Scale": "1:12",
      "Dimensions": "5 cm x 5 cm",
      "Material": "Clay/Wood",
      "Finish": "Painted",
      "Display Base": "Yes",
      "Ships From": "Pune"
    },
    "collections": [
      "Modern Minimalist"
    ],
    "occasions": [
      "Just Because"
    ]
  },
  {
    "id": "ls-mn-2",
    "title": "Miniature Food Platter Magnet",
    "creator": "Kavita Rathi",
    "creatorRating": 4.5,
    "creatorReviewCount": 370,
    "creatorBadges": [
      "Verified Creator"
    ],
    "verified": false,
    "category": "Lifestyle & Gifts",
    "subcategory": "Miniatures",
    "price": 800,
    "buyingMethod": "Buy Now",
    "offersAllowed": false,
    "minimumOfferPercent": 70,
    "image": "/images/f8e8c93f83911972060b57d5784893b9.jpg",
    "images": [
      "/images/f8e8c93f83911972060b57d5784893b9.jpg"
    ],
    "description": "This stunning Miniature Food Platter Magnet represents the pinnacle of craftsmanship in the Miniatures category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "specifications": {
      "Scale": "1:12",
      "Dimensions": "5 cm x 5 cm",
      "Material": "Clay/Wood",
      "Finish": "Painted",
      "Display Base": "Yes",
      "Ships From": "Pune"
    },
    "collections": [
      "Traditional Arts"
    ],
    "occasions": [
      "All Occasions"
    ]
  },
  {
    "id": "ls-st-0",
    "title": "Set of 25 Posca Markers",
    "creator": "Sneha Handmades",
    "creatorRating": 4.6,
    "creatorReviewCount": 395,
    "creatorBadges": [
      "Top Rated Seller",
      "Fast Shipper"
    ],
    "verified": false,
    "category": "Lifestyle & Gifts",
    "subcategory": "Stationery",
    "price": 950,
    "buyingMethod": "Buy Now",
    "offersAllowed": true,
    "minimumOfferPercent": 70,
    "image": "/images/85bd73f4fa6dc704d1d19c276fba84a2.jpg",
    "images": [
      "/images/85bd73f4fa6dc704d1d19c276fba84a2.jpg"
    ],
    "description": "This stunning Set of 25 Posca Markers represents the pinnacle of craftsmanship in the Stationery category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "specifications": {
      "Sheet Count / Pages": "100",
      "Paper Weight (gsm)": "120 gsm",
      "Cover Material": "Leather/Paper",
      "Dimensions": "A5",
      "Ruling Type": "Unruled",
      "Ships From": "Mumbai"
    },
    "collections": [
      "Vintage & Retro"
    ],
    "occasions": [
      "Birthdays"
    ]
  },
  {
    "id": "ls-st-1",
    "title": "Custom Pen, Paper & Sticky Notes Gift Set",
    "creator": "Neha Curations",
    "creatorRating": 4.7,
    "creatorReviewCount": 420,
    "creatorBadges": [
      "Verified Creator"
    ],
    "verified": false,
    "category": "Lifestyle & Gifts",
    "subcategory": "Stationery",
    "price": 350,
    "buyingMethod": "Buy Now",
    "offersAllowed": false,
    "minimumOfferPercent": 70,
    "image": "/images/cd653367e75f8af84fb565e77b4fc97f.webp",
    "images": [
      "/images/cd653367e75f8af84fb565e77b4fc97f.webp"
    ],
    "description": "This stunning Custom Pen, Paper & Sticky Notes Gift Set represents the pinnacle of craftsmanship in the Stationery category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "specifications": {
      "Sheet Count / Pages": "100",
      "Paper Weight (gsm)": "120 gsm",
      "Cover Material": "Leather/Paper",
      "Dimensions": "A5",
      "Ruling Type": "Unruled",
      "Ships From": "Mumbai"
    },
    "collections": [
      "Modern Minimalist"
    ],
    "occasions": [
      "Anniversaries"
    ]
  },
  {
    "id": "ls-st-2",
    "title": "Big Sticker Pack",
    "creator": "Aditya Collections",
    "creatorRating": 4.8,
    "creatorReviewCount": 49,
    "creatorBadges": [
      "Verified Creator"
    ],
    "verified": false,
    "category": "Lifestyle & Gifts",
    "subcategory": "Stationery",
    "price": 600,
    "buyingMethod": "Auction",
    "auctionEndsAt": "2026-07-07T06:31:17.796Z",
    "offersAllowed": false,
    "minimumOfferPercent": 70,
    "image": "/images/d8bb9900ecc6dd3dd2c62d723203a2c3.webp",
    "images": [
      "/images/d8bb9900ecc6dd3dd2c62d723203a2c3.webp"
    ],
    "description": "This stunning Big Sticker Pack represents the pinnacle of craftsmanship in the Stationery category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "specifications": {
      "Sheet Count / Pages": "100",
      "Paper Weight (gsm)": "120 gsm",
      "Cover Material": "Leather/Paper",
      "Dimensions": "A5",
      "Ruling Type": "Unruled",
      "Ships From": "Mumbai"
    },
    "currentBid": 650,
    "bidCount": 2,
    "collections": [
      "Traditional Arts"
    ],
    "occasions": [
      "Housewarming"
    ]
  },
  {
    "id": "ls-st-3",
    "title": "Blue Pen with Pink Bow",
    "creator": "Pooja Joshi",
    "creatorRating": 4.9,
    "creatorReviewCount": 101,
    "creatorBadges": [
      "Top Rated Seller",
      "Fast Shipper"
    ],
    "verified": false,
    "category": "Lifestyle & Gifts",
    "subcategory": "Stationery",
    "price": 250,
    "buyingMethod": "Buy Now",
    "offersAllowed": false,
    "minimumOfferPercent": 70,
    "image": "/images/fbc8d0c72ddf94d0a150ce1e24f19382.jpg",
    "images": [
      "/images/fbc8d0c72ddf94d0a150ce1e24f19382.jpg"
    ],
    "description": "This stunning Blue Pen with Pink Bow represents the pinnacle of craftsmanship in the Stationery category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "specifications": {
      "Sheet Count / Pages": "100",
      "Paper Weight (gsm)": "120 gsm",
      "Cover Material": "Leather/Paper",
      "Dimensions": "A5",
      "Ruling Type": "Unruled",
      "Ships From": "Mumbai"
    },
    "collections": [
      "Vintage & Retro"
    ],
    "occasions": [
      "Just Because"
    ]
  },
  {
    "id": "gh-am-0",
    "title": "Anime School Bag",
    "creator": "Vikram Singh",
    "creatorRating": 4.34,
    "creatorReviewCount": 145,
    "creatorBadges": [
      "Fast Shipper",
      "500+ Sales",
      "Verified Creator"
    ],
    "verified": false,
    "category": "Gaming & Hobby",
    "subcategory": "Anime Merchandise",
    "price": 1250,
    "buyingMethod": "Buy Now",
    "offersAllowed": true,
    "minimumOfferPercent": 70,
    "image": "/images/5f3adde084f08eee2d3375f04d56ba04.jpg",
    "images": [
      "/images/5f3adde084f08eee2d3375f04d56ba04.jpg"
    ],
    "description": "This stunning Anime School Bag represents the pinnacle of craftsmanship in the Anime Merchandise category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "specifications": {
      "Type": "Merchandise",
      "Character/Series": "Various Anime",
      "Material": "Premium Synthetic",
      "Dimensions": "Standard Size",
      "Weight": "200g",
      "Limited Edition": "Yes",
      "Ships From": "Mumbai, India"
    },
    "newArrival": true,
    "collections": [
      "Modern Minimalist"
    ],
    "occasions": [
      "All Occasions"
    ]
  },
  {
    "id": "gh-am-1",
    "title": "Anime Keychain Set",
    "creator": "Sneha Iyer",
    "creatorRating": 4.96,
    "creatorReviewCount": 331,
    "creatorBadges": [
      "Top Rated Seller",
      "500+ Sales"
    ],
    "verified": false,
    "category": "Gaming & Hobby",
    "subcategory": "Anime Merchandise",
    "price": 450,
    "buyingMethod": "Buy Now",
    "offersAllowed": false,
    "minimumOfferPercent": 70,
    "image": "/images/133ed5c3890f16eeca38eedf3bd059b5.jpg",
    "images": [
      "/images/133ed5c3890f16eeca38eedf3bd059b5.jpg"
    ],
    "description": "This stunning Anime Keychain Set represents the pinnacle of craftsmanship in the Anime Merchandise category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "specifications": {
      "Type": "Merchandise",
      "Character/Series": "Various Anime",
      "Material": "Premium Synthetic",
      "Dimensions": "Standard Size",
      "Weight": "200g",
      "Limited Edition": "Yes",
      "Ships From": "Mumbai, India"
    },
    "collections": [
      "Traditional Arts"
    ],
    "occasions": [
      "Birthdays"
    ]
  },
  {
    "id": "gh-am-2",
    "title": "Anime Figure Collectibles Set",
    "creator": "Sneha Iyer",
    "creatorRating": 4.83,
    "creatorReviewCount": 73,
    "creatorBadges": [
      "Trusted Seller",
      "500+ Sales"
    ],
    "verified": false,
    "category": "Gaming & Hobby",
    "subcategory": "Anime Merchandise",
    "price": 3500,
    "buyingMethod": "Auction",
    "auctionEndsAt": "2026-07-07T08:13:21.074Z",
    "offersAllowed": false,
    "minimumOfferPercent": 70,
    "image": "/images/ee616c53d459a38d4c2122653aa94920.jpg",
    "images": [
      "/images/ee616c53d459a38d4c2122653aa94920.jpg"
    ],
    "description": "This stunning Anime Figure Collectibles Set represents the pinnacle of craftsmanship in the Anime Merchandise category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "specifications": {
      "Type": "Merchandise",
      "Character/Series": "Various Anime",
      "Material": "Premium Synthetic",
      "Dimensions": "Standard Size",
      "Weight": "200g",
      "Limited Edition": "Yes",
      "Ships From": "Mumbai, India"
    },
    "currentBid": 2800,
    "bidCount": 7,
    "collections": [
      "Vintage & Retro"
    ],
    "occasions": [
      "Anniversaries"
    ]
  },
  {
    "id": "gh-bg-0",
    "title": "Classic Wooden Dominoes Set",
    "creator": "Rajesh Kumar",
    "creatorRating": 4.47,
    "creatorReviewCount": 115,
    "creatorBadges": [
      "Trusted Seller"
    ],
    "verified": false,
    "category": "Gaming & Hobby",
    "subcategory": "Board Games",
    "price": 850,
    "buyingMethod": "Buy Now",
    "offersAllowed": false,
    "minimumOfferPercent": 70,
    "image": "/images/5139a72a8fd930206d06b40689c6e35c.jpg",
    "images": [
      "/images/5139a72a8fd930206d06b40689c6e35c.jpg"
    ],
    "description": "This stunning Classic Wooden Dominoes Set represents the pinnacle of craftsmanship in the Board Games category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "specifications": {
      "Players": "2-4 Players",
      "Age Range": "8+",
      "Play Time": "30-60 Mins",
      "Components": "Complete Set",
      "Dimensions": "Standard Box",
      "Weight": "1.2kg",
      "Ships From": "Delhi, India"
    },
    "collections": [
      "Modern Minimalist"
    ],
    "occasions": [
      "Housewarming"
    ]
  },
  {
    "id": "gh-bg-1",
    "title": "Harry Potter Edition Guess Who",
    "creator": "Vikram Singh",
    "creatorRating": 4.97,
    "creatorReviewCount": 83,
    "creatorBadges": [
      "Trusted Seller"
    ],
    "verified": false,
    "category": "Gaming & Hobby",
    "subcategory": "Board Games",
    "price": 2100,
    "buyingMethod": "Buy Now",
    "offersAllowed": true,
    "minimumOfferPercent": 70,
    "image": "/images/ab649b70f654625251d0c0a5ff8f6eae.webp",
    "images": [
      "/images/ab649b70f654625251d0c0a5ff8f6eae.webp"
    ],
    "description": "This stunning Harry Potter Edition Guess Who represents the pinnacle of craftsmanship in the Board Games category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "specifications": {
      "Players": "2-4 Players",
      "Age Range": "8+",
      "Play Time": "30-60 Mins",
      "Components": "Complete Set",
      "Dimensions": "Standard Box",
      "Weight": "1.2kg",
      "Ships From": "Delhi, India"
    },
    "collections": [
      "Traditional Arts"
    ],
    "occasions": [
      "Just Because"
    ]
  },
  {
    "id": "gh-bg-2",
    "title": "Clash of Clans Collector's Board Game",
    "creator": "Rohan Sharma",
    "creatorRating": 4.29,
    "creatorReviewCount": 249,
    "creatorBadges": [
      "Top Rated Seller",
      "Fast Shipper",
      "500+ Sales"
    ],
    "verified": false,
    "category": "Gaming & Hobby",
    "subcategory": "Board Games",
    "price": 4200,
    "buyingMethod": "Auction",
    "auctionEndsAt": "2026-07-07T10:10:30.235Z",
    "offersAllowed": false,
    "minimumOfferPercent": 70,
    "image": "/images/b355c24663070085652f2205eb853402.webp",
    "images": [
      "/images/b355c24663070085652f2205eb853402.webp"
    ],
    "description": "This stunning Clash of Clans Collector's Board Game represents the pinnacle of craftsmanship in the Board Games category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "specifications": {
      "Players": "2-4 Players",
      "Age Range": "8+",
      "Play Time": "30-60 Mins",
      "Components": "Complete Set",
      "Dimensions": "Standard Box",
      "Weight": "1.2kg",
      "Ships From": "Delhi, India"
    },
    "currentBid": 3360,
    "bidCount": 1,
    "collections": [
      "Vintage & Retro"
    ],
    "occasions": [
      "All Occasions"
    ]
  },
  {
    "id": "gh-bg-3",
    "title": "Rare Wooden Chess Set",
    "creator": "Karthik Nair",
    "creatorRating": 4.2,
    "creatorReviewCount": 98,
    "creatorBadges": [
      "Verified Creator"
    ],
    "verified": false,
    "category": "Gaming & Hobby",
    "subcategory": "Board Games",
    "price": 4800,
    "buyingMethod": "Auction",
    "auctionEndsAt": "2026-07-07T11:58:14.788Z",
    "offersAllowed": false,
    "minimumOfferPercent": 70,
    "image": "/images/p452729_2.jpg",
    "images": [
      "/images/p452729_2.jpg"
    ],
    "description": "This stunning Rare Wooden Chess Set represents the pinnacle of craftsmanship in the Board Games category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "specifications": {
      "Players": "2-4 Players",
      "Age Range": "8+",
      "Play Time": "30-60 Mins",
      "Components": "Complete Set",
      "Dimensions": "Standard Box",
      "Weight": "1.2kg",
      "Ships From": "Delhi, India"
    },
    "currentBid": 3840,
    "bidCount": 15,
    "collections": [
      "Modern Minimalist"
    ],
    "occasions": [
      "Birthdays"
    ]
  },
  {
    "id": "gh-cp-0",
    "title": "Shadowmourne Battle Axe — WoW LED Replica",
    "creator": "Anjali Gupta",
    "creatorRating": 4.93,
    "creatorReviewCount": 185,
    "creatorBadges": [
      "Fast Shipper",
      "Verified Creator",
      "Top Rated Seller"
    ],
    "verified": false,
    "category": "Gaming & Hobby",
    "subcategory": "Cosplay Props",
    "price": 5000,
    "buyingMethod": "Auction",
    "auctionEndsAt": "2026-07-07T13:57:53.355Z",
    "offersAllowed": false,
    "minimumOfferPercent": 70,
    "image": "/images/3b996e5246d79ef9617231779fe39bfd.webp",
    "images": [
      "/images/3b996e5246d79ef9617231779fe39bfd.webp"
    ],
    "description": "This stunning Shadowmourne Battle Axe — WoW LED Replica represents the pinnacle of craftsmanship in the Cosplay Props category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "specifications": {
      "Character/Series": "Various",
      "Material": "High-Density Foam/Plastic",
      "Dimensions": "1:1 Scale",
      "Weight": "500g",
      "LED": "Yes",
      "Assembly Required": "No",
      "Ships From": "Bangalore, India"
    },
    "currentBid": 4000,
    "bidCount": 7,
    "collections": [
      "Traditional Arts"
    ],
    "occasions": [
      "Anniversaries"
    ]
  },
  {
    "id": "gh-cp-1",
    "title": "Shimmer Mic Set — Cosplay Performance Pack",
    "creator": "Meera Reddy",
    "creatorRating": 4.51,
    "creatorReviewCount": 304,
    "creatorBadges": [
      "500+ Sales",
      "Fast Shipper"
    ],
    "verified": false,
    "category": "Gaming & Hobby",
    "subcategory": "Cosplay Props",
    "price": 1800,
    "buyingMethod": "Buy Now",
    "offersAllowed": true,
    "minimumOfferPercent": 70,
    "image": "/images/5c9d92c399c387829d972b3c4dd94ddb.webp",
    "images": [
      "/images/5c9d92c399c387829d972b3c4dd94ddb.webp"
    ],
    "description": "This stunning Shimmer Mic Set — Cosplay Performance Pack represents the pinnacle of craftsmanship in the Cosplay Props category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "specifications": {
      "Character/Series": "Various",
      "Material": "High-Density Foam/Plastic",
      "Dimensions": "1:1 Scale",
      "Weight": "500g",
      "LED": "Yes",
      "Assembly Required": "No",
      "Ships From": "Bangalore, India"
    },
    "collections": [
      "Vintage & Retro"
    ],
    "occasions": [
      "Housewarming"
    ]
  },
  {
    "id": "gh-cp-2",
    "title": "Jinx Chomper Grenade — Arcane 3D Print",
    "creator": "Sneha Iyer",
    "creatorRating": 4.6,
    "creatorReviewCount": 320,
    "creatorBadges": [
      "Top Rated Seller",
      "Verified Creator"
    ],
    "verified": false,
    "category": "Gaming & Hobby",
    "subcategory": "Cosplay Props",
    "price": 2600,
    "buyingMethod": "Buy Now",
    "offersAllowed": false,
    "minimumOfferPercent": 70,
    "image": "/images/827f63726fb2295f4704e8a2293b8076.webp",
    "images": [
      "/images/827f63726fb2295f4704e8a2293b8076.webp"
    ],
    "description": "This stunning Jinx Chomper Grenade — Arcane 3D Print represents the pinnacle of craftsmanship in the Cosplay Props category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "specifications": {
      "Character/Series": "Various",
      "Material": "High-Density Foam/Plastic",
      "Dimensions": "1:1 Scale",
      "Weight": "500g",
      "LED": "Yes",
      "Assembly Required": "No",
      "Ships From": "Bangalore, India"
    },
    "collections": [
      "Modern Minimalist"
    ],
    "occasions": [
      "Just Because"
    ]
  },
  {
    "id": "gh-cp-3",
    "title": "Addams Family Thing Hand Prop",
    "creator": "Rajesh Kumar",
    "creatorRating": 4.57,
    "creatorReviewCount": 110,
    "creatorBadges": [
      "Top Rated Seller"
    ],
    "verified": false,
    "category": "Gaming & Hobby",
    "subcategory": "Cosplay Props",
    "price": 1100,
    "buyingMethod": "Buy Now",
    "offersAllowed": true,
    "minimumOfferPercent": 70,
    "image": "/images/8181163cbbd1df84ebcf1ee68060e86b.jpg",
    "images": [
      "/images/8181163cbbd1df84ebcf1ee68060e86b.jpg"
    ],
    "description": "This stunning Addams Family Thing Hand Prop represents the pinnacle of craftsmanship in the Cosplay Props category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "specifications": {
      "Character/Series": "Various",
      "Material": "High-Density Foam/Plastic",
      "Dimensions": "1:1 Scale",
      "Weight": "500g",
      "LED": "Yes",
      "Assembly Required": "No",
      "Ships From": "Bangalore, India"
    },
    "collections": [
      "Traditional Arts"
    ],
    "occasions": [
      "All Occasions"
    ]
  },
  {
    "id": "gh-pc-0",
    "title": "Mayhem in the Library — 1000pc Puzzle",
    "creator": "Rajesh Kumar",
    "creatorRating": 4.78,
    "creatorReviewCount": 37,
    "creatorBadges": [
      "Top Rated Seller"
    ],
    "verified": false,
    "category": "Gaming & Hobby",
    "subcategory": "Puzzle Collections",
    "price": 1350,
    "buyingMethod": "Buy Now",
    "offersAllowed": false,
    "minimumOfferPercent": 70,
    "image": "/images/1a1bf978dcd45523d39f580eee52572f.jpg",
    "images": [
      "/images/1a1bf978dcd45523d39f580eee52572f.jpg"
    ],
    "description": "This stunning Mayhem in the Library — 1000pc Puzzle represents the pinnacle of craftsmanship in the Puzzle Collections category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "specifications": {
      "Piece Count": "1000",
      "Dimensions (assembled)": "70x50 cm",
      "Difficulty": "Advanced",
      "Material": "Cardboard",
      "Age Range": "12+",
      "Ships From": "Chennai, India"
    },
    "collections": [
      "Vintage & Retro"
    ],
    "occasions": [
      "Birthdays"
    ]
  },
  {
    "id": "gh-pc-1",
    "title": "Pink Edition Collector Puzzle Box",
    "creator": "Meera Reddy",
    "creatorRating": 4.22,
    "creatorReviewCount": 272,
    "creatorBadges": [
      "Top Rated Seller"
    ],
    "verified": false,
    "category": "Gaming & Hobby",
    "subcategory": "Puzzle Collections",
    "price": 2200,
    "buyingMethod": "Buy Now",
    "offersAllowed": true,
    "minimumOfferPercent": 70,
    "image": "/images/6f125dfb748d013c750f962fec969796.jpg",
    "images": [
      "/images/6f125dfb748d013c750f962fec969796.jpg"
    ],
    "description": "This stunning Pink Edition Collector Puzzle Box represents the pinnacle of craftsmanship in the Puzzle Collections category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "specifications": {
      "Piece Count": "1000",
      "Dimensions (assembled)": "70x50 cm",
      "Difficulty": "Advanced",
      "Material": "Cardboard",
      "Age Range": "12+",
      "Ships From": "Chennai, India"
    },
    "collections": [
      "Modern Minimalist"
    ],
    "occasions": [
      "Anniversaries"
    ]
  },
  {
    "id": "gh-pc-2",
    "title": "Not Your Ordinary Jigsaw Set",
    "creator": "Neha Kapoor",
    "creatorRating": 4.14,
    "creatorReviewCount": 118,
    "creatorBadges": [
      "Verified Creator",
      "500+ Sales"
    ],
    "verified": false,
    "category": "Gaming & Hobby",
    "subcategory": "Puzzle Collections",
    "price": 1750,
    "buyingMethod": "Buy Now",
    "offersAllowed": false,
    "minimumOfferPercent": 70,
    "image": "/images/114dba49a0cb6e275f187ab73b4c71f6.webp",
    "images": [
      "/images/114dba49a0cb6e275f187ab73b4c71f6.webp"
    ],
    "description": "This stunning Not Your Ordinary Jigsaw Set represents the pinnacle of craftsmanship in the Puzzle Collections category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "specifications": {
      "Piece Count": "1000",
      "Dimensions (assembled)": "70x50 cm",
      "Difficulty": "Advanced",
      "Material": "Cardboard",
      "Age Range": "12+",
      "Ships From": "Chennai, India"
    },
    "collections": [
      "Traditional Arts"
    ],
    "occasions": [
      "Housewarming"
    ]
  },
  {
    "id": "col-af-0",
    "title": "Batman Action Figure",
    "creator": "Sneha Iyer",
    "creatorRating": 4.73,
    "creatorReviewCount": 155,
    "creatorBadges": [
      "Top Rated Seller",
      "Fast Shipper",
      "Verified Creator"
    ],
    "verified": false,
    "category": "Collectibles",
    "subcategory": "Action Figures",
    "price": 2800,
    "buyingMethod": "Buy Now",
    "offersAllowed": true,
    "minimumOfferPercent": 70,
    "image": "/images/9b2adcf5396176251f6e5686a1760f48.jpg",
    "images": [
      "/images/9b2adcf5396176251f6e5686a1760f48.jpg"
    ],
    "description": "This stunning Batman Action Figure represents the pinnacle of craftsmanship in the Action Figures category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "specifications": {
      "Character/Series": "Hero",
      "Scale": "1/6",
      "Material": "PVC",
      "Articulation Points": "24",
      "Includes Accessories": "Alternate hands, base",
      "Ships From": "Pune, India"
    },
    "collections": [
      "Vintage & Retro"
    ],
    "occasions": [
      "Just Because"
    ]
  },
  {
    "id": "col-af-1",
    "title": "Spider-Man Unique Action Figure",
    "creator": "Priya Patel",
    "creatorRating": 4.38,
    "creatorReviewCount": 90,
    "creatorBadges": [
      "Verified Creator",
      "500+ Sales"
    ],
    "verified": false,
    "category": "Collectibles",
    "subcategory": "Action Figures",
    "price": 3400,
    "buyingMethod": "Auction",
    "auctionEndsAt": "2026-07-07T16:07:17.580Z",
    "offersAllowed": false,
    "minimumOfferPercent": 70,
    "image": "/images/26e31402e0f6f219cb45dfbbaac247bc.jpg",
    "images": [
      "/images/26e31402e0f6f219cb45dfbbaac247bc.jpg"
    ],
    "description": "This stunning Spider-Man Unique Action Figure represents the pinnacle of craftsmanship in the Action Figures category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "specifications": {
      "Character/Series": "Hero",
      "Scale": "1/6",
      "Material": "PVC",
      "Articulation Points": "24",
      "Includes Accessories": "Alternate hands, base",
      "Ships From": "Pune, India"
    },
    "currentBid": 2720,
    "bidCount": 4,
    "collections": [
      "Modern Minimalist"
    ],
    "occasions": [
      "All Occasions"
    ]
  },
  {
    "id": "col-af-2",
    "title": "Spider-Man Listening to Music — Rare Figure",
    "creator": "Rajesh Kumar",
    "creatorRating": 4.92,
    "creatorReviewCount": 43,
    "creatorBadges": [
      "Top Rated Seller",
      "Fast Shipper"
    ],
    "verified": false,
    "category": "Collectibles",
    "subcategory": "Action Figures",
    "price": 4100,
    "buyingMethod": "Auction",
    "auctionEndsAt": "2026-07-07T17:36:28.491Z",
    "offersAllowed": false,
    "minimumOfferPercent": 70,
    "image": "/images/4256f8dcb8f244ba618721219f550054.jpg",
    "images": [
      "/images/4256f8dcb8f244ba618721219f550054.jpg"
    ],
    "description": "This stunning Spider-Man Listening to Music — Rare Figure represents the pinnacle of craftsmanship in the Action Figures category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "specifications": {
      "Character/Series": "Hero",
      "Scale": "1/6",
      "Material": "PVC",
      "Articulation Points": "24",
      "Includes Accessories": "Alternate hands, base",
      "Ships From": "Pune, India"
    },
    "currentBid": 3280,
    "bidCount": 1,
    "collections": [
      "Traditional Arts"
    ],
    "occasions": [
      "Birthdays"
    ]
  },
  {
    "id": "col-fp-0",
    "title": "Spider-Man Rare Funko Pop Set of 4",
    "creator": "Meera Reddy",
    "creatorRating": 4.65,
    "creatorReviewCount": 125,
    "creatorBadges": [
      "Top Rated Seller",
      "Verified Creator",
      "Fast Shipper"
    ],
    "verified": false,
    "category": "Collectibles",
    "subcategory": "Funko Pops",
    "price": 4500,
    "buyingMethod": "Auction",
    "auctionEndsAt": "2026-07-07T19:52:56.813Z",
    "offersAllowed": false,
    "minimumOfferPercent": 70,
    "image": "/images/56f2f37fe6cde13194e0c8795c4b40ae.webp",
    "images": [
      "/images/56f2f37fe6cde13194e0c8795c4b40ae.webp"
    ],
    "description": "This stunning Spider-Man Rare Funko Pop Set of 4 represents the pinnacle of craftsmanship in the Funko Pops category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "specifications": {
      "Character": "Special",
      "Series/Line": "Pop! Vinyl",
      "Height": "4 inches",
      "Material": "Vinyl",
      "Box Condition": "Mint",
      "Limited Edition": "Yes",
      "Ships From": "Kolkata, India"
    },
    "currentBid": 3600,
    "bidCount": 7,
    "collections": [
      "Vintage & Retro"
    ],
    "occasions": [
      "Anniversaries"
    ]
  },
  {
    "id": "col-fp-1",
    "title": "Miranda Priestly Special Edition Funko Pop",
    "creator": "Rohan Sharma",
    "creatorRating": 4.9,
    "creatorReviewCount": 254,
    "creatorBadges": [
      "Top Rated Seller"
    ],
    "verified": false,
    "category": "Collectibles",
    "subcategory": "Funko Pops",
    "price": 1600,
    "buyingMethod": "Buy Now",
    "offersAllowed": true,
    "minimumOfferPercent": 70,
    "image": "/images/9686ec7e50b85ac5696033ccfae67227.webp",
    "images": [
      "/images/9686ec7e50b85ac5696033ccfae67227.webp"
    ],
    "description": "This stunning Miranda Priestly Special Edition Funko Pop represents the pinnacle of craftsmanship in the Funko Pops category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "specifications": {
      "Character": "Special",
      "Series/Line": "Pop! Vinyl",
      "Height": "4 inches",
      "Material": "Vinyl",
      "Box Condition": "Mint",
      "Limited Edition": "Yes",
      "Ships From": "Kolkata, India"
    },
    "collections": [
      "Modern Minimalist"
    ],
    "occasions": [
      "Housewarming"
    ]
  },
  {
    "id": "col-fp-2",
    "title": "Vincent van Gogh Funko Pop",
    "creator": "Suresh Pillai",
    "creatorRating": 4.48,
    "creatorReviewCount": 35,
    "creatorBadges": [
      "Top Rated Seller",
      "Fast Shipper"
    ],
    "verified": false,
    "category": "Collectibles",
    "subcategory": "Funko Pops",
    "price": 1550,
    "buyingMethod": "Buy Now",
    "offersAllowed": false,
    "minimumOfferPercent": 70,
    "image": "/images/dca0a68b8d373d88caafb8802ca64371.webp",
    "images": [
      "/images/dca0a68b8d373d88caafb8802ca64371.webp"
    ],
    "description": "This stunning Vincent van Gogh Funko Pop represents the pinnacle of craftsmanship in the Funko Pops category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "specifications": {
      "Character": "Special",
      "Series/Line": "Pop! Vinyl",
      "Height": "4 inches",
      "Material": "Vinyl",
      "Box Condition": "Mint",
      "Limited Edition": "Yes",
      "Ships From": "Kolkata, India"
    },
    "collections": [
      "Traditional Arts"
    ],
    "occasions": [
      "Just Because"
    ]
  },
  {
    "id": "col-fp-3",
    "title": "Michael Jackson Funko Pop",
    "creator": "Sneha Iyer",
    "creatorRating": 4.65,
    "creatorReviewCount": 172,
    "creatorBadges": [
      "Top Rated Seller"
    ],
    "verified": false,
    "category": "Collectibles",
    "subcategory": "Funko Pops",
    "price": 1900,
    "buyingMethod": "Buy Now",
    "offersAllowed": true,
    "minimumOfferPercent": 70,
    "image": "/images/f8606ecbf401957653aa8e767871efa5.jpg",
    "images": [
      "/images/f8606ecbf401957653aa8e767871efa5.jpg"
    ],
    "description": "This stunning Michael Jackson Funko Pop represents the pinnacle of craftsmanship in the Funko Pops category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "specifications": {
      "Character": "Special",
      "Series/Line": "Pop! Vinyl",
      "Height": "4 inches",
      "Material": "Vinyl",
      "Box Condition": "Mint",
      "Limited Edition": "Yes",
      "Ships From": "Kolkata, India"
    },
    "collections": [
      "Vintage & Retro"
    ],
    "occasions": [
      "All Occasions"
    ]
  },
  {
    "id": "col-hw-0",
    "title": "Datsun 240Z Pink & Blue Twin Pack",
    "creator": "Anjali Gupta",
    "creatorRating": 4.21,
    "creatorReviewCount": 115,
    "creatorBadges": [
      "500+ Sales",
      "Fast Shipper",
      "Trusted Seller"
    ],
    "verified": false,
    "category": "Collectibles",
    "subcategory": "Hot Wheels",
    "price": 1200,
    "buyingMethod": "Buy Now",
    "offersAllowed": true,
    "minimumOfferPercent": 70,
    "image": "/images/59c28005f07f951c988868086560ab2e.jpg",
    "images": [
      "/images/59c28005f07f951c988868086560ab2e.jpg"
    ],
    "description": "This stunning Datsun 240Z Pink & Blue Twin Pack represents the pinnacle of craftsmanship in the Hot Wheels category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "specifications": {
      "Model Name": "Custom",
      "Series": "Collector Edition",
      "Scale": "1:64",
      "Material": "Diecast Metal",
      "Wheel Type": "Real Riders",
      "Box Condition": "Mint",
      "Ships From": "Delhi, India"
    },
    "collections": [
      "Modern Minimalist"
    ],
    "occasions": [
      "Birthdays"
    ]
  },
  {
    "id": "col-hw-1",
    "title": "Rare Blue Hot Wheels Collectible",
    "creator": "Rohan Sharma",
    "creatorRating": 4.86,
    "creatorReviewCount": 95,
    "creatorBadges": [
      "Fast Shipper",
      "Top Rated Seller"
    ],
    "verified": false,
    "category": "Collectibles",
    "subcategory": "Hot Wheels",
    "price": 2100,
    "buyingMethod": "Auction",
    "auctionEndsAt": "2026-07-07T21:49:13.522Z",
    "offersAllowed": false,
    "minimumOfferPercent": 70,
    "image": "/images/586fa4c05a4543d441ec3c2bf877f807.jpg",
    "images": [
      "/images/586fa4c05a4543d441ec3c2bf877f807.jpg"
    ],
    "description": "This stunning Rare Blue Hot Wheels Collectible represents the pinnacle of craftsmanship in the Hot Wheels category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "specifications": {
      "Model Name": "Custom",
      "Series": "Collector Edition",
      "Scale": "1:64",
      "Material": "Diecast Metal",
      "Wheel Type": "Real Riders",
      "Box Condition": "Mint",
      "Ships From": "Delhi, India"
    },
    "currentBid": 1680,
    "bidCount": 13,
    "collections": [
      "Traditional Arts"
    ],
    "occasions": [
      "Anniversaries"
    ]
  },
  {
    "id": "col-hw-2",
    "title": "Fast & Furious Special Edition Hot Wheels",
    "creator": "Arjun Menon",
    "creatorRating": 4.94,
    "creatorReviewCount": 173,
    "creatorBadges": [
      "Verified Creator"
    ],
    "verified": false,
    "category": "Collectibles",
    "subcategory": "Hot Wheels",
    "price": 1450,
    "buyingMethod": "Buy Now",
    "offersAllowed": false,
    "minimumOfferPercent": 70,
    "image": "/images/82984d988affd58d925369d18cfc6474.jpg",
    "images": [
      "/images/82984d988affd58d925369d18cfc6474.jpg"
    ],
    "description": "This stunning Fast & Furious Special Edition Hot Wheels represents the pinnacle of craftsmanship in the Hot Wheels category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "specifications": {
      "Model Name": "Custom",
      "Series": "Collector Edition",
      "Scale": "1:64",
      "Material": "Diecast Metal",
      "Wheel Type": "Real Riders",
      "Box Condition": "Mint",
      "Ships From": "Delhi, India"
    },
    "collections": [
      "Vintage & Retro"
    ],
    "occasions": [
      "Housewarming"
    ]
  },
  {
    "id": "col-hw-3",
    "title": "Formula 1 Special Edition Hot Wheels",
    "creator": "Meera Reddy",
    "creatorRating": 4.12,
    "creatorReviewCount": 296,
    "creatorBadges": [
      "500+ Sales",
      "Trusted Seller"
    ],
    "verified": false,
    "category": "Collectibles",
    "subcategory": "Hot Wheels",
    "price": 1300,
    "buyingMethod": "Buy Now",
    "offersAllowed": true,
    "minimumOfferPercent": 70,
    "image": "/images/bab649350f00266882bb6a4c5d7c9cd0.jpg",
    "images": [
      "/images/bab649350f00266882bb6a4c5d7c9cd0.jpg"
    ],
    "description": "This stunning Formula 1 Special Edition Hot Wheels represents the pinnacle of craftsmanship in the Hot Wheels category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "specifications": {
      "Model Name": "Custom",
      "Series": "Collector Edition",
      "Scale": "1:64",
      "Material": "Diecast Metal",
      "Wheel Type": "Real Riders",
      "Box Condition": "Mint",
      "Ships From": "Delhi, India"
    },
    "collections": [
      "Modern Minimalist"
    ],
    "occasions": [
      "Just Because"
    ]
  },
  {
    "id": "col-hw-4",
    "title": "1999 Treasure Hunt Series Hot Wheels",
    "creator": "Pooja Joshi",
    "creatorRating": 4.77,
    "creatorReviewCount": 182,
    "creatorBadges": [
      "Verified Creator"
    ],
    "verified": false,
    "category": "Collectibles",
    "subcategory": "Hot Wheels",
    "price": 3200,
    "buyingMethod": "Auction",
    "auctionEndsAt": "2026-07-07T23:25:15.493Z",
    "offersAllowed": false,
    "minimumOfferPercent": 70,
    "image": "/images/hw-vintage-corvette.jpg",
    "images": [
      "/images/hw-vintage-corvette.jpg"
    ],
    "description": "This stunning 1999 Treasure Hunt Series Hot Wheels represents the pinnacle of craftsmanship in the Hot Wheels category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "specifications": {
      "Model Name": "Custom",
      "Series": "Collector Edition",
      "Scale": "1:64",
      "Material": "Diecast Metal",
      "Wheel Type": "Real Riders",
      "Box Condition": "Mint",
      "Ships From": "Delhi, India"
    },
    "currentBid": 2560,
    "bidCount": 4,
    "collections": [
      "Traditional Arts"
    ],
    "occasions": [
      "All Occasions"
    ]
  },
  {
    "id": "col-rc-0",
    "title": "Custom Mechanical Keyboard",
    "creator": "Sneha Iyer",
    "creatorRating": 4.97,
    "creatorReviewCount": 408,
    "creatorBadges": [
      "500+ Sales",
      "Fast Shipper",
      "Verified Creator"
    ],
    "verified": false,
    "category": "Collectibles",
    "subcategory": "Rare Collectibles",
    "price": 4900,
    "buyingMethod": "Auction",
    "auctionEndsAt": "2026-07-08T01:32:21.397Z",
    "offersAllowed": false,
    "minimumOfferPercent": 70,
    "image": "/images/da73bc9b03ca4657978e673c794395f8.jpg",
    "images": [
      "/images/da73bc9b03ca4657978e673c794395f8.jpg"
    ],
    "description": "This stunning Custom Mechanical Keyboard represents the pinnacle of craftsmanship in the Rare Collectibles category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "specifications": {
      "Type": "Collectible",
      "Material": "Mixed Media",
      "Dimensions": "Various",
      "Condition": "Excellent",
      "Rarity": "Rare",
      "Ships From": "Mumbai, India"
    },
    "currentBid": 3920,
    "bidCount": 7,
    "collections": [
      "Vintage & Retro"
    ],
    "occasions": [
      "Birthdays"
    ]
  },
  {
    "id": "col-rc-1",
    "title": "Hirono Panda Action Figure",
    "creator": "Sneha Iyer",
    "creatorRating": 4.6,
    "creatorReviewCount": 80,
    "creatorBadges": [
      "500+ Sales",
      "Top Rated Seller"
    ],
    "verified": false,
    "category": "Collectibles",
    "subcategory": "Rare Collectibles",
    "price": 2950,
    "buyingMethod": "Buy Now",
    "offersAllowed": true,
    "minimumOfferPercent": 70,
    "image": "/images/fd65ab6bd2b173fea7adfd27510dd72a.jpg",
    "images": [
      "/images/fd65ab6bd2b173fea7adfd27510dd72a.jpg"
    ],
    "description": "This stunning Hirono Panda Action Figure represents the pinnacle of craftsmanship in the Rare Collectibles category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "specifications": {
      "Type": "Collectible",
      "Material": "Mixed Media",
      "Dimensions": "Various",
      "Condition": "Excellent",
      "Rarity": "Rare",
      "Ships From": "Mumbai, India"
    },
    "collections": [
      "Modern Minimalist"
    ],
    "occasions": [
      "Anniversaries"
    ]
  },
  {
    "id": "col-tc-0",
    "title": "Rare Pokémon Card",
    "creator": "Divya Deshmukh",
    "creatorRating": 4.52,
    "creatorReviewCount": 24,
    "creatorBadges": [
      "500+ Sales",
      "Fast Shipper",
      "Top Rated Seller"
    ],
    "verified": false,
    "category": "Collectibles",
    "subcategory": "Trading Cards",
    "price": 3800,
    "buyingMethod": "Auction",
    "auctionEndsAt": "2026-07-08T03:18:52.722Z",
    "offersAllowed": false,
    "minimumOfferPercent": 70,
    "image": "/images/3e509945098af056b376472bd2b9c91c.webp",
    "images": [
      "/images/3e509945098af056b376472bd2b9c91c.webp"
    ],
    "description": "This stunning Rare Pokémon Card represents the pinnacle of craftsmanship in the Trading Cards category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "specifications": {
      "Card Name": "Special Card",
      "Set/Series": "Base Set",
      "Condition": "Near Mint",
      "Holographic": "Yes",
      "Ships From": "Bangalore, India"
    },
    "currentBid": 3040,
    "bidCount": 4,
    "collections": [
      "Traditional Arts"
    ],
    "occasions": [
      "Housewarming"
    ]
  },
  {
    "id": "col-tc-1",
    "title": "Unique Sabrina Carpenter Trading Card",
    "creator": "Rajesh Kumar",
    "creatorRating": 4.99,
    "creatorReviewCount": 298,
    "creatorBadges": [
      "Fast Shipper"
    ],
    "verified": false,
    "category": "Collectibles",
    "subcategory": "Trading Cards",
    "price": 1100,
    "buyingMethod": "Buy Now",
    "offersAllowed": true,
    "minimumOfferPercent": 70,
    "image": "/images/4435fad5eacdcf934b4135a6709074ed.jpg",
    "images": [
      "/images/4435fad5eacdcf934b4135a6709074ed.jpg"
    ],
    "description": "This stunning Unique Sabrina Carpenter Trading Card represents the pinnacle of craftsmanship in the Trading Cards category. Its design captures the eye immediately, standing out as a truly unique and special piece that commands attention. The details are intricate and visually appealing, making it a proud addition to any collection.\n\nMeticulously crafted using premium, ethically sourced materials, this item guarantees both durability and aesthetic charm. To maintain its pristine condition, simply wipe it with a soft cloth and keep it away from direct sunlight. Whether you are an avid collector or searching for that perfect, unforgettable gift, this piece offers unmatched appeal.",
    "specifications": {
      "Card Name": "Special Card",
      "Set/Series": "Base Set",
      "Condition": "Near Mint",
      "Holographic": "Yes",
      "Ships From": "Bangalore, India"
    },
    "collections": [
      "Vintage & Retro"
    ],
    "occasions": [
      "Just Because"
    ]
  }
];

const prefixMap = {
  'exp': 10000,
  'art': 20000,
  'hc': 30000,
  'ls': 40000,
  'gh': 50000,
  'col': 60000
};

function getNumericId(stringId) {
  if (!stringId) return Math.floor(Math.random() * 10000);
  const parts = stringId.split('-');
  if (parts.length < 2) return Math.floor(Math.random() * 10000);
  const prefix = parts[0];
  const numStr = parts[parts.length - 1];
  let num = parseInt(numStr, 10);
  if (isNaN(num)) num = Math.floor(Math.random() * 10000);
  
  let hash = 0;
  for (let i=0; i<stringId.length; i++) {
    hash = ((hash << 5) - hash) + stringId.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % 2000000000;
}

async function seedListings() {
  let count = 0;
  for (const product of products) {
    try {
      const numericId = getNumericId(product.id);
      
      let listingType = 'BUY_NOW';
      if (product.buyingMethod === 'Auction') listingType = 'AUCTION';
      if (product.buyingMethod === 'Negotiable') listingType = 'NEGOTIABLE';

      await db.query(`
        INSERT INTO listings (
          id, title, description, price, category, subcategory,
          buying_method, image_urls, seller_id, creator_name,
          creator_rating, creator_review_count, creator_badges,
          is_verified, offers_allowed, minimum_offer_percent,
          new_arrival, collections, occasions,
          auction_ends_at, current_bid, bid_count,
          specifications, reviews, status, created_at, updated_at,
          photos, listing_type, condition, category_id, slug
        ) VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
          $11,$12,$13,$14,$15,$16,$17,$18,$19,
          $20,$21,$22,$23,$24,'active',NOW(),NOW(),
          $25,$26,$27,$28,$29
        )
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          description = EXCLUDED.description,
          price = EXCLUDED.price,
          category = EXCLUDED.category,
          subcategory = EXCLUDED.subcategory,
          buying_method = EXCLUDED.buying_method,
          image_urls = EXCLUDED.image_urls,
          creator_name = EXCLUDED.creator_name,
          creator_rating = EXCLUDED.creator_rating,
          creator_review_count = EXCLUDED.creator_review_count,
          creator_badges = EXCLUDED.creator_badges,
          is_verified = EXCLUDED.is_verified,
          offers_allowed = EXCLUDED.offers_allowed,
          auction_ends_at = EXCLUDED.auction_ends_at,
          current_bid = EXCLUDED.current_bid,
          bid_count = EXCLUDED.bid_count,
          specifications = EXCLUDED.specifications,
          reviews = EXCLUDED.reviews,
          photos = EXCLUDED.photos,
          listing_type = EXCLUDED.listing_type,
          updated_at = NOW()
      `, [
        numericId,
        product.title,
        product.description || '',
        product.price || 0,
        product.category || 'Other',
        product.subcategory || '',
        product.buyingMethod || 'Buy Now',
        product.images || (product.image ? [product.image] : []),
        999999,
        product.creator || 'Unknown',
        product.creatorRating || 4.5,
        product.creatorReviewCount || 50,
        product.creatorBadges || [],
        product.verified || false,
        product.offersAllowed || false,
        product.minimumOfferPercent || 70,
        product.newArrival || false,
        product.collections || [],
        product.occasions || [],
        product.auctionEndsAt ? new Date(product.auctionEndsAt) : null,
        product.currentBid || null,
        product.bidCount || 0,
        JSON.stringify(product.specifications || {}),
        JSON.stringify(product.reviews || []),
        JSON.stringify(product.images || (product.image ? [product.image] : [])), // photos
        listingType, // listing_type
        'New', // condition
        1, // category_id
        product.id // slug (mapped back to string ID so frontend might use it!)
      ]);
      console.log(`Seeded: ${product.id} (mapped to ${numericId}) — ${product.title}`);
      count++;
    } catch (e) {
      console.error(`Failed to seed ${product.id}:`);
      console.error(e);
    }
  }
  console.log(`Seed complete. ${count} listings inserted/updated.`);
  process.exit(0);
}

seedListings();
