"use client";

import { useState } from "react";
import { Plus, Vote, X, Loader2, Users } from "lucide-react";
import { Card, Badge, Button, EmptyState } from "@/components/ui/primitives";
import { useToast } from "@/components/providers/toast-provider";
import { cn, formatDate } from "@/lib/utils";
import type { listPollsWithResults } from "@/lib/services/polls";

type PollItem = Awaited<ReturnType<typeof listPollsWithResults>>[number];

export function PollsBoard({ initialPolls, canCreate }: { initialPolls: PollItem[]; canCreate: boolean }) {
  const [polls, setPolls] = useState(initialPolls);
  const [modalOpen, setModalOpen] = useState(false);
  const { push } = useToast();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--text)]">Polls</h1>
          <p className="mt-1 text-sm text-muted">Vote on council decisions and see live results.</p>
        </div>
        {canCreate && (
          <Button size="sm" onClick={() => setModalOpen(true)}><Plus className="h-4 w-4" /> New Poll</Button>
        )}
      </div>

      {polls.length === 0 ? (
        <div className="mt-8"><EmptyState icon={<Vote className="h-6 w-6" />} title="No polls yet" description="Council decisions put to a vote will appear here." /></div>
      ) : (
        <div className="mt-8 space-y-5">
          {polls.map((p) => (
            <PollCard
              key={p.poll.id}
              item={p}
              onVoted={(updated) => setPolls((prev) => prev.map((x) => (x.poll.id === updated.poll.id ? updated : x)))}
            />
          ))}
        </div>
      )}

      {modalOpen && (
        <CreatePollModal
          onClose={() => setModalOpen(false)}
          onCreated={() => {
            setModalOpen(false);
            push({ kind: "success", title: "Poll published" });
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}

function PollCard({ item, onVoted }: { item: PollItem; onVoted: (item: PollItem) => void }) {
  const { poll, options, totalVoters, myVotes, voters } = item;
  const [selected, setSelected] = useState<number[]>(myVotes);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasVoted = myVotes.length > 0;
  const closed = poll.closesAt ? new Date(poll.closesAt) < new Date() : false;
  const totalVotes = options.reduce((sum, o) => sum + o.voteCount, 0);

  async function submitVote() {
    if (selected.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/polls/${poll.id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionIds: selected }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        return;
      }
      onVoted({
        ...item,
        myVotes: selected,
        totalVoters: totalVoters + 1,
        options: options.map((o) => (selected.includes(o.id) ? { ...o, voteCount: o.voteCount + 1 } : o)),
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="p-4.5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold text-[var(--text)]">{poll.question}</p>
          {poll.description && <p className="mt-1 text-sm text-muted">{poll.description}</p>}
        </div>
        <div className="flex flex-wrap gap-1.5 shrink-0 self-start sm:self-auto">
          {poll.anonymous && <Badge tone="neutral">Anonymous</Badge>}
          {closed && <Badge tone="danger">Closed</Badge>}
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {options.map((o) => {
          const pct = totalVotes ? Math.round((o.voteCount / totalVotes) * 100) : 0;
          const isSelected = selected.includes(o.id);
          const optionVoters = voters.filter((v) => v.optionId === o.id);
          return (
            <div key={o.id}>
              <button
                disabled={hasVoted || closed}
                onClick={() => {
                  if (poll.type === "multiple") {
                    setSelected((prev) => (prev.includes(o.id) ? prev.filter((id) => id !== o.id) : [...prev, o.id]));
                  } else {
                    setSelected([o.id]);
                  }
                }}
                className={cn(
                  "relative flex w-full items-center justify-between overflow-hidden rounded-lg border px-3.5 py-2.5 text-left text-sm transition-colors",
                  isSelected ? "border-brand-500" : "border-[var(--border)]",
                  (hasVoted || closed) ? "cursor-default" : "hover:border-brand-300",
                )}
              >
                {(hasVoted || closed) && (
                  <div className="absolute inset-y-0 left-0 bg-brand-50 dark:bg-brand-900/20" style={{ width: `${pct}%` }} />
                )}
                <span className="relative z-10 font-medium text-[var(--text)]">{o.label}</span>
                {(hasVoted || closed) && <span className="relative z-10 text-xs font-semibold text-muted">{pct}% · {o.voteCount}</span>}
              </button>
              {!poll.anonymous && (hasVoted || closed) && optionVoters.length > 0 && (
                <p className="mt-1 pl-1 text-[11px] text-muted">{optionVoters.map((v) => v.name).join(", ")}</p>
              )}
            </div>
          );
        })}
      </div>

      {error && <p className="mt-2 text-xs font-medium text-rose-600">{error}</p>}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
        <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> {totalVoters} voted{poll.closesAt ? ` · closes ${formatDate(poll.closesAt)}` : ""}</span>
        {!hasVoted && !closed && (
          <Button size="sm" onClick={submitVote} disabled={loading || selected.length === 0}>
            {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Submit vote
          </Button>
        )}
      </div>
    </Card>
  );
}

function CreatePollModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [question, setQuestion] = useState("");
  const [type, setType] = useState<"single" | "multiple" | "yes_no">("single");
  const [options, setOptions] = useState(["", ""]);
  const [anonymous, setAnonymous] = useState(false);
  const [closesAt, setClosesAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/polls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          type,
          anonymous,
          closesAt: closesAt || null,
          options: type === "yes_no" ? undefined : options.filter(Boolean),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        return;
      }
      onCreated();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--text)]">Create poll</h2>
          <button onClick={onClose} className="focus-ring rounded-lg p-1 text-muted hover:bg-[var(--surface-muted)]"><X className="h-4 w-4" /></button>
        </div>
        <form onSubmit={submit} className="mt-5 space-y-4">
          <div>
            <label className="text-xs font-medium text-muted">Question</label>
            <input required value={question} onChange={(e) => setQuestion(e.target.value)} className="focus-ring mt-1.5 h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted">Poll type</label>
            <select value={type} onChange={(e) => setType(e.target.value as typeof type)} className="focus-ring mt-1.5 h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2 text-sm">
              <option value="single">Single choice</option>
              <option value="multiple">Multiple choice</option>
              <option value="yes_no">Yes / No</option>
            </select>
          </div>
          {type !== "yes_no" && (
            <div>
              <label className="text-xs font-medium text-muted">Options</label>
              <div className="mt-1.5 space-y-2">
                {options.map((o, i) => (
                  <input
                    key={i}
                    value={o}
                    onChange={(e) => setOptions((prev) => prev.map((x, idx) => (idx === i ? e.target.value : x)))}
                    placeholder={`Option ${i + 1}`}
                    className="focus-ring h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
                  />
                ))}
                <button type="button" onClick={() => setOptions((prev) => [...prev, ""])} className="text-xs font-medium text-brand-600 hover:underline">+ Add option</button>
              </div>
            </div>
          )}
          <div className="flex items-center gap-2">
            <input id="anon" type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} />
            <label htmlFor="anon" className="text-sm text-[var(--text)]">Anonymous voting</label>
          </div>
          <div>
            <label className="text-xs font-medium text-muted">Closes at (optional)</label>
            <input type="datetime-local" value={closesAt} onChange={(e) => setClosesAt(e.target.value)} className="focus-ring mt-1.5 h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-sm" />
          </div>
          {error && <p className="text-xs font-medium text-rose-600">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>{loading && <Loader2 className="h-4 w-4 animate-spin" />} Publish poll</Button>
        </form>
      </Card>
    </div>
  );
}
