import { Quote, Star } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";
import { useTestimonials } from "@/lib/content";

export function Testimonials() {
  const { data: testimonials } = useTestimonials();

  return (
    <section className="bg-secondary/60 py-24 lg:py-32">
      <div className="mx-auto w-full max-w-7xl px-4">
        <SectionHeading
          eyebrow="Testimonials"
          title="Rated 4.9 by hundreds of local clients"
          description="Real reviews from homes, offices and car owners we look after every week."
        />

        <Reveal className="mt-14">
          <Carousel opts={{ align: "start", loop: true }}>
            <CarouselContent className="-ml-5">
              {testimonials.map((t) => (
                <CarouselItem key={t.id} className="pl-5 sm:basis-1/2 lg:basis-1/3">
                  <article className="lift flex h-full flex-col rounded-[1.75rem] border border-border bg-card p-8 shadow-soft">
                    <div className="flex items-center justify-between">
                      <div className="flex">
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-primary-glow text-primary-glow" />
                        ))}
                      </div>
                      <Quote className="h-7 w-7 text-accent" />
                    </div>
                    <p className="mt-5 flex-1 text-sm leading-relaxed text-muted-foreground">
                      “{t.quote}”
                    </p>
                    <div className="mt-7 flex items-center gap-3 border-t border-border pt-5">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full gradient-brand font-display text-sm font-bold text-primary-foreground">
                        {t.name.charAt(0)}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-navy">{t.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{t.location}</p>
                      </div>
                    </div>
                  </article>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="mt-8 flex justify-center gap-3">
              <CarouselPrevious className="static translate-y-0 h-11 w-11 rounded-full" />
              <CarouselNext className="static translate-y-0 h-11 w-11 rounded-full" />
            </div>
          </Carousel>
        </Reveal>
      </div>
    </section>
  );
}
