"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Building2 } from "lucide-react";

export default function BrandAuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/brands/me")
      .then((r) => {
        if (r.ok) router.replace("/brand/dashboard");
      })
      .catch(() => {});
  }, [router]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const body =
      mode === "login"
        ? {
            email: fd.get("email"),
            password: fd.get("password"),
          }
        : {
            name: fd.get("name"),
            email: fd.get("email"),
            password: fd.get("password"),
            contactName: fd.get("contactName"),
            website: fd.get("website"),
            plan: fd.get("plan") || "starter",
          };

    try {
      const res = await fetch(
        mode === "login" ? "/api/brands/login" : "/api/brands/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      router.push("/brand/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-5 py-14 md:grid-cols-2 md:px-8 md:py-20">
      <div>
        <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-muted">
          LUMÉA Brand Portal
        </p>
        <h1 className="mt-3 font-display text-4xl tracking-tight md:text-5xl">
          Multi-tenant beauty commerce OS
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          Create a brand account, upload products via CSV, configure white-label
          domains, and launch Mirror Studio under your identity — the same stack
          powering LUMÉA.
        </p>
        <ul className="mt-8 space-y-3 text-sm text-ink-soft">
          <li>· Brand accounts with session auth</li>
          <li>· Product CSV bulk import API</li>
          <li>· White-label subdomain + custom domain</li>
          <li>· Theme colours, logo, storefront preview</li>
        </ul>
        <p className="mt-8 text-xs text-muted">
          Demo partner:{" "}
          <code className="bg-ivory-deep px-1">partner@glowlab.demo</code> /{" "}
          <code className="bg-ivory-deep px-1">glowlab-demo</code>
        </p>
        <Link
          href="/platform"
          className="mt-6 inline-block text-[11px] uppercase tracking-[0.14em] text-champagne underline underline-offset-4"
        >
          Platform overview
        </Link>
      </div>

      <div className="border border-line bg-surface p-6 md:p-8">
        <div className="mb-6 flex items-center gap-2">
          <Building2 size={18} className="text-champagne" />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`text-[11px] uppercase tracking-[0.14em] ${
                mode === "login" ? "text-ink font-medium" : "text-muted"
              }`}
            >
              Sign in
            </button>
            <span className="text-muted">/</span>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={`text-[11px] uppercase tracking-[0.14em] ${
                mode === "register" ? "text-ink font-medium" : "text-muted"
              }`}
            >
              Register brand
            </button>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {mode === "register" && (
            <>
              <div>
                <label className="label">Brand name</label>
                <input name="name" required className="field" />
              </div>
              <div>
                <label className="label">Contact name</label>
                <input name="contactName" required className="field" />
              </div>
              <div>
                <label className="label">Website</label>
                <input name="website" className="field" placeholder="https://" />
              </div>
              <div>
                <label className="label">Plan</label>
                <select name="plan" className="field" defaultValue="starter">
                  <option value="starter">Starter</option>
                  <option value="growth">Growth</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
            </>
          )}
          <div>
            <label className="label">Work email</label>
            <input name="email" type="email" required className="field" />
          </div>
          <div>
            <label className="label">Password</label>
            <input name="password" type="password" required minLength={6} className="field" />
          </div>
          {error && <p className="text-sm text-danger">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading
              ? "Please wait…"
              : mode === "login"
                ? "Enter brand portal"
                : "Create brand account"}
          </button>
        </form>
      </div>
    </div>
  );
}
