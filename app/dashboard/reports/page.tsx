"use client";
import { useEffect, useState, useCallback } from "react";
import { FileText, ClipboardList, AlertTriangle, Wrench, Search, Loader2, Trash2, ChevronDown, RefreshCw, CheckCircle, Clock } from "lucide-react";

interface Report { id: number; asset_name: string; asset_type: string; reporter_username: string; reporter_name: string; condition: string; description: string; status: string; created_at: string; }
interface Stats { total: number; damaged: number; in_repair: number; lost: number; other: number; open_count: number; pending: number; resolved: number; }

const CB: Record<string, string> = { damaged: "br", in_repair: "by", lost: "br", other: "bgr" };
const SB: Record<string, string> = { open: "by", pending: "bb", resolved: "bg" };
const fmt = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, damaged: 0, in_repair: 0, lost: 0, other: 0, open_count: 0, pending: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const r = await fetch("/api/reports"); const d = await r.json();
    setReports(d.reports || []); setStats(d.stats || {}); setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function updateStatus(id: number, status: string) {
    setUpdating(id);
    await fetch("/api/reports", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    setUpdating(null); load();
  }

  async function deleteReport(id: number, asset: string) {
    if (!confirm(`Delete report for "${asset}"? This cannot be undone.`)) return;
    setDeleting(id);
    await fetch("/api/reports", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setDeleting(null); load();
  }

  const filtered = reports.filter(r => {
    const q = search.toLowerCase();
    const matchQ = r.asset_name.toLowerCase().includes(q) || r.reporter_name.toLowerCase().includes(q) || r.condition.includes(q);
    const matchF = filter === "all" || r.condition === filter || r.status === filter;
    return matchQ && matchF;
  });

  const statCards = [
    { l: "Total Reports", v: stats.total, icon: ClipboardList, c: "#22c55e", bg: "rgba(34,197,94,.09)" },
    { l: "Damaged", v: stats.damaged, icon: AlertTriangle, c: "#f87171", bg: "rgba(248,113,113,.09)" },
    { l: "In Repair", v: stats.in_repair, icon: Wrench, c: "#fbbf24", bg: "rgba(251,191,36,.09)" },
    { l: "Lost", v: stats.lost, icon: Search, c: "#f87171", bg: "rgba(248,113,113,.07)" },
    { l: "Open", v: stats.open_count, icon: Clock, c: "#fbbf24", bg: "rgba(251,191,36,.07)" },
    { l: "Resolved", v: stats.resolved, icon: CheckCircle, c: "#22c55e", bg: "rgba(34,197,94,.07)" },
  ];

  return (
    <div className="page">
      <div className="ph">
        <div className="row">
          <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(251,191,36,.1)", border: "1px solid rgba(251,191,36,.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <FileText size={18} style={{ color: "#fbbf24" }} />
          </div>
          <div><h1 className="ph-title">Condition Reports</h1><p className="ph-sub">{stats.total} total · {stats.open_count} open · {stats.resolved} resolved</p></div>
        </div>
        <button onClick={load} className="btn btn-g btn-sm"><RefreshCw size={13} /></button>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: ".875rem", marginBottom: "1.5rem" }}>
        {statCards.map(({ l, v, icon: Ic, c, bg }) => (
          <div key={l} className="stat" style={{ padding: "1rem", gap: ".625rem" }}>
            <div className="row" style={{ justifyContent: "space-between" }}>
              <div className="stat-ico" style={{ background: bg, width: 36, height: 36 }}><Ic size={16} style={{ color: c }} /></div>
              <span style={{ fontSize: "1.75rem", fontWeight: 900, color: "var(--text)" }}>{v}</span>
            </div>
            <div className="stat-lbl">{l}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="row" style={{ flexWrap: "wrap", gap: 6, marginBottom: ".875rem" }}>
        {[
          { v: "all", l: "All" }, { v: "open", l: "Open" }, { v: "pending", l: "Pending" },
          { v: "damaged", l: "Damaged" }, { v: "in_repair", l: "In Repair" },
          { v: "lost", l: "Lost" }, { v: "resolved", l: "Resolved" },
        ].map(f => (
          <button key={f.v} onClick={() => setFilter(f.v)} className={`chip ${filter === f.v ? "on" : ""}`}>{f.l}</button>
        ))}
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: "1rem", maxWidth: 360 }}>
        <Search size={14} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "var(--text3)" }} />
        <input className="inp" style={{ paddingLeft: 34 }} placeholder="Search asset name, reporter…" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Table */}
      <div className="card">
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr><th>#</th><th>Asset</th><th>Condition</th><th>Reported By</th><th>Description</th><th>Status</th><th>Date</th><th>Update</th><th></th></tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9} style={{ textAlign: "center", padding: "3rem" }}><Loader2 size={20} className="spin" style={{ color: "var(--accent)", margin: "0 auto" }} /></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={9}>
                  <div className="empty">
                    <div className="empty-ico"><ClipboardList size={22} style={{ color: "var(--text3)" }} /></div>
                    <p className="txt2" style={{ fontWeight: 600 }}>No reports found</p>
                    <p className="txt3" style={{ fontSize: 12 }}>Employees submit reports from their dashboard</p>
                  </div>
                </td></tr>
              ) : filtered.map(r => (
                <tr key={r.id}>
                  <td className="mono txt3" style={{ fontSize: 11 }}>#{r.id}</td>
                  <td><div className="txt">{r.asset_name}</div><div className="txt3" style={{ fontSize: 11 }}>{r.asset_type}</div></td>
                  <td><span className={`badge ${CB[r.condition] || "bgr"}`}>{r.condition.replace("_", " ")}</span></td>
                  <td><div className="txt2" style={{ fontSize: 13 }}>{r.reporter_name}</div><div className="txt3" style={{ fontSize: 11 }}>@{r.reporter_username}</div></td>
                  <td style={{ maxWidth: 200 }}><p className="txt3" style={{ fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 200 }}>{r.description || "—"}</p></td>
                  <td><span className={`badge ${SB[r.status] || "bgr"}`}>{r.status}</span></td>
                  <td className="txt3" style={{ fontSize: 12 }}>{fmt(r.created_at)}</td>
                  <td>
                    <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                      <select value={r.status} onChange={e => updateStatus(r.id, e.target.value)} disabled={updating === r.id}
                        style={{ appearance: "none", padding: "4px 24px 4px 9px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "1px solid var(--bd)", background: "var(--bg)", color: "var(--text2)", fontFamily: "inherit" }}>
                        <option value="open">Open</option>
                        <option value="pending">Pending</option>
                        <option value="resolved">Resolved</option>
                      </select>
                      {updating === r.id
                        ? <Loader2 size={11} className="spin" style={{ position: "absolute", right: 6, pointerEvents: "none", color: "var(--accent)" }} />
                        : <ChevronDown size={11} style={{ position: "absolute", right: 6, pointerEvents: "none", color: "var(--text3)" }} />}
                    </div>
                  </td>
                  <td>
                    <button onClick={() => deleteReport(r.id, r.asset_name)} className="btn btn-r btn-ico btn-sm" disabled={deleting === r.id} title="Delete report">
                      {deleting === r.id ? <Loader2 size={12} className="spin" /> : <Trash2 size={13} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
