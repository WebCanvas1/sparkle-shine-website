import { z } from "zod";

const text = (max: number) => z.string().trim().max(max);
const required = (max: number) => z.string().trim().min(1).max(max);
const url = z.union([z.literal(""), z.string().trim().url().max(500)]);
/** Local `/api/image/...` reference or an absolute URL. */
const imageRef = z.union([z.literal(""), z.string().trim().max(500)]);

export const heroSchema = z.object({
  eyebrow: text(120),
  headline: required(160),
  subheadline: text(320),
  primary_cta: text(40),
  secondary_cta: text(40),
  image_url: imageRef,
});

export const aboutSchema = z.object({
  heading: required(160),
  story: text(2000),
  mission: text(1000),
  vision: text(1000),
  team_image_url: imageRef,
  stat_clients: text(20),
  stat_years: text(20),
  stat_cleans: text(20),
  stat_rating: text(20),
});

export const contactSchema = z.object({
  phone: required(40),
  whatsapp: text(40),
  email: z.string().trim().email().max(200),
  address: text(200),
  map_embed_url: url,
  hours: z.array(z.object({ day: text(60), time: text(60) })).max(14),
  facebook: url,
  instagram: url,
  linkedin: url,
});

export const servicesSchema = z
  .array(
    z.object({
      id: required(60),
      title: required(120),
      slug: required(80).regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers and dashes."),
      category: text(60),
      description: text(1200),
      image_url: imageRef,
      features: z.array(text(80)).max(20),
      cta_text: text(60),
      sort_order: z.number().int().min(0).max(999),
      is_published: z.boolean(),
    }),
  )
  .max(50);

export const gallerySchema = z
  .array(
    z.object({
      id: required(60),
      title: text(120),
      category: text(60),
      item_type: z.enum(["single", "before_after"]).optional(),
      image_url: imageRef,
      after_image_url: z.union([z.string().trim().max(500), z.null()]),
      sort_order: z.number().int().min(0).max(999),
      is_published: z.boolean(),
    }),
  )
  .max(200);

export const testimonialsSchema = z
  .array(
    z.object({
      id: required(60),
      name: required(120),
      location: text(120),
      rating: z.number().int().min(1).max(5),
      quote: required(1000),
      sort_order: z.number().int().min(0).max(999),
      is_published: z.boolean(),
    }),
  )
  .max(100);

export const faqsSchema = z
  .array(
    z.object({
      id: required(60),
      question: required(240),
      answer: required(2000),
      sort_order: z.number().int().min(0).max(999),
      is_published: z.boolean(),
    }),
  )
  .max(100);

export const sectionSchemas = {
  hero: heroSchema,
  about: aboutSchema,
  contact: contactSchema,
  services: servicesSchema,
  gallery: gallerySchema,
  testimonials: testimonialsSchema,
  faqs: faqsSchema,
} as const;

export type SectionName = keyof typeof sectionSchemas;
