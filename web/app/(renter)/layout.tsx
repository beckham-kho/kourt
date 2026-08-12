import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-server";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import RenterSidebar from "@/components/layout/renter-sidebar";

export default async function RenterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "renter") {
    redirect("/home");
  }

  return (
    <SidebarProvider>
      <RenterSidebar name={user.name} />
      <main className="flex-1">
        <SidebarTrigger className="m-3 lg:hidden" />
        <div className="px-4 py-7 lg:px-7">{children}</div>
      </main>
    </SidebarProvider>
  );
}
