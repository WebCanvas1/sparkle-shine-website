
REVOKE ALL ON FUNCTION public.touch_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

DROP POLICY "anyone can submit enquiry" ON public.enquiries;
CREATE POLICY "visitors can submit enquiry" ON public.enquiries
  FOR INSERT TO anon, authenticated
  WITH CHECK (length(btrim(name)) > 0 AND length(name) <= 100 AND length(message) <= 2000);
