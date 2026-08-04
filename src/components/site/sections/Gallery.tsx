import { useMemo, useState } from "react";
import { Expand } from "lucide-react";

import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  galleryImageFor,
  isBeforeAfter,
  useGallery,
} from "@/lib/content";
import type { GalleryItem } from "@/lib/content";
import { cn } from "@/lib/utils";

const categories = ["All", "Homes", "Offices", "Cars"] as const;

export function GallerySection() {
  const { data: items } = useGallery();
  const [active, setActive] =
    useState<(typeof categories)[number]>("All");
  const [zoomed, setZoomed] = useState<GalleryItem | null>(null);

  const filtered = useMemo(
    () =>
      active === "All"
        ? items
        : items.filter((item) => item.category === active),
    [items, active],
  );

  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto w-full max-w-7xl px-4">
        <SectionHeading
          eyebrow="Gallery"
          title="Results you can see from the doorway"
          description="A selection of recent homes, workplaces and vehicles finished by our teams."
        />

        <Reveal className="mt-10 flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActive(category)}
              className={cn(
                "h-11 rounded-full px-6 text-sm font-semibold transition-all duration-300",
                active === category
                  ? "gradient-brand text-primary-foreground shadow-[var(--shadow-glow)]"
                  : "border border-border bg-card text-navy hover:border-primary/40 hover:text-primary",
              )}
            >
              {category}
            </button>
          ))}
        </Reveal>

        <div className="mt-12 columns-1 gap-5 sm:columns-2 lg:columns-3">
          {filtered.map((item, index) => {
            const comparison =
              isBeforeAfter(item) && Boolean(item.after_image_url);

            return (
              <Reveal
                key={item.id}
                delay={(index % 3) * 90}
                className="mb-5 break-inside-avoid"
              >
                {comparison ? (
                  <figure className="relative overflow-hidden rounded-[1.5rem]">
                    <BeforeAfterSlider
                      before={galleryImageFor(item)}
                      after={item.after_image_url as string}
                      alt={
                        item.title ||
                        `${item.category} cleaning result`
                      }
                    />

                    <button
                      type="button"
                      onClick={() => setZoomed(item)}
                      aria-label={`Open ${
                        item.title || item.category
                      } comparison fullscreen`}
                      className="absolute bottom-3 right-3 grid h-10 w-10 place-items-center rounded-full glass-panel text-navy shadow-soft transition-transform duration-300 hover:scale-105"
                    >
                      <Expand className="h-4 w-4" />
                    </button>

                    <figcaption className="mt-3 text-sm font-bold text-navy">
                      {item.title || item.category}
                    </figcaption>
                  </figure>
                ) : (
                  <figure className="group relative overflow-hidden rounded-[1.5rem] shadow-soft">
                    <img
                      src={galleryImageFor(item)}
                      alt={
                        item.title ||
                        `${item.category} cleaning result`
                      }
                      loading="lazy"
                      className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    <figcaption className="absolute inset-0 flex items-end bg-gradient-to-t from-navy/80 via-navy/10 to-transparent p-5 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      <span className="text-sm font-bold text-navy-foreground">
                        {item.title || item.category}
                      </span>
                    </figcaption>
                  </figure>
                )}
              </Reveal>
            );
          })}
        </div>
      </div>

      <Dialog
        open={Boolean(zoomed)}
        onOpenChange={(open) => {
          if (!open) {
            setZoomed(null);
          }
        }}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-extrabold text-navy">
              {zoomed?.title || zoomed?.category}
            </DialogTitle>
          </DialogHeader>

          <p className="-mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {zoomed?.category}
          </p>

          {zoomed?.after_image_url && (
            <BeforeAfterSlider
              before={galleryImageFor(zoomed)}
              after={zoomed.after_image_url}
              alt={zoomed.title || zoomed.category}
              aspect="aspect-[16/10]"
            />
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
