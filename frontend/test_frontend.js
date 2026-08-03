const http = require('http');
http.get('http://localhost:3000/product/593', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const match = data.match(/More from [^<]*/g);
    console.log(match);
  });
});
