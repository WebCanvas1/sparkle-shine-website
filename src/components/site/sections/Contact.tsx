import { useEffect, useRef, useState } from "react";
import { Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Logo } from "../Logo";
import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";
import { useContact } from "@/lib/content";

const TURNSTILE_SITE_KEY = (import.meta.env.VITE_TURNSTILE_SITE_KEY ?? "").trim();

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  phone: z.string().trim().min(6, "Please enter a valid phone number").max(30),
  email: z.string().trim().email("Please enter a valid email").max(255),
  message: z.string().trim().min(5, "Tell us a little about the job").max(2000),
});

export function ContactSection() {
  const { data: contact } = useContact();
  const [submitting, setSubmitting] = useState(false);
  const turnstileRef = useRef<HTMLDivElement>(null);

  // Cloudflare Turnstile — rendered only when a site key is configured.
  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || !turnstileRef.current) return;
    const id = "cf-turnstile-script";
    if (!document.getElementById(id)) {
      const script = document.createElement("script");
      script.id = id;
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }, []);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    const parsed = schema.safeParse(values);

    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form");
      return;
    }

    const token = String(values["cf-turnstile-response"] ?? "");
    if (TURNSTILE_SITE_KEY && !token) {
      toast.error("Please complete the spam check and try again.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...parsed.data, turnstileToken: token }),
      });
      const result = (await response.json().catch(() => ({}))) as { error?: string };

      if (!response.ok) {
        toast.error(result.error ?? "Something went wrong. Please call us instead.");
        return;
      }

      toast.success("Thanks! We'll be in touch within a few hours.");
      form.reset();
      window.turnstile?.reset();
    } catch {
      toast.error("Something went wrong. Please call us instead.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative overflow-hidden py-24 lg:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-20 h-[30rem] w-[30rem] rounded-full bg-accent opacity-70 blur-3xl"
      />
      <div className="relative mx-auto w-full max-w-7xl px-4">
        <SectionHeading
          eyebrow="Contact"
          title="Get your free, fixed-price quote"
          description="Send us the details and we'll come back to you the same day — usually within a few hours."
        />

        <div className="mt-14 grid gap-7 lg:grid-cols-[1fr_1.1fr]">
          <Reveal>
            <div className="flex h-full flex-col gap-6 rounded-[1.75rem] gradient-deep p-8 text-navy-foreground shadow-lift lg:p-10">
              <Logo inverted size={56} />
              <p className="text-sm leading-relaxed text-navy-foreground/70">
                Clean spaces. Healthy places. Happy faces.
              </p>

              <ul className="space-y-5 text-sm">
                <li className="flex gap-4">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-primary-glow" />
                  <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="font-semibold">
                    {contact.phone}
                  </a>
                </li>
                <li className="flex gap-4">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary-glow" />
                  <a href={`mailto:${contact.email}`} className="break-all font-semibold">
                    {contact.email}
                  </a>
                </li>
                <li className="flex gap-4">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary-glow" />
                  <span className="text-navy-foreground/80">{contact.address}</span>
                </li>
                <li className="flex gap-4">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0 text-primary-glow" />
                  <div className="space-y-1.5">
                    {contact.hours.map((h) => (
                      <p key={h.day} className="text-navy-foreground/80">
                        <span className="font-semibold text-navy-foreground">{h.day}</span> · {h.time}
                      </p>
                    ))}
                  </div>
                </li>
              </ul>

              <div className="mt-auto overflow-hidden rounded-2xl border border-navy-foreground/15">
                <iframe
                  title="Sparkle Cleaning Services service area map"
                  src={contact.map_embed_url}
                  loading="lazy"
                  className="h-52 w-full"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <form
              onSubmit={onSubmit}
              className="h-full rounded-[1.75rem] border border-border bg-card p-8 shadow-soft lg:p-10"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" required maxLength={100} className="h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    maxLength={30}
                    className="h-12 rounded-xl"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    maxLength={255}
                    className="h-12 rounded-xl"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    maxLength={2000}
                    placeholder="Tell us the property type, rooms and preferred timing."
                    className="rounded-xl"
                  />
                </div>
              </div>

              {TURNSTILE_SITE_KEY && (
                <div
                  ref={turnstileRef}
                  className="cf-turnstile mt-6"
                  data-sitekey={TURNSTILE_SITE_KEY}
                  data-theme="light"
                />
              )}

              <Button
                type="submit"
                variant="hero"
                size="pill-lg"
                disabled={submitting}
                className="mt-7 w-full"
              >
                {submitting ? "Sending…" : "Send Enquiry"} <Send className="h-4 w-4" />
              </Button>
              <p className="mt-4 text-center text-xs text-muted-foreground">
                We reply to every enquiry — usually within a few hours during business hours.
              </p>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
declare global {
  interface Window {
    turnstile?: { reset: (widget?: string) => void };
  }
}
