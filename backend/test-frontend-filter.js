const fs = require('fs');

async function testFrontendFilter() {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/listings?limit=200');
    const data = await res.json();
    const initialListings = data.listings;
    console.log('API returned', initialListings.length, 'listings.');

    // Simulating no filters:
    const searchQuery = null;
    const categoriesParam = [];
    const subcategoriesParam = [];
    const methodsParam = [];
    const typeParam = null;
    const collectionParam = null;
    const occasionParam = null;
    const priceMinParam = 50;
    const priceMaxParam = 5000;

    const filteredProducts = initialListings.filter(p => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        if (!p.title.toLowerCase().includes(query) && !(p.description && p.description.toLowerCase().includes(query))) {
          return false
        }
      }
      if (categoriesParam.length > 0) {
        if (!categoriesParam.includes(p.category)) return false; // simplified slugify
      }
      if (subcategoriesParam.length > 0) {
        if (!p.subcategory || !subcategoriesParam.includes(p.subcategory)) return false;
      }
      if (methodsParam.length > 0) {
        if (!methodsParam.includes(p.buyingMethod)) return false;
      }
      if (typeParam === 'new-arrivals') {
        if (!p.newArrival) return false;
      } else if (typeParam === 'auction') {
        if (p.buyingMethod !== 'Auction') return false;
      }
      if (collectionParam) {
        if (!p.collections || !p.collections.includes(collectionParam)) return false;
      }
      if (occasionParam) {
        if (!p.occasions || !p.occasions.includes(occasionParam)) return false;
      }
      if (p.price < priceMinParam) return false
      if (priceMaxParam < 5000 && p.price > priceMaxParam) return false

      return true
    });

    console.log('Filtered on frontend:', filteredProducts.length);
    
    if (filteredProducts.length < initialListings.length) {
      const missing = initialListings.filter(p => !filteredProducts.some(fp => fp.id === p.id));
      console.log('Missing listings:');
      missing.forEach(m => console.log(`${m.id} | ${m.title} | Price: ${m.price}`));
    }
  } catch(err) {
    console.error(err);
  }
}

testFrontendFilter();
