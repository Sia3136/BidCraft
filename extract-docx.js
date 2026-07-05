const fs = require('fs');
const mammoth = require('mammoth');

const files = [
  'bidcraft blueprint 2.0 .docx',
  'BidCraft.docx',
  'impt info.docx'
];

(async () => {
  for (const file of files) {
    if (fs.existsSync(file)) {
      const result = await mammoth.extractRawText({path: file});
      fs.writeFileSync(file + '.txt', result.value);
      console.log('Extracted ' + file);
    } else {
      console.log('Not found: ' + file);
    }
  }
})();
