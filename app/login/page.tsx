"use client";

import { createSupabaseBrowser } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const supabase = createSupabaseBrowser();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function handleAuth(e: React.FormEvent) {
  e.preventDefault();
  setLoading(true);
  setMsg(null);

  let result;

  if (mode === "signin") {
    result = await supabase.auth.signInWithPassword({ email, password });
  } else {
    result = await supabase.auth.signUp({ email, password });
  }

  setLoading(false);

  if (result.error) {
    setMsg(result.error.message);
  } else {
    router.push("/dashboard");
  }
}

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm border rounded-xl p-6">
        <h1 className="text-xl font-semibold">LifeOS</h1>
        <p className="text-sm opacity-80 mt-1">
          Sign in to plan your day with agents.
        </p>

        <form onSubmit={handleAuth} className="mt-6 space-y-3">
          <input
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />
          <input
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
          />

          {msg && <p className="text-sm text-red-600">{msg}</p>}

          <button
            className="w-full border rounded-lg px-3 py-2 font-medium"
            disabled={loading}
            type="submit"
          >
            {loading ? "Loading..." : mode === "signin" ? "Sign in" : "Sign up"}
          </button>

          <button
            type="button"
            className="w-full text-sm underline opacity-80"
            onClick={() =>
              setMode((m) => (m === "signin" ? "signup" : "signin"))
            }
          >
            {mode === "signin"
              ? "New here? Create an account"
              : "Already have an account? Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}