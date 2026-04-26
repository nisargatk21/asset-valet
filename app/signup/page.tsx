"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, ShieldCheck, ArrowRight, BadgeCheck } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", fullName: "", email: "", password: "", confirm: "", role: "employee" });
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setError("");
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: form.username, fullName: form.fullName, email: form.email, password: form.password, role: form.role }) });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      router.push(data.role === "admin" ? "/dashboard" : "/employee");
    } catch { setError("Network error."); } finally { setLoading(false); }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-glow" style={{ width: 500, height: 500, top: -150, right: -100 }} />
      <div className="auth-glow" style={{ width: 350, height: 350, bottom: -100, left: -80 }} />
      <div style={{ position: "absolute", inset: 0, opacity: .03, backgroundImage: "linear-gradient(var(--accent) 1px,transparent 1px),linear-gradient(90deg,var(--accent) 1px,transparent 1px)", backgroundSize: "52px 52px" }} />

      <div className="auth-card" style={{ maxWidth: 460 }}>
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 52, height: 52, borderRadius: 15, background: "linear-gradient(135deg,#091e10,#0f3820)", border: "1px solid var(--bd2)", marginBottom: 12 }}>
            <ShieldCheck size={24} style={{ color: "var(--accent)" }} />
          </div>
          <h1 style={{ fontSize: "1.45rem", fontWeight: 900, color: "var(--text)", letterSpacing: "-.03em" }}>Create Account</h1>
          <p style={{ color: "var(--text3)", fontSize: 13, marginTop: 3 }}>Join AssetValet today</p>
        </div>

        {error && <div className="alert alert-e" style={{ marginBottom: "1rem" }}>{error}</div>}

        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: ".8rem" }}>
          <div className="field">
            <label className="lbl">Full Name</label>
            <input className="inp" placeholder="Sara Khan" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} required />
          </div>
          <div className="grid2">
            <div className="field">
              <label className="lbl">Username</label>
              <input className="inp" placeholder="sara.khan" value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value.toLowerCase().replace(/\s/g, ".") })} required />
            </div>
            <div className="field">
              <label className="lbl">Email</label>
              <input className="inp" type="email" placeholder="sara@co.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
          </div>

          {/* Role picker */}
          <div className="field">
            <label className="lbl">Account Type</label>
            <div className="grid2">
              {[{ v: "employee", l: "Employee", d: "View & report my assets" }, { v: "admin", l: "Admin", d: "Manage all assets" }].map(r => (
                <button key={r.v} type="button" onClick={() => setForm({ ...form, role: r.v })}
                  style={{ padding: "10px 12px", borderRadius: 9, textAlign: "left", cursor: "pointer", border: `1px solid ${form.role === r.v ? "rgba(34,197,94,.4)" : "var(--bd)"}`, background: form.role === r.v ? "rgba(22,163,74,.1)" : "var(--bg)", transition: "all .15s" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    {form.role === r.v && <BadgeCheck size={13} style={{ color: "var(--accent)" }} />}
                    <span style={{ fontSize: 13, fontWeight: 800, color: form.role === r.v ? "var(--accent)" : "var(--text2)" }}>{r.l}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>{r.d}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid2">
            <div className="field">
              <label className="lbl">Password</label>
              <div style={{ position: "relative" }}>
                <input className="inp" type={show ? "text" : "password"} placeholder="Min 6 chars"
                  style={{ paddingRight: 38 }} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                <button type="button" onClick={() => setShow(!show)} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text3)" }}>
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <div className="field">
              <label className="lbl">Confirm</label>
              <input className="inp" type={show ? "text" : "password"} placeholder="Repeat" value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} required />
            </div>
          </div>

          <button type="submit" className="btn btn-p btn-lg" disabled={loading} style={{ width: "100%", marginTop: 4 }}>
            {loading ? <><Loader2 size={16} className="spin" /> Creating...</> : <>Create Account <ArrowRight size={16} /></>}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.125rem", fontSize: 13, color: "var(--text3)" }}>
          Have an account? <Link href="/login" style={{ color: "var(--accent)", fontWeight: 700, textDecoration: "none" }}>Sign in →</Link>
        </p>
      </div>
    </div>
  );
}
