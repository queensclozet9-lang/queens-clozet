import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { galleryCategories, galleryItems, type GalleryItem } from "@/lib/gallery";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/collections")({
  head: () => ({
    meta: [
      { title: "Collections & Portfolio — Handcrafted Work | Queen Clozet" },
      {
        name: "description",
        content:
          "Browse the Queen Clozet portfolio: boutique pieces, custom costumes, stone work accessories, aari work, embroidery, resin art, fabric painting and brooches.",
      },
      { property: "og:title", content: "Queen Clozet Collections & Portfolio" },
      {
        property: "og:description",
        content:
          "A gallery of boutique fashion and handcrafted work — aari, embroidery, resin art, fabric painting and brooches.",
      },
    ],
  }),
  component: Collections,
});

function Collections() {
  const [active, setActive] = useState<string>("All");
  const [selected, setSelected] = useState<GalleryItem | null>(null);
  const [dbItems, setDbItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCollection() {
      try {
        const { data, error } = await supabase
          .from("collection_items")
          .select("*")
          .order("display_order", { ascending: true })
          .order("created_at", { ascending: false });

        if (error || !data || data.length === 0) {
          setDbItems(galleryItems);
        } else {
          const mapped: GalleryItem[] = data.map((item) => ({
            id: item.id,
            src: item.src,
            alt: item.alt || item.title,
            title: item.title,
            category: item.category as GalleryItem["category"],
            description: item.description || "",
            width: item.width || 1200,
            height: item.height || 1000,
          }));
          setDbItems(mapped);
        }
      } catch {
        setDbItems(galleryItems);
      } finally {
        setLoading(false);
      }
    }

    void fetchCollection();
  }, []);

  const currentSourceItems = dbItems.length > 0 ? dbItems : galleryItems;

  const filteredItems =
    active === "All"
      ? currentSourceItems
      : currentSourceItems.filter((item) => item.category === active);

  useEffect(() => {
    if (!selected) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [selected]);

  return (
    <>
      <section className="mx-auto max-w-7xl px-5 pb-10 pt-16 sm:px-8 lg:pt-24">
        <SectionHeading
          eyebrow="Collections & Portfolio"
          title="A closer look at our handwork"
          intro="Pieces from the boutique and the craft table. Every item is made by hand and can be recreated in your own colours and measurements."
        />
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8 lg:pb-32">
        {/* Categories Pills */}
        <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-4 sm:mx-0 sm:flex-wrap sm:px-0">
          {galleryCategories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActive(category)}
              className={cn(
                "shrink-0 rounded-full border px-5 py-2.5 text-xs uppercase tracking-[0.14em] transition-colors",
                active === category
                  ? "border-primary bg-primary text-primary-foreground font-semibold"
                  : "border-border text-muted-foreground hover:border-primary hover:text-primary",
              )}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Masonry / Grid Gallery */}
        <div className="mt-10 columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
          {filteredItems.map((item, index) => (
            <Reveal key={item.id} delay={Math.min(index, 6) * 60} className="break-inside-avoid">
              <button
                type="button"
                onClick={() => setSelected(item)}
                className="group block w-full text-left focus:outline-none"
              >
                <span className="block overflow-hidden rounded-sm bg-muted/20">
                  <img
                    src={item.src}
                    alt={item.alt}
                    width={item.width}
                    height={item.height}
                    loading="lazy"
                    className="w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                </span>
                <span className="mt-4 block">
                  <span className="eyebrow block text-accent-foreground/70">{item.category}</span>
                  <span className="mt-2 block font-serif text-xl text-primary">{item.title}</span>
                </span>
              </button>
            </Reveal>
          ))}
        </div>

        {!loading && filteredItems.length === 0 ? (
          <p className="mt-16 text-sm text-muted-foreground">
            New pieces in this category are being photographed. Meanwhile, do get in touch.
          </p>
        ) : null}
      </section>

      {/* Pop-up Image Viewer & Details Modal */}
      {selected ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selected.title}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-forest-deep/95 px-4 py-8"
          onClick={() => setSelected(null)}
        >
          <button
            type="button"
            aria-label="Close image viewer"
            onClick={() => setSelected(null)}
            className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full border border-ivory/30 text-ivory hover:border-ivory transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <div
            className="grid max-h-full w-full max-w-5xl gap-8 overflow-y-auto lg:grid-cols-[1.4fr_1fr] lg:items-center"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={selected.src}
              alt={selected.alt}
              width={selected.width}
              height={selected.height}
              className="max-h-[70vh] w-full rounded-sm object-contain"
            />
            <div className="text-ivory">
              <p className="eyebrow text-gold uppercase tracking-widest">{selected.category}</p>
              <h2 className="mt-4 font-serif text-3xl sm:text-4xl">{selected.title}</h2>
              <p className="mt-4 text-sm leading-relaxed text-ivory/75">{selected.description}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/appointment"
                  className="rounded-sm bg-ivory px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-[0.18em] text-primary transition-colors hover:bg-gold"
                >
                  Enquire
                </Link>
                <Link
                  to="/appointment"
                  className="rounded-sm border border-ivory/40 px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-[0.18em] text-ivory transition-colors hover:border-gold hover:text-gold"
                >
                  Book an Appointment
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
