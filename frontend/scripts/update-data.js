const fs = require('fs');

const subcatMap = {
  "Digital Art": "Digital Art & Illustrations",
  "Illustrations": "Digital Art & Illustrations",
  "Coins": "Rare Collectibles",
  "Stamps": "Rare Collectibles",
  "LEGO Collectibles": "Rare Collectibles",
  "Gaming Merchandise": "Board Games",
  "Model Kits": "Anime Merchandise",
  "Trading Card Games": "Board Games",
  "Handmade Decor": "Crochet & Knitting",
  "DIY Creations": "Paper Crafts",
  "Keychains": "Stationery",
  "Personalized Gifts": "Stationery"
};

const specificCorrections = {
  'exp-002': { title: "Crochet Flower Pot Cover", subcategory: "Crochet & Knitting", category: "Handmade & Crafts", description: "Crochet flower pot — this listing belongs to Handmade & Crafts, not Art; move it. Handcrafted with traditional crochet techniques to perfectly fit and enhance your potted plants. Ships securely from local artisan." },
  'art-001': { title: "Lord Ganesha — Intricate Ink Study", subcategory: "Sketches & Drawings", description: "Traditional ink drawing of Lord Ganesha with fine detailing. This intricate study captures the essence of the deity with masterful strokes. A perfect addition to any traditional or spiritual collection." },
  'art-002': { title: "Pink & White Florals", subcategory: "Paintings", description: "Painting of pink and white flowers. This vibrant piece brings a gentle touch of nature indoors with delicate brushwork. A beautiful focal point for a living space." },
  'art-003': { title: "The Eye — Abstract Portrait", subcategory: "Paintings", description: "Bold abstract painting centered on a human eye. The intense, contrasting colors draw the viewer in immediately and evoke deep thought. A striking contemporary piece for a modern aesthetic." },
  'art-004': { title: "Hibiscus in Bloom", subcategory: "Paintings", description: "Painting of a hibiscus flower. The vibrant red petals are captured in exquisite detail, showing the natural beauty of the tropics. A beautiful addition to your floral decor." },
  'art-005': { title: "Candlelight", subcategory: "Paintings", description: "Painting featuring a lit candle. The warm, flickering glow creates a cozy and intimate atmosphere that feels incredibly lifelike. A perfect calming piece for a quiet study or bedroom." },
  'art-006': { title: "En Pointe & Fighting Back", subcategory: "Paintings", description: "Painting of a girl in ballet outfit and boxing stance. It beautifully captures the powerful contrast between grace, discipline, and fierce strength. A highly evocative and empowering piece of art." },
  'art-007': { title: "Floral Reverie", subcategory: "Paintings", description: "Painting of flowers. A dreamy composition featuring soft, blended pastel tones that create a peaceful mood. Perfect for adding a gentle touch of tranquility to any room." },
  'art-008': { title: "Noir Cinema", subcategory: "Paintings", description: "Painting of a cinema hall showing a black-and-white film to an audience. It evokes a strong sense of nostalgia and classic cinematic storytelling. A great atmospheric piece for film enthusiasts." },
  'art-009': { title: "The Tiger", subcategory: "Paintings", description: "Painting of a tiger. This majestic piece captures the raw power and piercing gaze of the big cat in its natural element. A bold and striking statement for any wildlife lover." },
  'art-014': { title: "Palace Stairway — Charcoal Study", subcategory: "Sketches & Drawings", description: "Charcoal drawing of a palace interior with a grand staircase. The dramatic lighting and deep shadows give it an imposing, historical feel. A masterful architectural study for classic spaces." },
  'art-015': { title: "Metro Station", subcategory: "Digital Art & Illustrations", description: "Digital art of a metro/subway station. The piece captures the quiet, contemplative solitude of urban transit in a modern style. An excellent addition to a contemporary collection." },
  'art-016': { title: "Mandala Study", subcategory: "Sketches & Drawings", description: "Mandala art drawing. The highly detailed geometric patterns and symmetrical design offer a mesmerizing viewing experience. Perfect for a meditation space or calm corner." },
  'art-017': { title: "Abstract Digital Composition", subcategory: "Digital Art & Illustrations", description: "Abstract digital art piece. The fluid, intersecting shapes and vivid colors create a dynamic sense of perpetual motion. A truly modern aesthetic choice for creative minds." },
  'art-020': { title: "City Life", subcategory: "Digital Art & Illustrations", description: "Digital art depicting city life. A vibrant portrayal of a bustling urban environment filled with diverse activity. Perfect for those who love the energy of the metropolis." },
  'art-022': { title: "Spider-Man — Illustrated", subcategory: "Digital Art & Illustrations", description: "Spider-Man illustration. This dynamic artwork showcases the beloved superhero swinging into action with stylized flair. A must-have centerpiece for any comic book fan." },
  'art-023': { title: "Stranger Things — Poster Art", subcategory: "Prints & Posters", description: "Stranger Things fan poster. This stylized print captures the eerie, nostalgic 80s atmosphere of the hit sci-fi show. A fantastic conversation piece for fans and collectors." },
  'art-024': { title: "Titanic — Iconic Poster", subcategory: "Prints & Posters", description: "Titanic movie poster. A beautiful and dramatic tribute to the classic romance and tragedy of the iconic film. A must-have piece of cinematic history for your wall." },
  'art-025': { title: "Spider-Man — Movie Poster", subcategory: "Prints & Posters", description: "Spider-Man movie poster. This classic poster celebrates the epic cinematic adventures of the famous web-slinger. Perfect for a home theater room or entertainment space." },
  'art-026': { title: "Friends — Series Poster", subcategory: "Prints & Posters", description: "Friends TV series poster. Celebrate the beloved 90s sitcom with this nostalgic, high-quality print featuring iconic imagery. A great gift for any avid fan of the show." },
  
  'exp-014': { title: "Customised Birthday Candle", subcategory: "Home Decor", description: "Custom birthday gift candle. Hand-poured with premium wax and a delightful, long-lasting scent. A perfect personalized gift to celebrate someone's special day." },
  'exp-015': { title: "Anniversary Crochet Bouquet", subcategory: "Crochet & Knitting", category: "Handmade & Crafts", description: "Crochet flower bouquet, anniversary themed. Handcrafted with care and premium yarn to serve as a lasting symbol of love. A unique and charming gift for significant milestones." },
  'exp-016': { title: "Designer Wall Clock", subcategory: "Home Decor", description: "Designer wall clock. Featuring a modern, minimalist design that fits seamlessly into any contemporary room decor. Reliable quartz movement ensures completely accurate timekeeping." },
  'exp-017': { title: "Crochet Camera Keychain", subcategory: "Stationery", description: "Crochet camera keychain. A cute, meticulously handcrafted accessory designed especially for photography enthusiasts. Attaches easily and securely to bags, backpacks, or keys." },
  'exp-018': { title: "Set of 4 Occasion Earrings", subcategory: "Jewellery & Accessories", description: "Set of 4 earrings for all occasions. Each pair is beautifully crafted with elegant detailing and high-quality finishes. A versatile and essential addition to your daily jewelry box." },
  'ls-hd-0': { title: "Soft Floral Cushion", subcategory: "Home Decor", description: "Soft flower-shaped pillow/cushion. Extremely plush, filled with premium materials, and perfect for adding a cozy touch to a couch or bed. Available in lovely, complementary pastel tones." },
  'ls-hd-2': { title: "Chess Set Wall Storage", subcategory: "Home Decor", description: "Chess set repurposed as a hanging wall storage piece. A highly creative, artistic, and functional way to organize small items. Perfect for board game lovers looking for unique decor." },
  'ls-hd-3': { title: "Glass Bottle with Glasswork", subcategory: "Home Decor", description: "Beautiful decorated glass bottle with coloured glass work. The intricate, colorful details catch and reflect the light beautifully. A stunning decorative accent for shelves or windowsills." },
  'ls-hd-4': { title: "Sculptural Home Décor Piece", subcategory: "Home Decor", description: "Decorative sculpture piece for home. Its modern, fluid design brings a sophisticated and artistic touch to any surface. Carefully crafted from high-quality materials for longevity." },
  'ls-hd-5': { title: "Custom Sword Wall Hanging", subcategory: "Home Decor", description: "Decorative sword piece designed for wall display. Intricately detailed and painted to look like an authentic historical artifact. A bold and impressive statement piece for any room." },
  'ls-ja-0': { title: "Gold Arm Cuff", subcategory: "Jewellery & Accessories", description: "Bold gold arm cuff. Its striking, geometric design effortlessly adds a touch of glamour to any outfit. Hand-finished for a premium shine that resists tarnishing." },
  'ls-ja-1': { title: "Crochet Case Cover", subcategory: "Stationery", description: "Crochet phone/item case cover in green and cream. Carefully handcrafted with soft yarn to provide a snug fit and charming look. Offers gentle protection from scratches for your belongings." },
  'ls-ja-4': { title: "Shell Jewellery Stand", subcategory: "Home Decor", description: "Custom shell-themed jewellery display stand. Keep your favorite pieces organized in style with this ocean-inspired design. A beautiful and practical addition to a vanity or dresser." },
  'ls-ja-5': { title: "Set of 3 Cute Rings", subcategory: "Jewellery & Accessories", description: "Set of 3 dainty rings. Delicate and beautifully detailed with minimalist designs perfect for everyday wear. Mix, match, and stack them to perfectly suit your personal style." },
  'ls-mn-0': { title: "Miniature Pottery Set with Florals", subcategory: "Miniatures", description: "Miniature pottery pieces with small flowers. Perfectly scaled and delicately crafted for passionate collectors. A charming and intricate addition to any existing miniature display." },
  'ls-mn-1': { title: "Wooden Miniature House", subcategory: "Miniatures", description: "Rare detailed wooden miniature house interior. Every tiny piece of furniture is crafted with remarkable, lifelike precision. A delightful and highly sought-after collectible for enthusiasts." },
  'ls-mn-2': { title: "Miniature Food Platter Magnet", subcategory: "Miniatures", description: "Miniature food platter designed as a fridge magnet. Incredibly detailed and delightfully realistic, down to the smallest crumb. A fun, whimsical, and unique kitchen accessory." },
  'ls-st-0': { title: "Set of 25 Posca Markers", subcategory: "Stationery", description: "Posca marker set, 25 colours. High-quality paint markers perfect for professional illustration, journaling, and crafting. Features a vibrant, opaque finish on almost any surface." },
  'ls-st-1': { title: "Custom Pen, Paper & Sticky Notes Gift Set", subcategory: "Stationery", description: "Curated stationery gift set. Includes high-quality textured paper, a custom ergonomic pen, and matching sticky notes. Perfect for the organized creative or as a thoughtful gift." },
  'ls-st-2': { title: "Big Sticker Pack", subcategory: "Stationery", description: "Large assorted sticker packet. A fun, diverse collection of artistic designs for customizing laptops, notebooks, and more. Highly durable, water-resistant, and easily adhesive." },
  'ls-st-3': { title: "Blue Pen with Pink Bow", subcategory: "Stationery", description: "Blue pen in pink with decorative pink bow. A cute, quirky, and stylish writing instrument for your desk. Writes smoothly with rich blue ink for everyday note-taking." }
};

function processFile(filename, isExplore) {
  let content = fs.readFileSync(filename, 'utf8');
  let match = content.match(/export const \w+: Product\[\] = (\[[\s\S]*?\]);/);
  if (!match) {
    console.error("Could not find array in " + filename);
    return null;
  }
  let arrayStr = match[1];
  if (isExplore) {
     arrayStr = arrayStr.replace(/,\s*\.\.\.lifestyleProducts/, '');
  }
  let array = eval('(' + arrayStr + ')');
  return { array, content, match: match[0], isExplore };
}

let seenIds = new Set();
let seenImageCat = new Set();
let deletedIds = [];
let reassignments = [];
let corrections = [];

function applyUpdates(arr) {
  // First pass: group by image+category
  let groups = new Map();
  for (let p of arr) {
    if (p.id === 'ls-hd-1') continue;
    let key = p.image + "||" + p.category;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(p);
  }
  
  let keepIds = new Set();
  for (let [key, group] of groups) {
    let toKeep = group[0];
    for (let p of group) {
      if (specificCorrections[p.id]) {
        toKeep = p;
        break;
      }
    }
    keepIds.add(toKeep.id);
    for (let p of group) {
      if (p.id !== toKeep.id) deletedIds.push(p.id);
    }
  }

  let newArr = [];
  for (let p of arr) {
    if (p.id === 'ls-hd-1') {
      deletedIds.push(p.id);
      continue;
    }
    if (!keepIds.has(p.id)) {
      continue;
    }
    if (seenIds.has(p.id)) {
      deletedIds.push(p.id);
      continue;
    }
    seenIds.add(p.id);
    
    let oldTitle = p.title;
    if (specificCorrections[p.id]) {
      let sc = specificCorrections[p.id];
      p.title = sc.title;
      p.description = sc.description;
      
      let oldCat = p.category;
      let oldSub = p.subcategory;
      if (sc.category) p.category = sc.category;
      p.subcategory = sc.subcategory;
      
      corrections.push(`${p.id} | ${oldTitle} | ${p.title} | ${p.subcategory}`);
      if (oldCat !== p.category || oldSub !== p.subcategory) {
        reassignments.push(`${p.id} | ${oldCat}/${oldSub} | ${p.category}/${p.subcategory}`);
      }
    } else {
      let oldSub = p.subcategory;
      if (subcatMap[p.subcategory]) {
        p.subcategory = subcatMap[p.subcategory];
        reassignments.push(`${p.id} | ${p.category}/${oldSub} | ${p.category}/${p.subcategory}`);
      }
    }
    newArr.push(p);
  }
  return newArr;
}

function formatArray(arr, isExplore) {
  let str = "[\n";
  for (let [i, p] of arr.entries()) {
    str += "  {\n";
    for (let key in p) {
      let val = p[key];
      if (typeof val === 'string') {
        val = JSON.stringify(val);
      } else if (Array.isArray(val)) {
        val = JSON.stringify(val, null, 2).replace(/\n/g, '\n    ');
      } else if (typeof val === 'object') {
        val = JSON.stringify(val, null, 2).replace(/\n/g, '\n    ');
      }
      str += `    "${key}": ${val},\n`;
    }
    str = str.replace(/,\n$/, "\n");
    str += "  }" + (i < arr.length - 1 ? "," : "") + "\n";
  }
  
  if (isExplore) {
    str = str.replace(/\n$/, ",\n  ...lifestyleProducts\n");
  }
  str += "]";
  return str;
}

const lsFile = 'c:/Bidcraft/frontend/lib/lifestyleProducts.ts';
const exFile = 'c:/Bidcraft/frontend/lib/exploreProducts.ts';

let lsData = processFile(lsFile, false);
let exData = processFile(exFile, true);

let newLsArr = applyUpdates(lsData.array);
let newExArr = applyUpdates(exData.array);

let newLsStr = `export const lifestyleProducts: Product[] = ${formatArray(newLsArr, false)};`;
let newExStr = `export const exploreProducts: Product[] = ${formatArray(newExArr, true)};`;

fs.writeFileSync(lsFile, lsData.content.replace(lsData.match, newLsStr));
fs.writeFileSync(exFile, exData.content.replace(exData.match, newExStr));

console.log("Deleted IDs:", deletedIds);
console.log("Corrections:", corrections);
console.log("Reassignments:", reassignments);
