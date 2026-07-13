const fs = require('fs');
const path = require('path');

const navbarPath = path.join('C:', 'Bidcraft', 'frontend', 'components', 'navbar.tsx');
let navbarContent = fs.readFileSync(navbarPath, 'utf8');

// Replace desktop button logic
const oldDesktopLogic = `                    onClick={() => {
                      if (openDropdown === category.slug) {
                        setOpenDropdown(null);
                        router.push(\`/explore?category=\${category.slug}\`);
                      } else {
                        setOpenDropdown(category.slug);
                        router.push(\`/explore?category=\${category.slug}\`);
                      }
                    }}`;
const newDesktopLogic = `                    onClick={() => {
                      if (openDropdown === category.slug) {
                        setOpenDropdown(null);
                      } else {
                        setOpenDropdown(category.slug);
                      }
                    }}`;
navbarContent = navbarContent.replace(oldDesktopLogic, newDesktopLogic);

// Replace mobile menu logic to expand subcategories instead of navigating
const oldMobileCategories = `{categories.map((category) => (
              <Link
                key={category.slug}
                href={\`/explore?category=\${category.slug}\`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-body-lg text-[var(--color-ink-900)] hover:text-[var(--color-terracotta-600)] py-2 font-medium"
              >
                {category.name}
              </Link>
            ))}`;

const newMobileCategories = `{categories.map((category) => (
              <div key={category.slug} className="flex flex-col">
                <button
                  onClick={() => setOpenDropdown(openDropdown === category.slug ? null : category.slug)}
                  className="flex items-center justify-between text-body-lg text-[var(--color-ink-900)] hover:text-[var(--color-terracotta-600)] py-2 font-medium text-left w-full"
                >
                  {category.name}
                  <span className="text-xl leading-none">{openDropdown === category.slug ? '−' : '+'}</span>
                </button>
                <AnimatePresence>
                  {openDropdown === category.slug && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="flex flex-col pl-4 gap-3 overflow-hidden mt-2 mb-2 border-l-2 border-[var(--color-border-subtle)]"
                    >
                      {category.subcategories.map(sub => {
                        const subSlug = slugify(sub);
                        return (
                          <Link
                            key={subSlug}
                            href={\`/explore?category=\${category.slug}&subcategory=\${subSlug}\`}
                            onClick={() => {
                              setIsMobileMenuOpen(false);
                              setOpenDropdown(null);
                            }}
                            className="text-body-md text-[var(--color-ink-700)] hover:text-[var(--color-terracotta-600)]"
                          >
                            {sub}
                          </Link>
                        )
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}`;
navbarContent = navbarContent.replace(oldMobileCategories, newMobileCategories);

// Also need to ensure the hardcoded Contact link in navbar navigates correctly.
// The prompt says "Update the navbar Contact button so it navigates correctly to the Contact page."
// I had changed it to `href={isHomepage ? "#contact" : "/contact"}` in Prompt 2.
// Now I should just change it to `/contact` everywhere.
navbarContent = navbarContent.replace(/href=\{isHomepage \? "#contact" : "\/contact"\}/g, 'href="/contact"');

fs.writeFileSync(navbarPath, navbarContent);
console.log('navbar.tsx updated');
