# Queen Clozet — Premium Boutique Portfolio Site

A multi-page, editorial-style boutique website with a real appointment request system and a private admin dashboard.

## Brand system

- Palette: deep forest green (from logo), warm ivory, soft beige, muted gold accent, charcoal text. No neon, no blue, no heavy gradients.
- Typography: Cormorant Garamond for headings, Manrope for body (loaded via `<link>` in the root route).
- Logo: uploaded artwork becomes the brand mark (navbar, hero, footer) and the favicon.
- Motion: restrained fade/reveal on scroll, gentle image zoom on hover. Nothing bouncy or parallax-heavy.

## Pages

| Route | Content |
|---|---|
| `/` | Hero ("Where Creativity Meets Elegance", both CTAs, subtle logo), About teaser, services preview, portfolio preview, Why Queen Clozet, classes teaser, contact strip |
| `/about` | "Crafted With Creativity. Designed With You." + large image + "Creativity • Craftsmanship • Personalization" |
| `/services` | Editorial numbered service menu 01–10 with line icons and short copy (exact text from brief) |
| `/collections` | Masonry gallery with filter tabs (All, Boutique, Custom Costumes, Accessories, Aari Work, Embroidery, Resin Art, Fabric Painting, Brooches), premium lightbox showing image, category, description, and an "Enquire" CTA. No prices. |
| `/classes` | "Learn the Art. Create Something Beautiful." + craft categories + "Enquire About Classes" → booking form prefilled with Classes. No invented fees/duration. |
| `/appointment` | Booking form |
| `/contact` | "Let's Create Something Beautiful." + address, hours, Call Us / WhatsApp Us buttons, embedded Google Map for the Perambalur address |
| `/admin` | Private appointment dashboard (sign-in required) |

Shared sticky header (logo + nav + "Book Appointment" primary CTA, mobile hamburger), forest-green footer, and a floating WhatsApp button (wa.me/919363994467) on every page.

## Appointment booking

Fields: Full Name*, Mobile*, WhatsApp, Email, Service Required*, Preferred Date*, Preferred Time*, Number of People, Message.
Service options exactly as listed in the brief, including General Enquiry.

Validation: required fields, 10-digit Indian mobile, email format when filled, date not in the past, time restricted to 9:00 AM–7:00 PM slots (30-minute increments in a dropdown, so out-of-hours times are impossible). Submit button disables while sending to prevent duplicate submissions. Success message uses the exact confirmation copy; failures show a retry error.

## Data & admin

Lovable Cloud stores every request: name, phone, whatsapp, email, service, date, time, people count, message, created_at, status (pending / confirmed / completed / cancelled).

- Public visitors can only insert requests — never read them.
- `/admin` requires sign-in; only users holding an admin role can read or modify appointments. Roles live in a separate roles table checked server-side.
- Admin can list appointments, filter by date and status, view full customer details, change status, and delete.

## Imagery

Generated editorial photography for the hero, about, classes, and roughly a dozen portfolio pieces across the categories, styled to the green/ivory palette. All served from CDN asset pointers with descriptive alt text.

## Technical notes

- TanStack Start routes; each page gets its own `head()` with unique title/description/OG tags plus LocalBusiness JSON-LD on contact.
- Tailwind v4 tokens defined in `src/styles.css`; no hardcoded color utilities in components.
- Appointment insert and all admin reads/writes go through server functions; admin operations verify the caller's role.
- No cart, checkout, payments, prices, testimonials, or invented business facts anywhere.
