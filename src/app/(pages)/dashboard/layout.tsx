import { ReactNode } from "react";

import DashboardLayout from "../../components/pages/Dashboard/Layout";
import { getSession } from "@/src/lib/auth/next-auth";
import { getDashboardNavigation } from "@/src/lib/dashboard/nav-links";

export default async function DashLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSession();
  const permissions = session?.user?.permissions!;

  const navLinks = getDashboardNavigation(permissions);
  return <DashboardLayout navLinks={navLinks}>{children}</DashboardLayout>;
}
