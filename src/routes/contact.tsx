import { createFileRoute } from "@tanstack/react-router";
import { Clock, MapPin, Phone } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { business, mapEmbedSrc, whatsappLink } from "@/lib/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: business.name,
  description:
    "Boutique, custom fashion, handcrafted arts, parlor services and creative classes in Perambalur, Tamil Nadu.",
  telephone: business.phoneIntl,
  openingHours: "Mo-Su 09:00-19:00",
  address: {
    "@type": "PostalAddress",
    streetAddress: "26A, Super Nagar",
    addressLocality: "Perambalur",
    addressRegion: "Tamil Nadu",
    postalCode: "621212",
    addressCountry: "IN",
  },
};

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Location — Queens Clozet, Perambalur" },
      {
        name: "description",
        content:
          "Visit Queens Clozet at 26A, Super Nagar, Perambalur, Tamil Nadu 621212. Open 9:00 AM to 7:00 PM. Call or WhatsApp 9363994467.",
      },
      { property: "og:title", content: "Contact Queens Clozet" },
      {
        property: "og:description",
        content: "26A, Super Nagar, Perambalur, Tamil Nadu 621212. Open 9:00 AM – 7:00 PM.",
      },
    ],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(jsonLd) }],
  }),
  component: Contact,
});

function Contact() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-16 sm:px-8 lg:pt-24">
        <SectionHeading
          eyebrow="Contact & Location"
          title="Let's Create Something Beautiful."
          intro="Visit the atelier, call us, or send a message on WhatsApp — whichever is easiest for you."
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-3">
          {[
            {
              icon: MapPin,
              title: "Queens Clozet",
              lines: business.addressLines,
            },
            {
              icon: Clock,
              title: "Business Hours",
              lines: [business.hours, "Open all days"],
            },
            {
              icon: Phone,
              title: "Phone / WhatsApp",
              lines: [business.phone],
            },
          ].map((block, index) => (
            <Reveal key={block.title} delay={index * 80} className="border-t border-border pt-7">
              <block.icon className="h-5 w-5 text-accent-foreground" strokeWidth={1.4} />
              <h2 className="mt-5 text-xl text-primary">{block.title}</h2>
              <div className="mt-3 space-y-1 text-sm leading-relaxed text-muted-foreground">
                {block.lines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120} className="mt-12 flex flex-col gap-3 sm:flex-row">
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
      </section>

      <section className="pb-24 lg:pb-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal className="overflow-hidden rounded-sm border border-border">
            <iframe
              title="Queen Clozet location on Google Maps"
              src={mapEmbedSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[380px] w-full border-0 sm:h-[460px]"
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}
