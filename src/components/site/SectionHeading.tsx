import { Reveal } from "@/components/site/Reveal";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? <p className="eyebrow text-accent-foreground/70">{eyebrow}</p> : null}
      <h2 className="mt-4 text-3xl leading-[1.15] text-primary sm:text-4xl lg:text-[2.75rem]">
        {title}
      </h2>
      {intro ? (
        <p className="mt-5 text-base leading-relaxed text-muted-foreground">{intro}</p>
      ) : null}
    </Reveal>
  );
}
