import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Save, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { adminApi, compressToWebpDataUrl } from "@/lib/admin-api";
import { CONTENT_QUERY_KEY } from "@/lib/content";
import type { ContentBundle, ContentSection } from "@/lib/content-data";

export function PanelCard({
  title,
  description,
  children,
  actions,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <section className="rounded-[1.5rem] border border-border/70 bg-card p-6 shadow-soft">
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-lg font-bold tracking-tight text-foreground">{title}</h2>
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        </div>
        {actions}
      </header>
      {children}
    </section>
  );
}

export function Field({
  label,
  hint,
  className,
  children,
}: {
  label: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  hint,
  type = "text",
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
  type?: string;
  className?: string;
}) {
  return (
    <Field label={label} hint={hint} className={className}>
      <Input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </Field>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  rows = 4,
  hint,
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  hint?: string;
  className?: string;
}) {
  return (
    <Field label={label} hint={hint} className={className}>
      <Textarea rows={rows} value={value} onChange={(e) => onChange(e.target.value)} />
    </Field>
  );
}

/**
 * Uploads an image: compressed to WebP + Base64 in the browser, stored in KV
 * under `image:<name>` and referenced by its `/api/image/...` URL.
 */
export function ImageField({
  label,
  name,
  value,
  fallback,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  fallback?: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const handleFile = async (file?: File | null) => {
    if (!file) return;
    setBusy(true);
    try {
      const dataUrl = await compressToWebpDataUrl(file);
      const { url } = await adminApi.uploadImage(name, dataUrl);
      onChange(`${url}?v=${Date.now()}`);
      toast.success("Image uploaded — remember to save this section.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const preview = value || fallback;

  return (
    <Field label={label} hint="Resized, compressed to WebP and stored in Cloudflare KV. Max 8 MB.">
      <div className="flex flex-wrap items-center gap-4">
        <div className="h-20 w-28 overflow-hidden rounded-xl border border-border bg-muted">
          {preview ? (
            <img src={preview} alt="" className="h-full w-full object-cover" loading="lazy" />
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" disabled={busy} onClick={() => inputRef.current?.click()}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {value ? "Replace" : "Upload"}
          </Button>
          {value && (
            <Button
              type="button"
              variant="ghost"
              onClick={async () => {
                try {
                  await adminApi.deleteImage(name);
                } catch {
                  /* metadata may already be gone */
                }
                onChange("");
              }}
            >
              <Trash2 className="h-4 w-4" />
              Remove
            </Button>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
    </Field>
  );
}

/** Local draft state + save mutation for one KV content section. */
export function useSectionEditor<K extends ContentSection>(section: K, initial: ContentBundle[K]) {
  const [draft, setDraft] = useState<ContentBundle[K]>(initial);
  const [dirty, setDirty] = useState(false);
  const queryClient = useQueryClient();
  const initialRef = useRef(initial);

  useEffect(() => {
    if (!dirty && JSON.stringify(initialRef.current) !== JSON.stringify(initial)) {
      initialRef.current = initial;
      setDraft(initial);
    }
  }, [initial, dirty]);

  const update = (value: ContentBundle[K]) => {
    setDraft(value);
    setDirty(true);
  };

  const mutation = useMutation({
    mutationFn: () => adminApi.save(section, draft),
    onSuccess: async () => {
      setDirty(false);
      initialRef.current = draft;
      await queryClient.invalidateQueries({ queryKey: CONTENT_QUERY_KEY });
      await queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success("Saved — the public website is updated.");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return { draft, update, dirty, save: () => mutation.mutate(), saving: mutation.isPending };
}

export function SaveButton({ dirty, saving, onClick }: { dirty: boolean; saving: boolean; onClick: () => void }) {
  return (
    <Button onClick={onClick} disabled={saving || !dirty}>
      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
      {dirty ? "Save changes" : "Saved"}
    </Button>
  );
}

export const newId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
