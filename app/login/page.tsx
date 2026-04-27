"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, Shield, Monitor, Smartphone, Tablet } from "lucide-react";

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
    <div style={{ minHeight: "100vh", display: "flex", background: "#040d07", fontFamily: "'DM Sans', system-ui, sans-serif", overflow: "hidden" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "4rem", background: "linear-gradient(135deg, #040d07 0%, #071a0e 50%, #0a2918 100%)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)", top: -100, left: -100, pointerEvents: "none" }} />
        <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(34,197,94,0.05) 0%, transparent 70%)", bottom: 0, right: 0, pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "linear-gradient(rgba(34,197,94,1) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,1) 1px, transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none" }} />
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 99, border: "1px solid rgba(34,197,94,0.3)", background: "rgba(34,197,94,0.08)", marginBottom: "2rem", width: "fit-content" }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: "#22c55e", textTransform: "uppercase", letterSpacing: "0.1em" }}>Asset Management Platform</span>
        </div>
        <h1 style={{ fontSize: "4.5rem", fontWeight: 900, lineHeight: 1.05, marginBottom: "1.5rem", letterSpacing: "-0.03em" }}>
          <span style={{ color: "#e8fef0" }}>Asset</span><br />
          <span style={{ color: "#22c55e" }}>Valet</span>
        </h1>
        <p style={{ fontSize: 18, color: "rgba(232,254,240,0.5)", maxWidth: 380, lineHeight: 1.6, marginBottom: "3rem" }}>
          Growth driven by Assets,<br />led by people.
        </p>
        <div style={{ display: "flex", gap: "3rem", marginBottom: "3rem" }}>
          {[{ val: "99.9%", label: "Uptime" }, { val: "256-bit", label: "Encrypted" }, { val: "Real-time", label: "Tracking" }].map(s => (
            <div key={s.label}>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#22c55e" }}>{s.val}</div>
              <div style={{ fontSize: 12, color: "rgba(232,254,240,0.4)", fontWeight: 500, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div style={{ padding: "20px 28px", borderRadius: 16, background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.15)", display: "flex", alignItems: "center", gap: 12, width: "fit-content" }}>
          <Monitor size={28} style={{ color: "#22c55e" }} />
          <div style={{ width: 1, height: 40, background: "rgba(34,197,94,0.2)" }} />
          <Smartphone size={22} style={{ color: "rgba(34,197,94,0.5)" }} />
          <Tablet size={24} style={{ color: "rgba(34,197,94,0.4)" }} />
        </div>
      </div>

      <div style={{ width: 480, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(6,15,9,0.95)", borderLeft: "1px solid rgba(34,197,94,0.1)", padding: "2rem" }}>
        <div style={{ width: "100%", maxWidth: 400 }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 60, height: 60, borderRadius: 18, background: "linear-gradient(135deg,rgba(34,197,94,0.15),rgba(22,163,74,0.05))", border: "1px solid rgba(34,197,94,0.3)", marginBottom: 16 }}>
              <Shield size={28} style={{ color: "#22c55e" }} />
            </div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#e8fef0", letterSpacing: "-0.02em" }}>Welcome Back</h2>
            <p style={{ color: "rgba(232,254,240,0.4)", fontSize: 14, marginTop: 4 }}>Sign in to Asset Valet</p>
          </div>

          {error && <div style={{ marginBottom: "1.25rem", padding: "11px 14px", borderRadius: 8, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", color: "#fca5a5", fontSize: 13 }}>{error}</div>}

          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "1.125rem" }}>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(232,254,240,0.5)", marginBottom: 6 }}>Username</label>
              <input type="text" placeholder="Enter your username" required autoFocus value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(34,197,94,0.15)", borderRadius: 10, padding: "12px 16px", color: "#e8fef0", fontSize: 14, outline: "none", fontFamily: "inherit" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(232,254,240,0.5)", marginBottom: 6 }}>Password</label>
              <div style={{ position: "relative" }}>
                <input type={showPass ? "text" : "password"} placeholder="••••••••" required value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(34,197,94,0.15)", borderRadius: 10, padding: "12px 44px 12px 16px", color: "#e8fef0", fontSize: 14, outline: "none", fontFamily: "inherit" }} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(232,254,240,0.3)" }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} style={{ width: 16, height: 16, accentColor: "#22c55e" }} />
                <span style={{ fontSize: 13, color: "rgba(232,254,240,0.5)" }}>Remember me</span>
              </label>
              <span style={{ fontSize: 13, color: "#22c55e", cursor: "pointer", fontWeight: 600 }}>Forgot Password?</span>
            </div>
            <button type="submit" disabled={loading}
              style={{ width: "100%", padding: "14px", borderRadius: 10, background: "linear-gradient(135deg, #22c55e, #16a34a)", border: "none", color: "#fff", fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "inherit", boxShadow: "0 4px 20px rgba(34,197,94,0.3)" }}>
              {loading ? <><Loader2 size={17} style={{ animation: "spin 0.7s linear infinite" }} /> Signing in...</> : "Login"}
            </button>
            <p style={{ textAlign: "center", fontSize: 13, color: "rgba(232,254,240,0.4)" }}>
              Don&apos;t have an account?{" "}
              <Link href="/signup" style={{ color: "#22c55e", fontWeight: 700, textDecoration: "none" }}>Sign Up</Link>
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ flex: 1, height: 1, background: "rgba(34,197,94,0.1)" }} />
              <span style={{ fontSize: 11, color: "rgba(232,254,240,0.3)", fontWeight: 600 }}>OR CONTINUE WITH</span>
              <div style={{ flex: 1, height: 1, background: "rgba(34,197,94,0.1)" }} />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              {[{ label: "G", color: "#ea4335" }, { label: "in", color: "#0077b5" }, { label: "✉", color: "#22c55e" }].map(s => (
                <button key={s.label} type="button"
                  style={{ flex: 1, padding: "11px", borderRadius: 9, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer", fontSize: 15, fontWeight: 800, color: s.color, fontFamily: "inherit" }}>
                  {s.label}
                </button>
              ))}
            </div>
          </form>

          <div style={{ marginTop: "1.5rem", padding: "12px 14px", borderRadius: 10, background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.12)" }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(34,197,94,0.6)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>Demo Credentials</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[{ role: "Admin", u: "admin", p: "Admin@123" }, { role: "Employee", u: "sara.khan", p: "Pass@123" }].map(d => (
                <button key={d.role} type="button" onClick={() => setForm({ username: d.u, password: d.p })}
                  style={{ padding: "8px 10px", borderRadius: 7, background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.15)", cursor: "pointer", textAlign: "left", fontFamily: "inherit" }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#22c55e" }}>{d.role}</div>
                  <div style={{ fontSize: 10, color: "rgba(232,254,240,0.35)", marginTop: 1 }}>{d.u}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } input::placeholder { color: rgba(232,254,240,0.2) !important; }`}</style>
    </div>
  );
}