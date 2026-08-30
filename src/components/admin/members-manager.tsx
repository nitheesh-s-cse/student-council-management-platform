"use client";

import { useMemo, useState } from "react";
import { Plus, Search, Upload, Ban, RotateCcw, Pencil, X, Loader2, Download } from "lucide-react";
import { Card, Badge, Button, Avatar } from "@/components/ui/primitives";
import { useToast } from "@/components/providers/toast-provider";
import type { members as membersTable } from "@/db/schema";

type Member = typeof membersTable.$inferSelect;

const CATEGORY_LABEL: Record<string, string> = { board: "Board", executive: "Executive", committee: "Committee" };

export function MembersManager({ initialMembers }: { initialMembers: Member[] }) {
  const [members, setMembers] = useState(initialMembers);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [editing, setEditing] = useState<Member | null>(null);
  const [creating, setCreating] = useState(false);
  const [importing, setImporting] = useState(false);
  const { push } = useToast();

  const filtered = useMemo(() => {
    return members.filter((m) => {
      if (categoryFilter && m.category !== categoryFilter) return false;
      if (query && !`${m.fullName} ${m.department}`.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [members, query, categoryFilter]);

  async function toggleActive(member: Member) {
    const method = member.isActive ? "DELETE" : "PATCH";
    const res = await fetch(`/api/members/${member.id}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: member.isActive ? undefined : JSON.stringify({ isActive: true }),
    });
    if (res.ok) {
      setMembers((prev) => prev.map((m) => (m.id === member.id ? { ...m, isActive: !member.isActive } : m)));
      push({ kind: "success", title: member.isActive ? "Member disabled" : "Member restored" });
    }
  }

  function exportCsv() {
    const header = "Full Name,Department,Year,Category,Position,Committee\n";
    const rows = filtered
      .map((m) => [m.fullName, m.department, m.year, m.category, m.position ?? "", m.committeeName ?? ""].map((v) => `"${v}"`).join(","))
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ppgit-council-members.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--text)]">Members</h1>
          <p className="mt-1 text-sm text-muted">{members.length} council members on record.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={exportCsv}><Download className="h-4 w-4" /> Export CSV</Button>
          <Button variant="outline" size="sm" onClick={() => setImporting(true)}><Upload className="h-4 w-4" /> Import CSV / PDF Roster</Button>
          <Button size="sm" onClick={() => setCreating(true)}><Plus className="h-4 w-4" /> Add Member</Button>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search members…" className="focus-ring h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] pl-9 pr-3 text-sm" />
        </div>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="focus-ring h-10 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-sm">
          <option value="">All categories</option>
          <option value="board">Board</option>
          <option value="executive">Executive</option>
          <option value="committee">Committee</option>
        </select>
      </div>

      <Card className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-left text-xs uppercase tracking-wide text-muted">
              <th className="px-4 py-3 font-medium">Member</th>
              <th className="px-4 py-3 font-medium">Department</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => (
              <tr key={m.id} className="border-b border-[var(--border)] last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={m.fullName} src={m.photoUrl} size={32} />
                    <div>
                      <p className="font-medium text-[var(--text)]">{m.fullName}</p>
                      <p className="text-xs text-muted">{m.position ?? "—"}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted">{m.department} · Year {m.year}</td>
                <td className="px-4 py-3"><Badge tone="brand">{CATEGORY_LABEL[m.category]}</Badge></td>
                <td className="px-4 py-3">
                  <Badge tone={m.isActive ? "success" : "neutral"}>{m.isActive ? "Active" : "Disabled"}</Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1.5">
                    <button onClick={() => setEditing(m)} className="focus-ring rounded-lg p-1.5 text-muted hover:bg-[var(--surface-muted)]" aria-label="Edit member"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => toggleActive(m)} className="focus-ring rounded-lg p-1.5 text-muted hover:bg-[var(--surface-muted)]" aria-label={m.isActive ? "Disable member" : "Restore member"}>
                      {m.isActive ? <Ban className="h-4 w-4" /> : <RotateCcw className="h-4 w-4" />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="p-8 text-center text-sm text-muted">No members match your filters.</p>}
      </Card>

      {editing && (
        <MemberModal
          member={editing}
          onClose={() => setEditing(null)}
          onSaved={(updated) => {
            setMembers((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
            setEditing(null);
            push({ kind: "success", title: "Member updated" });
          }}
        />
      )}
      {creating && (
        <CreateMemberModal
          onClose={() => setCreating(false)}
          onCreated={(m) => {
            setMembers((prev) => [m, ...prev]);
            setCreating(false);
            push({ kind: "success", title: "Member added" });
          }}
        />
      )}
      {importing && (
        <ImportModal
          onClose={() => setImporting(false)}
          onImported={(count) => {
            setImporting(false);
            push({ kind: "success", title: `${count} members imported`, description: "Refresh to see the full roster." });
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}

function MemberModal({ member, onClose, onSaved }: { member: Member; onClose: () => void; onSaved: (m: Member) => void }) {
  const [form, setForm] = useState({
    fullName: member.fullName,
    position: member.position ?? "",
    department: member.department,
    year: member.year,
    category: member.category,
    committeeName: member.committeeName ?? "",
    registerNumber: member.registerNumber ?? "",
    registerNumberVisible: member.registerNumberVisible,
    bio: member.bio ?? "",
    responsibilities: member.responsibilities ?? "",
  });
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/members/${member.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) onSaved(data.member);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal title={`Edit ${member.fullName}`} onClose={onClose}>
      <form onSubmit={submit} className="space-y-3">
        <Field label="Full name"><input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="input" /></Field>
        <Field label="Position"><input value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} className="input" /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Department"><input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className="input" /></Field>
          <Field label="Year"><input value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className="input" /></Field>
        </div>
        <Field label="Category">
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Member["category"] })} className="input">
            <option value="board">Board</option>
            <option value="executive">Executive</option>
            <option value="committee">Committee</option>
          </select>
        </Field>
        <Field label="Committee / Team name"><input value={form.committeeName} onChange={(e) => setForm({ ...form, committeeName: e.target.value })} className="input" /></Field>
        <Field label="Register number"><input value={form.registerNumber} onChange={(e) => setForm({ ...form, registerNumber: e.target.value })} className="input" /></Field>
        <label className="flex items-center gap-2 text-sm text-[var(--text)]">
          <input type="checkbox" checked={form.registerNumberVisible} onChange={(e) => setForm({ ...form, registerNumberVisible: e.target.checked })} />
          Show register number publicly
        </label>
        <Field label="Bio"><textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} className="input" /></Field>
        <Field label="Responsibilities"><textarea value={form.responsibilities} onChange={(e) => setForm({ ...form, responsibilities: e.target.value })} rows={2} className="input" /></Field>
        <Button type="submit" className="w-full" disabled={loading}>{loading && <Loader2 className="h-4 w-4 animate-spin" />} Save changes</Button>
      </form>
    </Modal>
  );
}

function CreateMemberModal({ onClose, onCreated }: { onClose: () => void; onCreated: (m: Member) => void }) {
  const [form, setForm] = useState({ fullName: "", position: "", department: "", year: "I", category: "committee", committeeName: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        return;
      }
      onCreated(data.member);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal title="Add member" onClose={onClose}>
      <form onSubmit={submit} className="space-y-3">
        <Field label="Full name"><input required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="input" /></Field>
        <Field label="Position"><input value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} className="input" /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Department"><input required value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className="input" /></Field>
          <Field label="Year"><input required value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className="input" /></Field>
        </div>
        <Field label="Category">
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input">
            <option value="board">Board</option>
            <option value="executive">Executive</option>
            <option value="committee">Committee</option>
          </select>
        </Field>
        <Field label="Committee / Team name"><input value={form.committeeName} onChange={(e) => setForm({ ...form, committeeName: e.target.value })} className="input" /></Field>
        {error && <p className="text-xs font-medium text-rose-600">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>{loading && <Loader2 className="h-4 w-4 animate-spin" />} Create member</Button>
      </form>
    </Modal>
  );
}

function ImportModal({ onClose, onImported }: { onClose: () => void; onImported: (count: number) => void }) {
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result);
      const lines = text.split(/\r?\n/).filter(Boolean);
      const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, "").toLowerCase());
      const parsed = lines.slice(1).map((line) => {
        const values = line.split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
        const row: Record<string, string> = {};
        headers.forEach((h, i) => { row[h] = values[i] ?? ""; });
        return row;
      });
      setRows(parsed);
    };
    reader.readAsText(file);
  }

  async function confirmImport() {
    setLoading(true);
    setError(null);
    try {
      const payload = rows.map((r) => ({
        fullName: r["full name"] || r["fullname"] || r["name"],
        department: r["department"] || "General",
        year: r["year"] || "I",
        position: r["position"] || undefined,
        category: (r["category"]?.toLowerCase() as "board" | "executive" | "committee") || "committee",
        committeeName: r["committee"] || r["team"] || undefined,
      })).filter((r) => r.fullName);

      const res = await fetch("/api/members/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows: payload }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Import failed.");
        return;
      }
      onImported(data.created);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal title="Import member roster" onClose={onClose} wide>
      <p className="text-sm text-muted">
        Upload a CSV export of the council roster (columns: Full Name, Department, Year, Category, Position,
        Committee). For PDF rosters, export the PDF to CSV/Excel first — the verification table below always
        gives you a chance to review every row before anything is saved.
      </p>
      <input type="file" accept=".csv" onChange={handleFile} className="mt-4 block w-full text-sm" />
      {rows.length > 0 && (
        <div className="mt-4 max-h-64 overflow-auto rounded-lg border border-[var(--border)]">
          <table className="w-full text-xs">
            <thead className="bg-[var(--surface-muted)]">
              <tr>
                <th className="px-2 py-1.5 text-left">Name</th>
                <th className="px-2 py-1.5 text-left">Department</th>
                <th className="px-2 py-1.5 text-left">Year</th>
                <th className="px-2 py-1.5 text-left">Category</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-t border-[var(--border)]">
                  <td className="px-2 py-1.5">{r["full name"] || r["fullname"] || r["name"]}</td>
                  <td className="px-2 py-1.5">{r["department"]}</td>
                  <td className="px-2 py-1.5">{r["year"]}</td>
                  <td className="px-2 py-1.5">{r["category"] || "committee"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {error && <p className="mt-2 text-xs font-medium text-rose-600">{error}</p>}
      <Button className="mt-4 w-full" disabled={rows.length === 0 || loading} onClick={confirmImport}>
        {loading && <Loader2 className="h-4 w-4 animate-spin" />} Confirm & import {rows.length > 0 ? `${rows.length} members` : ""}
      </Button>
    </Modal>
  );
}

function Modal({ title, onClose, children, wide }: { title: string; onClose: () => void; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <Card className={`w-full ${wide ? "max-w-2xl" : "max-w-lg"} max-h-[90vh] overflow-y-auto p-6`}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--text)]">{title}</h2>
          <button onClick={onClose} className="focus-ring rounded-lg p-1 text-muted hover:bg-[var(--surface-muted)]"><X className="h-4 w-4" /></button>
        </div>
        <div className="mt-5">{children}</div>
      </Card>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-medium text-muted">{label}</label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}
