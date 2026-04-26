import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { query } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function GET() {
  const s = await getSession();
  if (!s || s.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const r = await query(`
    SELECT u.id, u.username, u.full_name, u.email, u.department, u.role, u.created_at,
      COUNT(asgn.id) FILTER (WHERE asgn.returned_at IS NULL)::int AS asset_count
    FROM users u
    LEFT JOIN assignments asgn ON u.id = asgn.user_id
    WHERE u.role = 'employee'
    GROUP BY u.id ORDER BY u.created_at DESC
  `);
  return NextResponse.json({ employees: r.rows });
}

export async function POST(req: NextRequest) {
  const s = await getSession();
  if (!s || s.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { username, fullName, email, password, department } = await req.json();
  if (!username || !fullName || !email || !password)
    return NextResponse.json({ error: "All fields required." }, { status: 400 });
  const ex = await query("SELECT id FROM users WHERE username=$1 OR email=$2", [username.toLowerCase(), email.toLowerCase()]);
  if (ex.rows.length) return NextResponse.json({ error: "Username or email already exists." }, { status: 409 });
  const hash = await bcrypt.hash(password, 10);
  const r = await query(
    "INSERT INTO users (username,full_name,email,password_hash,role,department) VALUES ($1,$2,$3,$4,'employee',$5) RETURNING id,username,full_name,email,department,role",
    [username.toLowerCase(), fullName, email.toLowerCase(), hash, department || null]
  );
  return NextResponse.json({ employee: r.rows[0] }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const s = await getSession();
  if (!s || s.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
  // Return all their assets first
  await query("UPDATE assignments SET returned_at=NOW() WHERE user_id=$1 AND returned_at IS NULL", [id]);
  await query("UPDATE assets SET status='available' WHERE id IN (SELECT asset_id FROM assignments WHERE user_id=$1)", [id]);
  await query("DELETE FROM users WHERE id=$1 AND role='employee'", [id]);
  return NextResponse.json({ success: true });
}
