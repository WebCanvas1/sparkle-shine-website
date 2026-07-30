
CREATE TYPE public.app_role AS ENUM ('admin','user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own roles readable" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS trigger
LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- SITE SETTINGS (key/value)
CREATE TABLE public.site_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings public read" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "settings admin write" ON public.site_settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER site_settings_touch BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- SERVICES
CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  category text NOT NULL DEFAULT 'General',
  description text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  features text[] NOT NULL DEFAULT '{}',
  cta_text text NOT NULL DEFAULT 'Get a Quote',
  sort_order int NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.services TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "services public read" ON public.services FOR SELECT USING (is_published);
CREATE POLICY "services admin write" ON public.services FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER services_touch BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- GALLERY
CREATE TABLE public.gallery_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'Homes',
  image_url text NOT NULL,
  after_image_url text,
  sort_order int NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.gallery_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery_items TO authenticated;
GRANT ALL ON public.gallery_items TO service_role;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "gallery public read" ON public.gallery_items FOR SELECT USING (is_published);
CREATE POLICY "gallery admin write" ON public.gallery_items FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- TESTIMONIALS
CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text NOT NULL DEFAULT '',
  rating int NOT NULL DEFAULT 5,
  quote text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.testimonials TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.testimonials TO authenticated;
GRANT ALL ON public.testimonials TO service_role;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "testimonials public read" ON public.testimonials FOR SELECT USING (is_published);
CREATE POLICY "testimonials admin write" ON public.testimonials FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- FAQS
CREATE TABLE public.faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.faqs TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.faqs TO authenticated;
GRANT ALL ON public.faqs TO service_role;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "faqs public read" ON public.faqs FOR SELECT USING (is_published);
CREATE POLICY "faqs admin write" ON public.faqs FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ENQUIRIES
CREATE TABLE public.enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  message text NOT NULL DEFAULT '',
  service text NOT NULL DEFAULT '',
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.enquiries TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.enquiries TO authenticated;
GRANT ALL ON public.enquiries TO service_role;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can submit enquiry" ON public.enquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "admins read enquiries" ON public.enquiries FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins update enquiries" ON public.enquiries FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins delete enquiries" ON public.enquiries FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- SEED
INSERT INTO public.site_settings (key, value) VALUES
('hero', '{"eyebrow":"Sydney''s trusted cleaning specialists","headline":"Professional Cleaning Services You Can Trust","subheadline":"Residential, Commercial & Car Cleaning delivered with exceptional attention to detail.","primary_cta":"Get Free Quote","secondary_cta":"Call Now","image_url":""}'::jsonb),
('about', '{"heading":"A cleaning company built on detail","story":"Sparkle Cleaning Services began with a simple belief: a spotless space changes how people feel. What started as a two-person team with one van has grown into a fully insured cleaning company trusted by families, offices and car owners across the region.","mission":"To deliver consistently immaculate spaces through trained professionals, eco-friendly products and uncompromising attention to detail.","vision":"To be the most trusted premium cleaning brand in Australia — known for reliability, care and results that speak for themselves.","team_image_url":"","stat_clients":"1200","stat_years":"12","stat_cleans":"18000","stat_rating":"4.9"}'::jsonb),
('contact', '{"phone":"+61 400 000 000","whatsapp":"61400000000","email":"hello@sparklecleaning.com.au","address":"12 Harbour Street, Sydney NSW 2000","map_embed_url":"https://www.google.com/maps?q=Sydney+NSW+Australia&output=embed","hours":[{"day":"Monday – Friday","time":"7:00am – 7:00pm"},{"day":"Saturday","time":"8:00am – 5:00pm"},{"day":"Sunday","time":"9:00am – 3:00pm"}],"facebook":"https://facebook.com","instagram":"https://instagram.com","linkedin":"https://linkedin.com"}'::jsonb);

INSERT INTO public.services (title, slug, category, description, features, cta_text, sort_order) VALUES
('Residential Cleaning','residential','Homes','Immaculate homes, every visit. Our residential teams work to a detailed checklist so nothing is ever missed.', ARRAY['Regular Cleaning','Deep Cleaning','End of Lease','Spring Cleaning'],'Get Free Quote',1),
('Commercial Cleaning','commercial','Business','Presentation matters. We keep workplaces spotless, hygienic and ready for clients — after hours or on your schedule.', ARRAY['Offices','Retail','Medical Clinics','Strata'],'Request a Site Visit',2),
('Car Cleaning','car','Automotive','Showroom-standard detailing inside and out, using pH-neutral products that protect your paint and interior.', ARRAY['Interior','Exterior','Detailing','Vacuum','Steam Cleaning'],'Book a Detail',3);

INSERT INTO public.testimonials (name, location, rating, quote, sort_order) VALUES
('Emily Harper','Bondi, NSW',5,'The team was punctual, thorough and genuinely lovely. Our apartment has never looked this good — even the skirting boards were spotless.',1),
('Daniel Nguyen','Parramatta, NSW',5,'We use Sparkle for our office of 40 staff. Consistent, reliable and always invisible — we arrive to a perfect workspace every morning.',2),
('Sofia Rossi','Manly, NSW',5,'Booked an end of lease clean and got the full bond back with zero fuss. Worth every dollar.',3),
('James Whitfield','Chatswood, NSW',5,'Had my car detailed inside and out. It genuinely looked better than the day I bought it.',4),
('Priya Sharma','Newtown, NSW',5,'Eco-friendly products were important to us with a toddler at home. Sparkle handled it perfectly.',5);

INSERT INTO public.faqs (question, answer, sort_order) VALUES
('How much does a clean cost?','Pricing depends on the size of the space and the type of clean. Regular residential cleans start from $45/hour, while deep and end of lease cleans are quoted per job. Every quote is free and fixed — no surprises.',1),
('How quickly can you book me in?','Most standard cleans can be scheduled within 48 hours. For urgent or same-day requests, call us directly and we will do our best to fit you in.',2),
('What cleaning products do you use?','We use hospital-grade, eco-friendly and pH-neutral products that are safe around children and pets. If you have specific sensitivities, let us know and we will tailor the products used.',3),
('Are you insured?','Yes. Sparkle Cleaning Services carries full public liability insurance and every cleaner is police-checked and trained in-house.',4),
('Do I need to be home during the clean?','Not at all. Many of our clients provide secure access instructions. All keys and access codes are handled under a strict privacy policy.',5),
('What if I am not happy with the clean?','Our 100% satisfaction guarantee means we will return and re-clean any area you are not happy with, free of charge, within 48 hours.',6);
