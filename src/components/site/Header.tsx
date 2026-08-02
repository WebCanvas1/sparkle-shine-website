import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, Phone, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { useContact } from "@/lib/content";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/services", label: "Services" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact Us" },
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { data: contact } = useContact();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled ? "py-2" : "py-4",
        )}
      >
        <div className="mx-auto w-full max-w-7xl px-4">
          <div
            className={cn(
              "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-3xl px-4 py-3 transition-all duration-500 lg:px-6",
              scrolled ? "glass-panel shadow-soft" : "bg-transparent",
            )}
          >
            <Logo />

            <div className="flex items-center gap-2">
              <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
                {links.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    activeOptions={{ exact: link.to === "/" }}
                    activeProps={{ className: "text-primary" }}
                    inactiveProps={{ className: "text-navy/75" }}
                    className="rounded-full px-4 py-2 text-sm font-semibold transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <Button asChild variant="hero" size="pill" className="hidden sm:inline-flex">
                <Link to="/contact">Get Free Quote</Link>
              </Button>

              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label="Open menu"
                className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-border bg-background/80 text-navy transition-colors hover:text-primary lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-[60] gradient-deep transition-all duration-500 lg:hidden",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <div className="flex h-full flex-col p-6">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
            <Logo inverted />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-navy-foreground/25 text-navy-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="mt-14 flex flex-col gap-2" aria-label="Mobile">
            {links.map((link, i) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-2 py-4 font-display text-3xl font-bold text-navy-foreground transition-all duration-300 hover:translate-x-2 hover:text-primary-glow"
                style={{ transitionDelay: `${i * 30}ms` }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto space-y-3">
            <Button asChild variant="glass" size="pill-lg" className="w-full">
              <a href={`tel:${contact.phone.replace(/\s/g, "")}`}>
                <Phone className="h-4 w-4" /> {contact.phone}
              </a>
            </Button>
            <Button asChild variant="hero" size="pill-lg" className="w-full">
              <Link to="/contact" onClick={() => setOpen(false)}>
                Get Free Quote
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
