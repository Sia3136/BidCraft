const fs = require('fs');
const path = require('path');

const clientHomePath = path.join('C:', 'Bidcraft', 'frontend', 'components', 'client-home.tsx');
let clientHome = fs.readFileSync(clientHomePath, 'utf8');

// replace the form HTML with <ContactForm />
const formStart = clientHome.indexOf('<form className="flex flex-col gap-4">');
const formEnd = clientHome.indexOf('</form>', formStart) + '</form>'.length;
clientHome = clientHome.substring(0, formStart) + '<ContactForm />' + clientHome.substring(formEnd);

// add import
if (!clientHome.includes("import { ContactForm }")) {
  clientHome = clientHome.replace("import Link from 'next/link'", "import Link from 'next/link'\nimport { ContactForm } from '@/components/contact-form'");
}

fs.writeFileSync(clientHomePath, clientHome);
console.log('client-home.tsx updated with ContactForm');

const contactPagePath = path.join('C:', 'Bidcraft', 'frontend', 'app', 'contact', 'page.tsx');
if (fs.existsSync(contactPagePath)) {
  let contactPage = fs.readFileSync(contactPagePath, 'utf8');
  // I need to look at what's inside contact/page.tsx first to properly replace it.
  // Actually, I can just rewrite contact/page.tsx since it's just a page holding the form.
  const newContactPage = `import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ContactForm } from '@/components/contact-form'

export const metadata = {
  title: 'Contact Us | BidCraft',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-cream-base)]">
      <Navbar />
      <main className="flex-1 py-24 px-[var(--space-5)]">
        <div className="max-w-[var(--container-max)] mx-auto flex flex-col lg:flex-row gap-12 lg:gap-16">
          <div className="w-full lg:w-1/2">
            <h1 className="text-display-lg text-[var(--color-ink-900)] mb-8">Contact Us</h1>
            <ContactForm />
          </div>
          
          <div className="w-full lg:w-1/2 flex flex-col justify-center gap-6">
            <div className="p-6 bg-[var(--color-cream-raised)] rounded-[var(--radius-md)]">
              <h3 className="text-heading-md text-[var(--color-ink-900)] mb-1">General</h3>
              <a href="mailto:support@bidcraft.in" className="text-body-lg text-[var(--color-terracotta-600)] font-semibold hover:underline">support@bidcraft.in</a>
            </div>
            <div className="p-6 bg-[var(--color-cream-raised)] rounded-[var(--radius-md)]">
              <h3 className="text-heading-md text-[var(--color-ink-900)] mb-1">Sellers</h3>
              <a href="mailto:sellers@bidcraft.in" className="text-body-lg text-[var(--color-terracotta-600)] font-semibold hover:underline">sellers@bidcraft.in</a>
            </div>
            <div className="p-6 bg-[var(--color-cream-raised)] rounded-[var(--radius-md)]">
              <h3 className="text-heading-md text-[var(--color-ink-900)] mb-1">Disputes</h3>
              <a href="mailto:disputes@bidcraft.in" className="text-body-lg text-[var(--color-terracotta-600)] font-semibold hover:underline">disputes@bidcraft.in</a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
`;
  fs.writeFileSync(contactPagePath, newContactPage);
  console.log('app/contact/page.tsx updated.');
} else {
  console.log('app/contact/page.tsx not found!');
}
