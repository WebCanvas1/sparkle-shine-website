import { createFileRoute } from "@tanstack/react-router";

import { seoUrlTags } from "@/lib/seo";

import { GallerySection } from "@/components/site/sections/Gallery";
import { Testimonials } from "@/components/site/sections/Testimonials";
import { ContactSection } from "@/components/site/sections/Contact";

const title = "Cleaning Gallery | Before & After — Sparkle Cleaning Services";
const description =
  "Browse recent homes, offices and cars finished by our teams, with a before and after slider showing the Sparkle difference.";

export const Route = createFileRoute("/_site/gallery")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
            { property: "og:type", content: "website" },
      ...seoUrlTags("/gallery").meta,
    ],
    links: seoUrlTags("/gallery").links,
  }),
  component: GalleryPage,
});

function GalleryPage() {
  return (
    <div className="pt-20">
      <GallerySection />
      <Testimonials />
      <ContactSection />
    </div>
  );
}