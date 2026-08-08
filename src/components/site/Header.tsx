import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import logoHeader from "@/assets/logo-header.png";
import { navLinks } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors duration-500",
        scrolled ? "border-border bg-background/95 backdrop-blur" : "border-transparent bg-background",
      )}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4 sm:px-8 lg:py-5">
        <Link to="/" className="flex min-w-0 items-center gap-3" onClick={() => setOpen(false)}>
          <img
            src={logoHeader}
            alt="Queen Clozet Logo"
            width={48}
            height={48}
            className="h-11 w-11 shrink-0 rounded-full object-cover"
          />
          <span className="min-w-0">
            <span className="block truncate font-serif text-xl leading-none text-primary sm:text-2xl">
              Queen Clozet
            </span>
            <span className="eyebrow mt-1 block truncate text-muted-foreground">
              Boutique &amp; Craft Atelier
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <nav className="hidden items-center gap-7 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                activeOptions={{ exact: link.to === "/" }}
                className="relative py-1 text-sm text-foreground/75 transition-colors hover:text-primary data-[status=active]:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link
            to="/appointment"
            className="hidden rounded-sm bg-primary px-5 py-3 text-xs font-medium uppercase tracking-[0.18em] text-primary-foreground transition-colors hover:bg-forest-deep sm:inline-block"
          >
            Book Appointment
          </Link>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-sm border border-border text-primary lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border bg-background px-5 pb-8 pt-4 sm:px-8 lg:hidden">
          <ul className="flex flex-col">
            {navLinks.map((link) => (
              <li key={link.to} className="border-b border-border/70">
                <Link
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className="block py-4 font-serif text-2xl text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            to="/appointment"
            onClick={() => setOpen(false)}
            className="mt-6 block rounded-sm bg-primary px-5 py-4 text-center text-xs font-medium uppercase tracking-[0.18em] text-primary-foreground"
          >
            Book an Appointment
          </Link>
        </nav>
      )}
    </header>
  );
}
