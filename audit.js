const http = require('http');

function slugify(s) {
  if (!s) return '';
  return s.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
}

const CATEGORIES = [
  {
    name: "Art",
    subcategories: ["Digital Art & Illustrations", "Paintings", "Prints & Posters", "Sculptures", "Sketches & Drawings"]
  },
  {
    name: "Collectibles",
    subcategories: ["Action Figures", "Funko Pops", "Hot Wheels", "Rare Collectibles", "Trading Cards"]
  },
  {
    name: "Gaming & Hobby",
    subcategories: ["Anime Merchandise", "Board Games", "Cosplay Props", "Puzzle Collections"]
  },
  {
    name: "Handmade & Crafts",
    subcategories: ["Clay & Pottery", "Candles & Soaps", "Crochet & Knitting", "Paper Crafts", "Resin Arts"]
  },
  {
    name: "Lifestyle & Gifts",
    subcategories: ["Home Decor", "Jewellery & Accessories", "Miniatures", "Stationery"]
  }
];

function resolveDisplayTitle(slug) {
  if (!slug) return null;
  for (const cat of CATEGORIES) {
    for (const sub of cat.subcategories) {
      if (slugify(sub) === slug) return sub;
    }
    if (slugify(cat.name) === slug) return cat.name;
  }
  return null;
}

async function fetchListings(catSlug, subSlug) {
  return new Promise((resolve, reject) => {
    const catResolved = resolveDisplayTitle(catSlug) || catSlug;
    const subResolved = resolveDisplayTitle(subSlug) || subSlug;

    const url = `http://localhost:8000/api/listings?category=${encodeURIComponent(catResolved)}&subcategory=${encodeURIComponent(subResolved)}`;
    
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({
            apiSent: url,
            backendParams: `category=${catResolved}&subcategory=${subResolved}`,
            count: parsed.listings ? parsed.listings.length : 0,
            status: res.statusCode,
            error: parsed.error
          });
        } catch (e) {
          resolve({ apiSent: url, error: 'JSON Parse Error: ' + data });
        }
      });
    }).on('error', err => resolve({ error: err.message }));
  });
}

async function runAudit() {
  console.log("| Category | Subcategory | Generated URL | URL After Slug Res | API Request | Backend Params | Listings | Pass/Fail | Cause |");
  console.log("|---|---|---|---|---|---|---|---|---|");

  for (const cat of CATEGORIES) {
    for (const sub of cat.subcategories) {
      const catSlug = slugify(cat.name);
      const subSlug = slugify(sub);
      
      const generatedUrl = `/explore?category=${catSlug}&subcategory=${subSlug}`;
      const urlAfterRes = `category=${resolveDisplayTitle(catSlug)}&subcategory=${resolveDisplayTitle(subSlug)}`;
      
      const res = await fetchListings(catSlug, subSlug);
      
      const isSuccess = res.status === 200 && !res.error;
      const passFail = isSuccess ? "Pass" : "Fail";
      const cause = isSuccess ? "-" : res.error;

      console.log(`| ${cat.name} | ${sub} | ${generatedUrl} | ${urlAfterRes} | ${res.apiSent} | ${res.backendParams} | ${res.count} | ${passFail} | ${cause} |`);
    }
  }
}

runAudit();
