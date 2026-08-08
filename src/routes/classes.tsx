import { createFileRoute, Link } from "@tanstack/react-router";
import classesImage from "@/assets/classes.jpg";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { classCategories } from "@/lib/site";

export const Route = createFileRoute("/classes")({
  head: () => ({
    meta: [
      { title: "Creative Classes — Aari, Embroidery, Resin Art | Queen Clozet" },
      {
        name: "description",
        content:
          "Learn aari work, embroidery, fabric painting, resin art and other handcrafted techniques with Queen Clozet in Perambalur. Enquire about upcoming classes.",
      },
      { property: "og:title", content: "Learn the Art — Queen Clozet Classes" },
      {
        property: "og:description",
        content:
          "Small-group classes in aari work, embroidery, fabric painting, resin art and other creative crafts.",
      },
    ],
  }),
  component: Classes,
});

function Classes() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-16 sm:px-8 lg:pb-24 lg:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="Classes & Training"
              title="Learn the Art. Create Something Beautiful."
              intro="Queen Clozet also teaches the crafts we practise. Sessions are hands-on and kept small, so you finish with something you made yourself."
            />
            <Reveal delay={80} className="mt-8 text-sm leading-relaxed text-muted-foreground">
              <p>
                Whether you want a new skill, a creative outlet, or a foundation for your own small
                business, we will guide you through the techniques step by step, with the same
                materials we use in the atelier.
              </p>
            </Reveal>
          </div>
          <Reveal delay={100}>
            <div className="overflow-hidden rounded-sm shadow-soft">
              <img
                src={classesImage}
                alt="Craft class table with embroidery hoops, fabric paints, brushes and resin art pieces"
                width={1600}
                height={1104}
                className="h-[340px] w-full object-cover sm:h-[460px]"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-secondary/40 py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal>
            <h2 className="text-3xl leading-[1.15] text-primary sm:text-4xl">What you can learn</h2>
          </Reveal>
          <ul className="mt-12 grid gap-x-14 sm:grid-cols-2 lg:grid-cols-3">
            {classCategories.map((category, index) => (
              <Reveal
                key={category}
                as="li"
                delay={index * 60}
                className="border-t border-border py-7"
              >
                <h3 className="text-xl text-primary">{category}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Taught hands-on in the atelier.
                </p>
              </Reveal>
            ))}
          </ul>
          <Reveal delay={120} className="mt-12 max-w-xl text-sm leading-relaxed text-muted-foreground">
            <p>
              Class schedules, session length and fees are shared directly, based on the craft you
              choose and the group. Send us an enquiry and we will get back to you with the details.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-20 text-center sm:px-8 lg:py-28">
        <Reveal>
          <p className="eyebrow text-accent-foreground/70">Interested in learning?</p>
          <h2 className="mt-4 text-3xl text-primary sm:text-4xl">
            Tell us which craft you'd like to learn
          </h2>
          <Link
            to="/appointment"
            search={{ service: "Classes" }}
            className="mt-10 inline-block rounded-sm bg-primary px-8 py-4 text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-forest-deep"
          >
            Enquire About Classes
          </Link>
        </Reveal>
      </section>
    </>
  );
}
