import { createFileRoute } from "@tanstack/react-router";

import { seoUrlTags } from "@/lib/seo";

import { ContactSection } from "@/components/site/sections/Contact";
import { FaqSection } from "@/components/site/sections/Faq";

const title = "Contact Sparkle Cleaning Services | Free Quote";
const description =
  "Request a free fixed-price cleaning quote, call us directly or message on WhatsApp. Same-day replies during business hours.";

export const Route = createFileRoute("/_site/contact")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      ...seoUrlTags("/contact").meta,
    ],
    links: seoUrlTags("/contact").links,
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="pt-20">
      <ContactSection />
      <FaqSection />
    </div>
  );
}
