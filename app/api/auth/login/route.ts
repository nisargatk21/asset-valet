import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { query } from "@/lib/db";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    if (!username?.trim() || !password)
      return NextResponse.json({ error: "Username and password required." }, { status: 400 });

    const r = await query("SELECT id,username,full_name,password_hash,role FROM users WHERE username=$1", [username.trim().toLowerCase()]);
    if (!r.rows.length) return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });

    const u = r.rows[0];
    if (!await bcrypt.compare(password, u.password_hash))
      return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });

    const token = await signToken({ userId: u.id, username: u.username, fullName: u.full_name, role: u.role });
    const res = NextResponse.json({ success: true, role: u.role });
    res.cookies.set("av_token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 28800, path: "/" });
    return res;
  } catch (e) { console.error(e); return NextResponse.json({ error: "Server error." }, { status: 500 }); }
}
