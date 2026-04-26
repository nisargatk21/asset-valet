import { getSession } from "@/lib/auth";
import { query } from "@/lib/db";
import { Package, Users, GitBranch, AlertTriangle, TrendingUp, Clock, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const SB: Record<string, string> = { available: "bg", assigned: "bb", damaged: "br", in_repair: "by", lost: "br", retired: "bgr" };
const CB: Record<string, string> = { damaged: "br", in_repair: "by", lost: "br", other: "bgr" };
const RB: Record<string, string> = { open: "by", pending: "bb", resolved: "bg" };
const fmt = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });

async function getStats() {
  try {
    const [a, e, asgn, r, ra, rr] = await Promise.all([
      query(`SELECT COUNT(*)::int t, COUNT(*) FILTER (WHERE status='available')::int av,
        COUNT(*) FILTER (WHERE status='assigned')::int asgnd,
        COUNT(*) FILTER (WHERE status IN ('damaged','in_repair','lost'))::int iss FROM assets`),
      query("SELECT COUNT(*)::int t FROM users WHERE role='employee'"),
      query("SELECT COUNT(*)::int t FROM assignments WHERE returned_at IS NULL"),
      query("SELECT COUNT(*)::int t FROM reports WHERE status='open'"),
      query(`SELECT a.name, a.type, a.status, u.full_name assigned_to
        FROM assets a LEFT JOIN assignments asgn ON a.id=asgn.asset_id AND asgn.returned_at IS NULL
        LEFT JOIN users u ON asgn.user_id=u.id ORDER BY a.created_at DESC LIMIT 7`),
      query(`SELECT r.condition, r.status, r.created_at, a.name asset_name, u.full_name reporter
        FROM reports r JOIN assets a ON r.asset_id=a.id JOIN users u ON r.reported_by=u.id
        ORDER BY r.created_at DESC LIMIT 5`),
    ]);
    return { a: a.rows[0], e: e.rows[0], asgn: asgn.rows[0], r: r.rows[0], ra: ra.rows, rr: rr.rows };
  } catch { return null; }
}

export default async function DashboardPage() {
  const s = await getSession();
  const d = await getStats();
  const hr = new Date().getHours();
  const greet = hr < 12 ? "Good morning" : hr < 17 ? "Good afternoon" : "Good evening";

  const cards = [
    { label: "Total Assets", val: d?.a.t ?? 0, sub: `${d?.a.av ?? 0} available`, icon: Package, c: "#22c55e", bg: "rgba(34,197,94,.09)", href: "/dashboard/assets" },
    { label: "Employees", val: d?.e.t ?? 0, sub: "Active staff", icon: Users, c: "#60a5fa", bg: "rgba(96,165,250,.09)", href: "/dashboard/employees" },
    { label: "Active Assignments", val: d?.asgn.t ?? 0, sub: "Assets checked out", icon: GitBranch, c: "#a78bfa", bg: "rgba(167,139,250,.09)", href: "/dashboard/assignments" },
    { label: "Open Reports", val: d?.r.t ?? 0, sub: "Need attention", icon: AlertTriangle, c: "#fbbf24", bg: "rgba(251,191,36,.09)", href: "/dashboard/reports" },
  ];

  return (
    <div className="page">
      {/* Header */}
      <div style={{ marginBottom: "1.75rem" }}>
        <h1 style={{ fontSize: "1.45rem", fontWeight: 900, color: "var(--text)", letterSpacing: "-.03em", marginBottom: 4 }}>
          {greet}, <span style={{ color: "var(--accent)" }}>{s?.fullName?.split(" ")[0]}</span> 👋
        </h1>
        <p style={{ color: "var(--text3)", fontSize: 13 }}>
          {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Stat cards */}
      <div className="stats-grid">
        {cards.map(({ label, val, sub, icon: Ic, c, bg, href }) => (
          <Link key={label} href={href} style={{ textDecoration: "none" }}>
            <div className="stat">
              <div className="row" style={{ justifyContent: "space-between" }}>
                <div className="stat-ico" style={{ background: bg }}><Ic size={19} style={{ color: c }} /></div>
                <TrendingUp size={13} style={{ color: "var(--text3)" }} />
              </div>
              <div>
                <div className="stat-num">{val}</div>
                <div className="stat-lbl" style={{ marginTop: 3 }}>{label}</div>
                <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 2 }}>{sub}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Asset health bar */}
      {d && (
        <div className="card" style={{ marginBottom: "1.25rem" }}>
          <div className="card-bd" style={{ padding: "1rem 1.25rem" }}>
            <div className="row" style={{ justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--text2)" }}>Asset Health</span>
              <span style={{ fontSize: 12, color: "var(--text3)" }}>{d.a.t} total assets</span>
            </div>
            <div style={{ display: "flex", borderRadius: 5, overflow: "hidden", height: 9, background: "var(--bg)" }}>
              {d.a.t > 0 && <>
                <div style={{ width: `${(d.a.av / d.a.t) * 100}%`, background: "#22c55e" }} title={`Available: ${d.a.av}`} />
                <div style={{ width: `${(d.a.asgnd / d.a.t) * 100}%`, background: "#60a5fa" }} title={`Assigned: ${d.a.asgnd}`} />
                <div style={{ width: `${(d.a.iss / d.a.t) * 100}%`, background: "#f87171" }} title={`Issues: ${d.a.iss}`} />
              </>}
            </div>
            <div className="row" style={{ marginTop: 9, gap: 16 }}>
              {[{ l: "Available", v: d.a.av, c: "#22c55e" }, { l: "Assigned", v: d.a.asgnd, c: "#60a5fa" }, { l: "Issues", v: d.a.iss, c: "#f87171" }].map(x => (
                <div key={x.l} className="row" style={{ gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: x.c }} />
                  <span style={{ fontSize: 12, color: "var(--text3)" }}>{x.l}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text2)" }}>{x.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "1.25rem" }}>
        {/* Recent assets */}
        <div className="card">
          <div className="card-hd">
            <div className="row"><Clock size={15} style={{ color: "var(--accent)" }} /><span className="txt" style={{ fontSize: 14 }}>Recent Assets</span></div>
            <Link href="/dashboard/assets" style={{ fontSize: 12, color: "var(--accent)", textDecoration: "none", fontWeight: 700 }}>View all →</Link>
          </div>
          <div className="tbl-wrap">
            <table className="tbl">
              <thead><tr><th>Asset</th><th>Status</th><th>Assigned To</th></tr></thead>
              <tbody>
                {!d?.ra.length ? (
                  <tr><td colSpan={3}><div className="empty" style={{ padding: "2rem" }}><Package size={22} style={{ color: "var(--text3)" }} /><span style={{ color: "var(--text3)" }}>No assets yet</span></div></td></tr>
                ) : d.ra.map((a: { name: string; type: string; status: string; assigned_to: string }, i: number) => (
                  <tr key={i}>
                    <td><div className="txt">{a.name}</div><div style={{ fontSize: 11, color: "var(--text3)" }}>{a.type}</div></td>
                    <td><span className={`badge ${SB[a.status] || "bgr"}`}>{a.status.replace("_", " ")}</span></td>
                    <td style={{ color: a.assigned_to ? "var(--text2)" : "var(--text3)" }}>{a.assigned_to || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent reports */}
        <div className="card">
          <div className="card-hd">
            <div className="row"><AlertTriangle size={15} style={{ color: "#fbbf24" }} /><span className="txt" style={{ fontSize: 14 }}>Recent Reports</span></div>
            <Link href="/dashboard/reports" style={{ fontSize: 12, color: "var(--accent)", textDecoration: "none", fontWeight: 700 }}>View all →</Link>
          </div>
          <div>
            {!d?.rr.length ? (
              <div className="empty" style={{ padding: "2.5rem" }}>
                <CheckCircle2 size={26} style={{ color: "var(--accent)", opacity: .4 }} />
                <p style={{ color: "var(--text3)", fontSize: 13 }}>No reports yet</p>
              </div>
            ) : d.rr.map((r: { asset_name: string; condition: string; status: string; created_at: string; reporter: string }, i: number) => (
              <div key={i} style={{ padding: "10px 14px", borderBottom: i < d.rr.length - 1 ? "1px solid var(--bd)" : "none" }}>
                <div className="row" style={{ justifyContent: "space-between", marginBottom: 3 }}>
                  <span className="txt" style={{ fontSize: 13 }}>{r.asset_name}</span>
                  <span className={`badge ${CB[r.condition] || "bgr"}`} style={{ fontSize: 10.5 }}>{r.condition}</span>
                </div>
                <div style={{ fontSize: 11.5, color: "var(--text3)" }}>{r.reporter} · {fmt(r.created_at)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
