"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, ShieldCheck, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPass, setShowPass] = useState(false);
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

  const demo = (u: string, p: string) => setForm({ username: u, password: p });

  return (
    <div className="auth-wrap">
      <div className="auth-glow" style={{ width: 640, height: 640, top: -200, right: -120 }} />
      <div className="auth-glow" style={{ width: 400, height: 400, bottom: -120, left: -80 }} />
      <div style={{ position: "absolute", inset: 0, opacity: .03, backgroundImage: "linear-gradient(var(--accent) 1px,transparent 1px),linear-gradient(90deg,var(--accent) 1px,transparent 1px)", backgroundSize: "52px 52px" }} />

      <div className="auth-card">
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 54, height: 54, borderRadius: 16, background: "linear-gradient(135deg,#091e10,#0f3820)", border: "1px solid var(--bd2)", marginBottom: 14 }}>
            <ShieldCheck size={26} style={{ color: "var(--accent)" }} />
          </div>
          <h1 style={{ fontSize: "1.55rem", fontWeight: 900, color: "var(--text)", letterSpacing: "-.03em" }}>
            Asset<span style={{ color: "var(--accent)" }}>Valet</span>
          </h1>
          <p style={{ color: "var(--text3)", fontSize: 13, marginTop: 4 }}>Sign in to your workspace</p>
        </div>

        {/* Demo buttons */}
        <div style={{ marginBottom: "1.25rem" }}>
          <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", color: "var(--text3)", marginBottom: 8 }}>Quick Demo</p>
          <div className="grid2">
            {[
              { label: "Admin", sub: "admin / Admin@123", u: "admin", p: "Admin@123", c: "var(--accent)" },
              { label: "Employee", sub: "sara.khan / Pass@123", u: "sara.khan", p: "Pass@123", c: "var(--blue2)" },
            ].map(d => (
              <button key={d.label} type="button" onClick={() => demo(d.u, d.p)}
                style={{ padding: "9px 13px", borderRadius: 8, border: "1px solid var(--bd)", background: "var(--bg)", cursor: "pointer", textAlign: "left", transition: "all .15s" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = d.c + "55")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--bd)")}>
                <div style={{ fontSize: 12, fontWeight: 800, color: d.c }}>{d.label}</div>
                <div style={{ fontSize: 10.5, color: "var(--text3)", marginTop: 1 }}>{d.sub}</div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1.125rem" }}>
          <div style={{ flex: 1, height: 1, background: "var(--bd)" }} />
          <span style={{ fontSize: 10, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".07em" }}>or enter manually</span>
          <div style={{ flex: 1, height: 1, background: "var(--bd)" }} />
        </div>

        {error && <div className="alert alert-e" style={{ marginBottom: "1rem" }}>{error}</div>}

        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: ".875rem" }}>
          <div className="field">
            <label className="lbl">Username</label>
            <input className="inp" type="text" placeholder="your.username" value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })} required autoFocus autoComplete="username" />
          </div>
          <div className="field">
            <label className="lbl">Password</label>
            <div style={{ position: "relative" }}>
              <input className="inp" type={showPass ? "text" : "password"} placeholder="••••••••"
                style={{ paddingRight: 42 }} value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })} required autoComplete="current-password" />
              <button type="button" onClick={() => setShowPass(!showPass)}
                style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text3)" }}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn-p btn-lg" disabled={loading} style={{ width: "100%", marginTop: 4 }}>
            {loading ? <><Loader2 size={16} className="spin" /> Signing in...</> : <>Sign In <ArrowRight size={16} /></>}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.25rem", fontSize: 13, color: "var(--text3)" }}>
          No account?{" "}
          <Link href="/signup" style={{ color: "var(--accent)", fontWeight: 700, textDecoration: "none" }}>Create one →</Link>
        </p>
      </div>
    </div>
  );
}
