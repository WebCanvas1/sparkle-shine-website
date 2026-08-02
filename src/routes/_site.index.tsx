import { createFileRoute } from "@tanstack/react-router";

import { seoUrlTags } from "@/lib/seo";

import { Hero } from "@/components/site/sections/Hero";
import { Features } from "@/components/site/sections/Features";
import { ServicesSection } from "@/components/site/sections/Services";
import { WhyChooseUs } from "@/components/site/sections/WhyChooseUs";
import { HowItWorks } from "@/components/site/sections/HowItWorks";
import { Stats } from "@/components/site/sections/Stats";
import { GallerySection } from "@/components/site/sections/Gallery";
import { Testimonials } from "@/components/site/sections/Testimonials";
import { FaqSection } from "@/components/site/sections/Faq";
import { ContactSection } from "@/components/site/sections/Contact";

const title = "Sparkle Cleaning Services | Residential, Office & Car Cleaning";
const description =
  "Professional cleaning services you can trust. Residential, commercial and car cleaning delivered with exceptional attention to detail. Free fixed-price quotes.";

export const Route = createFileRoute("/_site/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
            { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      ...seoUrlTags("/").meta,
    ],
    links: seoUrlTags("/").links,
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <ServicesSection />
      <WhyChooseUs />
      <HowItWorks />
      <Stats />
      <GallerySection />
      <Testimonials />
      <FaqSection />
      <ContactSection />
    </>
  );
}