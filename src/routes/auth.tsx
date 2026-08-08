import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/lib/use-user";

type AuthSearch = { redirect?: string | undefined };

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): AuthSearch => ({
    redirect:
      typeof search["redirect"] === "string" && (search["redirect"] as string).startsWith("/")
        ? (search["redirect"] as string)
        : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Login or Register — Diablo" },
      {
        name: "description",
        content: "Sign in to your Diablo account to check out and follow your orders.",
      },
      { property: "og:title", content: "Login or Register — Diablo" },
      { property: "og:description", content: "Sign in to your Diablo account." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { redirect } = Route.useSearch();
  const navigate = useNavigate();
  const { user } = useUser();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [busy, setBusy] = useState(false);
  const [sentConfirmation, setSentConfirmation] = useState(false);

  useEffect(() => {
    if (user) navigate({ to: redirect ?? "/", replace: true });
  }, [user, redirect, navigate]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      if (mode === "register") {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: fullName.trim() },
          },
        });
        if (error) throw error;
        setSentConfirmation(true);
        toast.success("Check your email to confirm your account");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
        toast.success("Welcome back");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-4xl">{mode === "login" ? "Login" : "Register"}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {mode === "login"
          ? "Sign in to check out and follow your orders."
          : "Create an account to place orders with Diablo."}
      </p>

      {sentConfirmation ? (
        <div className="mt-8 border border-gold/50 bg-card p-6 text-sm text-muted-foreground">
          We sent a confirmation link to <span className="text-foreground">{email}</span>. Click it,
          then come back and log in.
        </div>
      ) : (
        <form onSubmit={submit} className="mt-8 space-y-4">
          {mode === "register" && (
            <div>
              <label className="label-caps text-muted-foreground" htmlFor="fullName">
                Full name
              </label>
              <input
                id="fullName"
                value={fullName}
                onChange={(event) => setFullName(event.target.value.slice(0, 100))}
                required
                className="mt-2 w-full border border-input bg-card px-3 py-3 text-sm outline-none focus:border-gold"
              />
            </div>
          )}
          <div>
            <label className="label-caps text-muted-foreground" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value.slice(0, 255))}
              required
              className="mt-2 w-full border border-input bg-card px-3 py-3 text-sm outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="label-caps text-muted-foreground" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value.slice(0, 72))}
              required
              minLength={6}
              className="mt-2 w-full border border-input bg-card px-3 py-3 text-sm outline-none focus:border-gold"
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="label-caps w-full bg-gold py-4 text-gold-foreground disabled:opacity-50"
          >
            {mode === "login" ? "Log in" : "Create account"}
          </button>
        </form>
      )}



      <button
        onClick={() => {
          setMode(mode === "login" ? "register" : "login");
          setSentConfirmation(false);
        }}
        className="mt-8 text-sm text-muted-foreground underline-offset-4 hover:text-gold hover:underline"
      >
        {mode === "login" ? "No account? Register here" : "Already registered? Log in"}
      </button>
    </div>
  );
}
