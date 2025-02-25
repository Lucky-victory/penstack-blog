export const metadata: Metadata = {};
import SignIn from "@/src/app/components/Auth/SignIn";
import { getSession } from "@/src/lib/auth/next-auth";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getSession();
  if (session) {
    redirect("/");
  }
  return <SignIn />;
}
