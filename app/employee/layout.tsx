import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import EmployeeSidebar from "@/components/employee/EmployeeSidebar";

export default async function EmployeeLayout({ children }: { children: React.ReactNode }) {
  const s = await getSession();
  if (!s) redirect("/login");
  if (s.role === "admin") redirect("/dashboard");
  return (
    <div className="app">
      <EmployeeSidebar username={s.username} fullName={s.fullName} />
      <main className="content">{children}</main>
    </div>
  );
}
