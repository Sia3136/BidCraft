const fs = require('fs');
if (fs.existsSync('audit_results.json')) {
  const data = require('./audit_results.json');
  const listingsWithAuctions = data.report.filter(r => r.auctionCount > 0);
  console.log('Listings with auctions:', listingsWithAuctions.length);
  const totalAuctions = listingsWithAuctions.reduce((sum, r) => sum + r.auctionCount, 0);
  console.log('Total auctions among the 47 listings:', totalAuctions);
  listingsWithAuctions.forEach(r => {
    console.log('Listing ' + r.id + ': ' + r.title.substring(0, 30) + ' -> ' + r.auctionCount + ' auction(s)');
  });
} else {
  console.log('No audit_results.json found');
}
