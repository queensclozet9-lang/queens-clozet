import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Staff Sign In — Queens Clozet" },
      { name: "description", content: "Queens Clozet staff sign in for appointment management." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Staff Sign In — Queens Clozet" },
      { property: "og:description", content: "Private sign in for Queens Clozet staff." },
    ],
  }),
  component: Auth,
});

function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin", replace: true });
    });
  }, [navigate]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setMessage("");

    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) {
        setMessage(error.message);
        return;
      }
      navigate({ to: "/admin", replace: true });
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin + "/auth" },
    });
    setBusy(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    if (data.session) {
      navigate({ to: "/admin", replace: true });
      return;
    }
    setMessage("Check your email to confirm the account, then sign in.");
  }

  const fieldClass =
    "mt-2 w-full rounded-sm border border-input bg-card px-4 py-3 text-sm outline-none focus:border-accent";

  return (
    <section className="mx-auto flex max-w-md flex-col px-5 py-20 sm:px-8 lg:py-28">
      <p className="eyebrow text-accent-foreground/70">Staff area</p>
      <h1 className="mt-4 font-serif text-3xl text-primary">
        {mode === "signin" ? "Sign in" : "Create staff account"}
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Appointment management is private to Queens Clozet staff.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <label className="block">
          <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Email
          </span>
          <input
            className={fieldClass}
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Password
          </span>
          <input
            className={fieldClass}
            type="password"
            required
            minLength={6}
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        {message ? <p className="text-sm text-destructive">{message}</p> : null}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-sm bg-primary px-6 py-4 text-xs font-medium uppercase tracking-[0.18em] text-primary-foreground disabled:opacity-60"
        >
          {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
        </button>
      </form>

      <button
        type="button"
        onClick={() => {
          setMode(mode === "signin" ? "signup" : "signin");
          setMessage("");
        }}
        className="mt-6 text-sm text-primary underline decoration-accent underline-offset-4"
      >
        {mode === "signin" ? "Need a staff account?" : "Already have an account? Sign in"}
      </button>

      <Link to="/" className="mt-10 text-xs uppercase tracking-[0.18em] text-muted-foreground">
        Back to site
      </Link>
    </section>
  );
}
