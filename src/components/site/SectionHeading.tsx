import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  inverted = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  inverted?: boolean;
}) {
  return (
    <Reveal className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      {eyebrow && (
        <span
          className={cn(
            "inline-flex items-center rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em]",
            inverted ? "bg-navy-foreground/10 text-primary-glow" : "bg-accent text-primary",
          )}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          "mt-5 text-3xl font-extrabold leading-[1.1] sm:text-4xl lg:text-[2.75rem]",
          inverted ? "text-navy-foreground" : "text-navy",
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed",
            inverted ? "text-navy-foreground/70" : "text-muted-foreground",
          )}
        >
          {description}
        </p>
      )}
    </Reveal>
  );
}