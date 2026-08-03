import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { galleryImageFor, serviceImageFor } from "@/lib/content";
import type { ContentBundle, ContentSection, Faq, GalleryItem, Service, Testimonial } from "@/lib/content-data";

import { Field, ImageField, PanelCard, SaveButton, TextAreaField, TextField, newId, useSectionEditor } from "../AdminKit";

type Item = { id: string; sort_order: number; is_published: boolean };

const reindex = <T extends Item>(items: T[]) => items.map((item, i) => ({ ...item, sort_order: i + 1 }));

function ListEditor<K extends Extract<ContentSection, "services" | "gallery" | "testimonials" | "faqs">>({
  section,
  initial,
  title,
  description,
  emptyItem,
  label,
  renderItem,
}: {
  section: K;
  initial: ContentBundle[K];
  title: string;
  description: string;
  emptyItem: () => ContentBundle[K][number];
  label: (item: ContentBundle[K][number]) => string;
  renderItem: (
    item: ContentBundle[K][number],
    patch: (patch: Partial<ContentBundle[K][number]>) => void,
  ) => React.ReactNode;
}) {
  const { draft, update, dirty, save, saving } = useSectionEditor(section, initial);
  const items = draft as unknown as Item[];

  const setItems = (next: Item[]) => update(reindex(next) as unknown as ContentBundle[K]);

  const move = (index: number, delta: number) => {
    const next = items.slice();
    const target = index + delta;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);
  };

  return (
    <PanelCard
      title={title}
      description={description}
      actions={
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setItems([...items, emptyItem() as unknown as Item])}
          >
            <Plus className="h-4 w-4" />
            Add
          </Button>
          <SaveButton dirty={dirty} saving={saving} onClick={save} />
        </div>
      }
    >
      <div className="space-y-5">
        {items.length === 0 && <p className="text-sm text-muted-foreground">Nothing here yet — add your first entry.</p>}
        {items.map((item, index) => (
          <article key={item.id} className="rounded-2xl border border-border/70 bg-background p-5">
            <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-display text-sm font-bold text-foreground">
                {label(item as never) || "Untitled"}
              </h3>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  <Switch
                    checked={item.is_published}
                    onCheckedChange={(checked) => {
                      const next = items.slice();
                      next[index] = { ...item, is_published: checked };
                      setItems(next);
                    }}
                  />
                  {item.is_published ? "Published" : "Hidden"}
                </label>
                <Button type="button" variant="ghost" size="icon" aria-label="Move up" onClick={() => move(index, -1)}>
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button type="button" variant="ghost" size="icon" aria-label="Move down" onClick={() => move(index, 1)}>
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Delete"
                  onClick={() => setItems(items.filter((_, i) => i !== index))}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </header>
            {renderItem(item as never, (patch) => {
              const next = items.slice();
              next[index] = { ...item, ...(patch as object) };
              setItems(next);
            })}
          </article>
        ))}
      </div>
    </PanelCard>
  );
}

export function ServicesPanel({ initial }: { initial: Service[] }) {
  return (
    <ListEditor
      section="services"
      initial={initial}
      title="Services"
      description="Add, edit, reorder, publish or remove the cleaning services shown across the site."
      label={(s) => s.title}
      emptyItem={() => ({
        id: newId("service"),
        title: "New service",
        slug: `service-${Date.now().toString(36)}`,
        category: "",
        description: "",
        image_url: "",
        features: [],
        cta_text: "Get Free Quote",
        sort_order: 0,
        is_published: false,
      })}
      renderItem={(service, patch) => (
        <div className="grid gap-5 md:grid-cols-2">
          <TextField label="Title" value={service.title} onChange={(v) => patch({ title: v })} />
          <TextField label="Slug" hint="Lowercase letters, numbers and dashes." value={service.slug} onChange={(v) => patch({ slug: v })} />
          <TextField label="Category" value={service.category} onChange={(v) => patch({ category: v })} />
          <TextField label="CTA text" value={service.cta_text} onChange={(v) => patch({ cta_text: v })} />
          <TextAreaField className="md:col-span-2" label="Description" value={service.description} onChange={(v) => patch({ description: v })} />
          <Field className="md:col-span-2" label="Features" hint="Comma separated.">
            <Input
              value={service.features.join(", ")}
              onChange={(e) => patch({ features: e.target.value.split(",").map((f) => f.trim()).filter(Boolean) })}
            />
          </Field>
          <div className="md:col-span-2">
            <ImageField
              label="Service image"
              name={`service:${service.id}`}
              value={service.image_url}
              fallback={serviceImageFor(service.slug, service.image_url)}
              onChange={(url) => patch({ image_url: url })}
            />
          </div>
        </div>
      )}
    />
  );
}

export function GalleryPanel({ initial }: { initial: GalleryItem[] }) {
  return (
    <ListEditor
      section="gallery"
      initial={initial}
      title="Gallery"
      description="Upload, replace, reorder and publish gallery images."
      label={(g) => g.title}
      emptyItem={() => ({
        id: newId("gallery"),
        title: "New image",
        category: "Homes",
        image_url: "",
        after_image_url: null,
        sort_order: 0,
        is_published: false,
      })}
      renderItem={(item, patch) => (
        <div className="grid gap-5 md:grid-cols-2">
          <TextField label="Title" value={item.title} onChange={(v) => patch({ title: v })} />
          <TextField label="Category" hint="Homes, Offices or Cars." value={item.category} onChange={(v) => patch({ category: v })} />
          <div className="md:col-span-2">
            <ImageField
              label="Image"
              name={`gallery:${item.id}`}
              value={item.image_url}
              fallback={galleryImageFor(item)}
              onChange={(url) => patch({ image_url: url })}
            />
          </div>
        </div>
      )}
    />
  );
}

export function TestimonialsPanel({ initial }: { initial: Testimonial[] }) {
  return (
    <ListEditor
      section="testimonials"
      initial={initial}
      title="Testimonials"
      description="Customer reviews shown in the home page carousel."
      label={(t) => t.name}
      emptyItem={() => ({
        id: newId("testimonial"),
        name: "New customer",
        location: "",
        rating: 5,
        quote: "",
        sort_order: 0,
        is_published: false,
      })}
      renderItem={(item, patch) => (
        <div className="grid gap-5 md:grid-cols-3">
          <TextField label="Name" value={item.name} onChange={(v) => patch({ name: v })} />
          <TextField label="Location" value={item.location} onChange={(v) => patch({ location: v })} />
          <Field label="Rating">
            <Input
              type="number"
              min={1}
              max={5}
              value={item.rating}
              onChange={(e) => patch({ rating: Math.min(5, Math.max(1, Number(e.target.value) || 5)) })}
            />
          </Field>
          <TextAreaField className="md:col-span-3" label="Review" value={item.quote} onChange={(v) => patch({ quote: v })} />
        </div>
      )}
    />
  );
}

export function FaqsPanel({ initial }: { initial: Faq[] }) {
  return (
    <ListEditor
      section="faqs"
      initial={initial}
      title="FAQs"
      description="Questions and answers shown on the home page accordion."
      label={(f) => f.question}
      emptyItem={() => ({
        id: newId("faq"),
        question: "New question",
        answer: "",
        sort_order: 0,
        is_published: false,
      })}
      renderItem={(item, patch) => (
        <div className="grid gap-5">
          <TextField label="Question" value={item.question} onChange={(v) => patch({ question: v })} />
          <TextAreaField label="Answer" rows={4} value={item.answer} onChange={(v) => patch({ answer: v })} />
        </div>
      )}
    />
  );
}
