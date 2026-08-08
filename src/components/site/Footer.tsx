import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Youtube } from "lucide-react";
import logo from "@/assets/logo.png.asset.json";
import { business, navLinks } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-forest text-ivory">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1.2fr]">
          <div>
            <div className="flex min-w-0 items-center gap-3">
              <img
                src={logo.url}
                alt="Queen Clozet"
                width={56}
                height={56}
                loading="lazy"
                className="h-14 w-14 shrink-0 rounded-full object-cover"
              />
              <span className="font-serif text-2xl">Queen Clozet</span>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-ivory/70">{business.tagline}</p>
            <div className="mt-6 flex gap-3">
              {[Instagram, Facebook, Youtube].map((Icon, index) => (
                <span
                  key={index}
                  aria-hidden="true"
                  title="Social profile coming soon"
                  className="grid h-10 w-10 place-items-center rounded-full border border-ivory/25 text-ivory/60"
                >
                  <Icon className="h-4 w-4" />
                </span>
              ))}
            </div>
          </div>

          <nav>
            <h3 className="eyebrow text-gold">Explore</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-ivory/75 transition-colors hover:text-gold">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/appointment" className="text-ivory/75 transition-colors hover:text-gold">
                  Book Appointment
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <h3 className="eyebrow text-gold">Visit &amp; Contact</h3>
            <address className="mt-5 space-y-1 text-sm not-italic leading-relaxed text-ivory/75">
              {business.addressLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </address>
            <p className="mt-4 text-sm text-ivory/75">
              Business hours: {business.hours}
            </p>
            <a
              href={`tel:${business.phoneIntl}`}
              className="mt-2 inline-block font-serif text-2xl text-gold"
            >
              {business.phone}
            </a>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-ivory/15 pt-6 text-xs text-ivory/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Queen Clozet. All rights reserved.</p>
          <p>Perambalur, Tamil Nadu</p>
        </div>
      </div>
    </footer>
  );
}
