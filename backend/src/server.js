const app = require('./app');
const http = require('http');
const { initJobs } = require('./jobs/auctionJobs');
const { initEscrowJobs } = require('./jobs/escrowAutoRelease');
const { initSocket } = require('./socket');

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);
initSocket(server);

server.listen(PORT, () => {
  console.log(`BidCraft backend running on port ${PORT}`);
  initJobs();
  initEscrowJobs();
});
