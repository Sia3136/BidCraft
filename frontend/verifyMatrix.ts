import { fetchListings } from './lib/api';
import { CATEGORIES } from './lib/categories';
import { slugify } from './lib/slugify';

async function testAllRoutes() {
  let passed = 0;
  let failed = 0;
  
  for (const cat of CATEGORIES) {
    for (const sub of cat.subcategories) {
      // Simulate app/explore/page.tsx behavior
      const qsParams: any = { limit: 24, offset: 0 };
      qsParams.category = cat.name; // resolved slug
      qsParams.subcategory = sub;   // resolved slug
      
      try {
        const data = await fetchListings(qsParams);
        
        // Also simulate ClientExplore filtering logic
        const catSlug = slugify(cat.name);
        const subSlug = slugify(sub);
        
        const filtered = data.listings.filter(p => {
          if (slugify(p.category) !== catSlug) return false;
          if (!p.subcategory || slugify(p.subcategory) !== subSlug) return false;
          return true;
        });
        
        if (data.listings.length === 0) {
          console.log(`⚠️ Empty: ${cat.name} -> ${sub}`);
          passed++;
        } else if (filtered.length === data.listings.length) {
          console.log(`✅ Passed: ${cat.name} -> ${sub} (${data.listings.length} items)`);
          passed++;
        } else {
          console.log(`❌ Failed Client Filter: ${cat.name} -> ${sub} (API returned ${data.listings.length}, but client kept ${filtered.length})`);
          failed++;
        }
      } catch (err: any) {
        console.log(`❌ Failed API: ${cat.name} -> ${sub} - ${err.message}`);
        failed++;
      }
    }
  }
  
  console.log(`\nResults: ${passed} Passed, ${failed} Failed`);
}

testAllRoutes();
