import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { query } from "@/lib/db";

export async function GET() {
  const s = await getSession();
  if (!s || s.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const [assets, emps, asgns, reps, recent, recentReps] = await Promise.all([
    query(`SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE status='available')::int AS available,
      COUNT(*) FILTER (WHERE status='assigned')::int AS assigned,
      COUNT(*) FILTER (WHERE status IN ('damaged','in_repair','lost'))::int AS issues FROM assets`),
    query("SELECT COUNT(*)::int AS total FROM users WHERE role='employee'"),
    query("SELECT COUNT(*)::int AS total FROM assignments WHERE returned_at IS NULL"),
    query("SELECT COUNT(*)::int AS total FROM reports WHERE status='open'"),
    query(`SELECT a.name, a.type, a.status, u.full_name AS assigned_to, u.username AS assigned_uname
      FROM assets a LEFT JOIN assignments asgn ON a.id=asgn.asset_id AND asgn.returned_at IS NULL
      LEFT JOIN users u ON asgn.user_id=u.id ORDER BY a.created_at DESC LIMIT 7`),
    query(`SELECT r.id, r.condition, r.status, r.created_at, a.name AS asset_name, u.full_name AS reporter
      FROM reports r JOIN assets a ON r.asset_id=a.id JOIN users u ON r.reported_by=u.id
      ORDER BY r.created_at DESC LIMIT 5`),
  ]);
  return NextResponse.json({
    assets: assets.rows[0], employees: emps.rows[0], assignments: asgns.rows[0],
    openReports: reps.rows[0], recentAssets: recent.rows, recentReports: recentReps.rows,
  });
}
