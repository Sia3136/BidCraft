const fs = require('fs');
const path = require('path');

const filePath = path.join('C:', 'Bidcraft', 'frontend', 'app', 'auth', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Add Sign In disclaimer
const signInButton = `{isSigningIn ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
                </button>`;
const newSignInButton = `{isSigningIn ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
                </button>
                <p className="text-center font-ui text-[12px] text-[var(--color-ink-500)] mt-4">
                  By signing in, you agree to our <Link href="/terms" className="hover:underline">Terms of Service</Link> and <Link href="/privacy" className="hover:underline">Privacy Policy</Link>.
                </p>`;
content = content.replace(signInButton, newSignInButton);

// Replace Create Account disclaimer
const oldSignUpDisclaimerRegex = /<p className="text-center text-caption text-\[var\(--color-ink-500\)\] mt-4">[\s\S]*?<\/p>/;
const newSignUpDisclaimer = `<p className="text-center font-ui text-[12px] text-[var(--color-ink-500)] mt-4">
                        By creating an account, you agree to our <Link href="/terms" className="hover:underline">Terms of Service</Link> and <Link href="/privacy" className="hover:underline">Privacy Policy</Link>.
                      </p>`;
content = content.replace(oldSignUpDisclaimerRegex, newSignUpDisclaimer);

fs.writeFileSync(filePath, content);
console.log("auth/page.tsx updated");
