import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Logo } from "@/components/site/Logo";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Content Admin | Sparkle Cleaning Services" },
      { name: "description", content: "Manage Sparkle Cleaning Services website content." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Content Admin | Sparkle Cleaning Services" },
      { property: "og:description", content: "Manage website content and enquiries." },
    ],
  }),
  component: AdminPage,
});

type Row = Record<string, unknown> & { id: string };

function AdminPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate({ to: "/auth" });
        return;
      }
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.session.user.id);
      if (!active) return;
      setIsAdmin(Boolean(roles?.some((r) => r.role === "admin")));
      setReady(true);
    })();
    return () => {
      active = false;
    };
  }, [navigate]);

  if (!ready) {
    return <div className="grid min-h-screen place-items-center text-sm text-muted-foreground">Loading…</div>;
  }

  return (
    <div className="min-h-screen bg-secondary/40">
      <header className="border-b border-border bg-background">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-4">
          <Logo />
          <Button
            variant="outline"
            size="pill"
            onClick={async () => {
              await supabase.auth.signOut();
              navigate({ to: "/auth" });
            }}
          >
            Sign out
          </Button>
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        {!isAdmin && (
          <div className="mb-8 rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
            Your account is signed in but does not have the admin role yet, so saving is disabled.
            Grant the <code>admin</code> role to this user in the backend Users area to unlock editing.
          </div>
        )}

        <h1 className="text-3xl font-extrabold text-navy">Website content</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Everything below is live on the public site as soon as you save.
        </p>

        <Tabs defaultValue="hero" className="mt-8">
          <TabsList className="flex h-auto flex-wrap gap-1 rounded-2xl p-1.5">
            {["hero", "about", "contact", "services", "gallery", "testimonials", "faqs", "enquiries"].map(
              (t) => (
                <TabsTrigger key={t} value={t} className="rounded-xl capitalize">
                  {t}
                </TabsTrigger>
              ),
            )}
          </TabsList>

          <TabsContent value="hero">
            <SettingEditor
              settingKey="hero"
              fields={[
                ["eyebrow", "Eyebrow text"],
                ["headline", "Headline"],
                ["subheadline", "Subheadline", "long"],
                ["primary_cta", "Primary button text"],
                ["secondary_cta", "Secondary button text"],
                ["image_url", "Hero image URL"],
              ]}
            />
          </TabsContent>
          <TabsContent value="about">
            <SettingEditor
              settingKey="about"
              fields={[
                ["heading", "Heading"],
                ["story", "Story", "long"],
                ["mission", "Mission", "long"],
                ["vision", "Vision", "long"],
                ["team_image_url", "Team image URL"],
                ["stat_clients", "Stat: clients"],
                ["stat_years", "Stat: years"],
                ["stat_cleans", "Stat: cleans"],
                ["stat_rating", "Stat: rating"],
              ]}
            />
          </TabsContent>
          <TabsContent value="contact">
            <SettingEditor
              settingKey="contact"
              fields={[
                ["phone", "Phone"],
                ["whatsapp", "WhatsApp number (digits only)"],
                ["email", "Email"],
                ["address", "Address"],
                ["map_embed_url", "Google Map embed URL"],
                ["facebook", "Facebook URL"],
                ["instagram", "Instagram URL"],
                ["linkedin", "LinkedIn URL"],
                ["hours", "Business hours (JSON list of day/time)", "json"],
              ]}
            />
          </TabsContent>

          <TabsContent value="services">
            <TableEditor
              table="services"
              columns={[
                ["title", "Title"],
                ["slug", "Slug"],
                ["category", "Category"],
                ["description", "Description", "long"],
                ["image_url", "Image URL"],
                ["features", "Features (comma separated)", "array"],
                ["cta_text", "Button text"],
                ["sort_order", "Order", "number"],
              ]}
              blank={{ title: "New service", slug: `service-${Date.now()}` }}
            />
          </TabsContent>
          <TabsContent value="gallery">
            <TableEditor
              table="gallery_items"
              columns={[
                ["title", "Title"],
                ["category", "Category (Homes/Offices/Cars)"],
                ["image_url", "Image URL"],
                ["sort_order", "Order", "number"],
              ]}
              blank={{ title: "New image", category: "Homes", image_url: "" }}
            />
          </TabsContent>
          <TabsContent value="testimonials">
            <TableEditor
              table="testimonials"
              columns={[
                ["name", "Name"],
                ["location", "Location"],
                ["rating", "Rating", "number"],
                ["quote", "Review", "long"],
                ["sort_order", "Order", "number"],
              ]}
              blank={{ name: "New client", quote: "Great service", rating: 5 }}
            />
          </TabsContent>
          <TabsContent value="faqs">
            <TableEditor
              table="faqs"
              columns={[
                ["question", "Question"],
                ["answer", "Answer", "long"],
                ["sort_order", "Order", "number"],
              ]}
              blank={{ question: "New question", answer: "Answer" }}
            />
          </TabsContent>
          <TabsContent value="enquiries">
            <Enquiries />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

type Field = [string, string, ("long" | "json" | "array" | "number")?];

function SettingEditor({ settingKey, fields }: { settingKey: string; fields: Field[] }) {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-setting", settingKey],
    queryFn: async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", settingKey)
        .maybeSingle();
      return (data?.value ?? {}) as Record<string, unknown>;
    },
  });
  const [draft, setDraft] = useState<Record<string, unknown>>({});

  useEffect(() => {
    if (data) setDraft(data);
  }, [data]);

  if (isLoading) return <p className="mt-6 text-sm text-muted-foreground">Loading…</p>;

  const save = async () => {
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key: settingKey, value: draft as never });
    if (error) return toast.error(error.message);
    toast.success("Saved");
    queryClient.invalidateQueries();
  };

  return (
    <div className="mt-6 space-y-5 rounded-3xl border border-border bg-card p-7 shadow-soft">
      {fields.map(([key, label, kind]) => {
        const value = draft[key];
        const text =
          kind === "json" ? JSON.stringify(value ?? [], null, 2) : String(value ?? "");
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={`${settingKey}-${key}`}>{label}</Label>
            {kind === "long" || kind === "json" ? (
              <Textarea
                id={`${settingKey}-${key}`}
                rows={kind === "json" ? 8 : 4}
                value={text}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    [key]: kind === "json" ? safeJson(e.target.value, d[key]) : e.target.value,
                  }))
                }
                className="rounded-xl font-mono text-sm"
              />
            ) : (
              <Input
                id={`${settingKey}-${key}`}
                value={text}
                onChange={(e) => setDraft((d) => ({ ...d, [key]: e.target.value }))}
                className="h-12 rounded-xl"
              />
            )}
          </div>
        );
      })}
      <Button variant="hero" size="pill" onClick={save}>
        Save changes
      </Button>
    </div>
  );
}

function safeJson(text: string, fallback: unknown) {
  try {
    return JSON.parse(text);
  } catch {
    return fallback;
  }
}

function TableEditor({
  table,
  columns,
  blank,
}: {
  table: "services" | "gallery_items" | "testimonials" | "faqs";
  columns: Field[];
  blank: Record<string, unknown>;
}) {
  const queryClient = useQueryClient();
  const { data: rows = [], refetch } = useQuery({
    queryKey: ["admin-table", table],
    queryFn: async () => {
      const { data } = await supabase.from(table).select("*").order("sort_order");
      return (data ?? []) as Row[];
    },
  });

  const update = async (id: string, patch: Record<string, unknown>) => {
    const { error } = await supabase.from(table).update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    refetch();
    queryClient.invalidateQueries();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) return toast.error(error.message);
    refetch();
    queryClient.invalidateQueries();
  };

  const add = async () => {
    const { error } = await supabase.from(table).insert(blank as never);
    if (error) return toast.error(error.message);
    refetch();
  };

  return (
    <div className="mt-6 space-y-5">
      <Button variant="hero" size="pill" onClick={add}>
        Add new
      </Button>
      {rows.map((row) => (
        <div key={row.id} className="space-y-4 rounded-3xl border border-border bg-card p-7 shadow-soft">
          {columns.map(([key, label, kind]) => {
            const raw = row[key];
            const text = Array.isArray(raw) ? raw.join(", ") : String(raw ?? "");
            const onChange = (value: string) => {
              const parsed =
                kind === "array"
                  ? value.split(",").map((v) => v.trim()).filter(Boolean)
                  : kind === "number"
                    ? Number(value) || 0
                    : value;
              queryClient.setQueryData(["admin-table", table], (old: Row[] | undefined) =>
                (old ?? []).map((r) => (r.id === row.id ? { ...r, [key]: parsed } : r)),
              );
            };
            return (
              <div key={key} className="space-y-2">
                <Label htmlFor={`${row.id}-${key}`}>{label}</Label>
                {kind === "long" ? (
                  <Textarea
                    id={`${row.id}-${key}`}
                    rows={3}
                    value={text}
                    onChange={(e) => onChange(e.target.value)}
                    className="rounded-xl"
                  />
                ) : (
                  <Input
                    id={`${row.id}-${key}`}
                    value={text}
                    onChange={(e) => onChange(e.target.value)}
                    className="h-12 rounded-xl"
                  />
                )}
              </div>
            );
          })}
          <div className="flex gap-3">
            <Button
              variant="navy"
              size="pill"
              onClick={() =>
                update(
                  row.id,
                  Object.fromEntries(columns.map(([key]) => [key, row[key]])) as Record<string, unknown>,
                )
              }
            >
              Save
            </Button>
            <Button variant="outline" size="pill" onClick={() => remove(row.id)}>
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

function Enquiries() {
  const { data: rows = [] } = useQuery({
    queryKey: ["admin-enquiries"],
    queryFn: async () => {
      const { data } = await supabase
        .from("enquiries")
        .select("*")
        .order("created_at", { ascending: false });
      return (data ?? []) as Row[];
    },
  });

  if (!rows.length) {
    return <p className="mt-6 text-sm text-muted-foreground">No enquiries yet.</p>;
  }

  return (
    <div className="mt-6 space-y-4">
      {rows.map((r) => (
        <article key={r.id} className="rounded-3xl border border-border bg-card p-6 shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-bold text-navy">{String(r.name)}</h3>
            <span className="text-xs text-muted-foreground">
              {new Date(String(r.created_at)).toLocaleString()}
            </span>
          </div>
          <p className="mt-1 text-sm text-primary">
            {String(r.email)} · {String(r.phone)}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{String(r.message)}</p>
        </article>
      ))}
    </div>
  );
}