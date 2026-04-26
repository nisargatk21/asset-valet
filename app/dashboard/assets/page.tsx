"use client";
import { useEffect, useState, useCallback } from "react";
import { Package, Plus, Search, Trash2, X, Loader2, ChevronDown, RefreshCw } from "lucide-react";

interface Asset { id: number; name: string; type: string; brand: string; model: string; serial_number: string; status: string; assigned_to_username: string; assigned_to_name: string; purchase_date: string; purchase_price: number; location: string; notes: string; }
const TYPES = ["Laptop","Desktop","Monitor","Keyboard","Mouse","Headphones","Mobile Phone","Tablet","Webcam","Printer","Docking Station","Speaker","Camera","Projector","Server","Networking","Other"];
const SB: Record<string, string> = { available: "bg", assigned: "bb", damaged: "br", in_repair: "by", lost: "br", retired: "bgr" };
const FILTERS = ["all","available","assigned","damaged","in_repair","lost","retired"];

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", type: "", brand: "", model: "", serialNumber: "", purchaseDate: "", purchasePrice: "", location: "", notes: "" });

  const load = useCallback(async () => {
    setLoading(true);
    const r = await fetch("/api/assets"); const d = await r.json();
    setAssets(d.assets || []); setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault(); setError(""); setSaving(true);
    const r = await fetch("/api/assets", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, purchasePrice: form.purchasePrice ? parseFloat(form.purchasePrice) : null }) });
    const d = await r.json();
    if (!r.ok) { setError(d.error); setSaving(false); return; }
    setSaving(false); setShowAdd(false); setForm({ name: "", type: "", brand: "", model: "", serialNumber: "", purchaseDate: "", purchasePrice: "", location: "", notes: "" }); load();
  }

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    await fetch("/api/assets", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setDeleting(null); load();
  }

  const counts = assets.reduce((a, x) => { a[x.status] = (a[x.status] || 0) + 1; return a; }, {} as Record<string, number>);
  const filtered = assets.filter(a => {
    const q = search.toLowerCase();
    return (filter === "all" || a.status === filter) &&
      (a.name.toLowerCase().includes(q) || a.type.toLowerCase().includes(q) || (a.serial_number || "").toLowerCase().includes(q) || (a.brand || "").toLowerCase().includes(q));
  });

  return (
    <div className="page">
      {/* Header */}
      <div className="ph">
        <div>
          <div className="row">
            <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(34,197,94,.1)", border: "1px solid rgba(34,197,94,.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Package size={18} style={{ color: "var(--accent)" }} />
            </div>
            <div>
              <h1 className="ph-title">Assets</h1>
              <p className="ph-sub">{assets.length} total · {counts.available || 0} available · {counts.assigned || 0} assigned</p>
            </div>
          </div>
        </div>
        <div className="row">
          <button onClick={load} className="btn btn-g btn-sm"><RefreshCw size={13} /></button>
          <button onClick={() => setShowAdd(true)} className="btn btn-p"><Plus size={14} /> Add Asset</button>
        </div>
      </div>

      {/* Filter chips */}
      <div className="row" style={{ flexWrap: "wrap", gap: 6, marginBottom: "1rem" }}>
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`chip ${filter === f ? "on" : ""}`}>
            {f === "all" ? "All" : f.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase())}
            <span style={{ opacity: .65 }}>({f === "all" ? assets.length : counts[f] || 0})</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: "1rem", maxWidth: 360 }}>
        <Search size={14} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "var(--text3)" }} />
        <input className="inp" style={{ paddingLeft: 34 }} placeholder="Search name, type, brand, serial…" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Table */}
      <div className="card">
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr><th>#</th><th>Asset Name</th><th>Type</th><th>Brand / Model</th><th>Serial No.</th><th>Status</th><th>Assigned To</th><th>Price</th><th>Location</th><th></th></tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={10} style={{ textAlign: "center", padding: "3rem" }}><Loader2 size={20} className="spin" style={{ color: "var(--accent)", margin: "0 auto" }} /></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={10}>
                  <div className="empty">
                    <div className="empty-ico"><Package size={22} style={{ color: "var(--text3)" }} /></div>
                    <p className="txt2" style={{ fontWeight: 600 }}>No assets found</p>
                    <p className="txt3" style={{ fontSize: 12 }}>Try adjusting filters or add a new asset</p>
                    <button onClick={() => setShowAdd(true)} className="btn btn-p btn-sm"><Plus size={13} /> Add Asset</button>
                  </div>
                </td></tr>
              ) : filtered.map((a, i) => (
                <tr key={a.id}>
                  <td className="txt3 mono" style={{ fontSize: 11 }}>{i + 1}</td>
                  <td>
                    <div className="txt">{a.name}</div>
                    {a.notes && <div style={{ fontSize: 11, color: "var(--text3)", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.notes}</div>}
                  </td>
                  <td className="txt2">{a.type}</td>
                  <td>
                    {a.brand && <div style={{ fontSize: 13, color: "var(--text2)" }}>{a.brand}</div>}
                    {a.model && <div style={{ fontSize: 11, color: "var(--text3)" }}>{a.model}</div>}
                    {!a.brand && !a.model && <span className="txt3">—</span>}
                  </td>
                  <td><span className="mono txt3">{a.serial_number || "—"}</span></td>
                  <td><span className={`badge ${SB[a.status] || "bgr"}`}>{a.status.replace("_", " ")}</span></td>
                  <td>
                    {a.assigned_to_name ? (
                      <div><div style={{ fontSize: 13, color: "var(--text2)" }}>{a.assigned_to_name}</div><div style={{ fontSize: 11, color: "var(--text3)" }}>@{a.assigned_to_username}</div></div>
                    ) : <span className="txt3">—</span>}
                  </td>
                  <td className="txt3 mono" style={{ fontSize: 12 }}>{a.purchase_price ? `$${Number(a.purchase_price).toLocaleString()}` : "—"}</td>
                  <td className="txt3" style={{ fontSize: 12 }}>{a.location || "—"}</td>
                  <td>
                    <button onClick={() => handleDelete(a.id, a.name)} className="btn btn-r btn-ico btn-sm" disabled={deleting === a.id} title="Delete asset">
                      {deleting === a.id ? <Loader2 size={12} className="spin" /> : <Trash2 size={13} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAdd && (
        <div className="overlay" onClick={e => e.target === e.currentTarget && setShowAdd(false)}>
          <div className="modal" style={{ maxWidth: 560 }}>
            <div className="modal-hd">
              <div><div style={{ fontWeight: 800, fontSize: 15, color: "var(--text)" }}>Add New Asset</div><div style={{ fontSize: 12, color: "var(--text3)", marginTop: 2 }}>Fill in the details below</div></div>
              <button onClick={() => setShowAdd(false)} className="btn btn-g btn-ico btn-sm"><X size={15} /></button>
            </div>
            <form onSubmit={handleAdd}>
              <div className="modal-bd">
                {error && <div className="alert alert-e">{error}</div>}
                <div className="grid2">
                  <div className="field">
                    <label className="lbl">Asset Name *</label>
                    <input className="inp" required placeholder='e.g. MacBook Pro 14"' value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div className="field">
                    <label className="lbl">Type *</label>
                    <div style={{ position: "relative" }}>
                      <select className="inp" required style={{ paddingRight: 30 }} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                        <option value="">Select type…</option>
                        {TYPES.map(t => <option key={t}>{t}</option>)}
                      </select>
                      <ChevronDown size={13} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text3)", pointerEvents: "none" }} />
                    </div>
                  </div>
                </div>
                <div className="grid2">
                  <div className="field">
                    <label className="lbl">Brand</label>
                    <input className="inp" placeholder="e.g. Apple, Dell, Sony" value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} />
                  </div>
                  <div className="field">
                    <label className="lbl">Model</label>
                    <input className="inp" placeholder="e.g. WH-1000XM5" value={form.model} onChange={e => setForm({ ...form, model: e.target.value })} />
                  </div>
                </div>
                <div className="grid2">
                  <div className="field">
                    <label className="lbl">Serial Number</label>
                    <input className="inp mono" placeholder="SN-XXXX-0000" value={form.serialNumber} onChange={e => setForm({ ...form, serialNumber: e.target.value })} />
                  </div>
                  <div className="field">
                    <label className="lbl">Location</label>
                    <input className="inp" placeholder="e.g. Office Floor 2" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
                  </div>
                </div>
                <div className="grid2">
                  <div className="field">
                    <label className="lbl">Purchase Date</label>
                    <input className="inp" type="date" value={form.purchaseDate} onChange={e => setForm({ ...form, purchaseDate: e.target.value })} />
                  </div>
                  <div className="field">
                    <label className="lbl">Purchase Price ($)</label>
                    <input className="inp" type="number" step="0.01" min="0" placeholder="0.00" value={form.purchasePrice} onChange={e => setForm({ ...form, purchasePrice: e.target.value })} />
                  </div>
                </div>
                <div className="field">
                  <label className="lbl">Notes</label>
                  <textarea className="inp" rows={2} placeholder="Any additional details…" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
                </div>
              </div>
              <div className="modal-ft">
                <button type="button" onClick={() => setShowAdd(false)} className="btn btn-g">Cancel</button>
                <button type="submit" className="btn btn-p" disabled={saving}>{saving ? <><Loader2 size={13} className="spin" /> Saving…</> : "Add Asset"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
