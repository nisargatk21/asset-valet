import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { query } from "@/lib/db";

export async function GET() {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const reports = await query(`
      SELECT r.*, a.name AS asset_name, a.type AS asset_type,
        u.username AS reporter_username, u.full_name AS reporter_name
      FROM reports r
      JOIN assets a ON r.asset_id = a.id
      JOIN users u ON r.reported_by = u.id
      ${s.role === "employee" ? "WHERE r.reported_by = " + s.userId : ""}
      ORDER BY r.created_at DESC
    `);
    const stats = await query(`
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE condition='damaged')::int AS damaged,
        COUNT(*) FILTER (WHERE condition='in_repair')::int AS in_repair,
        COUNT(*) FILTER (WHERE condition='lost')::int AS lost,
        COUNT(*) FILTER (WHERE condition='other')::int AS other,
        COUNT(*) FILTER (WHERE status='open')::int AS open_count,
        COUNT(*) FILTER (WHERE status='pending')::int AS pending,
        COUNT(*) FILTER (WHERE status='resolved')::int AS resolved
      FROM reports
    `);
    return NextResponse.json({ reports: reports.rows, stats: stats.rows[0] });
  } catch (e) { console.error(e); return NextResponse.json({ error: "Server error" }, { status: 500 }); }
}

export async function POST(req: NextRequest) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { assetId, condition, description } = await req.json();
  if (!assetId || !condition)
    return NextResponse.json({ error: "Asset and condition are required." }, { status: 400 });
  try {
    const r = await query(
      "INSERT INTO reports (asset_id,reported_by,condition,description) VALUES ($1,$2,$3,$4) RETURNING *",
      [assetId, s.userId, condition, description || null]
    );
    if (["damaged", "in_repair", "lost"].includes(condition))
      await query("UPDATE assets SET status=$1 WHERE id=$2", [condition, assetId]);
    return NextResponse.json({ report: r.rows[0] }, { status: 201 });
  } catch (e) { console.error(e); return NextResponse.json({ error: "Server error" }, { status: 500 }); }
}

export async function PATCH(req: NextRequest) {
  const s = await getSession();
  if (!s || s.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id, status } = await req.json();
  if (!id || !status) return NextResponse.json({ error: "ID and status required." }, { status: 400 });
  await query("UPDATE reports SET status=$1 WHERE id=$2", [status, id]);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const s = await getSession();
  if (!s || s.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "ID required." }, { status: 400 });
  try {
    await query("DELETE FROM reports WHERE id=$1", [id]);
    return NextResponse.json({ success: true });
  } catch (e) { console.error(e); return NextResponse.json({ error: "Server error" }, { status: 500 }); }
}
