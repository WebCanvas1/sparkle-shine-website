import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";

const steps = [
  {
    title: "Request Quote",
    text: "Tell us about your space in 60 seconds. We reply with a fixed price the same day.",
  },
  {
    title: "Schedule Service",
    text: "Pick a time that suits — mornings, evenings or weekends, no surcharge.",
  },
  {
    title: "Professional Cleaning",
    text: "Our uniformed team arrives fully equipped and works to a detailed checklist.",
  },
  {
    title: "Enjoy Your Sparkling Space",
    text: "We walk you through the finish. Not perfect? We come back free.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto w-full max-w-7xl px-4">
        <SectionHeading
          eyebrow="How It Works"
          title="Four simple steps to a spotless space"
          description="No lock-in contracts, no confusing quotes, no chasing anyone up."
        />

        <ol className="relative mt-16 grid gap-10 lg:grid-cols-4">
          <span
            aria-hidden
            className="absolute left-6 top-6 hidden h-px w-full bg-gradient-to-r from-primary/40 via-primary-glow/40 to-transparent lg:block"
          />
          {steps.map((step, i) => (
            <Reveal as="li" key={step.title} delay={i * 120} className="relative">
              <span className="relative z-10 grid h-13 w-13 place-items-center rounded-2xl gradient-brand font-display text-lg font-extrabold text-primary-foreground shadow-[var(--shadow-glow)]">
                {i + 1}
              </span>
              <h3 className="mt-6 text-lg font-bold text-navy">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
