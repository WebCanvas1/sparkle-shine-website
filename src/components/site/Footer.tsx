import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";

import { Logo } from "./Logo";
import { useContact, useServices } from "@/lib/content";

export function Footer() {
  const { data: contact } = useContact();
  const { data: services } = useServices();

  return (
    <footer className="gradient-deep text-navy-foreground">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div className="space-y-5">
            <Logo inverted size={56} />
            <p className="max-w-xs text-sm leading-relaxed text-navy-foreground/70">
              Clean spaces. Healthy places. Happy faces. Premium residential, commercial and car
              cleaning delivered with obsessive attention to detail.
            </p>
            <div className="flex gap-3">
              {[
                { href: contact.facebook, Icon: Facebook, label: "Facebook" },
                { href: contact.instagram, Icon: Instagram, label: "Instagram" },
                { href: contact.linkedin, Icon: Linkedin, label: "LinkedIn" },
              ].map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href || "#"}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={label}
                  className="grid h-11 w-11 place-items-center rounded-2xl border border-navy-foreground/20 bg-navy-foreground/5 transition-all duration-300 hover:-translate-y-1 hover:bg-navy-foreground/15"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-primary-glow">
              Quick Links
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-navy-foreground/75">
              {[
                { to: "/", label: "Home" },
                { to: "/about", label: "About Us" },
                { to: "/services", label: "Services" },
                { to: "/gallery", label: "Gallery" },
                { to: "/contact", label: "Contact Us" },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="transition-colors hover:text-primary-glow">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-primary-glow">
              Services
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-navy-foreground/75">
              {services.map((s) => (
                <li key={s.id}>
                  <Link to="/services" className="transition-colors hover:text-primary-glow">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-primary-glow">
              Get in touch
            </h3>
            <ul className="mt-5 space-y-4 text-sm text-navy-foreground/75">
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary-glow" />
                <a href={`tel:${contact.phone.replace(/\s/g, "")}`}>{contact.phone}</a>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary-glow" />
                <a href={`mailto:${contact.email}`} className="break-all">
                  {contact.email}
                </a>
              </li>
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary-glow" />
                <span>{contact.address}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-navy-foreground/15 pt-6 text-xs text-navy-foreground/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Sparkle Cleaning Services. All rights reserved.</p>
          <p className="flex items-center gap-3">
            <span>Fully insured · Police-checked cleaners · Eco-friendly products</span>
            <Link to="/admin" className="opacity-50 transition-opacity hover:opacity-100">
              Admin
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
