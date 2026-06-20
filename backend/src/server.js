const app = require('./app');
const { initJobs } = require('./jobs/auctionJobs');
const { initEscrowJobs } = require('./jobs/escrowAutoRelease');

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`BidCraft backend running on port ${PORT}`);
  initJobs();
  initEscrowJobs();
});
