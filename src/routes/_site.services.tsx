import { createFileRoute } from "@tanstack/react-router";

import { seoUrlTags } from "@/lib/seo";

import { ServicesSection } from "@/components/site/sections/Services";
import { HowItWorks } from "@/components/site/sections/HowItWorks";
import { FaqSection } from "@/components/site/sections/Faq";
import { ContactSection } from "@/components/site/sections/Contact";
import { SectionHeading } from "@/components/site/SectionHeading";

const title = "Cleaning Services | Residential, Commercial & Car — Sparkle";
const description =
  "Regular and deep home cleaning, end of lease, offices, retail, medical, strata and full car detailing. Fixed-price quotes, fully insured teams.";

export const Route = createFileRoute("/_site/services")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      ...seoUrlTags("/services").meta,
    ],
    links: seoUrlTags("/services").links,
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <>
      <section className="pb-4 pt-36 lg:pt-44">
        <div className="mx-auto w-full max-w-7xl px-4">
          <SectionHeading
            eyebrow="What We Do"
            title="Specialist cleaning divisions, one standard"
            description="Whether it's a family home, a 40-desk office or your car, the same checklist discipline applies."
          />
        </div>
      </section>
      <ServicesSection />
      <HowItWorks />
      <FaqSection />
      <ContactSection />
    </>
  );
}
