"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, Users, GitBranch, FileText, ShieldCheck, LogOut, ChevronRight } from "lucide-react";

const NAV = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/assets", icon: Package, label: "Assets" },
  { href: "/dashboard/employees", icon: Users, label: "Employees" },
  { href: "/dashboard/assignments", icon: GitBranch, label: "Assignments" },
  { href: "/dashboard/reports", icon: FileText, label: "Reports" },
];

export default function AdminSidebar({ username, fullName }: { username: string; fullName: string }) {
  const path = usePathname();
  const router = useRouter();
  const initials = fullName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sb-logo">
        <div className="row">
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,#091e10,#0f3820)", border: "1px solid var(--bd2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <ShieldCheck size={17} style={{ color: "var(--accent)" }} />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 900, color: "var(--text)", letterSpacing: "-.03em" }}>
              Asset<span style={{ color: "var(--accent)" }}>Valet</span>
            </div>
            <div style={{ fontSize: 10, color: "var(--text3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".09em" }}>Admin Panel</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="sb-nav">
        <div className="sb-section">Navigation</div>
        {NAV.map(({ href, icon: Icon, label }) => {
          const on = href === "/dashboard" ? path === href : path.startsWith(href);
          return (
            <Link key={href} href={href} className={`nav-link ${on ? "on" : ""}`}>
              <Icon size={15} />
              <span style={{ flex: 1 }}>{label}</span>
              {on && <ChevronRight size={13} />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="sb-foot">
        <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 10px", borderRadius: 9, background: "var(--bg)", border: "1px solid var(--bd)", marginBottom: 6 }}>
          <div className="avatar" style={{ background: "linear-gradient(135deg,#0d3320,#1a5c30)", borderColor: "var(--bd2)", color: "var(--accent)", fontSize: 12, width: 32, height: 32 }}>{initials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{fullName}</div>
            <div style={{ fontSize: 10.5, color: "var(--text3)" }}>@{username}</div>
          </div>
        </div>
        <button onClick={logout} className="nav-link" style={{ width: "100%", color: "var(--red2)", border: "none", background: "none" }}>
          <LogOut size={14} style={{ color: "var(--red2)" }} /><span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
