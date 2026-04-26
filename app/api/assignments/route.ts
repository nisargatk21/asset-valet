import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { query } from "@/lib/db";

export async function GET() {
  const s = await getSession();
  if (!s || s.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const r = await query(`
    SELECT asgn.*, a.name AS asset_name, a.type AS asset_type, a.serial_number,
      u.username, u.full_name, ab.username AS by_username
    FROM assignments asgn
    JOIN assets a ON asgn.asset_id = a.id
    JOIN users u ON asgn.user_id = u.id
    LEFT JOIN users ab ON asgn.assigned_by = ab.id
    ORDER BY asgn.assigned_at DESC
  `);
  return NextResponse.json({ assignments: r.rows });
}

export async function POST(req: NextRequest) {
  const s = await getSession();
  if (!s || s.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { assetId, userId, notes } = await req.json();
  if (!assetId || !userId) return NextResponse.json({ error: "Asset and employee required." }, { status: 400 });
  // Check asset is available
  const assetCheck = await query("SELECT status FROM assets WHERE id=$1", [assetId]);
  if (!assetCheck.rows.length) return NextResponse.json({ error: "Asset not found." }, { status: 404 });
  if (assetCheck.rows[0].status === "assigned")
    return NextResponse.json({ error: "Asset is already assigned. Return it first." }, { status: 409 });
  try {
    await query("UPDATE assignments SET returned_at=NOW() WHERE asset_id=$1 AND returned_at IS NULL", [assetId]);
    const r = await query(
      "INSERT INTO assignments (asset_id,user_id,assigned_by,notes) VALUES ($1,$2,$3,$4) RETURNING *",
      [assetId, userId, s.userId, notes || null]
    );
    await query("UPDATE assets SET status='assigned' WHERE id=$1", [assetId]);
    return NextResponse.json({ assignment: r.rows[0] }, { status: 201 });
  } catch (e) { console.error(e); return NextResponse.json({ error: "Server error" }, { status: 500 }); }
}

export async function DELETE(req: NextRequest) {
  const s = await getSession();
  if (!s || s.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { assetId } = await req.json();
  await query("UPDATE assignments SET returned_at=NOW() WHERE asset_id=$1 AND returned_at IS NULL", [assetId]);
  await query("UPDATE assets SET status='available' WHERE id=$1", [assetId]);
  return NextResponse.json({ success: true });
}
