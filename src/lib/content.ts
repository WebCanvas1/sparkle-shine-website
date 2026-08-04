import { useQuery } from "@tanstack/react-query";

import heroImg from "@/assets/hero-cleaning.webp";
import residentialImg from "@/assets/service-residential.webp";
import commercialImg from "@/assets/service-commercial.webp";
import carImg from "@/assets/service-car.webp";
import teamImg from "@/assets/team.webp";
import galleryKitchen from "@/assets/gallery-kitchen.webp";
import galleryBathroom from "@/assets/gallery-bathroom.webp";
import galleryCarInterior from "@/assets/gallery-car-interior.webp";
import galleryRetail from "@/assets/gallery-retail.webp";

import {
  defaultAbout,
  defaultContact,
  defaultHero,
  fallbackFaqs,
  fallbackGallery,
  fallbackServices,
  fallbackTestimonials,
  type ContentBundle,
  type GalleryItem,
} from "./content-data";

export * from "./content-data";

export const localImages = {
  hero: heroImg,
  residential: residentialImg,
  commercial: commercialImg,
  car: carImg,
  team: teamImg,
  galleryKitchen,
  galleryBathroom,
  galleryCarInterior,
  galleryRetail,
};

/** Bundled artwork used whenever a gallery item has no KV image of its own. */
const localGalleryImages: Record<string, string> = {
  g1: galleryKitchen,
  g2: commercialImg,
  g3: galleryCarInterior,
  g4: galleryBathroom,
  g5: galleryRetail,
  g6: carImg,
  g7: residentialImg,
};

export const galleryImageFor = (item: GalleryItem) =>
  item.image_url || localGalleryImages[item.id] || residentialImg;

/** True when an item should render as a before/after comparison. */
export const isBeforeAfter = (item: GalleryItem) =>
  item.item_type === "before_after" || Boolean(item.image_url && item.after_image_url);

export const serviceImageFor = (slug: string, imageUrl: string) => {
  if (imageUrl) return imageUrl;
  if (slug.includes("commercial")) return commercialImg;
  if (slug.includes("car")) return carImg;
  return residentialImg;
};

/*
 * Content source.
 *
 * Content is served by the Cloudflare Pages Function `GET /api/content`,
 * which reads the `content:*` keys from the SPARKLE_CONTENT KV namespace.
 * If KV is empty, unreachable, or the request fails, every hook falls back to
 * the static content in `content-data.ts`, so the public site never breaks.
 */

export type ContentResponse = Partial<ContentBundle> & { updated_at?: string };

export const CONTENT_QUERY_KEY = ["site-content"] as const;

export async function fetchContent(): Promise<ContentResponse> {
  const res = await fetch("/api/content", { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error("Content unavailable");
  return (await res.json()) as ContentResponse;
}

function useContent() {
  return useQuery({
    queryKey: CONTENT_QUERY_KEY,
    queryFn: fetchContent,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

const sorted = <T extends { sort_order: number; is_published: boolean }>(items: T[]) =>
  items.filter((i) => i.is_published !== false).slice().sort((a, b) => a.sort_order - b.sort_order);

export const useHero = () => {
  const { data } = useContent();
  return { data: data?.hero ?? defaultHero };
};

export const useAbout = () => {
  const { data } = useContent();
  return { data: data?.about ?? defaultAbout };
};

export const useContact = () => {
  const { data } = useContent();
  return { data: data?.contact ?? defaultContact };
};

export const useServices = () => {
  const { data } = useContent();
  return { data: sorted(data?.services ?? fallbackServices) };
};

export const useGallery = () => {
  const { data } = useContent();
  return { data: sorted(data?.gallery ?? fallbackGallery) };
};

export const useTestimonials = () => {
  const { data } = useContent();
  return { data: sorted(data?.testimonials ?? fallbackTestimonials) };
};

export const useFaqs = () => {
  const { data } = useContent();
  return { data: sorted(data?.faqs ?? fallbackFaqs) };
};
