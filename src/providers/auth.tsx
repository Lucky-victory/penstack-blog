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
  const setisLoading = usePermissionsStore((state) => state.setIsLoading);

  useEffect(() => {
    setisLoading(true);
    setPermissions(session?.user?.permissions || []);
    setisLoading(false);
  }, [session?.user?.permissions, setPermissions, setisLoading]);
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
