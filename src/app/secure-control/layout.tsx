import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { roleAtLeast } from "@/lib/constants";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function SecureControlLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!roleAtLeast(user.role, "admin")) redirect("/dashboard");

  return <AdminShell user={user}>{children}</AdminShell>;
}
