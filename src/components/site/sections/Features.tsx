import { Leaf, ShieldCheck, Sparkles, Users } from "lucide-react";
import { Reveal } from "../Reveal";

const features = [
  {
    Icon: ShieldCheck,
    title: "Fully Insured",
    text: "Public liability cover on every single job.",
  },
  { Icon: Leaf, title: "Eco-Friendly Products", text: "Safe around children, pets and allergies." },
  { Icon: Users, title: "Experienced Cleaners", text: "Trained, police-checked, uniformed teams." },
  {
    Icon: Sparkles,
    title: "100% Satisfaction",
    text: "Not happy? We re-clean it free within 48h.",
  },
];

export function Features() {
  return (
    <section className="relative -mt-4 pb-8">
      <div className="mx-auto grid w-full max-w-7xl gap-5 px-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f, i) => (
          <Reveal key={f.title} delay={i * 90}>
            <article className="lift h-full rounded-3xl border border-border bg-card p-7 shadow-soft">
              <span className="grid h-13 w-13 place-items-center rounded-2xl bg-accent p-3.5 text-primary">
                <f.Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-lg font-bold text-navy">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
