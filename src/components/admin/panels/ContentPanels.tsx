import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { localImages } from "@/lib/content";
import type { AboutContent, ContactContent, HeroContent } from "@/lib/content-data";

import { Field, ImageField, PanelCard, SaveButton, TextAreaField, TextField, useSectionEditor } from "../AdminKit";

export function HeroPanel({ initial }: { initial: HeroContent }) {
  const { draft, update, dirty, save, saving } = useSectionEditor("hero", initial);
  const set = (patch: Partial<HeroContent>) => update({ ...draft, ...patch });

  return (
    <PanelCard
      title="Hero section"
      description="The first thing visitors see on the home page."
      actions={<SaveButton dirty={dirty} saving={saving} onClick={save} />}
    >
      <div className="grid gap-6 md:grid-cols-2">
        <TextField label="Eyebrow" value={draft.eyebrow} onChange={(v) => set({ eyebrow: v })} />
        <TextField label="Heading" value={draft.headline} onChange={(v) => set({ headline: v })} />
        <TextAreaField
          className="md:col-span-2"
          label="Subheading"
          value={draft.subheadline}
          onChange={(v) => set({ subheadline: v })}
        />
        <TextField label="Primary button" value={draft.primary_cta} onChange={(v) => set({ primary_cta: v })} />
        <TextField label="Secondary button" value={draft.secondary_cta} onChange={(v) => set({ secondary_cta: v })} />
        <div className="md:col-span-2">
          <ImageField
            label="Hero image"
            name="hero"
            value={draft.image_url}
            fallback={localImages.hero}
            onChange={(url) => set({ image_url: url })}
          />
        </div>
      </div>
    </PanelCard>
  );
}

export function AboutPanel({ initial }: { initial: AboutContent }) {
  const { draft, update, dirty, save, saving } = useSectionEditor("about", initial);
  const set = (patch: Partial<AboutContent>) => update({ ...draft, ...patch });

  return (
    <PanelCard
      title="About"
      description="Story, mission, vision and the statistics strip."
      actions={<SaveButton dirty={dirty} saving={saving} onClick={save} />}
    >
      <div className="grid gap-6 md:grid-cols-2">
        <TextField className="md:col-span-2" label="Heading" value={draft.heading} onChange={(v) => set({ heading: v })} />
        <TextAreaField className="md:col-span-2" rows={5} label="Story" value={draft.story} onChange={(v) => set({ story: v })} />
        <TextAreaField label="Mission" value={draft.mission} onChange={(v) => set({ mission: v })} />
        <TextAreaField label="Vision" value={draft.vision} onChange={(v) => set({ vision: v })} />
        <TextField label="Clients served" value={draft.stat_clients} onChange={(v) => set({ stat_clients: v })} />
        <TextField label="Years in business" value={draft.stat_years} onChange={(v) => set({ stat_years: v })} />
        <TextField label="Cleans completed" value={draft.stat_cleans} onChange={(v) => set({ stat_cleans: v })} />
        <TextField label="Average rating" value={draft.stat_rating} onChange={(v) => set({ stat_rating: v })} />
        <div className="md:col-span-2">
          <ImageField
            label="Team image"
            name="team"
            value={draft.team_image_url}
            fallback={localImages.team}
            onChange={(url) => set({ team_image_url: url })}
          />
        </div>
      </div>
    </PanelCard>
  );
}

export function ContactPanel({ initial }: { initial: ContactContent }) {
  const { draft, update, dirty, save, saving } = useSectionEditor("contact", initial);
  const set = (patch: Partial<ContactContent>) => update({ ...draft, ...patch });

  return (
    <PanelCard
      title="Contact details"
      description="Phone, email, location, opening hours and social profiles."
      actions={<SaveButton dirty={dirty} saving={saving} onClick={save} />}
    >
      <div className="grid gap-6 md:grid-cols-2">
        <TextField label="Phone" value={draft.phone} onChange={(v) => set({ phone: v })} />
        <TextField label="WhatsApp number" hint="Digits only, including country code." value={draft.whatsapp} onChange={(v) => set({ whatsapp: v })} />
        <TextField label="Email" type="email" value={draft.email} onChange={(v) => set({ email: v })} />
        <TextField label="Location" value={draft.address} onChange={(v) => set({ address: v })} />
        <TextField className="md:col-span-2" label="Google Maps embed URL" value={draft.map_embed_url} onChange={(v) => set({ map_embed_url: v })} />
        <TextField label="Facebook" value={draft.facebook} onChange={(v) => set({ facebook: v })} />
        <TextField label="Instagram" value={draft.instagram} onChange={(v) => set({ instagram: v })} />
        <TextField label="LinkedIn" value={draft.linkedin} onChange={(v) => set({ linkedin: v })} />

        <div className="md:col-span-2">
          <Field label="Opening hours">
            <div className="space-y-3">
              {draft.hours.map((row, i) => (
                <div key={i} className="flex flex-wrap gap-3">
                  <Input
                    className="min-w-[10rem] flex-1"
                    value={row.day}
                    placeholder="Monday – Friday"
                    onChange={(e) => {
                      const hours = draft.hours.slice();
                      hours[i] = { ...row, day: e.target.value };
                      set({ hours });
                    }}
                  />
                  <Input
                    className="min-w-[10rem] flex-1"
                    value={row.time}
                    placeholder="7:00am – 7:00pm"
                    onChange={(e) => {
                      const hours = draft.hours.slice();
                      hours[i] = { ...row, time: e.target.value };
                      set({ hours });
                    }}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => set({ hours: draft.hours.filter((_, idx) => idx !== i) })}
                    aria-label="Remove row"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => set({ hours: [...draft.hours, { day: "", time: "" }] })}
              >
                <Plus className="h-4 w-4" />
                Add row
              </Button>
            </div>
          </Field>
        </div>
      </div>
    </PanelCard>
  );
}
