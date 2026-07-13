const fs = require('fs');

const datePlus = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
};

const homeDecor = [
  { img: '7caa33bf8eca070ee8a1dd20f86723ec.webp', title: 'Handwoven Macrame Wall Hanging', price: 1200, buy: 'Buy Now', offers: true },
  { img: '27c1a7020f1f1ae13757444e6e302582.jpg', title: 'Vintage Brass Table Lamp', price: 3500, buy: 'Auction', currentBid: 3600, bidCount: 4, endsIn: 3 },
  { img: 'a5f4ca975a91906c04d6f284ddb53aca.jpg', title: 'Hand-painted Ceramic Vase', price: 900, buy: 'Buy Now', offers: false },
  { img: 'b2577665a29cbe1b2263e4c0b1a4ee29.webp', title: 'Boho Cushion Cover Set', price: 650, buy: 'Buy Now', offers: true },
  { img: 'c3f27a4077f7d8474444c2c129199224.webp', title: 'Wooden Minimalist Clock', price: 1800, buy: 'Auction', currentBid: 1850, bidCount: 2, endsIn: 7 },
  { img: 'e2174f2cb5f931e40766c959c4adc809.jpg', title: 'Terracotta Decorative Bowl', price: 450, buy: 'Buy Now', offers: false }
];

const jewellery = [
  { img: '1f986eedcf59a21d3352b5cc6bee2244.jpg', title: 'Silver Filigree Earrings', price: 850, buy: 'Buy Now', offers: true },
  { img: '5cf84872e9e0ed2dcee303bf9e245b28.jpg', title: 'Oxidized Tribal Necklace', price: 1100, buy: 'Auction', currentBid: 1200, bidCount: 3, endsIn: 1 },
  { img: '7f69e85a737d75f85a041d457c9be525.jpg', title: 'Handcrafted Beaded Bracelet', price: 300, buy: 'Buy Now', offers: false },
  { img: '417caba42ec36fd9ba441b33afd74e7c.jpg', title: 'Gold-Plated Minimalist Ring', price: 500, buy: 'Buy Now', offers: true },
  { img: '454b1c36b55a7aac07a46dec81f95a6f.jpg', title: 'Enamel Floral Pendant', price: 750, buy: 'Buy Now', offers: false },
  { img: '629babcd420c53e76b891e70f45966ee.jpg', title: 'Kundan Inspired Choker', price: 2500, buy: 'Auction', currentBid: 2800, bidCount: 6, endsIn: 3 }
];

const miniatures = [
  { img: '2057d7b98e01e6d4671c8652e542bfbb.jpg', title: 'Miniature Wooden Chai Stall', price: 1500, buy: 'Auction', currentBid: 1600, bidCount: 5, endsIn: 1 },
  { img: '9780ce408b0eeacb2b478b53e49472f3.webp', title: 'Clay Miniature Pots Set', price: 400, buy: 'Buy Now', offers: true },
  { img: 'f8e8c93f83911972060b57d5784893b9.jpg', title: 'Hand-painted Mini Auto Rickshaw', price: 800, buy: 'Buy Now', offers: false }
];

const stationery = [
  { img: '85bd73f4fa6dc704d1d19c276fba84a2.jpg', title: 'Handbound Leather Journal', price: 950, buy: 'Buy Now', offers: true },
  { img: 'cd653367e75f8af84fb565e77b4fc97f.webp', title: 'Block Printed Notebook', price: 350, buy: 'Buy Now', offers: false },
  { img: 'd8bb9900ecc6dd3dd2c62d723203a2c3.webp', title: 'Handmade Cotton Paper Set', price: 600, buy: 'Auction', currentBid: 650, bidCount: 2, endsIn: 7 },
  { img: 'fbc8d0c72ddf94d0a150ce1e24f19382.jpg', title: 'Brass Vintage Bookmark', price: 250, buy: 'Buy Now', offers: false }
];

const allData = [
  ...homeDecor.map((x, i) => ({ ...x, sub: 'Home Decor', id: `ls-hd-${i}` })),
  ...jewellery.map((x, i) => ({ ...x, sub: 'Jewellery & Accessories', id: `ls-ja-${i}` })),
  ...miniatures.map((x, i) => ({ ...x, sub: 'Miniatures', id: `ls-mn-${i}` })),
  ...stationery.map((x, i) => ({ ...x, sub: 'Stationery', id: `ls-st-${i}` }))
];

const creators = ["Aarav Crafts", "Diya Designs", "Meera Arts", "Kavya Studios", "Rohan Creations", "Sneha Handmades", "Neha Curations", "Aditya Collections", "Vanya Boutique", "Priya Elements"];
let creatorIdx = 0;

const products = allData.map(item => {
  const p = {
    id: item.id,
    title: item.title,
    creator: creators[creatorIdx % creators.length],
    creatorRating: 4.1 + (creatorIdx % 10) * 0.1,
    creatorReviewCount: 20 + creatorIdx * 25,
    creatorBadges: creatorIdx % 3 === 0 ? ["Top Rated Seller", "Fast Shipper"] : ["Verified Creator"],
    verified: creatorIdx === 0 || creatorIdx === 5,
    category: "Lifestyle & Gifts",
    subcategory: item.sub,
    price: item.price,
    buyingMethod: item.buy,
    offersAllowed: item.offers || false,
    minimumOfferPercent: 70,
    image: `/images/${item.img}`,
    images: Array(6).fill(`/images/${item.img}`),
    description: `This exquisite ${item.title} brings a touch of handcrafted elegance to your life. Carefully sourced and produced with the highest attention to detail, it stands out as a unique lifestyle piece. The materials used are sustainable and locally procured, ensuring a lower carbon footprint. Whether as a gift or a personal treat, its distinct character makes it truly special. We recommend gentle care to maintain its pristine condition for years to come.`,
    specifications: item.sub === 'Home Decor' ? { Dimensions: "30 cm x 20 cm", Material: "Mixed", Finish: "Matte", Weight: "500g", "Care Instructions": "Wipe with dry cloth", "Ships From": "Jaipur" } :
                   item.sub === 'Jewellery & Accessories' ? { "Metal/Material": "Silver/Brass", "Stone/Embellishment": "None", "Clasp Type": "Lobster", Dimensions: "Adjustable", Weight: "15g", Finish: "Polished", "Ships From": "Delhi" } :
                   item.sub === 'Miniatures' ? { Scale: "1:12", Dimensions: "5 cm x 5 cm", Material: "Clay/Wood", Finish: "Painted", "Display Base": "Yes", "Ships From": "Pune" } :
                   { "Sheet Count / Pages": "100", "Paper Weight (gsm)": "120 gsm", "Cover Material": "Leather/Paper", Dimensions: "A5", "Ruling Type": "Unruled", "Ships From": "Mumbai" }
  };
  creatorIdx++;
  
  if (item.buy === 'Auction') {
    p.currentBid = item.currentBid;
    p.bidCount = item.bidCount;
    p.auctionEndsAt = datePlus(item.endsIn);
  }
  
  return p;
});

const fileContent = `import { Product } from "./exploreProducts";

export const lifestyleProducts: Product[] = ${JSON.stringify(products, null, 2)};
`;

fs.writeFileSync('c:/Bidcraft/frontend/lib/lifestyleProducts.ts', fileContent);
