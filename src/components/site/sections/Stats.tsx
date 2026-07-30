import { Counter, Reveal } from "../Reveal";
import { useAbout } from "@/lib/content";

export function Stats() {
  const { data: about } = useAbout();

  const stats = [
    { value: Number(about.stat_clients) || 0, suffix: "+", label: "Happy clients" },
    { value: Number(about.stat_years) || 0, suffix: " yrs", label: "In business" },
    { value: Number(about.stat_cleans) || 0, suffix: "+", label: "Cleans completed" },
    { value: Number(about.stat_rating) || 0, suffix: "/5", label: "Average rating" },
  ];

  return (
    <section className="pb-8">
      <div className="mx-auto w-full max-w-7xl px-4">
        <Reveal>
          <div className="grid gap-8 rounded-[2rem] border border-border bg-card p-10 shadow-soft sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-display text-4xl font-extrabold text-gradient">
                  <Counter to={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}