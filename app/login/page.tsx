"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid credentials");
      router.push(data.role === "admin" ? "/dashboard" : "/employee");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Sora', sans-serif; background: #020d0b; overflow: hidden; }
        .page {
          min-height: 100vh; width: 100%; display: flex;
          background: radial-gradient(ellipse 80% 60% at 20% 50%, #001a12 0%, #020d0b 60%),
                      radial-gradient(ellipse 50% 50% at 80% 50%, #001510 0%, transparent 70%);
          position: relative; overflow: hidden;
        }
        .blob1 { position:absolute; width:500px; height:500px; border-radius:50%; background:radial-gradient(circle,rgba(0,245,176,0.08) 0%,transparent 70%); top:-100px; left:-100px; pointer-events:none; }
        .blob2 { position:absolute; width:400px; height:400px; border-radius:50%; background:radial-gradient(circle,rgba(0,245,176,0.06) 0%,transparent 70%); bottom:-100px; right:300px; pointer-events:none; }
        .blob3 { position:absolute; width:300px; height:300px; border-radius:50%; background:radial-gradient(circle,rgba(0,245,176,0.05) 0%,transparent 70%); top:50%; right:100px; pointer-events:none; }
        .grid-lines { position:absolute; inset:0; background-image:linear-gradient(rgba(0,245,176,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,245,176,0.03) 1px,transparent 1px); background-size:60px 60px; pointer-events:none; }
        .left { flex:1; display:flex; flex-direction:column; justify-content:center; padding:60px 60px 60px 80px; position:relative; z-index:1; }
        .platform-label { display:flex; align-items:center; gap:12px; margin-bottom:36px; }
        .platform-label::before { content:''; display:block; width:40px; height:1.5px; background:#00f5b0; }
        .platform-label span { font-size:11px; font-weight:600; letter-spacing:0.18em; color:#00f5b0; text-transform:uppercase; }
        .main-heading { margin-bottom:20px; }
        .main-heading .asset { display:block; font-size:76px; font-weight:800; color:#ffffff; line-height:1; letter-spacing:-2px; }
        .main-heading .valet { display:block; font-size:76px; font-weight:800; color:#00f5b0; line-height:1; letter-spacing:-2px; text-shadow:0 0 40px rgba(0,245,176,0.5),0 0 80px rgba(0,245,176,0.2); }
        .subtitle { font-size:15px; color:#5a9e88; font-weight:400; line-height:1.6; max-width:300px; margin-bottom:56px; border-left:2px solid rgba(0,245,176,0.3); padding-left:16px; }
        .devices { position:relative; width:420px; height:220px; margin-bottom:56px; margin-left:-10px; }
        .device-laptop { position:absolute; left:0; bottom:0; width:260px; animation:float1 4s ease-in-out infinite; }
        .laptop-screen { width:260px; height:160px; background:rgba(0,245,176,0.04); border:1.5px solid rgba(0,245,176,0.18); border-radius:10px 10px 0 0; overflow:hidden; }
        .laptop-screen-inner { margin:10px; height:calc(100% - 20px); background:rgba(0,245,176,0.03); border-radius:6px; border:1px solid rgba(0,245,176,0.08); display:flex; flex-direction:column; gap:6px; padding:10px; }
        .screen-bar { height:6px; border-radius:3px; background:rgba(0,245,176,0.15); }
        .screen-bar.short { width:60%; }
        .screen-bar.medium { width:80%; }
        .screen-bar.tiny { width:40%; height:4px; background:rgba(0,245,176,0.08); }
        .screen-grid { display:grid; grid-template-columns:1fr 1fr; gap:5px; margin-top:4px; }
        .screen-card { height:28px; border-radius:4px; background:rgba(0,245,176,0.07); border:1px solid rgba(0,245,176,0.1); }
        .laptop-base { width:280px; height:12px; background:rgba(0,245,176,0.08); border:1.5px solid rgba(0,245,176,0.15); border-top:none; border-radius:0 0 6px 6px; margin-left:-10px; }
        .device-tablet { position:absolute; right:60px; top:10px; width:90px; animation:float2 4.5s ease-in-out infinite 0.5s; }
        .tablet-body { width:90px; height:120px; background:rgba(0,245,176,0.04); border:1.5px solid rgba(0,245,176,0.18); border-radius:10px; padding:8px 6px; display:flex; flex-direction:column; gap:5px; }
        .tablet-bar { height:5px; border-radius:3px; background:rgba(0,245,176,0.15); }
        .tablet-bar.s { width:70%; }
        .tablet-bar.m { width:90%; }
        .tablet-icon { width:20px; height:20px; border-radius:5px; background:rgba(0,245,176,0.12); border:1px solid rgba(0,245,176,0.2); margin:2px auto; }
        .device-phone { position:absolute; right:10px; bottom:20px; width:55px; animation:float3 3.8s ease-in-out infinite 1s; }
        .phone-body { width:55px; height:100px; background:rgba(0,245,176,0.04); border:1.5px solid rgba(0,245,176,0.18); border-radius:12px; padding:8px 5px; display:flex; flex-direction:column; gap:4px; align-items:center; }
        .phone-notch { width:20px; height:4px; border-radius:2px; background:rgba(0,245,176,0.2); margin-bottom:4px; }
        .phone-bar { height:4px; border-radius:2px; background:rgba(0,245,176,0.15); width:100%; }
        .phone-bar.s { width:70%; }
        @keyframes float1 { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-10px)} }
        @keyframes float2 { 0%,100%{transform:translateY(0px) rotate(2deg)} 50%{transform:translateY(-14px) rotate(2deg)} }
        @keyframes float3 { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-8px)} }
        .stats { display:flex; gap:48px; }
        .stat-value { font-size:22px; font-weight:700; color:#00f5b0; text-shadow:0 0 20px rgba(0,245,176,0.4); }
        .stat-label { font-size:11px; color:#4a8870; font-weight:400; margin-top:2px; letter-spacing:0.05em; }
        .right { width:480px; display:flex; align-items:center; justify-content:center; padding:40px 48px; position:relative; z-index:1; }
        .card { width:100%; max-width:380px; background:rgba(5,28,22,0.7); border:1px solid rgba(0,245,176,0.15); border-radius:28px; padding:40px 36px; backdrop-filter:blur(24px); box-shadow:0 0 0 1px rgba(0,245,176,0.05),0 20px 60px rgba(0,0,0,0.6),inset 0 1px 0 rgba(0,245,176,0.1); animation:fadeInUp 0.6s ease both; }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        .card-icon { width:52px; height:52px; margin:0 auto 24px; border-radius:14px; background:linear-gradient(135deg,rgba(0,245,176,0.2),rgba(0,245,176,0.05)); border:1px solid rgba(0,245,176,0.3); display:flex; align-items:center; justify-content:center; box-shadow:0 0 24px rgba(0,245,176,0.2); }
        .card-title { text-align:center; font-size:26px; font-weight:700; color:#ffffff; margin-bottom:6px; letter-spacing:-0.5px; }
        .card-sub { text-align:center; font-size:13px; color:#5a9e88; margin-bottom:32px; }
        .field { margin-bottom:16px; }
        .field-label { display:block; font-size:10px; font-weight:600; letter-spacing:0.12em; color:#4a8870; text-transform:uppercase; margin-bottom:8px; }
        .field-input { width:100%; background:rgba(0,245,176,0.04); border:1px solid rgba(0,245,176,0.12); border-radius:12px; padding:13px 16px; font-size:14px; font-family:'Sora',sans-serif; color:#e0f5ee; outline:none; transition:all 0.2s; }
        .field-input::placeholder { color:#2d6657; }
        .field-input:focus { border-color:rgba(0,245,176,0.4); background:rgba(0,245,176,0.07); box-shadow:0 0 0 3px rgba(0,245,176,0.08); }
        .row-options { display:flex; align-items:center; justify-content:space-between; margin:6px 0 24px; }
        .remember { display:flex; align-items:center; gap:8px; cursor:pointer; }
        .remember input[type=checkbox] { width:15px; height:15px; accent-color:#00f5b0; cursor:pointer; }
        .remember span { font-size:12px; color:#5a9e88; }
        .forgot { font-size:12px; color:#00f5b0; text-decoration:none; opacity:0.8; }
        .btn-login { width:100%; padding:14px; background:linear-gradient(135deg,#00f5b0,#00c98f); border:none; border-radius:14px; font-family:'Sora',sans-serif; font-size:15px; font-weight:700; color:#020d0b; cursor:pointer; transition:all 0.2s; box-shadow:0 0 30px rgba(0,245,176,0.3); letter-spacing:0.02em; margin-bottom:20px; }
        .btn-login:hover { transform:translateY(-1px); box-shadow:0 0 40px rgba(0,245,176,0.45); }
        .btn-login:disabled { opacity:0.6; cursor:not-allowed; transform:none; }
        .signup-row { text-align:center; font-size:12.5px; color:#4a8870; margin-bottom:24px; }
        .signup-row a { color:#00f5b0; text-decoration:none; font-weight:600; }
        .error-msg { background:rgba(255,80,80,0.08); border:1px solid rgba(255,80,80,0.2); border-radius:10px; padding:10px 14px; font-size:12px; color:#ff6b6b; margin-bottom:16px; text-align:center; }

        /* Demo credentials */
        .demo-box { margin-top:4px; padding:12px 14px; border-radius:12px; background:rgba(0,245,176,0.04); border:1px solid rgba(0,245,176,0.1); }
        .demo-title { font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:.12em; color:rgba(0,245,176,0.5); margin-bottom:8px; }
        .demo-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
        .demo-btn { padding:8px 10px; border-radius:8px; background:rgba(0,245,176,0.06); border:1px solid rgba(0,245,176,0.15); cursor:pointer; text-align:left; font-family:'Sora',sans-serif; transition:all .15s; }
        .demo-btn:hover { background:rgba(0,245,176,0.12); }
        .demo-role { font-size:11px; font-weight:700; color:#00f5b0; }
        .demo-user { font-size:10px; color:rgba(224,245,238,0.35); margin-top:1px; }
      `}</style>

      <div className="page">
        <div className="blob1" /><div className="blob2" /><div className="blob3" />
        <div className="grid-lines" />

        {/* LEFT */}
        <div className="left">
          <div className="platform-label"><span>Asset Management Platform</span></div>
          <div className="main-heading">
            <span className="asset">Asset</span>
            <span className="valet">Valet</span>
          </div>
          <p className="subtitle">Growth driven by Assets,<br />led by people.</p>

          <div className="devices">
            <div className="device-laptop">
              <div className="laptop-screen">
                <div className="laptop-screen-inner">
                  <div className="screen-bar short" />
                  <div className="screen-bar medium" />
                  <div className="screen-bar tiny" />
                  <div className="screen-grid">
                    <div className="screen-card" /><div className="screen-card" />
                    <div className="screen-card" /><div className="screen-card" />
                  </div>
                </div>
              </div>
              <div className="laptop-base" />
            </div>
            <div className="device-tablet">
              <div className="tablet-body">
                <div className="tablet-icon" />
                <div className="tablet-bar m" /><div className="tablet-bar s" />
                <div className="tablet-bar m" /><div className="tablet-bar s" />
              </div>
            </div>
            <div className="device-phone">
              <div className="phone-body">
                <div className="phone-notch" />
                <div className="phone-bar" /><div className="phone-bar s" />
                <div className="phone-bar" /><div className="phone-bar s" />
                <div className="phone-bar" />
              </div>
            </div>
          </div>

          <div className="stats">
            <div><div className="stat-value">99.9%</div><div className="stat-label">Uptime</div></div>
            <div><div className="stat-value">256-bit</div><div className="stat-label">Encrypted</div></div>
            <div><div className="stat-value">Real-time</div><div className="stat-label">Tracking</div></div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="right">
          <div className="card">
            <div className="card-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="7" height="7" rx="2" fill="#00f5b0"/>
                <rect x="14" y="3" width="7" height="7" rx="2" fill="#00f5b0" opacity="0.6"/>
                <rect x="3" y="14" width="7" height="7" rx="2" fill="#00f5b0" opacity="0.6"/>
                <rect x="14" y="14" width="7" height="7" rx="2" fill="#00f5b0" opacity="0.3"/>
              </svg>
            </div>
            <h1 className="card-title">Welcome Back</h1>
            <p className="card-sub">Sign in to Asset Valet</p>

            <form onSubmit={handleLogin}>
              <div className="field">
                <label className="field-label">Username</label>
                <input type="text" className="field-input" placeholder="Enter your username"
                  value={username} onChange={e => setUsername(e.target.value)} required autoFocus />
              </div>
              <div className="field">
                <label className="field-label">Password</label>
                <input type="password" className="field-input" placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              <div className="row-options">
                <label className="remember">
                  <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
                  <span>Remember me</span>
                </label>
                <a href="#" className="forgot">Forgot Password?</a>
              </div>
              {error && <div className="error-msg">⚠ {error}</div>}
              <button type="submit" className="btn-login" disabled={loading}>
                {loading ? "Signing in..." : "Login"}
              </button>
            </form>

            <div className="signup-row">
              Don&apos;t have an account? <Link href="/signup">Sign Up</Link>
            </div>

            {/* Demo credentials */}
            <div className="demo-box">
              <div className="demo-title">Demo Credentials</div>
              <div className="demo-grid">
                <button className="demo-btn" type="button"
                  onClick={() => { setUsername("admin"); setPassword("Admin@123"); }}>
                  <div className="demo-role">Admin</div>
                  <div className="demo-user">admin / Admin@123</div>
                </button>
                <button className="demo-btn" type="button"
                  onClick={() => { setUsername("sara.khan"); setPassword("Pass@123"); }}>
                  <div className="demo-role">Employee</div>
                  <div className="demo-user">sara.khan / Pass@123</div>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}