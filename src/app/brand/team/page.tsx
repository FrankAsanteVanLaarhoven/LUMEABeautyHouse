"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BrandShell } from "@/components/brand/BrandShell";
import { useBrandPortal } from "@/hooks/useBrandPortal";
import { ROLE_DESCRIPTIONS, ROLE_LABELS } from "@/lib/rbac";
import type { TeamRole } from "@/lib/types";
import { cn } from "@/lib/utils";

interface MemberRow {
  id: string;
  email: string;
  name: string;
  role: TeamRole;
  status: string;
  lastLoginAt?: string;
  createdAt: string;
}

export default function BrandTeamPage() {
  const router = useRouter();
  const { brand, role, member, loading, can } = useBrandPortal();
  const [members, setMembers] = useState<MemberRow[]>([]);
  const [seatLimit, setSeatLimit] = useState(0);
  const [seatsUsed, setSeatsUsed] = useState(0);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [inviteResult, setInviteResult] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadTeam() {
    const res = await fetch("/api/brands/me/team");
    if (res.status === 401) {
      router.replace("/brand");
      return;
    }
    if (res.status === 403) {
      setError("You do not have permission to view team");
      return;
    }
    const d = await res.json();
    setMembers(d.members || []);
    setSeatLimit(d.seatLimit || 0);
    setSeatsUsed(d.seatsUsed || 0);
  }

  useEffect(() => {
    if (brand) loadTeam();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brand?.id]);

  async function onInvite(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setInviteResult("");
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/brands/me/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          email: fd.get("email"),
          role: fd.get("role"),
          password: fd.get("password") || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invite failed");
      setInviteResult(
        `Invited ${data.member.email}. Temp password: ${data.tempPassword}`
      );
      setOpen(false);
      loadTeam();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setSaving(false);
    }
  }

  async function changeRole(memberId: string, newRole: TeamRole) {
    const res = await fetch("/api/brands/me/team", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ memberId, role: newRole }),
    });
    if (!res.ok) {
      const d = await res.json();
      setError(d.error || "Failed");
      return;
    }
    loadTeam();
  }

  async function removeMember(id: string) {
    if (!confirm("Remove this team seat?")) return;
    const res = await fetch(`/api/brands/me/team?id=${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const d = await res.json();
      setError(d.error || "Failed");
      return;
    }
    loadTeam();
  }

  if (loading || !brand) {
    return <div className="p-16 text-center text-muted">Loading…</div>;
  }

  return (
    <BrandShell brand={brand} role={role} memberName={member?.name}>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-dim)]">
            Access control
          </p>
          <h1 className="mt-1 font-display text-4xl text-[var(--text)]">
            Team seats
          </h1>
          <p className="mt-2 text-sm text-[var(--text-dim)]">
            {seatsUsed} / {seatLimit} seats used · {brand.plan} plan · roles:
            owner, admin, editor, viewer
          </p>
        </div>
        {can("team:write") && (
          <button
            onClick={() => setOpen(true)}
            disabled={seatsUsed >= seatLimit}
            className="bg-champagne px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.14em] text-ink disabled:opacity-40"
          >
            Invite seat
          </button>
        )}
      </div>

      {/* Seat meter */}
      <div className="mb-6 border border-[var(--border)] bg-[var(--panel)] p-4">
        <div className="mb-2 flex justify-between text-[10px] uppercase tracking-[0.14em] text-[var(--text-dim)]">
          <span>Seats</span>
          <span>
            {seatsUsed} / {seatLimit}
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-[var(--panel-2)]">
          <div
            className="h-full bg-champagne transition-all"
            style={{
              width: `${Math.min(100, (seatsUsed / Math.max(1, seatLimit)) * 100)}%`,
            }}
          />
        </div>
      </div>

      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
      {inviteResult && (
        <p className="mb-4 border border-champagne/30 bg-champagne/10 px-4 py-3 text-sm text-champagne">
          {inviteResult}
        </p>
      )}

      <div className="overflow-x-auto border border-[var(--border)] bg-[var(--panel)]">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead>
            <tr className="text-[10px] uppercase tracking-[0.12em] text-[var(--text-dim)]">
              <th className="px-4 py-3 font-medium">Member</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id} className="border-t border-[var(--border)]">
                <td className="px-4 py-3">
                  <p className="font-medium text-[var(--text)]">{m.name}</p>
                  <p className="text-xs text-[var(--text-dim)]">{m.email}</p>
                </td>
                <td className="px-4 py-3">
                  {can("team:write") && m.role !== "owner" ? (
                    <select
                      value={m.role}
                      onChange={(e) =>
                        changeRole(m.id, e.target.value as TeamRole)
                      }
                      className="border border-[var(--border)] bg-[var(--panel-2)] px-2 py-1 text-xs text-[var(--text)]"
                    >
                      <option value="admin">Admin</option>
                      <option value="editor">Editor</option>
                      <option value="viewer">Viewer</option>
                    </select>
                  ) : (
                    <span
                      className={cn(
                        "text-xs uppercase tracking-[0.12em]",
                        m.role === "owner" ? "text-champagne" : "text-[var(--text)]"
                      )}
                    >
                      {ROLE_LABELS[m.role]}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 capitalize text-[var(--text-dim)]">
                  {m.status}
                </td>
                <td className="px-4 py-3 text-right">
                  {can("team:write") && m.role !== "owner" && (
                    <button
                      onClick={() => removeMember(m.id)}
                      className="text-xs text-red-400 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {(Object.keys(ROLE_LABELS) as TeamRole[]).map((r) => (
          <div
            key={r}
            className="border border-[var(--border)] bg-[var(--panel)] p-4"
          >
            <p className="text-[10px] uppercase tracking-[0.14em] text-champagne">
              {ROLE_LABELS[r]}
            </p>
            <p className="mt-2 text-xs text-[var(--text-dim)]">
              {ROLE_DESCRIPTIONS[r]}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-6 text-xs text-[var(--text-dim)]">
        Demo seats — editor:{" "}
        <code className="text-champagne">editor@glowlab.demo</code> /{" "}
        <code className="text-champagne">editor-demo</code> · viewer:{" "}
        <code className="text-champagne">viewer@glowlab.demo</code> /{" "}
        <code className="text-champagne">viewer-demo</code>
      </p>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">
          <form
            onSubmit={onInvite}
            className="w-full max-w-md border border-[var(--border)] bg-[var(--panel)] p-6"
          >
            <h2 className="font-display text-2xl text-[var(--text)]">
              Invite team seat
            </h2>
            <div className="mt-5 space-y-3">
              <input
                name="name"
                required
                placeholder="Full name"
                className="w-full border border-[var(--border)] bg-[var(--panel-2)] px-3 py-2 text-sm text-[var(--text)]"
              />
              <input
                name="email"
                type="email"
                required
                placeholder="Work email"
                className="w-full border border-[var(--border)] bg-[var(--panel-2)] px-3 py-2 text-sm text-[var(--text)]"
              />
              <select
                name="role"
                defaultValue="editor"
                className="w-full border border-[var(--border)] bg-[var(--panel-2)] px-3 py-2 text-sm text-[var(--text)]"
              >
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </select>
              <input
                name="password"
                placeholder="Temp password (optional)"
                className="w-full border border-[var(--border)] bg-[var(--panel-2)] px-3 py-2 text-sm text-[var(--text)]"
              />
            </div>
            <div className="mt-6 flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="bg-champagne px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.14em] text-ink"
              >
                {saving ? "Inviting…" : "Invite"}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="border border-[var(--border)] px-5 py-2.5 text-[11px] uppercase tracking-[0.14em] text-[var(--text)]"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </BrandShell>
  );
}
