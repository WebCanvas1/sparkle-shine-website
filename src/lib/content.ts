import heroImg from "@/assets/hero-cleaning.webp";
import residentialImg from "@/assets/service-residential.webp";
import commercialImg from "@/assets/service-commercial.webp";
import carImg from "@/assets/service-car.webp";
import teamImg from "@/assets/team.webp";
import galleryKitchen from "@/assets/gallery-kitchen.webp";
import galleryBathroom from "@/assets/gallery-bathroom.webp";
import galleryCarInterior from "@/assets/gallery-car-interior.webp";
import galleryRetail from "@/assets/gallery-retail.webp";

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

export type HeroContent = {
  eyebrow: string;
  headline: string;
  subheadline: string;
  primary_cta: string;
  secondary_cta: string;
  image_url: string;
};

export type AboutContent = {
  heading: string;
  story: string;
  mission: string;
  vision: string;
  team_image_url: string;
  stat_clients: string;
  stat_years: string;
  stat_cleans: string;
  stat_rating: string;
};

export type ContactContent = {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  map_embed_url: string;
  hours: { day: string; time: string }[];
  facebook: string;
  instagram: string;
  linkedin: string;
};

export type Service = {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  image_url: string;
  features: string[];
  cta_text: string;
  sort_order: number;
  is_published: boolean;
};

export type GalleryItem = {
  id: string;
  title: string;
  category: string;
  image_url: string;
  after_image_url: string | null;
  sort_order: number;
  is_published: boolean;
};

export type Testimonial = {
  id: string;
  name: string;
  location: string;
  rating: number;
  quote: string;
  sort_order: number;
  is_published: boolean;
};

export type Faq = {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  is_published: boolean;
};

export const defaultHero: HeroContent = {
  eyebrow: "Perth's trusted cleaning specialists",
  headline: "Professional Cleaning Services You Can Trust",
  subheadline:
    "Residential, Commercial & Car Cleaning delivered with exceptional attention to detail.",
  primary_cta: "Get Free Quote",
  secondary_cta: "Call Now",
  image_url: "",
};

export const defaultAbout: AboutContent = {
  heading: "A cleaning company built on detail",
  story:
    "Sparkle Cleaning Services began with a simple belief: a spotless space changes how people feel. What started as a two-person team with one van has grown into a fully insured cleaning company trusted by families, offices and car owners across the region.",
  mission:
    "To deliver consistently immaculate spaces through trained professionals, eco-friendly products and uncompromising attention to detail.",
  vision:
    "To be the most trusted premium cleaning brand in Australia — known for reliability, care and results that speak for themselves.",
  team_image_url: "",
  stat_clients: "1200",
  stat_years: "12",
  stat_cleans: "18000",
  stat_rating: "4.9",
};

export const defaultContact: ContactContent = {
  phone: "0416 477 753",
  whatsapp: "61416477753",
  email: "sparklecleaningaustralia@gmail.com",
  address: "Perth, Western Australia",
  map_embed_url:
    "https://www.google.com/maps?q=Perth+WA+Australia&output=embed",
  hours: [
    { day: "Monday – Friday", time: "7:00am – 7:00pm" },
    { day: "Saturday", time: "8:00am – 5:00pm" },
    { day: "Sunday", time: "9:00am – 3:00pm" },
  ],
  facebook: "https://facebook.com",
  instagram: "https://instagram.com",
  linkedin: "https://linkedin.com",
};

export const fallbackServices: Service[] = [
  {
    id: "residential",
    title: "Residential Cleaning",
    slug: "residential",
    category: "Homes",
    description:
      "Immaculate homes, every visit. Our residential teams work to a detailed checklist so nothing is ever missed.",
    image_url: "",
    features: [
      "Regular Cleaning",
      "Deep Cleaning",
      "End of Lease",
      "Spring Cleaning",
    ],
    cta_text: "Get Free Quote",
    sort_order: 1,
    is_published: true,
  },
  {
    id: "commercial",
    title: "Commercial Cleaning",
    slug: "commercial",
    category: "Business",
    description:
      "Presentation matters. We keep workplaces spotless, hygienic and ready for clients — after hours or on your schedule.",
    image_url: "",
    features: ["Offices", "Retail", "Medical Clinics", "Strata"],
    cta_text: "Request a Site Visit",
    sort_order: 2,
    is_published: true,
  },
  {
    id: "car",
    title: "Car Cleaning",
    slug: "car",
    category: "Automotive",
    description:
      "Showroom-standard detailing inside and out, using pH-neutral products that protect your paint and interior.",
    image_url: "",
    features: [
      "Interior",
      "Exterior",
      "Detailing",
      "Vacuum",
      "Steam Cleaning",
    ],
    cta_text: "Book a Detail",
    sort_order: 3,
    is_published: true,
  },
];

export const fallbackGallery: GalleryItem[] = [
  {
    id: "g1",
    title: "Kitchen deep clean",
    category: "Homes",
    image_url: galleryKitchen,
    after_image_url: null,
    sort_order: 1,
    is_published: true,
  },
  {
    id: "g2",
    title: "Corporate office",
    category: "Offices",
    image_url: commercialImg,
    after_image_url: null,
    sort_order: 2,
    is_published: true,
  },
  {
    id: "g3",
    title: "Interior detailing",
    category: "Cars",
    image_url: galleryCarInterior,
    after_image_url: null,
    sort_order: 3,
    is_published: true,
  },
  {
    id: "g4",
    title: "Bathroom restoration",
    category: "Homes",
    image_url: galleryBathroom,
    after_image_url: null,
    sort_order: 4,
    is_published: true,
  },
  {
    id: "g5",
    title: "Retail floor care",
    category: "Offices",
    image_url: galleryRetail,
    after_image_url: null,
    sort_order: 5,
    is_published: true,
  },
  {
    id: "g6",
    title: "Exterior wash & polish",
    category: "Cars",
    image_url: carImg,
    after_image_url: null,
    sort_order: 6,
    is_published: true,
  },
  {
    id: "g7",
    title: "Living room reset",
    category: "Homes",
    image_url: residentialImg,
    after_image_url: null,
    sort_order: 7,
    is_published: true,
  },
];

export const fallbackTestimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Emily Harper",
    location: "Scarborough, WA",
    rating: 5,
    quote:
      "The team was punctual, thorough and genuinely lovely. Our apartment has never looked this good — even the skirting boards were spotless.",
    sort_order: 1,
    is_published: true,
  },
  {
    id: "t2",
    name: "Daniel Nguyen",
    location: "Perth CBD, WA",
    rating: 5,
    quote:
      "We use Sparkle for our office of 40 staff. Consistent, reliable and always invisible — we arrive to a perfect workspace every morning.",
    sort_order: 2,
    is_published: true,
  },
  {
    id: "t3",
    name: "Sofia Rossi",
    location: "Joondalup, WA",
    rating: 5,
    quote:
      "Booked an end of lease clean and got the full bond back with zero fuss. Worth every dollar.",
    sort_order: 3,
    is_published: true,
  },
];

export const fallbackFaqs: Faq[] = [
  {
    id: "f1",
    question: "How much does a clean cost?",
    answer:
      "Pricing depends on the size of the space and the type of clean. Regular residential cleans start from $45/hour, while deep and end of lease cleans are quoted per job. Every quote is free and fixed — no surprises.",
    sort_order: 1,
    is_published: true,
  },
  {
    id: "f2",
    question: "How quickly can you book me in?",
    answer:
      "Most standard cleans can be scheduled within 48 hours. For urgent or same-day requests, call us directly and we will do our best to fit you in.",
    sort_order: 2,
    is_published: true,
  },
  {
    id: "f3",
    question: "Are you insured?",
    answer:
      "Yes. Sparkle Cleaning Services carries full public liability insurance and every cleaner is police-checked and trained in-house.",
    sort_order: 3,
    is_published: true,
  },
];

export const serviceImageFor = (slug: string, imageUrl: string) => {
  if (imageUrl) return imageUrl;
  if (slug.includes("commercial")) return commercialImg;
  if (slug.includes("car")) return carImg;
  return residentialImg;
};

/*
 * Content source.
 *
 * The site is fully static: every section reads from the typed constants
 * above, which are bundled at build time. Edit the constants to change the
 * live copy — no backend, no runtime fetch, nothing to configure.
 *
 * The hook shape (`{ data }`) is kept so section components stay untouched.
 */
export const useHero = () => ({ data: defaultHero });
export const useAbout = () => ({ data: defaultAbout });
export const useContact = () => ({ data: defaultContact });
export const useServices = () => ({ data: fallbackServices });
export const useGallery = () => ({ data: fallbackGallery });
export const useTestimonials = () => ({ data: fallbackTestimonials });
export const useFaqs = () => ({ data: fallbackFaqs });
