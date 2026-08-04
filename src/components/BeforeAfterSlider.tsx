import { useCallback, useRef, useState } from "react";
import { MoveHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";

type Props = {
  before: string;
  after: string;
  alt?: string;
  className?: string;
  /** Tailwind aspect ratio class for the container. */
  aspect?: string;
};

/**
 * Reusable before/after comparison slider.
 * Supports mouse, touch and keyboard (arrow keys) interaction.
 */
export function BeforeAfterSlider({ before, after, alt = "", className, aspect = "aspect-[4/3]" }: Props) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);

  const moveTo = useCallback((clientX: number) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    setPos(Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)));
  }, []);

  return (
    <div
      ref={ref}
      className={cn("relative w-full select-none overflow-hidden rounded-[1.5rem] shadow-soft touch-none", aspect, className)}
      onPointerDown={(e) => {
        (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
        moveTo(e.clientX);
      }}
      onPointerMove={(e) => e.buttons === 1 && moveTo(e.clientX)}
    >
      <img
        src={before}
        alt={alt ? `${alt} — before cleaning` : "Before cleaning"}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${pos}%` }}>
        <div className="absolute inset-y-0 left-0 h-full" style={{ width: ref.current?.clientWidth ?? "100%" }}>
          <img
            src={after}
            alt={alt ? `${alt} — after cleaning` : "After cleaning"}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      <span className="pointer-events-none absolute left-3 top-3 rounded-full glass-panel px-3 py-1 text-[0.7rem] font-bold uppercase tracking-wider text-navy shadow-soft">
        After
      </span>
      <span className="pointer-events-none absolute right-3 top-3 rounded-full glass-panel px-3 py-1 text-[0.7rem] font-bold uppercase tracking-wider text-navy shadow-soft">
        Before
      </span>

      <div className="pointer-events-none absolute inset-y-0 w-1 bg-primary-foreground/90" style={{ left: `${pos}%` }}>
        <span className="absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full gradient-brand text-primary-foreground shadow-lift">
          <MoveHorizontal className="h-5 w-5" />
        </span>
      </div>

      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        role="slider"
        aria-label={alt ? `${alt} before and after comparison` : "Before and after comparison"}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        aria-valuetext={`${Math.round(pos)}% of the after photo shown`}
        className="absolute inset-x-0 bottom-3 mx-auto h-11 w-2/3 cursor-ew-resize opacity-0"
      />
    </div>
  );
}