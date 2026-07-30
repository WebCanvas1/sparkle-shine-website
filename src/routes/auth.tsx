import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/site/Logo";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Admin Sign In | Sparkle Cleaning Services" },
      { name: "description", content: "Secure sign in for Sparkle Cleaning Services administrators." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Admin Sign In | Sparkle Cleaning Services" },
      { property: "og:description", content: "Secure sign in for site administrators." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    setBusy(true);

    const { error } =
      mode === "signin"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: `${window.location.origin}/admin` },
          });

    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    if (mode === "signup") {
      toast.success("Account created. Ask an existing admin to grant you access.");
    }
    navigate({ to: "/admin" });
  };

  return (
    <div className="grid min-h-screen place-items-center gradient-deep px-4">
      <div className="w-full max-w-md rounded-[1.75rem] bg-card p-8 shadow-lift">
        <Logo />
        <h1 className="mt-8 text-2xl font-extrabold text-navy">
          {mode === "signin" ? "Admin sign in" : "Create admin account"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage website content, enquiries and business details.
        </p>

        <form onSubmit={submit} className="mt-7 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required className="h-12 rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              className="h-12 rounded-xl"
            />
          </div>
          <Button type="submit" variant="hero" size="pill-lg" disabled={busy} className="w-full">
            {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Sign up"}
          </Button>
        </form>

        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-6 w-full text-center text-sm font-semibold text-primary hover:underline"
        >
          {mode === "signin" ? "Need an account? Sign up" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}