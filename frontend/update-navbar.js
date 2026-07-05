const fs = require('fs');
const path = require('path');

const navbarPath = path.join('C:', 'Bidcraft', 'frontend', 'components', 'navbar.tsx');
let navbarContent = fs.readFileSync(navbarPath, 'utf8');

// Replace desktop links
navbarContent = navbarContent.replace(
  /<Link href="\/#our-story"[^>]*>\s*Our Story\s*<\/Link>/g,
  `<Link href={isHomepage ? "#our-story" : "/our-story"} className={cn("text-body-md font-medium transition-colors duration-fast", textClass)}>
                  Our Story
                </Link>`
);

navbarContent = navbarContent.replace(
  /<a href="mailto:hello@bidcraft.in" className=\{cn\("text-body-md font-medium transition-colors duration-fast", textClass\)\}>\s*Contact\s*<\/a>/g,
  `<Link href={isHomepage ? "#contact" : "/contact"} className={cn("text-body-md font-medium transition-colors duration-fast", textClass)}>
                  Contact
                </Link>`
);

// Replace mobile links
navbarContent = navbarContent.replace(
  /<Link\s*href="\/#our-story"\s*onClick=\{\(\) => setIsMobileMenuOpen\(false\)\}\s*className="text-body-lg text-\[var\(--color-ink-900\)\] hover:text-\[var\(--color-terracotta-600\)\] py-2 font-medium"\s*>\s*Our Story\s*<\/Link>/g,
  `<Link
              href={isHomepage ? "#our-story" : "/our-story"}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-body-lg text-[var(--color-ink-900)] hover:text-[var(--color-terracotta-600)] py-2 font-medium"
            >
              Our Story
            </Link>`
);

navbarContent = navbarContent.replace(
  /<a\s*href="mailto:hello@bidcraft.in"\s*onClick=\{\(\) => setIsMobileMenuOpen\(false\)\}\s*className="text-body-lg text-\[var\(--color-ink-900\)\] hover:text-\[var\(--color-terracotta-600\)\] py-2 font-medium"\s*>\s*Contact\s*<\/a>/g,
  `<Link
              href={isHomepage ? "#contact" : "/contact"}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-body-lg text-[var(--color-ink-900)] hover:text-[var(--color-terracotta-600)] py-2 font-medium"
            >
              Contact
            </Link>`
);

fs.writeFileSync(navbarPath, navbarContent);
console.log('navbar.tsx updated.');
