import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Brush,
  Flower2,
  Gem,
  GraduationCap,
  Palette,
  Scissors,
  Shirt,
  Sparkles,
  Ribbon,
  Wand2,
} from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { services } from "@/lib/site";

const icons = [Shirt, Scissors, Gem, Flower2, Sparkles, Ribbon, Brush, Wand2, Palette, GraduationCap];

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Boutique, Aari Work, Resin Art & Parlor | Queens Clozet" },
      {
        name: "description",
        content:
          "Explore Queens Clozet services: boutique fashion, costume customization, stone work accessories, resin arts, aari work, brooches, fabric painting, embroidery, parlor and creative classes.",
      },
      { property: "og:title", content: "Queens Clozet Services" },
      {
        property: "og:description",
        content:
          "Ten handcrafted services — boutique, customization, aari work, embroidery, resin art, brooches, fabric painting, parlor and classes.",
      },
    ],
  }),
  component: Services,
});

function Services() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-5 pb-12 pt-16 sm:px-8 lg:pt-24">
        <SectionHeading
          eyebrow="Service Menu"
          title="Ten ways to work with Queens Clozet"
          intro="Each service is offered as personal, made-to-order work. Tell us what you have in mind and we will shape it with you."
        />
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 lg:pb-28">
        <ul className="border-t border-border">
          {services.map((service, index) => {
            const Icon = icons[index] ?? Sparkles;
            return (
              <Reveal
                key={service.number}
                as="li"
                delay={Math.min(index, 6) * 50}
                className="group border-b border-border"
              >
                <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-5 py-8 transition-colors sm:grid-cols-[auto_auto_minmax(0,1fr)_auto] sm:items-center sm:gap-8 lg:py-10">
                  <span className="font-serif text-xl text-accent-foreground/70 sm:text-2xl">
                    {service.number}
                  </span>
                  <span className="hidden h-12 w-12 shrink-0 place-items-center rounded-full border border-border text-primary transition-colors group-hover:border-accent sm:grid">
                    <Icon className="h-5 w-5" strokeWidth={1.25} />
                  </span>
                  <div className="min-w-0">
                    <h2 className="text-2xl text-primary sm:text-[1.75rem]">{service.name}</h2>
                    <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                      {service.description}
                    </p>
                  </div>
                  <Link
                    to="/appointment"
                    search={{ service: service.name }}
                    className="col-span-2 justify-self-start text-xs font-semibold uppercase tracking-[0.18em] text-primary underline decoration-accent decoration-2 underline-offset-8 sm:col-span-1 sm:justify-self-end hover:text-forest-deep"
                  >
                    Enquire
                  </Link>
                </div>
              </Reveal>
            );
          })}
        </ul>

        <Reveal delay={100} className="mt-16 border border-border bg-secondary/40 p-10 text-center rounded-sm">
          <h2 className="text-2xl text-primary sm:text-3xl">Not sure which service you need?</h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
            Book a general enquiry and we will talk it through with you.
          </p>
          <Link
            to="/appointment"
            className="mt-8 inline-block rounded-sm bg-primary px-8 py-4 text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-forest-deep"
          >
            Book an Appointment
          </Link>
        </Reveal>
      </section>
    </>
  );
}
