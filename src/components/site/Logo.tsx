import { Link } from "@tanstack/react-router";
import logoSrc from "@/assets/sparkle-logo.webp";
import { cn } from "@/lib/utils";

export const logoUrl = logoSrc;

export function Logo({
  className,
  size = 44,
  inverted = false,
  withText = true,
}: {
  className?: string;
  size?: number;
  inverted?: boolean;
  withText?: boolean;
}) {
  return (
    <Link to="/" className={cn("flex min-w-0 items-center gap-3", className)} aria-label="Sparkle Cleaning Services home">
      <span
        className="grid shrink-0 place-items-center overflow-hidden rounded-2xl bg-background shadow-soft"
        style={{ width: size, height: size }}
      >
        <img
          src={logoUrl}
          alt="Sparkle Cleaning Services logo"
          width={size}
          height={size}
          className="h-full w-full object-cover"
        />
      </span>
      {withText && (
        <span className="min-w-0 leading-tight">
          <span
            className={cn(
              "block truncate font-display text-base font-extrabold tracking-tight",
              inverted ? "text-navy-foreground" : "text-navy",
            )}
          >
            SPARKLE
          </span>
          <span
            className={cn(
              "block truncate text-[10px] font-semibold uppercase tracking-[0.22em]",
              inverted ? "text-navy-foreground/70" : "text-primary",
            )}
          >
            Cleaning Services
          </span>
        </span>
      )}
    </Link>
  );
}