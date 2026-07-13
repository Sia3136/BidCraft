const fs = require('fs');

const fixFile = (file) => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/'review'/g, "'under_review'");
    fs.writeFileSync(file, content);
  }
};

fixFile('backend/tests/disputes.test.js');
fixFile('backend/tests/notifications.test.js');
