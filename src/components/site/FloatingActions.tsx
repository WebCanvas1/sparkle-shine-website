import { Link } from "@tanstack/react-router";
import { MessageCircle, Phone, Sparkles } from "lucide-react";

import { useContact } from "@/lib/content";

export function FloatingActions() {
  const { data: contact } = useContact();
  const tel = `tel:${contact.phone.replace(/\s/g, "")}`;
  const wa = `https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`;

  return (
    <>
      <div className="fixed bottom-6 right-5 z-40 hidden flex-col gap-3 md:flex">
        <a
          href={tel}
          aria-label="Call Sparkle Cleaning Services"
          className="grid h-14 w-14 place-items-center rounded-full bg-navy text-navy-foreground shadow-lift transition-transform duration-300 hover:-translate-y-1"
        >
          <Phone className="h-5 w-5" />
        </a>
        <a
          href={wa}
          target="_blank"
          rel="noreferrer noopener"
          aria-label="Message us on WhatsApp"
          className="grid h-14 w-14 place-items-center rounded-full bg-[oklch(0.72_0.17_150)] text-white shadow-lift transition-transform duration-300 hover:-translate-y-1"
        >
          <MessageCircle className="h-5 w-5" />
        </a>
        <Link
          to="/contact"
          aria-label="Request a quote"
          className="grid h-14 w-14 place-items-center rounded-full gradient-brand text-primary-foreground shadow-lift transition-transform duration-300 hover:-translate-y-1"
        >
          <Sparkles className="h-5 w-5" />
        </Link>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 gap-2 border-t border-border bg-background/95 p-3 backdrop-blur-xl md:hidden">
        <a
          href={tel}
          className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-navy text-sm font-semibold text-navy-foreground"
        >
          <Phone className="h-4 w-4" /> Call
        </a>
        <a
          href={wa}
          target="_blank"
          rel="noreferrer noopener"
          className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-[oklch(0.72_0.17_150)] text-sm font-semibold text-white"
        >
          <MessageCircle className="h-4 w-4" /> Chat
        </a>
        <Link
          to="/contact"
          className="flex h-12 items-center justify-center gap-2 rounded-2xl gradient-brand text-sm font-semibold text-primary-foreground"
        >
          <Sparkles className="h-4 w-4" /> Quote
        </Link>
      </div>
    </>
  );
}