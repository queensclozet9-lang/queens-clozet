import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Brush, Flower2, Gem, Palette, Scissors, Shirt, Sparkles, Ribbon } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import aboutImage from "@/assets/about.jpg";
import classesImage from "@/assets/classes.jpg";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { benefits, business, services, whatsappLink } from "@/lib/site";
import { galleryItems } from "@/lib/gallery";

const homeServiceIcons = [Shirt, Scissors, Gem, Flower2, Sparkles, Ribbon];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Queens Clozet — Boutique, Custom Fashion & Handcrafted Arts" },
      {
        name: "description",
        content:
          "Where creativity meets elegance. Boutique collections, costume customization, aari work, embroidery, resin art, brooches, parlor services and creative classes in Perambalur.",
      },
      { property: "og:title", content: "Queens Clozet — Where Creativity Meets Elegance" },
      {
        property: "og:description",
        content:
          "Custom fashion, handcrafted details, creative artistry and more — all under one roof in Perambalur, Tamil Nadu.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const previewWork = galleryItems.slice(0, 4);

  return (
    <>
      <section className="relative overflow-hidden bg-forest text-ivory py-20 lg:py-28 min-h-[80vh] flex items-center">
        <img
          src={heroBg}
          alt="Queens Clozet Atelier Interior"
          className="absolute inset-0 h-full w-full object-cover object-center brightness-[0.6]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/35 backdrop-blur-[1px]" />


        <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 w-full py-12">
          <Reveal className="max-w-2xl">
            <p className="eyebrow text-gold tracking-[0.3em]">
              Boutique · Craft · Beauty · Classes
            </p>
            <h1 className="mt-6 text-4xl leading-[1.08] text-ivory sm:text-5xl lg:text-6xl font-serif">
              Where Creativity
              <br />
              Meets Elegance
            </h1>
            <p className="mt-7 max-w-xl text-base leading-relaxed text-ivory/85">
              Custom fashion, handcrafted details, creative artistry and more — all under one roof.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/appointment"
                className="rounded-sm bg-gold px-8 py-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-forest-deep transition-colors hover:bg-gold/90 shadow-md"
              >
                Book an Appointment
              </Link>
              <Link
                to="/collections"
                className="rounded-sm border border-ivory/60 px-8 py-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-ivory transition-colors hover:border-gold hover:bg-gold hover:text-forest-deep"
              >
                Explore Our Work
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal className="order-2 lg:order-1">
            <div className="overflow-hidden rounded-sm">
              <img
                src={aboutImage}
                alt="Hands stitching gold aari embroidery onto deep green fabric"
                width={1408}
                height={1600}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
          <div className="order-1 lg:order-2">
            <SectionHeading
              eyebrow="About Queens Clozet"
              title="Crafted With Creativity. Designed With You."
              intro="Queens Clozet began with a simple love for making things by hand. Every outfit, every motif and every small accessory is shaped around the person it is made for."
            />
            <Reveal delay={80} className="mt-8 space-y-5 text-sm leading-relaxed text-muted-foreground">
              <p>
                Boutique collections sit beside customised costumes, handmade accessories, aari work,
                embroidery, fabric painting, resin art and brooches. Parlor services and creative
                classes complete the space, so you can be styled, dressed, and taught all in one visit.
              </p>
              <p>
                Nothing here is mass produced. We work slowly, discuss ideas with you, and finish each
                piece by hand.
              </p>
            </Reveal>
            <Reveal delay={140} className="mt-10 border-t border-border pt-6">
              <p className="eyebrow text-primary">Creativity • Craftsmanship • Personalization</p>
            </Reveal>
            <Reveal delay={180}>
              <Link
                to="/about"
                className="group mt-8 inline-flex items-center gap-2 text-sm text-primary"
              >
                Read our story
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-secondary/40 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading
            eyebrow="Our Services"
            title="A menu of handcrafted possibilities"
            intro="Ten ways to work with us — from a full boutique wardrobe to a single hand-finished brooch."
          />
          <ul className="mt-14 grid gap-x-14 sm:grid-cols-2">
            {services.slice(0, 6).map((service, index) => {
              const Icon = homeServiceIcons[index] ?? Sparkles;
              return (
                <Reveal
                  key={service.number}
                  as="li"
                  delay={index * 60}
                  className="grid grid-cols-[auto_minmax(0,1fr)] gap-5 border-b border-border py-7"
                >
                  <span className="font-serif text-xl text-accent-foreground/70">{service.number}</span>
                  <div className="min-w-0">
                    <h3 className="text-xl text-primary">{service.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {service.description}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </ul>
          <Reveal delay={120}>
            <Link
              to="/services"
              className="group mt-12 inline-flex items-center gap-2 text-sm text-primary font-medium"
            >
              View all ten services
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <SectionHeading
          eyebrow="Collections & Portfolio"
          title="Work that speaks in detail"
          intro="A glimpse of recent boutique pieces, hand embroidery and handmade art."
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {previewWork.map((item, index) => (
            <Reveal key={item.id} delay={index * 70}>
              <Link to="/collections" className="group block overflow-hidden rounded-sm">
                <img
                  src={item.src}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  loading="lazy"
                  className="h-72 w-full object-cover transition-transform duration-700 group-hover:scale-[1.04] lg:h-80"
                />
                <div className="pt-4">
                  <p className="eyebrow text-accent-foreground/70">{item.category}</p>
                  <h3 className="mt-2 text-lg text-primary">{item.title}</h3>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
        <Reveal delay={120}>
          <Link
            to="/collections"
            className="group mt-12 inline-flex items-center gap-2 text-sm text-primary"
          >
            Explore the full portfolio
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </section>

      <section className="bg-forest py-20 text-ivory lg:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal className="max-w-2xl">
            <p className="eyebrow text-gold">Why Queens Clozet?</p>

            <h2 className="mt-4 text-3xl leading-[1.15] sm:text-4xl lg:text-[2.75rem]">
              Made by hand, made for you
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-x-14 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit, index) => (
              <Reveal
                key={benefit.title}
                delay={index * 70}
                className="border-t border-ivory/20 py-7"
              >
                <h3 className="text-xl text-ivory">{benefit.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ivory/70">{benefit.description}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <div className="overflow-hidden rounded-sm">
              <img
                src={classesImage}
                alt="Creative class table with embroidery hoops, fabric paints and resin art pieces"
                width={1600}
                height={1104}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
          <div>
            <SectionHeading
              eyebrow="Classes"
              title="Learn the Art. Create Something Beautiful."
              intro="If you would rather make it yourself, we teach the crafts we practise — patiently, in small groups."
            />
            <Reveal delay={100}>
              <Link
                to="/classes"
                className="mt-10 inline-block rounded-sm border border-primary px-8 py-4 text-xs font-medium uppercase tracking-[0.2em] text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                Enquire About Classes
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-secondary/40 py-20 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <Reveal>
            <p className="eyebrow text-accent-foreground/70">Visit the atelier</p>
            <h2 className="mt-4 text-3xl leading-[1.15] text-primary sm:text-4xl">
              Let's Create Something Beautiful.
            </h2>
            <address className="mt-6 space-y-1 text-sm not-italic leading-relaxed text-muted-foreground">
              {business.addressLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </address>
            <p className="mt-3 text-sm text-muted-foreground">Open daily {business.hours}</p>
          </Reveal>
          <Reveal delay={100} className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <a
              href={`tel:${business.phoneIntl}`}
              className="rounded-sm bg-primary px-8 py-4 text-center text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-forest-deep"
            >
              Call Us
            </a>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-sm border border-primary px-8 py-4 text-center text-xs font-medium uppercase tracking-[0.2em] text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              WhatsApp Us
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}
