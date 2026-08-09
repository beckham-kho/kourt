import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-server";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (user) {
    redirect(user.role === "renter" ? "/dashboard" : "/home");
  }

  return <>{children}</>;
}
