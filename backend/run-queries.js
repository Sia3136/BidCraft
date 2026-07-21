const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_puatjTPoH93y@ep-aged-bread-aodxmn99.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require',
});

async function run() {
  try {
    await client.connect();
    
    console.log("--- SQL OUTPUT ---");
    
    let res = await client.query(`SELECT COUNT(*) FROM listings;`);
    console.log("SELECT COUNT(*) FROM listings;");
    console.log(res.rows);

    res = await client.query(`SELECT buying_method, COUNT(*) FROM listings GROUP BY buying_method;`);
    console.log("SELECT buying_method, COUNT(*) FROM listings GROUP BY buying_method;");
    console.log(res.rows);

    res = await client.query(`SELECT category, COUNT(*) FROM listings GROUP BY category;`);
    console.log("SELECT category, COUNT(*) FROM listings GROUP BY category;");
    console.log(res.rows);

    res = await client.query(`SELECT COUNT(*) FROM auctions;`);
    console.log("SELECT COUNT(*) FROM auctions;");
    console.log(res.rows);

    res = await client.query(`SELECT COUNT(*) FROM auctions WHERE end_time > NOW();`);
    console.log("SELECT COUNT(*) FROM auctions WHERE end_time > NOW();");
    console.log(res.rows);

    res = await client.query(`SELECT COUNT(*) FROM listings WHERE buying_method='Auction';`);
    console.log("SELECT COUNT(*) FROM listings WHERE buying_method='Auction';");
    console.log(res.rows);

    res = await client.query(`SELECT COUNT(*) FROM listings WHERE buying_method='Negotiable';`);
    console.log("SELECT COUNT(*) FROM listings WHERE buying_method='Negotiable';");
    console.log(res.rows);

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.end();
  }
}
run();
