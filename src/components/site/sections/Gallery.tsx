import { useMemo, useRef, useState } from "react";
import { MoveHorizontal } from "lucide-react";

import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";
import { localImages, useGallery } from "@/lib/content";
import { cn } from "@/lib/utils";

const categories = ["All", "Homes", "Offices", "Cars"] as const;

export function GallerySection() {
  const { data: items } = useGallery();
  const [active, setActive] = useState<(typeof categories)[number]>("All");

  const filtered = useMemo(
    () => (active === "All" ? items : items.filter((i) => i.category === active)),
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
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setActive(c)}
              className={cn(
                "h-11 rounded-full px-6 text-sm font-semibold transition-all duration-300",
                active === c
                  ? "gradient-brand text-primary-foreground shadow-[var(--shadow-glow)]"
                  : "border border-border bg-card text-navy hover:border-primary/40 hover:text-primary",
              )}
            >
              {c}
            </button>
          ))}
        </Reveal>

        <div className="mt-12 columns-1 gap-5 sm:columns-2 lg:columns-3">
          {filtered.map((item, i) => (
            <Reveal key={item.id} delay={(i % 3) * 90} className="mb-5 break-inside-avoid">
              <figure className="group relative overflow-hidden rounded-[1.5rem] shadow-soft">
                <img
                  src={item.image_url}
                  alt={item.title || `${item.category} cleaning result`}
                  loading="lazy"
                  className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <figcaption className="absolute inset-0 flex items-end bg-gradient-to-t from-navy/80 via-navy/10 to-transparent p-5 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <span className="text-sm font-bold text-navy-foreground">
                    {item.title || item.category}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <div className="mt-16">
          <Reveal>
            <h3 className="text-center font-display text-2xl font-extrabold text-navy">
              Before &amp; After
            </h3>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Drag the handle to see the difference a Sparkle deep clean makes.
            </p>
          </Reveal>
          <Reveal delay={120} className="mt-8">
            <BeforeAfter before={localImages.galleryBathroom} after={localImages.galleryKitchen} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function BeforeAfter({ before, after }: { before: string; after: string }) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);

  const move = (clientX: number) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setPos(Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)));
  };

  return (
    <div
      ref={ref}
      className="relative aspect-[16/10] w-full select-none overflow-hidden rounded-[1.75rem] shadow-lift"
      onPointerMove={(e) => e.buttons === 1 && move(e.clientX)}
      onPointerDown={(e) => move(e.clientX)}
    >
      <img src={before} alt="Before cleaning" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
        <img
          src={after}
          alt="After cleaning"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ width: ref.current?.clientWidth ?? "100%", maxWidth: "none" }}
        />
        <span className="absolute left-4 top-4 rounded-full glass-panel px-3 py-1 text-xs font-bold uppercase tracking-wider text-navy">
          After
        </span>
      </div>
      <span className="absolute right-4 top-4 rounded-full glass-panel px-3 py-1 text-xs font-bold uppercase tracking-wider text-navy">
        Before
      </span>
      <div
        className="absolute inset-y-0 w-1 bg-primary-foreground/90"
        style={{ left: `${pos}%` }}
      >
        <span className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize place-items-center rounded-full gradient-brand text-primary-foreground shadow-lift">
          <MoveHorizontal className="h-5 w-5" />
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label="Before and after comparison slider"
        className="absolute inset-x-0 bottom-3 mx-auto w-2/3 cursor-ew-resize opacity-0"
      />
    </div>
  );
}