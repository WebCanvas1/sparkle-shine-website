import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Images,
  Info,
  LayoutDashboard,
  Loader2,
  LogOut,
  MessageSquareQuote,
  Phone,
  Shield,
  Sparkles,
  Star,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/site/Logo";
import { AboutPanel, ContactPanel, HeroPanel } from "@/components/admin/panels/ContentPanels";
import {
  FaqsPanel,
  GalleryPanel,
  ServicesPanel,
  TestimonialsPanel,
} from "@/components/admin/panels/ListPanels";
import { PanelCard } from "@/components/admin/AdminKit";
import { useAdminContent } from "@/components/admin/useAdminContent";
import { adminApi, formatBytes } from "@/lib/admin-api";
import { CONTENT_QUERY_KEY } from "@/lib/content";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin · Sparkle Cleaning Services" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

const TABS = [
  { id: "dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { id: "hero", label: "Hero", Icon: Sparkles },
  { id: "about", label: "About", Icon: Info },
  { id: "services", label: "Services", Icon: Wrench },
  { id: "gallery", label: "Gallery", Icon: Images },
  { id: "testimonials", label: "Testimonials", Icon: Star },
  { id: "faqs", label: "FAQs", Icon: MessageSquareQuote },
  { id: "contact", label: "Contact", Icon: Phone },
] as const;

type TabId = (typeof TABS)[number]["id"];

function AdminPage() {
  const queryClient = useQueryClient();
  const session = useQuery({ queryKey: ["admin-session"], queryFn: adminApi.session, retry: false });

  if (session.isLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-muted/40">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!session.data?.authenticated) {
    return <LoginScreen onSuccess={() => queryClient.invalidateQueries()} />;
  }

  return <Dashboard username={session.data.username ?? "admin"} />;
}

function LoginScreen({ onSuccess }: { onSuccess: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = useMutation({
    mutationFn: () => adminApi.login(username, password),
    onSuccess: () => {
      toast.success("Welcome back.");
      onSuccess();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <div className="grid min-h-screen place-items-center bg-muted/40 px-4 py-16">
      <div className="w-full max-w-md rounded-[1.75rem] border border-border/70 bg-card p-8 shadow-elevated">
        <div className="flex flex-col items-center gap-3 text-center">
          <Logo size={56} />
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            <Shield className="h-3.5 w-3.5" />
            Admin access
          </div>
          <p className="text-sm text-muted-foreground">
            Sign in to manage the website content.
          </p>
        </div>

        <form
          className="mt-8 space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            if (!username.trim() || !password) {
              toast.error("Enter your username and password.");
              return;
            }
            login.mutate();
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="admin-username">Username</Label>
            <Input
              id="admin-username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-password">Password</Label>
            <Input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={login.isPending}>
            {login.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Sign in
          </Button>
        </form>
      </div>
    </div>
  );
}

function Dashboard({ username }: { username: string }) {
  const [tab, setTab] = useState<TabId>("dashboard");
  const queryClient = useQueryClient();
  const { data, isLoading } = useAdminContent();

  const logout = useMutation({
    mutationFn: adminApi.logout,
    onSuccess: async () => {
      await queryClient.invalidateQueries();
      toast.success("Signed out.");
    },
  });

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="sticky top-0 z-30 border-b border-border/70 bg-card/90 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <div className="flex items-center gap-3">
            <Logo size={40} />
            <div>
              <p className="font-display text-sm font-bold text-foreground">Content admin</p>
              <p className="text-xs text-muted-foreground">Signed in as {username}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <a href="/" target="_blank" rel="noreferrer">
                View site
              </a>
            </Button>
            <Button variant="ghost" onClick={() => logout.mutate()} disabled={logout.isPending}>
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 lg:flex-row">
        <nav className="flex gap-2 overflow-x-auto lg:w-56 lg:shrink-0 lg:flex-col lg:overflow-visible">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors",
                tab === id
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "text-muted-foreground hover:bg-card hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </nav>

        <main className="min-w-0 flex-1">
          {isLoading ? (
            <div className="grid h-64 place-items-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {tab === "dashboard" && <Stats />}
              {tab === "hero" && <HeroPanel initial={data.hero} />}
              {tab === "about" && <AboutPanel initial={data.about} />}
              {tab === "services" && <ServicesPanel initial={data.services} />}
              {tab === "gallery" && <GalleryPanel initial={data.gallery} />}
              {tab === "testimonials" && <TestimonialsPanel initial={data.testimonials} />}
              {tab === "faqs" && <FaqsPanel initial={data.faqs} />}
              {tab === "contact" && <ContactPanel initial={data.contact} />}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

function Stats() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin-stats"], queryFn: adminApi.stats });

  const cards = [
    { label: "Services", value: data?.services ?? 0 },
    { label: "Gallery images", value: data?.gallery ?? 0 },
    { label: "Testimonials", value: data?.testimonials ?? 0 },
    { label: "FAQs", value: data?.faqs ?? 0 },
    { label: "Stored images", value: data?.images ?? 0 },
    { label: "KV storage used", value: formatBytes(data?.storage_bytes ?? 0) },
  ];

  return (
    <PanelCard
      title="Overview"
      description={
        data?.updated_at
          ? `Content last updated ${new Date(data.updated_at).toLocaleString()}`
          : "Live counts from Cloudflare KV."
      }
      actions={
        <Button
          variant="outline"
          onClick={() => {
            queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
            queryClient.invalidateQueries({ queryKey: CONTENT_QUERY_KEY });
          }}
        >
          Refresh
        </Button>
      }
    >
      {isLoading ? (
        <div className="grid h-32 place-items-center">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <div key={card.label} className="rounded-2xl border border-border/70 bg-background p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {card.label}
              </p>
              <p className="mt-2 font-display text-2xl font-bold text-foreground">{card.value}</p>
            </div>
          ))}
        </div>
      )}
    </PanelCard>
  );
}
