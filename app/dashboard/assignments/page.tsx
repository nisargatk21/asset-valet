"use client";
import { useEffect, useState, useCallback } from "react";
import { GitBranch, Plus, X, Loader2, RotateCcw, ChevronDown, RefreshCw } from "lucide-react";

interface Asgn { id: number; asset_id: number; asset_name: string; asset_type: string; serial_number: string; username: string; full_name: string; assigned_at: string; returned_at: string | null; by_username: string; notes: string; }
interface Asset { id: number; name: string; type: string; status: string; }
interface Emp { id: number; username: string; full_name: string; }

const fmt = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export default function AssignmentsPage() {
  const [all, setAll] = useState<Asgn[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [emps, setEmps] = useState<Emp[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [tab, setTab] = useState<"active" | "history">("active");
  const [saving, setSaving] = useState(false);
  const [returning, setReturning] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ assetId: "", userId: "", notes: "" });

  const load = useCallback(async () => {
    setLoading(true);
    const [a, as, em] = await Promise.all([
      fetch("/api/assignments").then(r => r.json()),
      fetch("/api/assets").then(r => r.json()),
      fetch("/api/employees").then(r => r.json()),
    ]);
    setAll(a.assignments || []);
    setAssets((as.assets || []).filter((x: Asset) => x.status === "available"));
    setEmps(em.employees || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleAssign(e: React.FormEvent) {
    e.preventDefault(); setError(""); setSaving(true);
    const r = await fetch("/api/assignments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ assetId: parseInt(form.assetId), userId: parseInt(form.userId), notes: form.notes }) });
    const d = await r.json();
    if (!r.ok) { setError(d.error); setSaving(false); return; }
    setSaving(false); setShowAdd(false); setForm({ assetId: "", userId: "", notes: "" }); load();
  }

  async function handleReturn(assetId: number) {
    if (!confirm("Return this asset? Status will become available.")) return;
    setReturning(assetId);
    await fetch("/api/assignments", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ assetId }) });
    setReturning(null); load();
  }

  const active = all.filter(a => !a.returned_at);
  const history = all.filter(a => a.returned_at);
  const shown = tab === "active" ? active : history;

  return (
    <div className="page">
      <div className="ph">
        <div className="row">
          <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(167,139,250,.1)", border: "1px solid rgba(167,139,250,.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <GitBranch size={18} style={{ color: "#a78bfa" }} />
          </div>
          <div><h1 className="ph-title">Assignments</h1><p className="ph-sub">{active.length} active · {history.length} returned</p></div>
        </div>
        <div className="row">
          <button onClick={load} className="btn btn-g btn-sm"><RefreshCw size={13} /></button>
          <button onClick={() => setShowAdd(true)} className="btn btn-p"><Plus size={14} /> Assign Asset</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 2, marginBottom: "1.25rem", background: "var(--surf)", border: "1px solid var(--bd)", borderRadius: 10, padding: 4, width: "fit-content" }}>
        {(["active", "history"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding: "7px 20px", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", border: "none", transition: "all .15s", background: tab === t ? "var(--surf2)" : "transparent", color: tab === t ? "var(--text)" : "var(--text3)" }}>
            {t === "active" ? "Active" : "History"} <span style={{ fontSize: 11, opacity: .7 }}>({t === "active" ? active.length : history.length})</span>
          </button>
        ))}
      </div>

      <div className="card">
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr><th>Asset</th><th>Type</th><th>Employee</th><th>Assigned On</th>{tab === "history" && <th>Returned</th>}<th>Notes</th>{tab === "active" && <th></th>}</tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ textAlign: "center", padding: "3rem" }}><Loader2 size={20} className="spin" style={{ color: "var(--accent)", margin: "0 auto" }} /></td></tr>
              ) : shown.length === 0 ? (
                <tr><td colSpan={7}>
                  <div className="empty"><GitBranch size={24} style={{ color: "var(--text3)" }} /><p className="txt2" style={{ fontWeight: 600 }}>No {tab} assignments</p>
                    {tab === "active" && <button onClick={() => setShowAdd(true)} className="btn btn-p btn-sm"><Plus size={13} /> Assign Asset</button>}
                  </div>
                </td></tr>
              ) : shown.map(a => (
                <tr key={a.id}>
                  <td><div className="txt">{a.asset_name}</div>{a.serial_number && <div className="mono txt3" style={{ fontSize: 11 }}>{a.serial_number}</div>}</td>
                  <td className="txt2">{a.asset_type}</td>
                  <td><div className="txt" style={{ fontSize: 13 }}>{a.full_name}</div><div className="txt3" style={{ fontSize: 11 }}>@{a.username}</div></td>
                  <td className="txt3" style={{ fontSize: 12 }}>{fmt(a.assigned_at)}</td>
                  {tab === "history" && <td className="txt3" style={{ fontSize: 12 }}>{a.returned_at ? fmt(a.returned_at) : "—"}</td>}
                  <td className="txt3" style={{ fontSize: 12, maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.notes || "—"}</td>
                  {tab === "active" && (
                    <td>
                      <button onClick={() => handleReturn(a.asset_id)} disabled={returning === a.asset_id} className="btn btn-y btn-sm">
                        {returning === a.asset_id ? <Loader2 size={12} className="spin" /> : <RotateCcw size={12} />} Return
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAdd && (
        <div className="overlay" onClick={e => e.target === e.currentTarget && setShowAdd(false)}>
          <div className="modal">
            <div className="modal-hd">
              <div><div style={{ fontWeight: 800, fontSize: 15, color: "var(--text)" }}>Assign Asset</div><div style={{ fontSize: 12, color: "var(--text3)", marginTop: 2 }}>{assets.length} available assets</div></div>
              <button onClick={() => setShowAdd(false)} className="btn btn-g btn-ico btn-sm"><X size={15} /></button>
            </div>
            <form onSubmit={handleAssign}>
              <div className="modal-bd">
                {error && <div className="alert alert-e">{error}</div>}
                {assets.length === 0 && <div className="alert" style={{ background: "rgba(251,191,36,.08)", borderColor: "rgba(251,191,36,.25)", color: "var(--yellow2)" }}>⚠ No available assets. Return assigned assets first.</div>}
                <div className="field">
                  <label className="lbl">Asset *</label>
                  <div style={{ position: "relative" }}>
                    <select className="inp" required style={{ paddingRight: 28 }} value={form.assetId} onChange={e => setForm({ ...form, assetId: e.target.value })}>
                      <option value="">Select available asset…</option>
                      {assets.map(a => <option key={a.id} value={a.id}>{a.name} ({a.type})</option>)}
                    </select>
                    <ChevronDown size={13} style={{ position: "absolute", right: 9, top: "50%", transform: "translateY(-50%)", color: "var(--text3)", pointerEvents: "none" }} />
                  </div>
                </div>
                <div className="field">
                  <label className="lbl">Employee *</label>
                  <div style={{ position: "relative" }}>
                    <select className="inp" required style={{ paddingRight: 28 }} value={form.userId} onChange={e => setForm({ ...form, userId: e.target.value })}>
                      <option value="">Select employee…</option>
                      {emps.map(e => <option key={e.id} value={e.id}>{e.full_name} (@{e.username})</option>)}
                    </select>
                    <ChevronDown size={13} style={{ position: "absolute", right: 9, top: "50%", transform: "translateY(-50%)", color: "var(--text3)", pointerEvents: "none" }} />
                  </div>
                </div>
                <div className="field">
                  <label className="lbl">Notes</label>
                  <textarea className="inp" rows={2} placeholder="Optional assignment notes…" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
                </div>
              </div>
              <div className="modal-ft">
                <button type="button" onClick={() => setShowAdd(false)} className="btn btn-g">Cancel</button>
                <button type="submit" className="btn btn-p" disabled={saving || assets.length === 0}>
                  {saving ? <><Loader2 size={13} className="spin" /> Assigning…</> : "Assign Asset"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
