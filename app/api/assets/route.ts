import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { query } from "@/lib/db";

export async function GET() {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    if (s.role === "admin") {
      const r = await query(`
        SELECT a.*, u.username AS assigned_to_username, u.full_name AS assigned_to_name
        FROM assets a
        LEFT JOIN assignments asgn ON a.id = asgn.asset_id AND asgn.returned_at IS NULL
        LEFT JOIN users u ON asgn.user_id = u.id
        ORDER BY a.created_at DESC
      `);
      return NextResponse.json({ assets: r.rows });
    } else {
      const r = await query(`
        SELECT a.id,a.name,a.type,a.brand,a.model,a.status,a.serial_number,a.notes,asgn.assigned_at
        FROM assets a
        JOIN assignments asgn ON a.id = asgn.asset_id
        WHERE asgn.user_id = $1 AND asgn.returned_at IS NULL
        ORDER BY asgn.assigned_at DESC
      `, [s.userId]);
      return NextResponse.json({ assets: r.rows });
    }
  } catch (e) { console.error(e); return NextResponse.json({ error: "Server error" }, { status: 500 }); }
}

export async function POST(req: NextRequest) {
  const s = await getSession();
  if (!s || s.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { name, type, brand, model, serialNumber, notes, purchaseDate, purchasePrice, location } = await req.json();
  if (!name?.trim() || !type?.trim())
    return NextResponse.json({ error: "Name and type are required." }, { status: 400 });
  try {
    const r = await query(
      `INSERT INTO assets (name,type,brand,model,serial_number,notes,purchase_date,purchase_price,location)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [name.trim(), type.trim(), brand || null, model || null, serialNumber || null, notes || null, purchaseDate || null, purchasePrice || null, location || null]
    );
    return NextResponse.json({ asset: r.rows[0] }, { status: 201 });
  } catch (e) { console.error(e); return NextResponse.json({ error: "Server error" }, { status: 500 }); }
}

export async function PATCH(req: NextRequest) {
  const s = await getSession();
  if (!s || s.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id, ...fields } = await req.json();
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
  const allowed = ["name","type","brand","model","serial_number","status","notes","purchase_date","purchase_price","location"];
  const sets: string[] = [];
  const vals: unknown[] = [];
  let i = 1;
  for (const [k, v] of Object.entries(fields)) {
    if (allowed.includes(k)) { sets.push(`${k}=$${i++}`); vals.push(v); }
  }
  if (!sets.length) return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  vals.push(id);
  const r = await query(`UPDATE assets SET ${sets.join(",")} WHERE id=$${i} RETURNING *`, vals);
  return NextResponse.json({ asset: r.rows[0] });
}

export async function DELETE(req: NextRequest) {
  const s = await getSession();
  if (!s || s.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
  try {
    await query("DELETE FROM assets WHERE id=$1", [id]);
    return NextResponse.json({ success: true });
  } catch (e) { console.error(e); return NextResponse.json({ error: "Server error" }, { status: 500 }); }
}
