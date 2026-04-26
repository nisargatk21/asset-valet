"use client";
import { useEffect, useState, useCallback } from "react";
import { Users, Plus, X, Loader2, Trash2, Package, Mail, Building2, Calendar, RefreshCw } from "lucide-react";

interface Emp { id: number; username: string; full_name: string; email: string; department: string; created_at: string; asset_count: number; }
const DEPTS = ["Engineering","Design","Marketing","Sales","HR","Finance","IT","Operations","Legal","Other"];

function Av({ name }: { name: string }) {
  const ini = name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2);
  const COLORS = ["#22c55e","#60a5fa","#a78bfa","#f59e0b","#f87171","#34d399","#fb7185"];
  const c = COLORS[name.charCodeAt(0) % COLORS.length];
  return <div style={{ width: 42, height: 42, borderRadius: 12, background: `${c}18`, border: `1px solid ${c}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: c, flexShrink: 0 }}>{ini}</div>;
}

export default function EmployeesPage() {
  const [emps, setEmps] = useState<Emp[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ username: "", fullName: "", email: "", password: "", department: "" });

  const load = useCallback(async () => {
    setLoading(true);
    const r = await fetch("/api/employees"); const d = await r.json();
    setEmps(d.employees || []); setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault(); setError(""); setSaving(true);
    const r = await fetch("/api/employees", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const d = await r.json();
    if (!r.ok) { setError(d.error); setSaving(false); return; }
    setSaving(false); setShowAdd(false); setForm({ username: "", fullName: "", email: "", password: "", department: "" }); load();
  }

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Remove ${name}? Their asset assignments will be returned.`)) return;
    setDeleting(id);
    await fetch("/api/employees", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setDeleting(null); load();
  }

  const filtered = emps.filter(e => {
    const q = search.toLowerCase();
    return e.full_name.toLowerCase().includes(q) || e.username.toLowerCase().includes(q) || (e.email || "").toLowerCase().includes(q) || (e.department || "").toLowerCase().includes(q);
  });

  return (
    <div className="page">
      <div className="ph">
        <div className="row">
          <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(96,165,250,.1)", border: "1px solid rgba(96,165,250,.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Users size={18} style={{ color: "#60a5fa" }} />
          </div>
          <div><h1 className="ph-title">Employees</h1><p className="ph-sub">{emps.length} registered employees</p></div>
        </div>
        <div className="row">
          <button onClick={load} className="btn btn-g btn-sm"><RefreshCw size={13} /></button>
          <button onClick={() => setShowAdd(true)} className="btn btn-p"><Plus size={14} /> Add Employee</button>
        </div>
      </div>

      <div style={{ position: "relative", marginBottom: "1.25rem", maxWidth: 340 }}>
        <Users size={13} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "var(--text3)" }} />
        <input className="inp" style={{ paddingLeft: 32 }} placeholder="Search employees…" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}><Loader2 size={24} className="spin" style={{ color: "var(--accent)" }} /></div>
      ) : filtered.length === 0 ? (
        <div className="card"><div className="empty">
          <div className="empty-ico"><Users size={22} style={{ color: "var(--text3)" }} /></div>
          <p className="txt2" style={{ fontWeight: 600 }}>No employees found</p>
          <button onClick={() => setShowAdd(true)} className="btn btn-p btn-sm"><Plus size={13} /> Add Employee</button>
        </div></div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: "1rem" }}>
          {filtered.map(emp => (
            <div key={emp.id} className="card" style={{ padding: "1.125rem" }}>
              <div className="row" style={{ alignItems: "flex-start" }}>
                <Av name={emp.full_name} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="txt" style={{ fontSize: 14 }}>{emp.full_name}</div>
                  <div className="txt3" style={{ fontSize: 12 }}>@{emp.username}</div>
                </div>
                <button onClick={() => handleDelete(emp.id, emp.full_name)} className="btn btn-r btn-ico btn-sm" disabled={deleting === emp.id} title="Remove employee">
                  {deleting === emp.id ? <Loader2 size={12} className="spin" /> : <Trash2 size={13} />}
                </button>
              </div>

              <div style={{ marginTop: ".875rem", display: "flex", flexDirection: "column", gap: 5 }}>
                <div className="row txt3" style={{ gap: 7, fontSize: 12 }}><Mail size={12} />{emp.email}</div>
                {emp.department && <div className="row txt3" style={{ gap: 7, fontSize: 12 }}><Building2 size={12} />{emp.department}</div>}
                <div className="row txt3" style={{ gap: 7, fontSize: 12 }}>
                  <Calendar size={12} />Joined {new Date(emp.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                </div>
              </div>

              <div style={{ marginTop: ".875rem", paddingTop: ".875rem", borderTop: "1px solid var(--bd)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div className="row txt3" style={{ fontSize: 12, gap: 6 }}>
                  <Package size={12} />
                  <span><strong style={{ color: "var(--accent)", fontWeight: 800 }}>{emp.asset_count}</strong> asset{emp.asset_count !== 1 ? "s" : ""}</span>
                </div>
                <span className="badge bg" style={{ fontSize: 11 }}>Active</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAdd && (
        <div className="overlay" onClick={e => e.target === e.currentTarget && setShowAdd(false)}>
          <div className="modal">
            <div className="modal-hd">
              <div><div style={{ fontWeight: 800, fontSize: 15, color: "var(--text)" }}>Add Employee</div><div style={{ fontSize: 12, color: "var(--text3)", marginTop: 2 }}>Create a new employee account</div></div>
              <button onClick={() => setShowAdd(false)} className="btn btn-g btn-ico btn-sm"><X size={15} /></button>
            </div>
            <form onSubmit={handleAdd}>
              <div className="modal-bd">
                {error && <div className="alert alert-e">{error}</div>}
                <div className="field"><label className="lbl">Full Name *</label><input className="inp" required placeholder="Sara Khan" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} /></div>
                <div className="grid2">
                  <div className="field"><label className="lbl">Username *</label><input className="inp" required placeholder="sara.khan" value={form.username} onChange={e => setForm({ ...form, username: e.target.value.toLowerCase() })} /></div>
                  <div className="field"><label className="lbl">Department</label>
                    <div style={{ position: "relative" }}>
                      <select className="inp" style={{ paddingRight: 28 }} value={form.department} onChange={e => setForm({ ...form, department: e.target.value })}>
                        <option value="">Select…</option>
                        {DEPTS.map(d => <option key={d}>{d}</option>)}
                      </select>
                      <ChevronDown size={12} style={{ position: "absolute", right: 9, top: "50%", transform: "translateY(-50%)", color: "var(--text3)", pointerEvents: "none" }} />
                    </div>
                  </div>
                </div>
                <div className="field"><label className="lbl">Email *</label><input className="inp" type="email" required placeholder="sara@company.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
                <div className="field"><label className="lbl">Password *</label><input className="inp" type="password" required placeholder="Min. 6 characters" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /></div>
              </div>
              <div className="modal-ft">
                <button type="button" onClick={() => setShowAdd(false)} className="btn btn-g">Cancel</button>
                <button type="submit" className="btn btn-p" disabled={saving}>{saving ? <><Loader2 size={13} className="spin" /> Adding…</> : "Add Employee"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function ChevronDown({ size, style }: { size: number; style?: React.CSSProperties }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={style}><path d="m6 9 6 6 6-6" /></svg>;
}
