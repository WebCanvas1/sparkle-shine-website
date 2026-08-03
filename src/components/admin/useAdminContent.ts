import { useQuery } from "@tanstack/react-query";

import { CONTENT_QUERY_KEY, fetchContent } from "@/lib/content";
import { seedContent, type ContentBundle } from "@/lib/content-data";

/** Raw, unfiltered content for the admin panel (includes unpublished items). */
export function useAdminContent(): { data: ContentBundle; isLoading: boolean; error: Error | null } {
  const query = useQuery({ queryKey: CONTENT_QUERY_KEY, queryFn: fetchContent, staleTime: 0 });
  const data: ContentBundle = {
    hero: query.data?.hero ?? seedContent.hero,
    about: query.data?.about ?? seedContent.about,
    contact: query.data?.contact ?? seedContent.contact,
    services: query.data?.services ?? seedContent.services,
    gallery: query.data?.gallery ?? seedContent.gallery,
    testimonials: query.data?.testimonials ?? seedContent.testimonials,
    faqs: query.data?.faqs ?? seedContent.faqs,
  };
  return { data, isLoading: query.isLoading, error: (query.error as Error) ?? null };
}
