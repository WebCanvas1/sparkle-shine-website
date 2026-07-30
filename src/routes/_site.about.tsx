import { createFileRoute } from "@tanstack/react-router";
import { Compass, Heart, Target } from "lucide-react";

import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Stats } from "@/components/site/sections/Stats";
import { WhyChooseUs } from "@/components/site/sections/WhyChooseUs";
import { ContactSection } from "@/components/site/sections/Contact";
import { localImages, useAbout } from "@/lib/content";

const title = "About Sparkle Cleaning Services | Our Story & Team";
const description =
  "Meet the team behind Sparkle Cleaning Services — our story, mission, vision and the standards that keep clients with us for years.";

export const Route = createFileRoute("/_site/about")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "/about" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { data: about } = useAbout();

  return (
    <>
      <section className="pb-16 pt-36 lg:pb-24 lg:pt-44">
        <div className="mx-auto w-full max-w-7xl px-4">
          <SectionHeading eyebrow="About Us" title={about.heading} description={about.story} />

          <Reveal delay={120} className="mt-14 overflow-hidden rounded-[2rem] shadow-lift">
            <img
              src={about.team_image_url || localImages.team}
              alt="The Sparkle Cleaning Services team"
              loading="lazy"
              width={1400}
              height={1000}
              className="h-[22rem] w-full object-cover sm:h-[30rem]"
            />
          </Reveal>

          <div className="mt-14 grid gap-5 lg:grid-cols-3">
            {[
              { Icon: Target, title: "Our Mission", text: about.mission },
              { Icon: Compass, title: "Our Vision", text: about.vision },
              {
                Icon: Heart,
                title: "Our Promise",
                text: "If any part of a clean falls short of our standard, we return and re-clean it free of charge within 48 hours. No debate, no invoice.",
              },
            ].map((c, i) => (
              <Reveal key={c.title} delay={i * 100}>
                <article className="lift h-full rounded-3xl border border-border bg-card p-8 shadow-soft">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent text-primary">
                    <c.Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-lg font-bold text-navy">{c.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Stats />
      <WhyChooseUs />
      <ContactSection />
    </>
  );
}