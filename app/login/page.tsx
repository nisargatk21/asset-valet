"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, Shield, Monitor, Smartphone, Tablet, Lock, User } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const res = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      router.push(data.role === "admin" ? "/dashboard" : "/employee");
    } catch { setError("Network error. Please try again."); } finally { setLoading(false); }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#030a05", fontFamily: "'DM Sans',system-ui,sans-serif" }}>
      
      {/* ── LEFT PANEL ── */}
      <div style={{ flex: 1, position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", padding: "5rem", overflow: "hidden", background: "linear-gradient(160deg,#030a05 0%,#061208 40%,#0c2414 100%)" }}>
        
        {/* Grid overlay */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(34,197,94,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(34,197,94,.06) 1px,transparent 1px)", backgroundSize: "56px 56px", pointerEvents: "none" }} />
        
        {/* Glow orbs */}
        <div style={{ position: "absolute", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle,rgba(34,197,94,.07) 0%,transparent 65%)", top: -200, left: -150, pointerEvents: "none" }} />
        <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(34,197,94,.05) 0%,transparent 65%)", bottom: -100, right: -50, pointerEvents: "none" }} />

        {/* Badge */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 18px", borderRadius: 99, border: "1px solid rgba(34,197,94,.25)", background: "rgba(34,197,94,.07)", marginBottom: "2.5rem", width: "fit-content" }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px #22c55e" }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: "#22c55e", textTransform: "uppercase", letterSpacing: ".12em" }}>Asset Management Platform</span>
        </div>

        {/* Heading */}
        <h1 style={{ fontSize: "5rem", fontWeight: 900, lineHeight: .95, marginBottom: "1.75rem", letterSpacing: "-.04em" }}>
          <span style={{ color: "#e4fced" }}>Asset</span><br />
          <span style={{ color: "#22c55e" }}>Valet</span>
        </h1>

        <p style={{ fontSize: 17, color: "rgba(228,252,237,.45)", lineHeight: 1.7, marginBottom: "3rem", maxWidth: 340 }}>
          Growth driven by Assets,<br />led by people.
        </p>

        {/* Stats */}
        <div style={{ display: "flex", gap: "2.5rem", marginBottom: "3rem" }}>
          {[{ v: "99.9%", l: "Uptime" }, { v: "256-bit", l: "Encrypted" }, { v: "Real-time", l: "Tracking" }].map(s => (
            <div key={s.l}>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#22c55e" }}>{s.v}</div>
              <div style={{ fontSize: 11.5, color: "rgba(228,252,237,.35)", fontWeight: 500, marginTop: 3, textTransform: "uppercase", letterSpacing: ".06em" }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Device bar */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 14, padding: "16px 24px", borderRadius: 14, background: "rgba(34,197,94,.05)", border: "1px solid rgba(34,197,94,.12)" }}>
          <Monitor size={26} style={{ color: "#22c55e" }} />
          <div style={{ width: 1, height: 28, background: "rgba(34,197,94,.18)" }} />
          <Smartphone size={20} style={{ color: "rgba(34,197,94,.45)" }} />
          <div style={{ width: 1, height: 28, background: "rgba(34,197,94,.12)" }} />
          <Tablet size={22} style={{ color: "rgba(34,197,94,.35)" }} />
        </div>

        {/* Bottom branding */}
        <div style={{ position: "absolute", bottom: "2rem", left: "5rem", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(34,197,94,.12)", border: "1px solid rgba(34,197,94,.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Shield size={14} style={{ color: "#22c55e" }} />
          </div>
          <span style={{ fontSize: 12, color: "rgba(228,252,237,.25)", fontWeight: 600 }}>AssetValet © 2024</span>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div style={{ width: 500, display: "flex", alignItems: "center", justifyContent: "center", background: "#040c07", borderLeft: "1px solid rgba(34,197,94,.08)", padding: "2.5rem" }}>
        <div style={{ width: "100%", maxWidth: 400 }}>

          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 64, height: 64, borderRadius: 20, background: "rgba(34,197,94,.1)", border: "1px solid rgba(34,197,94,.25)", marginBottom: 18, position: "relative" }}>
              <Shield size={30} style={{ color: "#22c55e" }} />
            </div>
            <h2 style={{ fontSize: "1.6rem", fontWeight: 900, color: "#e4fced", letterSpacing: "-.03em", margin: 0 }}>Welcome Back</h2>
            <p style={{ color: "rgba(228,252,237,.35)", fontSize: 14, marginTop: 6, fontWeight: 500 }}>Sign in to Asset Valet</p>
          </div>

          {/* Error */}
          {error && (
            <div style={{ marginBottom: "1.25rem", padding: "12px 16px", borderRadius: 10, background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.2)", color: "#fca5a5", fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16 }}>⚠</span> {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>

            {/* Username */}
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".09em", color: "rgba(228,252,237,.4)", marginBottom: 8 }}>Username</label>
              <div style={{ position: "relative" }}>
                <User size={15} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "rgba(34,197,94,.4)", pointerEvents: "none" }} />
                <input type="text" placeholder="Enter your username" required autoFocus value={form.username}
                  onChange={e => setForm({ ...form, username: e.target.value })}
                  style={{ width: "100%", background: "rgba(255,255,255,.03)", border: "1px solid rgba(34,197,94,.12)", borderRadius: 11, padding: "13px 16px 13px 40px", color: "#e4fced", fontSize: 14, outline: "none", fontFamily: "inherit", transition: "border-color .15s, box-shadow .15s" }}
                  onFocus={e => { e.target.style.borderColor = "rgba(34,197,94,.4)"; e.target.style.boxShadow = "0 0 0 3px rgba(34,197,94,.08)"; }}
                  onBlur={e => { e.target.style.borderColor = "rgba(34,197,94,.12)"; e.target.style.boxShadow = "none"; }} />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".09em", color: "rgba(228,252,237,.4)", marginBottom: 8 }}>Password</label>
              <div style={{ position: "relative" }}>
                <Lock size={15} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "rgba(34,197,94,.4)", pointerEvents: "none" }} />
                <input type={showPass ? "text" : "password"} placeholder="••••••••" required value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  style={{ width: "100%", background: "rgba(255,255,255,.03)", border: "1px solid rgba(34,197,94,.12)", borderRadius: 11, padding: "13px 44px 13px 40px", color: "#e4fced", fontSize: 14, outline: "none", fontFamily: "inherit", transition: "border-color .15s, box-shadow .15s" }}
                  onFocus={e => { e.target.style.borderColor = "rgba(34,197,94,.4)"; e.target.style.boxShadow = "0 0 0 3px rgba(34,197,94,.08)"; }}
                  onBlur={e => { e.target.style.borderColor = "rgba(34,197,94,.12)"; e.target.style.boxShadow = "none"; }} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(228,252,237,.25)", padding: 2 }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: -2 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} style={{ width: 15, height: 15, accentColor: "#22c55e", cursor: "pointer" }} />
                <span style={{ fontSize: 13, color: "rgba(228,252,237,.4)", fontWeight: 500 }}>Remember me</span>
              </label>
              <span style={{ fontSize: 13, color: "#22c55e", cursor: "pointer", fontWeight: 700 }}>Forgot Password?</span>
            </div>

            {/* Login Button */}
            <button type="submit" disabled={loading}
              style={{ width: "100%", padding: "15px", marginTop: 4, borderRadius: 11, background: loading ? "rgba(34,197,94,.5)" : "linear-gradient(135deg,#22c55e,#15803d)", border: "none", color: "#fff", fontSize: 15, fontWeight: 800, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "inherit", letterSpacing: ".01em", boxShadow: loading ? "none" : "0 4px 24px rgba(34,197,94,.25)", transition: "all .2s" }}>
              {loading ? <><Loader2 size={17} style={{ animation: "spin .7s linear infinite" }} /> Signing in...</> : "Login"}
            </button>

            {/* Sign up link */}
            <p style={{ textAlign: "center", fontSize: 13.5, color: "rgba(228,252,237,.35)", fontWeight: 500 }}>
              Don&apos;t have an account?{" "}
              <Link href="/signup" style={{ color: "#22c55e", fontWeight: 800, textDecoration: "none" }}>Sign Up</Link>
            </p>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ flex: 1, height: 1, background: "rgba(34,197,94,.08)" }} />
              <span style={{ fontSize: 10.5, color: "rgba(228,252,237,.2)", fontWeight: 700, letterSpacing: ".08em" }}>OR CONTINUE WITH</span>
              <div style={{ flex: 1, height: 1, background: "rgba(34,197,94,.08)" }} />
            </div>

            {/* Social */}
            <div style={{ display: "flex", gap: 10 }}>
              {[{ l: "G", c: "#ea4335" }, { l: "in", c: "#0077b5" }, { l: "✉", c: "#22c55e" }].map(s => (
                <button key={s.l} type="button"
                  style={{ flex: 1, padding: "12px", borderRadius: 10, background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)", cursor: "pointer", fontSize: 14, fontWeight: 800, color: s.c, fontFamily: "inherit", transition: "background .15s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,.06)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,.03)")}>
                  {s.l}
                </button>
              ))}
            </div>
          </form>

          {/* Demo credentials */}
          <div style={{ marginTop: "1.75rem", padding: "14px 16px", borderRadius: 12, background: "rgba(34,197,94,.04)", border: "1px solid rgba(34,197,94,.1)" }}>
            <p style={{ fontSize: 10, fontWeight: 800, color: "rgba(34,197,94,.5)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 10 }}>Demo Credentials</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[{ role: "Admin", u: "admin", p: "Admin@123", sub: "Full access" }, { role: "Employee", u: "sara.khan", p: "Pass@123", sub: "Limited access" }].map(d => (
                <button key={d.role} type="button"
                  onClick={() => setForm({ username: d.u, password: d.p })}
                  style={{ padding: "10px 12px", borderRadius: 9, background: "rgba(34,197,94,.06)", border: "1px solid rgba(34,197,94,.14)", cursor: "pointer", textAlign: "left", fontFamily: "inherit", transition: "background .15s, border-color .15s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(34,197,94,.12)"; e.currentTarget.style.borderColor = "rgba(34,197,94,.28)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(34,197,94,.06)"; e.currentTarget.style.borderColor = "rgba(34,197,94,.14)"; }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: "#22c55e" }}>{d.role}</div>
                  <div style={{ fontSize: 11, color: "rgba(228,252,237,.3)", marginTop: 2 }}>{d.sub}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: rgba(228,252,237,0.18) !important; }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}