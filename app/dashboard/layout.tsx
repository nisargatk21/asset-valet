import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const s = await getSession();
  if (!s) redirect("/login");
  if (s.role !== "admin") redirect("/employee");
  return (
    <div className="app">
      <AdminSidebar username={s.username} fullName={s.fullName} />
      <main className="content">{children}</main>
    </div>
  );
}
