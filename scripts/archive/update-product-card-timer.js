const fs = require('fs');
const path = require('path');

const cardPath = path.join('C:', 'Bidcraft', 'frontend', 'components', 'product-card.tsx');
let cardContent = fs.readFileSync(cardPath, 'utf8');

const oldTimerLogic = `      const d = Math.floor(remaining / (1000 * 60 * 60 * 24));
      const h = Math.floor((remaining / (1000 * 60 * 60)) % 24);
      const m = Math.floor((remaining / 1000 / 60) % 60);
      const s = Math.floor((remaining / 1000) % 60);
      
      if (remaining >= 60 * 60 * 1000) {
        setTimeLeft(\`\${d}d \${h}h \${m}m\`);
      } else {
        setTimeLeft(\`\${m}m \${s}s\`);
      }`;

const newTimerLogic = `      const d = Math.floor(remaining / (1000 * 60 * 60 * 24));
      const h = Math.floor((remaining / (1000 * 60 * 60)) % 24);
      const m = Math.floor((remaining / 1000 / 60) % 60);
      const s = Math.floor((remaining / 1000) % 60);
      
      setTimeLeft(\`\${d}d \${h}h \${m}m \${s}s\`);`;

cardContent = cardContent.replace(oldTimerLogic, newTimerLogic);

cardContent = cardContent.replace(`setTimeLeft('Ended');`, `setTimeLeft('Auction Ended');`);

fs.writeFileSync(cardPath, cardContent);
console.log('product-card.tsx updated');
