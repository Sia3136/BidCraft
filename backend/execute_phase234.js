const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://neondb_owner:npg_puatjTPoH93y@ep-aged-bread-aodxmn99.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require' });

async function run() {
  await client.connect();

  console.log("--- PHASE 3: FIX NEW LISTING QUALITY ---");

  const newListings = [
    { title: 'Stranger Things Digital Art', type: 'Buy Now', sellerIdx: 0,
      desc: "A vibrant digital artwork inspired by the iconic Stranger Things universe, capturing the eerie yet nostalgic world of Hawkins with rich colour gradients and intricate detail. The piece blends retro 80s aesthetics with supernatural elements, making it instantly recognisable to fans of the series.\n\nPerfect for collectors, superfans, or anyone who wants a statement piece for their room or workspace. Delivered as a high-resolution digital file ready for printing at any size.",
      specs: { "Type": "Digital Artwork", "File Format": "JPG + PNG (high-res)", "Resolution": "300 DPI", "Print Size": "Up to A2", "Style": "Fan Art / Pop Culture", "Fandom": "Stranger Things", "Delivery": "Digital download", "Origin": "India" },
      comments: [
        { reviewerName: 'Aditi Sharma', rating: 5, comment: "Absolutely love this piece — the colours are so vivid and the detail is incredible. Printed it at A2 and it looks stunning framed. Perfect for any Stranger Things fan.", date: new Date().toISOString() },
        { reviewerName: 'Rahul Verma', rating: 4, comment: "Delivery was smooth and the file quality was exactly as described. Very happy.", date: new Date().toISOString() }
      ]
    },
    { title: 'Limited Edition Comic Poster', type: 'Buy Now', sellerIdx: 1,
      desc: "A striking limited edition comic poster featuring bold linework and vivid panel-style illustration, produced in a numbered print run for collectors. The artwork draws from classic comic book visual language with a contemporary edge.\n\nA must-have for comic enthusiasts and pop culture collectors alike. Frame it, display it, or keep it sealed — either way it holds its visual and collector value.",
      specs: { "Type": "Print / Poster", "Medium": "Offset print on 200gsm matte paper", "Dimensions": "A3 (29.7 x 42 cm)", "Edition": "Limited numbered run", "Frame": "Not included", "Origin": "India" },
      comments: [
        { reviewerName: 'Sanjay Kumar', rating: 5, comment: "The print quality is exceptional — rich colours and clean lines. Worth every rupee.", date: new Date().toISOString() },
        { reviewerName: 'Priya Patel', rating: 5, comment: "Got mine framed immediately. Looks amazing on the wall. Fast shipping too.", date: new Date().toISOString() }
      ]
    },
    { title: 'Abstract City Drawing', type: 'Negotiable', sellerIdx: 0,
      desc: "An expressive abstract interpretation of an urban cityscape rendered in confident ink strokes, capturing the energy and density of a modern city without literal representation. The layering of lines and forms creates depth and movement.\n\nIdeal for minimalist or contemporary interiors, this piece works as a focal point in a home office, studio, or living room. A thoughtful gift for architecture or art lovers.",
      specs: { "Type": "Original Drawing", "Medium": "Ink on cartridge paper", "Dimensions": "A4 (21 x 29.7 cm)", "Style": "Abstract / Urban", "Framing": "Unframed", "Origin": "India" },
      comments: [
        { reviewerName: 'Rohan Desai', rating: 5, comment: "The linework is confident and expressive. Framed it in a simple black frame and it completely transformed my workspace.", date: new Date().toISOString() },
        { reviewerName: 'Neha Gupta', rating: 4, comment: "Arrived well packaged, no damage. The drawing is even more impressive in person.", date: new Date().toISOString() }
      ]
    },
    { title: 'Pack of 9 Super Cards', type: 'Buy Now', sellerIdx: 2,
      desc: "A curated pack of 9 premium super cards featuring high-gloss finishes and dynamic character artwork across a range of series and universes. Each card is individually sleeved and in excellent condition.\n\nGreat for collectors building their sets or for gifting to a young enthusiast just starting their collection journey. A fun, affordable entry point into the trading card hobby.",
      specs: { "Type": "Trading Cards", "Quantity": "9 cards", "Condition": "Near Mint to Excellent", "Sleeved": "Yes", "Series": "Mixed", "Origin": "India" },
      comments: [
        { reviewerName: 'Amit Singh', rating: 5, comment: "Great value for the price — got two cards I'd been looking for. Well sleeved.", date: new Date().toISOString() },
        { reviewerName: 'Sunita Reddy', rating: 5, comment: "Quick delivery and all cards in excellent condition. Would buy again.", date: new Date().toISOString() }
      ]
    },
    { title: 'Pack of 25 Pokémon Cards', type: 'Auction', sellerIdx: 2,
      desc: "A pack of 25 authentic Pokémon trading cards spanning multiple generations, including a mix of common, uncommon, and potential rare finds. Cards are in played-to-near-mint condition.\n\nWhether you're completing your Pokédex collection or searching for that elusive holographic, this pack offers excellent value. A beloved gift for Pokémon trainers of all ages.",
      specs: { "Type": "Trading Cards", "Quantity": "25 cards", "Condition": "Played to Near Mint", "Generation": "Mixed", "Sleeved": "No", "Origin": "India" },
      comments: [
        { reviewerName: 'Kunal Shah', rating: 4, comment: "Found three holos in the pack — genuinely surprised. Great deal.", date: new Date().toISOString() },
        { reviewerName: 'Meera Rao', rating: 5, comment: "Cards were in good condition and the variety was nice. Good for completing sets.", date: new Date().toISOString() }
      ],
      auctionMult: 0.65
    },
    { title: 'Resin Art Pendant (Pack of 2)', type: 'Buy Now', sellerIdx: 3,
      desc: "A pair of handcrafted resin pendants, each unique due to the fluid nature of the resin-pouring process. Suspended floral and glitter inclusions catch the light beautifully, giving each piece a one-of-a-kind character.\n\nWear one and gift the other, or keep both as a matching set. Lightweight and comfortable, these pendants pair easily with casual and formal outfits alike.",
      specs: { "Type": "Handmade Jewellery", "Material": "Epoxy resin, metallic inclusions", "Dimensions": "approx. 3 cm diameter each", "Finish": "Gloss", "Pack of": "2", "Chain": "Not included", "Origin": "India" },
      comments: [
        { reviewerName: 'Sneha Iyer', rating: 5, comment: "These pendants are so delicate and pretty. One for me, gifted the other — both loved it. The resin work is flawless.", date: new Date().toISOString() },
        { reviewerName: 'Vikas Jain', rating: 4, comment: "Lightweight and well finished. Exactly as shown in the photo.", date: new Date().toISOString() }
      ]
    },
    { title: 'Resin Art Wall Hanging', type: 'Negotiable', sellerIdx: 3,
      desc: "A substantial handmade resin wall hanging featuring layered colour gradients, embedded dried botanicals, and a polished high-gloss finish. Cast and finished by hand, no two pieces are identical.\n\nA striking statement piece for living rooms, bedrooms, or studio spaces. This makes an exceptional housewarming or anniversary gift for someone who appreciates artisan home décor.",
      specs: { "Type": "Wall Art / Home Décor", "Material": "Epoxy resin, dried botanicals", "Dimensions": "approx. 20 x 25 cm", "Finish": "High gloss", "Mounting": "Included", "Origin": "India" },
      comments: [
        { reviewerName: 'Pooja Desai', rating: 5, comment: "This is a showstopper. Everyone who visits asks about it. The resin depth and colour layering are beautiful.", date: new Date().toISOString() },
        { reviewerName: 'Arjun Nair', rating: 5, comment: "Arrived securely packaged and looks even better in person. Very happy with this.", date: new Date().toISOString() }
      ]
    },
    { title: 'Resin Beach Themed Earring', type: 'Negotiable', sellerIdx: 3,
      desc: "Delicate drop earrings handcrafted in clear resin with beach-inspired inclusions — tiny shells, sand-toned pigments, and ocean-blue swirls that evoke coastal calm. Lightweight and hypoallergenic-safe findings.\n\nA perfect accessory for summer outfits or as a reminder of the sea year-round. These also make a charming, personal gift for anyone who loves the ocean.",
      specs: { "Type": "Earrings", "Material": "Epoxy resin, shell inclusions, brass findings", "Dimensions": "approx. 3.5 cm drop", "Finish": "Gloss", "Weight": "Lightweight", "Origin": "India" },
      comments: [
        { reviewerName: 'Simran Kaur', rating: 5, comment: "These are adorable — light, comfortable, and the beach vibe is perfect for summer.", date: new Date().toISOString() },
        { reviewerName: 'Tarun Mehta', rating: 5, comment: "Gifted these to my sister and she loved them instantly. Great craftsmanship.", date: new Date().toISOString() }
      ]
    },
    { title: 'Resin Art Decorated Mirror', type: 'Auction', sellerIdx: 4,
      desc: "A circular mirror with a handcrafted resin border featuring fluid abstract patterns in complementary tones. The resin frame is sealed with a protective gloss coat for durability and longevity.\n\nFunctional art for any room — bathroom, bedroom, or entryway. The unique frame makes this far more than a utility item; it's a daily-use decorative piece that draws the eye.",
      specs: { "Type": "Decorative Mirror", "Frame Material": "Epoxy resin", "Mirror Diameter": "approx. 18 cm", "Overall Diameter with Frame": "approx. 25 cm", "Finish": "Gloss", "Hanging": "Wall hook included", "Origin": "India" },
      comments: [
        { reviewerName: 'Kavita Menon', rating: 5, comment: "The frame detail is stunning. It's become the focal point of my bedroom. Very well made and the mirror quality is clear and clean.", date: new Date().toISOString() },
        { reviewerName: 'Gaurav Joshi', rating: 5, comment: "Arrived without a scratch. The gloss finish on the resin is immaculate.", date: new Date().toISOString() }
      ],
      auctionMult: 0.65
    },
    { title: 'Resin Art Bookmark (Pack of 3)', type: 'Buy Now', sellerIdx: 3,
      desc: "A set of three slim resin bookmarks, each cast with a different colour combination and embedded with tiny dried flowers or metallic flakes. Smooth edges and a sealed surface make them pleasant to handle.\n\nA thoughtful gift for the avid reader in your life. Practical, beautiful, and handmade — the kind of small luxury that elevates the everyday reading ritual.",
      specs: { "Type": "Bookmark", "Material": "Epoxy resin, dried florals / metallic flakes", "Dimensions": "approx. 2 x 12 cm each", "Finish": "Smooth gloss", "Pack of": "3", "Origin": "India" },
      comments: [
        { reviewerName: 'Anjali Sharma', rating: 5, comment: "A lovely set — each bookmark is different and they all feel premium. Great gift idea.", date: new Date().toISOString() },
        { reviewerName: 'Ravi Teja', rating: 5, comment: "Bought these for my book club friends. Everyone was delighted. Beautifully made.", date: new Date().toISOString() }
      ]
    },
    { title: 'Crochet Mobile Cover with Accessory', type: 'Negotiable', sellerIdx: 4,
      desc: "A handmade crochet phone cover crafted in soft cotton yarn, fitted for popular smartphone sizes, and accompanied by a coordinating crochet accessory charm. Each piece is made to order with attention to stitch tension and finish.\n\nA quirky, personalised alternative to mass-produced cases. It protects your phone while expressing individuality — and makes a delightful gift for anyone who loves handmade things.",
      specs: { "Type": "Phone Cover + Accessory", "Material": "100% cotton yarn", "Compatible With": "Most standard smartphones (specify on order)", "Includes": "1 crochet cover + 1 charm accessory", "Origin": "India" },
      comments: [
        { reviewerName: 'Disha Patani', rating: 4, comment: "Fits my phone perfectly and the crochet work is tight and neat. Love the charm too.", date: new Date().toISOString() },
        { reviewerName: 'Vikram Singh', rating: 5, comment: "So unique — everyone asks where I got my phone cover. Really pleased with this.", date: new Date().toISOString() }
      ]
    },
    { title: 'Handmade Shell Jewellery Stand', type: 'Buy Now', sellerIdx: 1,
      desc: "A beautifully crafted jewellery stand made with natural shells arranged by hand into an elegant display structure. The shells are sourced, cleaned, and assembled with care to create a functional organiser with coastal charm.\n\nPerfect for holding rings, earrings, necklaces, and bracelets on a dressing table or shelf. A lovely housewarming or birthday gift for someone who appreciates natural materials and artisan craft.",
      specs: { "Type": "Jewellery Organiser", "Material": "Natural shells, wire frame base", "Dimensions": "approx. 15 x 10 x 8 cm", "Holds": "Rings, earrings, necklaces", "Care": "Wipe clean with dry cloth", "Origin": "India" },
      comments: [
        { reviewerName: 'Mansi Shah', rating: 5, comment: "This is exactly what I needed for my dressing table. Holds my rings and earrings perfectly and it looks gorgeous. Very well made.", date: new Date().toISOString() },
        { reviewerName: 'Nitin Kumar', rating: 4, comment: "The shells are beautiful and the stand is sturdy. A lovely piece.", date: new Date().toISOString() }
      ]
    },
    { title: 'Solar System Themed Cute Pendant', type: 'Buy Now', sellerIdx: 4,
      desc: "A miniature pendant featuring hand-painted planets arranged in a playful solar system composition, encased in a clear resin dome for protection and shine. The detail work is precise and the colour palette is rich and accurate.\n\nA charming gift for astronomy enthusiasts, students, or anyone who keeps their love of space close at hand. Pairs well with a simple chain or cord.",
      specs: { "Type": "Pendant", "Material": "Resin dome, hand-painted base", "Dimensions": "approx. 2.5 cm diameter", "Theme": "Solar System / Astronomy", "Chain": "Not included", "Origin": "India" },
      comments: [
        { reviewerName: 'Riya Sen', rating: 5, comment: "The detail on the planets is remarkable for such a tiny piece. I get compliments every time I wear it.", date: new Date().toISOString() },
        { reviewerName: 'Karan Malhotra', rating: 5, comment: "Perfect gift for my friend who loves astronomy. She was thrilled. Lovely work.", date: new Date().toISOString() }
      ]
    }
  ];

  const sellers = [1041, 1042, 1043, 1044, 1045];

  for (const nl of newListings) {
    const sId = sellers[nl.sellerIdx];
    let q = `UPDATE listings SET description = $1, specifications = $2, seller_id = $3, reviews = $4, buying_method = $5`;
    const params = [nl.desc, JSON.stringify(nl.specs), sId, JSON.stringify(nl.comments), nl.type];
    
    if (nl.type === 'Auction') {
      const dbItem = await client.query("SELECT price FROM listings WHERE title = $1", [nl.title]);
      if (dbItem.rows.length > 0) {
        const startPrice = Math.floor(parseFloat(dbItem.rows[0].price) * nl.auctionMult);
        const endTime = new Date();
        endTime.setDate(endTime.getDate() + 7);
        q += `, current_bid = $6, auction_ends_at = $7`;
        params.push(startPrice, endTime.toISOString());
      }
    } else if (nl.type === 'Negotiable') {
      q += `, offers_allowed = true, minimum_offer_percent = 70`;
    }
    
    q += ` WHERE title = $${params.length + 1}`;
    params.push(nl.title);
    
    console.log(`UPDATE listings SET format for ${nl.title}`);
    await client.query(q, params);
  }

  await client.end();
}
run();
