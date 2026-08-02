import { BadgeCheck, CalendarClock, Leaf, PiggyBank, ShieldCheck, Users } from "lucide-react";
import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";

const reasons = [
  {
    Icon: Users,
    title: "Experienced Team",
    text: "Every cleaner is trained in-house to our 60-point finish standard.",
  },
  {
    Icon: PiggyBank,
    title: "Affordable Pricing",
    text: "Transparent fixed quotes with no hidden call-out fees.",
  },
  {
    Icon: ShieldCheck,
    title: "Fully Insured",
    text: "Comprehensive public liability cover for total peace of mind.",
  },
  {
    Icon: BadgeCheck,
    title: "Reliable Service",
    text: "On time, every time — or your next clean is discounted.",
  },
  {
    Icon: Leaf,
    title: "Eco Friendly",
    text: "Low-tox, biodegradable products safe for family and pets.",
  },
  {
    Icon: CalendarClock,
    title: "Flexible Scheduling",
    text: "Early mornings, evenings and weekends at no extra charge.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="relative overflow-hidden gradient-deep py-24 lg:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-primary-glow/25 blur-3xl"
      />
      <div className="relative mx-auto w-full max-w-7xl px-4">
        <SectionHeading
          inverted
          eyebrow="Why Sparkle"
          title="Six reasons clients stay with us for years"
          description="We built this company around the details other cleaners skip."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((r, i) => (
            <Reveal key={r.title} delay={i * 80}>
              <article className="h-full rounded-3xl border border-navy-foreground/12 bg-navy-foreground/6 p-7 backdrop-blur-md transition-all duration-500 hover:-translate-y-1.5 hover:bg-navy-foreground/12">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-glow/18 text-primary-glow">
                  <r.Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg font-bold text-navy-foreground">{r.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-foreground/70">{r.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
