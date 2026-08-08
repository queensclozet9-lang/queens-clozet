import { createFileRoute } from "@tanstack/react-router";
import { AppointmentForm } from "@/components/site/AppointmentForm";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { business, whatsappLink } from "@/lib/site";

type AppointmentSearch = { service?: string | undefined };

export const Route = createFileRoute("/appointment")({
  validateSearch: (search: Record<string, unknown>): AppointmentSearch => ({
    service: typeof search['service'] === "string" ? search['service'] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Book an Appointment — Queen Clozet Boutique, Perambalur" },
      {
        name: "description",
        content:
          "Request an appointment with Queen Clozet for boutique fashion, customization, aari work, embroidery, resin art, parlor services or creative classes. No online payment needed.",
      },
      { property: "og:title", content: "Book an Appointment at Queen Clozet" },
      {
        property: "og:description",
        content:
          "Share your details and preferred time between 9:00 AM and 7:00 PM. We'll contact you to confirm.",
      },
    ],
  }),
  component: Appointment,
});

function Appointment() {
  const { service } = Route.useSearch();

  return (
    <section className="mx-auto max-w-6xl px-5 pb-24 pt-16 sm:px-8 lg:pb-32 lg:pt-24">
      <SectionHeading
        eyebrow="Appointments"
        title="Book an Appointment"
        intro="Share a few details and we will contact you to confirm your visit. Appointments are available between 9:00 AM and 7:00 PM."
      />

      <div className="mt-14 grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
        <Reveal>
          <AppointmentForm {...(service ? { defaultService: service } : {})} />
        </Reveal>

        <Reveal delay={100} className="lg:border-l lg:border-border lg:pl-12">
          <h2 className="text-2xl text-primary">Prefer to talk first?</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Call or message us and we will help you choose the right service and time.
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <a
              href={`tel:${business.phoneIntl}`}
              className="rounded-sm bg-primary px-6 py-4 text-center text-xs font-medium uppercase tracking-[0.18em] text-primary-foreground transition-colors hover:bg-forest-deep"
            >
              Call {business.phone}
            </a>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-sm border border-primary px-6 py-4 text-center text-xs font-medium uppercase tracking-[0.18em] text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              WhatsApp Us
            </a>
          </div>

          <div className="mt-10 border-t border-border pt-8">
            <p className="eyebrow text-accent-foreground/70">Atelier</p>
            <address className="mt-4 space-y-1 text-sm not-italic leading-relaxed text-muted-foreground">
              {business.addressLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </address>
            <p className="mt-4 text-sm text-muted-foreground">Open daily {business.hours}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
