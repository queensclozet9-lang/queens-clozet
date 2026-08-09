import { createFileRoute, Link } from "@tanstack/react-router";
import aboutImage from "@/assets/about.jpg";
import boutiqueImage from "@/assets/work-boutique-2.jpg";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { services } from "@/lib/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Queens Clozet — Boutique & Craft Atelier in Perambalur" },
      {
        name: "description",
        content:
          "Queens Clozet is a boutique and handcraft atelier offering personalised fashion, aari work, embroidery, resin art, brooches, parlor services and creative classes.",
      },
      { property: "og:title", content: "About Queens Clozet" },
      {
        property: "og:description",
        content:
          "Crafted with creativity, designed with you — personalised fashion and handcrafted creative services in Perambalur.",
      },
    ],
  }),
  component: About,
});

function About() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-16 sm:px-8 lg:pb-24 lg:pt-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="Our Story"
              title="Crafted With Creativity. Designed With You."
              intro="Queens Clozet is a small atelier built around handwork. We design, stitch, paint and embellish — and we do it in conversation with the person who will wear it."
            />
            <Reveal delay={80} className="mt-8 space-y-5 text-sm leading-relaxed text-muted-foreground">
              <p>
                What began as a love for needle and thread has grown into a space where fashion and
                craft live together. Boutique collections hang beside costumes made to measure.
                Handmade accessories, aari work and embroidery share the table with fabric painting,
                resin art and brooches.
              </p>
              <p>
                There is a quiet corner for parlor services, and a workbench for classes — because so
                many people who visit want to learn the craft themselves.
              </p>
              <p>
                Every piece is finished by hand, checked slowly, and made for one person at a time.
              </p>
            </Reveal>
            <Reveal delay={140} className="mt-10 border-y border-border py-6">
              <p className="eyebrow text-primary">Creativity • Craftsmanship • Personalization</p>
            </Reveal>
          </div>

          <Reveal delay={100}>
            <div className="overflow-hidden rounded-sm shadow-soft">
              <img
                src={aboutImage}
                alt="Artisan stitching gold aari embroidery onto deep green fabric"
                width={1408}
                height={1600}
                className="h-[440px] w-full object-cover sm:h-[600px] lg:h-[720px]"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-secondary/40 py-20 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <div className="overflow-hidden rounded-sm">
              <img
                src={boutiqueImage}
                alt="Folded ivory, beige and forest green garments on a wooden boutique shelf"
                width={1100}
                height={1400}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
          <div>
            <h2 className="text-3xl leading-[1.15] text-primary sm:text-4xl">
              Everything we make, under one roof
            </h2>
            <ul className="mt-10 grid gap-x-10 sm:grid-cols-2">
              {services.map((service, index) => (
                <Reveal
                  key={service.number}
                  as="li"
                  delay={index * 40}
                  className="border-b border-border py-4 text-sm text-primary"
                >
                  {service.name}
                </Reveal>
              ))}
            </ul>
            <Reveal delay={120}>
              <Link
                to="/appointment"
                className="mt-10 inline-block rounded-sm bg-primary px-8 py-4 text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-forest-deep"
              >
                Book an Appointment
              </Link>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
