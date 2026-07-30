const fs = require('fs');
const path = 'components/client-home.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/className="([^"]*)"/g, (match, classes) => {
  // Remove existing font classes that we're replacing
  classes = classes.replace(/\bfont-(display|ui|sans|playfair)\b/g, '');
  classes = classes.replace(/font-\[family-name:var\(--font-(display|ui)\)\]/g, '');
  
  if (/text-(display|heading|\d+xl)/.test(classes) || classes.includes('text-4xl')) {
    classes = classes.replace(/\s+/g, ' ').trim() + ' font-[family-name:var(--font-playfair)]';
  } else if (/text-(body|caption|base|sm|xs)/.test(classes)) {
    classes = classes.replace(/\s+/g, ' ').trim() + ' font-[family-name:var(--font-jakarta)]';
  }
  return `className="${classes}"`;
});

fs.writeFileSync(path, content);
console.log('Fonts updated in client-home.tsx');
