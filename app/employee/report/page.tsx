"use client";
import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle, Loader2, ArrowLeft, ChevronDown } from "lucide-react";
import Link from "next/link";

interface Asset { id: number; name: string; type: string; brand: string; }

const CONDITIONS = [
  { v: "damaged",   label: "🔨 Damaged",   desc: "Physical damage",         c: "#f87171" },
  { v: "in_repair", label: "🔧 In Repair",  desc: "Currently being repaired", c: "#fbbf24" },
  { v: "lost",      label: "🔍 Lost",       desc: "Cannot be located",        c: "#f87171" },
  { v: "other",     label: "💬 Other Issue", desc: "Something else",           c: "#9ca3af" },
];

export default function ReportPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [form, setForm] = useState({ assetId: "", condition: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successAsset, setSuccessAsset] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/assets").then(r => r.json()).then(d => setAssets(d.assets || []));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setError("");
    if (!form.assetId || !form.condition) { setError("Please select both an asset and a condition."); return; }
    setLoading(true);
    try {
      const r = await fetch("/api/reports", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ assetId: parseInt(form.assetId), condition: form.condition, description: form.description }) });
      const d = await r.json();
      if (!r.ok) { setError(d.error); return; }
      const asset = assets.find(a => a.id === parseInt(form.assetId));
      setSuccessAsset(asset?.name || "Asset");
      setSuccess(true); setForm({ assetId: "", condition: "", description: "" });
    } catch { setError("Network error. Please try again."); } finally { setLoading(false); }
  }

  return (
    <div className="page" style={{ maxWidth: 640 }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <Link href="/employee" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text3)", textDecoration: "none", marginBottom: 14, fontWeight: 600 }}>
          <ArrowLeft size={14} /> Back to My Assets
        </Link>
        <div className="row">
          <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(248,113,113,.1)", border: "1px solid rgba(248,113,113,.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <AlertCircle size={18} style={{ color: "#f87171" }} />
          </div>
          <div><h1 className="ph-title">Report an Issue</h1><p className="ph-sub">Submit a condition report for your assigned asset</p></div>
        </div>
      </div>

      {success && (
        <div style={{ marginBottom: "1.5rem", padding: "1rem 1.25rem", borderRadius: 12, background: "rgba(34,197,94,.08)", border: "1px solid rgba(34,197,94,.25)", display: "flex", alignItems: "center", gap: 12 }}>
          <CheckCircle size={20} style={{ color: "var(--accent)", flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div className="txt" style={{ fontSize: 14 }}>Report submitted for "{successAsset}"</div>
            <div className="txt3" style={{ fontSize: 12, marginTop: 2 }}>The admin team has been notified and will review it shortly.</div>
          </div>
          <button onClick={() => setSuccess(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "var(--accent)", fontWeight: 700 }}>+ New</button>
        </div>
      )}

      <div className="card">
        <div className="card-bd">
          {error && <div className="alert alert-e" style={{ marginBottom: "1rem" }}>{error}</div>}

          {assets.length === 0 ? (
            <div className="empty">
              <div className="empty-ico"><Package size={22} style={{ color: "var(--text3)" }} /></div>
              <p className="txt2" style={{ fontWeight: 600 }}>No assets to report</p>
              <p className="txt3" style={{ fontSize: 12 }}>You need an assigned asset to submit a report.</p>
              <Link href="/employee" className="btn btn-g btn-sm"><ArrowLeft size={13} /> Back to My Assets</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {/* Asset select */}
              <div className="field">
                <label className="lbl">Select Your Asset *</label>
                <div style={{ position: "relative" }}>
                  <select className="inp" required style={{ paddingRight: 30 }} value={form.assetId} onChange={e => setForm({ ...form, assetId: e.target.value })}>
                    <option value="">Choose an asset…</option>
                    {assets.map(a => <option key={a.id} value={a.id}>{a.name}{a.brand ? ` (${a.brand})` : ""} — {a.type}</option>)}
                  </select>
                  <ChevronDown size={13} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text3)", pointerEvents: "none" }} />
                </div>
              </div>

              {/* Condition */}
              <div className="field">
                <label className="lbl">Issue Type *</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {CONDITIONS.map(c => (
                    <button key={c.v} type="button" onClick={() => setForm({ ...form, condition: c.v })}
                      style={{ padding: "12px 14px", borderRadius: 10, textAlign: "left", cursor: "pointer", border: `1px solid ${form.condition === c.v ? c.c + "55" : "var(--bd)"}`, background: form.condition === c.v ? c.c + "10" : "var(--bg)", transition: "all .15s" }}>
                      <div style={{ fontSize: 13.5, fontWeight: 800, color: form.condition === c.v ? c.c : "var(--text2)", marginBottom: 3 }}>{c.label}</div>
                      <div style={{ fontSize: 11.5, color: "var(--text3)" }}>{c.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="field">
                <label className="lbl">Description <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0, color: "var(--text3)", fontSize: 11 }}>(recommended)</span></label>
                <textarea className="inp" rows={4} placeholder="Describe the issue: what happened, when, any visible damage, how it affects work…" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>

              <button type="submit" className="btn btn-p btn-lg" disabled={loading || !form.assetId || !form.condition} style={{ width: "100%" }}>
                {loading ? <><Loader2 size={16} className="spin" /> Submitting…</> : "Submit Report"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function Package({ size, style }: { size: number; style?: React.CSSProperties }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={style}><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>;
}
