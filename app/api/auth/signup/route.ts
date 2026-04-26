import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { query } from "@/lib/db";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { username, fullName, email, password, role } = await req.json();
    if (!username?.trim() || !fullName?.trim() || !email?.trim() || !password)
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    if (password.length < 6)
      return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });

    const ex = await query("SELECT id FROM users WHERE username=$1 OR email=$2", [username.trim().toLowerCase(), email.trim().toLowerCase()]);
    if (ex.rows.length) return NextResponse.json({ error: "Username or email already taken." }, { status: 409 });

    const hash = await bcrypt.hash(password, 10);
    const userRole = role === "admin" ? "admin" : "employee";
    const r = await query(
      "INSERT INTO users (username,full_name,email,password_hash,role) VALUES ($1,$2,$3,$4,$5) RETURNING id,username,full_name,role",
      [username.trim().toLowerCase(), fullName.trim(), email.trim().toLowerCase(), hash, userRole]
    );
    const u = r.rows[0];
    const token = await signToken({ userId: u.id, username: u.username, fullName: u.full_name, role: u.role });
    const res = NextResponse.json({ success: true, role: u.role }, { status: 201 });
    res.cookies.set("av_token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 28800, path: "/" });
    return res;
  } catch (e) { console.error(e); return NextResponse.json({ error: "Server error." }, { status: 500 }); }
}
