const fs = require('fs');
const cp = require('child_process');

const files = [
  'check.js', 'verify_before_delete.js', 'dump.json', 'full_dump.json', 
  'auction_backup_2026-08-06.json', 'trace.log', 'test_output.log', 
  'prev_navbar.tsx', 'old_navbar.tsx', 'archive', 'tools', 'debug', 'script'
];

console.log('Checking for references...');
for (const f of files) {
  try {
    const res = cp.execSync(`findstr /S /I /C:"${f}" backend\\* frontend\\* 2>nul`).toString();
    if (res.trim()) {
      console.log('--- Found ref for ' + f + ' ---');
      const lines = res.split('\n');
      for (const line of lines.slice(0, 5)) {
        if (line && !line.includes('node_modules')) {
          console.log(line.substring(0, 150));
        }
      }
    }
  } catch(e) {
    // findstr exits with 1 if no match found
  }
}
