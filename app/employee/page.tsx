import { getSession } from "@/lib/auth";
import { query } from "@/lib/db";
import { Package, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const SB: Record<string, string> = { assigned: "bb", available: "bg", damaged: "br", in_repair: "by", lost: "br" };

async function getMyData(userId: number) {
  try {
    const [assets, reports] = await Promise.all([
      query(`SELECT a.id,a.name,a.type,a.brand,a.status,a.serial_number,a.notes,asgn.assigned_at
        FROM assets a JOIN assignments asgn ON a.id=asgn.asset_id
        WHERE asgn.user_id=$1 AND asgn.returned_at IS NULL ORDER BY asgn.assigned_at DESC`, [userId]),
      query(`SELECT r.id,r.condition,r.status,r.created_at,a.name asset_name
        FROM reports r JOIN assets a ON r.asset_id=a.id
        WHERE r.reported_by=$1 ORDER BY r.created_at DESC LIMIT 5`, [userId]),
    ]);
    return { assets: assets.rows, reports: reports.rows };
  } catch { return { assets: [], reports: [] }; }
}

const CB: Record<string, string> = { damaged: "br", in_repair: "by", lost: "br", other: "bgr" };
const RB: Record<string, string> = { open: "by", pending: "bb", resolved: "bg" };
const fmt = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export default async function EmployeePage() {
  const s = await getSession();
  if (!s) return null;
  const { assets, reports } = await getMyData(s.userId);
  const hr = new Date().getHours();
  const greet = hr < 12 ? "Good morning" : hr < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="page">
      {/* Welcome */}
      <div style={{ marginBottom: "1.75rem" }}>
        <h1 style={{ fontSize: "1.4rem", fontWeight: 900, color: "var(--text)", letterSpacing: "-.03em", marginBottom: 4 }}>
          {greet}, <span style={{ color: "var(--accent)" }}>{s.fullName.split(" ")[0]}</span> 👋
        </h1>
        <p className="txt3" style={{ fontSize: 13 }}>You have access to your assigned assets only.</p>
      </div>

      {/* Summary cards */}
      <div className="stats-grid" style={{ marginBottom: "1.5rem" }}>
        <div className="stat">
          <div className="stat-ico" style={{ background: "rgba(34,197,94,.09)", width: 40, height: 40 }}><Package size={18} style={{ color: "var(--accent)" }} /></div>
          <div><div className="stat-num">{assets.length}</div><div className="stat-lbl" style={{ marginTop: 3 }}>Assigned Assets</div></div>
        </div>
        <div className="stat">
          <div className="stat-ico" style={{ background: "rgba(251,191,36,.09)", width: 40, height: 40 }}><AlertCircle size={18} style={{ color: "#fbbf24" }} /></div>
          <div><div className="stat-num">{reports.length}</div><div className="stat-lbl" style={{ marginTop: 3 }}>My Reports</div></div>
        </div>
        <div className="stat">
          <div className="stat-ico" style={{ background: "rgba(34,197,94,.09)", width: 40, height: 40 }}><CheckCircle2 size={18} style={{ color: "var(--accent)" }} /></div>
          <div><div className="stat-num">{reports.filter(r => r.status === "resolved").length}</div><div className="stat-lbl" style={{ marginTop: 3 }}>Resolved</div></div>
        </div>
      </div>

      {/* Assets table */}
      <div className="card" style={{ marginBottom: "1.25rem" }}>
        <div className="card-hd">
          <div className="row">
            <Package size={15} style={{ color: "var(--accent)" }} />
            <span className="txt" style={{ fontSize: 14 }}>My Assigned Assets</span>
            <span className="badge bg" style={{ fontSize: 11 }}>{assets.length}</span>
          </div>
          {assets.length > 0 && (
            <Link href="/employee/report" style={{ fontSize: 12, fontWeight: 700, color: "#fbbf24", textDecoration: "none" }} className="row">
              <AlertCircle size={13} /> Report Issue
            </Link>
          )}
        </div>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr><th>Asset Name</th><th>Brand</th><th>Type</th><th>Serial No.</th><th>Status</th><th>Assigned On</th></tr></thead>
            <tbody>
              {assets.length === 0 ? (
                <tr><td colSpan={6}>
                  <div className="empty">
                    <div className="empty-ico"><Package size={22} style={{ color: "var(--text3)" }} /></div>
                    <p className="txt2" style={{ fontWeight: 600 }}>No assets assigned</p>
                    <p className="txt3" style={{ fontSize: 12 }}>Contact your administrator to get assets assigned</p>
                  </div>
                </td></tr>
              ) : assets.map((a: { id: number; name: string; brand: string; type: string; status: string; serial_number: string; notes: string; assigned_at: string }) => (
                <tr key={a.id}>
                  <td><div className="txt">{a.name}</div>{a.notes && <div className="txt3" style={{ fontSize: 11 }}>{a.notes}</div>}</td>
                  <td className="txt2">{a.brand || "—"}</td>
                  <td className="txt2">{a.type}</td>
                  <td><span className="mono txt3">{a.serial_number || "—"}</span></td>
                  <td><span className={`badge ${SB[a.status] || "bgr"}`}>{a.status}</span></td>
                  <td className="txt3" style={{ fontSize: 12 }}>{fmt(a.assigned_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* My reports */}
      {reports.length > 0 && (
        <div className="card">
          <div className="card-hd">
            <div className="row"><AlertCircle size={15} style={{ color: "#fbbf24" }} /><span className="txt" style={{ fontSize: 14 }}>My Recent Reports</span></div>
            <Link href="/employee/report" style={{ fontSize: 12, color: "var(--accent)", textDecoration: "none", fontWeight: 700 }}>+ New Report</Link>
          </div>
          <div>
            {reports.map((r: { id: number; asset_name: string; condition: string; status: string; created_at: string }, i: number) => (
              <div key={r.id} style={{ padding: "11px 14px", borderBottom: i < reports.length - 1 ? "1px solid var(--bd)" : "none", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
                <div>
                  <div className="txt" style={{ fontSize: 13 }}>{r.asset_name}</div>
                  <div className="txt3" style={{ fontSize: 11.5, marginTop: 2 }}>{fmt(r.created_at)}</div>
                </div>
                <div className="row" style={{ gap: 8 }}>
                  <span className={`badge ${CB[r.condition] || "bgr"}`} style={{ fontSize: 11 }}>{r.condition.replace("_", " ")}</span>
                  <span className={`badge ${RB[r.status] || "bgr"}`} style={{ fontSize: 11 }}>{r.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {assets.length === 0 && (
        <div style={{ marginTop: "1.25rem", padding: "1rem 1.25rem", borderRadius: 10, background: "rgba(34,197,94,.06)", border: "1px solid rgba(34,197,94,.15)", fontSize: 13, color: "var(--text3)" }}>
          💡 <strong style={{ color: "var(--text2)" }}>Tip:</strong> Contact your admin to get assets assigned. Once assigned, you can report issues from the &quot;Report Issue&quot; menu.
        </div>
      )}
    </div>
  );
}
