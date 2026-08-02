import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Phone, ShieldCheck, Sparkles, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Reveal } from "../Reveal";
import { useContact, useHero, localImages } from "@/lib/content";

export function Hero() {
  const { data: hero } = useHero();
  const { data: contact } = useContact();
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => setOffset(Math.min(window.scrollY, 500));
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative overflow-hidden pb-20 pt-32 lg:pb-32 lg:pt-44">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 h-[38rem] w-[38rem] rounded-full opacity-30 blur-3xl gradient-brand"
        style={{ transform: `translateY(${offset * 0.15}px)` }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-1/2 h-96 w-96 rounded-full bg-accent opacity-60 blur-3xl"
      />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-14 px-4 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">
              <Sparkles className="h-3.5 w-3.5" /> {hero.eyebrow}
            </span>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] text-navy sm:text-5xl lg:text-6xl">
              {hero.headline.split(" ").slice(0, -2).join(" ")}{" "}
              <span className="text-gradient">{hero.headline.split(" ").slice(-2).join(" ")}</span>
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              {hero.subheadline}
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild variant="hero" size="pill-lg">
                <Link to="/contact">
                  {hero.primary_cta} <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="glass" size="pill-lg">
                <a href={`tel:${contact.phone.replace(/\s/g, "")}`}>
                  <Phone className="h-4 w-4" /> {hero.secondary_cta}
                </a>
              </Button>
            </div>
          </Reveal>

          <Reveal delay={320}>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary-glow text-primary-glow" />
                  ))}
                </div>
                <span className="text-sm font-semibold text-navy">4.9 from 400+ reviews</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-navy">
                <ShieldCheck className="h-4 w-4 text-primary" /> Fully insured & police-checked
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={200} className="relative">
          <div
            className="relative overflow-hidden rounded-[2rem] shadow-lift"
            style={{ transform: `translateY(${-offset * 0.05}px)` }}
          >
            <img
              src={hero.image_url || localImages.hero}
              alt="Professional cleaner polishing a window in a bright modern living room"
              width={1200}
              height={1408}
              fetchPriority="high"
              className="h-[26rem] w-full object-cover sm:h-[34rem] lg:h-[38rem]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/35 to-transparent" />
          </div>

          <div className="absolute -bottom-6 left-4 rounded-3xl glass-panel px-5 py-4 shadow-soft sm:left-8">
            <p className="font-display text-2xl font-extrabold text-navy">100%</p>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Satisfaction guarantee
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
