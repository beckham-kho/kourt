"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Building2,
  CalendarCheck,
  Star,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

const menuItems = [
  { label: "Ringkasan", href: "/dashboard", icon: LayoutDashboard },
  { label: "Lapangan Saya", href: "/dashboard/courts", icon: Building2 },
  { label: "Booking Masuk", href: "/dashboard/bookings", icon: CalendarCheck },
  { label: "Ulasan", href: "/dashboard/reviews", icon: Star },
  { label: "Laporan", href: "/dashboard/reports", icon: BarChart3 },
];

interface RenterSidebarProps {
  name: string;
}

export default function RenterSidebar({ name }: RenterSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <Sidebar>
      <SidebarHeader className="mb-2 px-4 py-3">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image
            src="/logo/logo-text-orange.png"
            alt="Kourt"
            width={350}
            height={100}
            className="w-20"
          />
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={isActive}
                      render={
                        <Link href={item.href}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </Link>
                      }
                    />
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-4 py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              render={
                <Link href="/dashboard/settings">
                  <Settings className="h-4 w-4" />
                  <span>Pengaturan</span>
                </Link>
              }
            />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              <span>Keluar</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <p className="text-xs text-muted-foreground px-2 mt-2">{name}</p>
      </SidebarFooter>
    </Sidebar>
  );
}
