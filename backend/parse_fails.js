const fs = require('fs'); 
const data = JSON.parse(fs.readFileSync('final_failures.json', 'utf16le')); 
const fails = data.testResults.flatMap(r => r.assertionResults.filter(a => a.status === 'failed').map(a => r.name.split('\\\\').pop() + ': ' + a.title + ' -> ' + (a.failureMessages[0] ? a.failureMessages[0].split('\n')[0] : ''))); 
fs.writeFileSync('parsed_fails.json', JSON.stringify(fails, null, 2), 'utf8');
