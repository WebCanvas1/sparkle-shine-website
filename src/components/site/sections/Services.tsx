import { Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";
import { serviceImageFor, useServices } from "@/lib/content";

export function ServicesSection({ compact = false }: { compact?: boolean }) {
  const { data: services } = useServices();

  return (
    <section id="services" className="py-24 lg:py-32">
      <div className="mx-auto w-full max-w-7xl px-4">
        <SectionHeading
          eyebrow="Our Services"
          title="Premium cleaning, tailored to your space"
          description="Three specialist divisions, one standard of finish. Every clean is quoted upfront and delivered by a team that knows your property."
        />

        <div className="mt-14 grid gap-7 lg:grid-cols-3">
          {services.map((service, i) => (
            <Reveal key={service.id} delay={i * 110}>
              <article className="lift group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-soft">
                <div className="relative overflow-hidden">
                  <img
                    src={serviceImageFor(service.slug, service.image_url)}
                    alt={service.title}
                    loading="lazy"
                    width={1200}
                    height={900}
                    className="h-56 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 rounded-full glass-panel px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-navy">
                    {service.category}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-7">
                  <h3 className="text-xl font-bold text-navy">{service.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {service.description}
                  </p>

                  {!compact && (
                    <ul className="mt-6 space-y-2.5">
                      {service.features.map((f) => (
                        <li
                          key={f}
                          className="flex items-center gap-3 text-sm font-medium text-navy"
                        >
                          <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent text-primary">
                            <Check className="h-3 w-3" />
                          </span>
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}

                  <Button asChild variant="navy" size="pill" className="mt-8 w-full">
                    <Link to="/contact">
                      {service.cta_text} <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
