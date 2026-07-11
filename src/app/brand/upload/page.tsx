"use client";

import { useState } from "react";
import { BrandShell } from "@/components/brand/BrandShell";
import { useBrandPortal } from "@/hooks/useBrandPortal";
import { Download, FileSpreadsheet, Upload } from "lucide-react";

export default function BrandUploadPage() {
  const { brand, role, member, loading: portalLoading } = useBrandPortal();
  const [file, setFile] = useState<File | null>(null);
  const [paste, setPaste] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    created: number;
    errors: { row: number; error: string }[];
  } | null>(null);
  const [error, setError] = useState("");

  async function uploadFile() {
    if (!file) {
      setError("Choose a CSV file");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/brands/me/products/csv", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setResult({ created: data.created, errors: data.errors || [] });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  async function uploadPaste() {
    if (!paste.trim()) {
      setError("Paste CSV content");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/brands/me/products/csv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csv: paste }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Import failed");
      setResult({ created: data.created, errors: data.errors || [] });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Import failed");
    } finally {
      setLoading(false);
    }
  }

  if (portalLoading || !brand) {
    return <div className="p-16 text-center text-muted">Loading…</div>;
  }

  return (
    <BrandShell brand={brand} role={role} memberName={member?.name}>
      <div className="mb-8">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-dim)]">
          Bulk import
        </p>
        <h1 className="mt-1 font-display text-4xl text-[var(--text)]">
          Product CSV upload
        </h1>
        <p className="mt-2 max-w-xl text-sm text-[var(--text-dim)]">
          Import makeup, hair, body, and tools in one go. API endpoint:{" "}
          <code className="text-champagne">POST /api/brands/me/products/csv</code>
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <a
          href="/api/brands/me/products/csv"
          className="inline-flex items-center gap-2 border border-[var(--border)] px-4 py-2.5 text-[11px] uppercase tracking-[0.14em] text-[var(--text)]"
        >
          <Download size={14} /> Download template
        </a>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="border border-[var(--border)] bg-[var(--panel)] p-6">
          <div className="flex items-center gap-2 text-[var(--text)]">
            <Upload size={16} className="text-champagne" />
            <h2 className="text-sm font-medium">Upload file</h2>
          </div>
          <input
            type="file"
            accept=".csv,text/csv"
            className="mt-4 block w-full text-sm text-[var(--text-dim)] file:mr-3 file:border-0 file:bg-champagne file:px-3 file:py-2 file:text-[10px] file:font-medium file:uppercase file:tracking-wider file:text-ink"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          {file && (
            <p className="mt-2 text-xs text-[var(--text-dim)]">
              <FileSpreadsheet size={12} className="mr-1 inline" />
              {file.name} ({Math.round(file.size / 1024)} KB)
            </p>
          )}
          <button
            onClick={uploadFile}
            disabled={loading}
            className="mt-5 bg-champagne px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.14em] text-ink disabled:opacity-50"
          >
            {loading ? "Importing…" : "Import file"}
          </button>
        </div>

        <div className="border border-[var(--border)] bg-[var(--panel)] p-6">
          <h2 className="text-sm font-medium text-[var(--text)]">
            Or paste CSV
          </h2>
          <textarea
            value={paste}
            onChange={(e) => setPaste(e.target.value)}
            placeholder="name,category,price,stock,sku..."
            className="mt-4 min-h-[160px] w-full border border-[var(--border)] bg-[var(--panel-2)] p-3 font-mono text-xs text-[var(--text)] outline-none focus:border-champagne"
          />
          <button
            onClick={uploadPaste}
            disabled={loading}
            className="mt-4 border border-[var(--border)] px-5 py-2.5 text-[11px] uppercase tracking-[0.14em] text-[var(--text)] disabled:opacity-50"
          >
            {loading ? "Importing…" : "Import paste"}
          </button>
        </div>
      </div>

      {error && (
        <p className="mt-6 text-sm text-red-400">{error}</p>
      )}

      {result && (
        <div className="mt-8 border border-[var(--border)] bg-[var(--panel)] p-6">
          <p className="text-sm text-[var(--text)]">
            Imported <strong className="text-champagne">{result.created}</strong>{" "}
            product{result.created === 1 ? "" : "s"}
            {result.errors.length > 0 && (
              <span className="text-[var(--text-dim)]">
                {" "}
                · {result.errors.length} row error
                {result.errors.length === 1 ? "" : "s"}
              </span>
            )}
          </p>
          {result.errors.length > 0 && (
            <ul className="mt-4 max-h-40 space-y-1 overflow-y-auto text-xs text-red-300">
              {result.errors.map((e, i) => (
                <li key={i}>
                  Row {e.row}: {e.error}
                </li>
              ))}
            </ul>
          )}
          <a
            href="/brand/products"
            className="mt-4 inline-block text-[11px] uppercase tracking-[0.14em] text-champagne hover:underline"
          >
            View products →
          </a>
        </div>
      )}

      <div className="mt-10 border border-[var(--border)] bg-[var(--panel)] p-6 text-sm text-[var(--text-dim)]">
        <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--text)]">
          CSV columns
        </p>
        <p className="mt-3 font-mono text-xs leading-relaxed">
          name, slug, category, tagline, description, price, stock, sku, variant,
          shade_hex, image, badges, featured, active
        </p>
        <p className="mt-3 text-xs">
          Categories: makeup · skin · hair · body · tools · sets. Badges pipe-separated
          e.g. <code className="text-champagne">new|bestseller</code>
        </p>
      </div>
    </BrandShell>
  );
}
