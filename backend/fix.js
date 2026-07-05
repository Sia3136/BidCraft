const fs = require('fs');
let code = fs.readFileSync('scripts/seedListings.js', 'utf8');
code = code.replace("require('dotenv').config({ path: '../.env' });", "require('dotenv').config();");
fs.writeFileSync('scripts/seedListings.js', code);
