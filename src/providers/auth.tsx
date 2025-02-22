"use client";

import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { usePermissionsStore } from "../state/permissions";
import { useEffect } from "react";

export default function Providers({
  session,
  children,
}: {
  session: Session | null;
  children: React.ReactNode;
}) {
  const setPermissions = usePermissionsStore((state) => state.setPermissions);

  useEffect(() => {
    setPermissions(session?.user?.permissions || []);
  }, [session?.user?.permissions, setPermissions]);
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
