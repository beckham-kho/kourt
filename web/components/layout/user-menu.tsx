"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User, Settings } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface UserMenuProps {
  name: string;
  avatarUrl?: string;
}

export default function UserMenu({ name, avatarUrl }: UserMenuProps) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button className="rounded-full">
            <Avatar>
              <AvatarImage src={avatarUrl} />
              <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          </button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          render={
            <Link href="/profile">
              <User className="mr-2 h-4 w-4" />
              Profil
            </Link>
          }
        />
        <DropdownMenuItem
          render={
            <Link href="/settings">
              <Settings className="mr-2 h-4 w-4" />
              Pengaturan
            </Link>
          }
        />
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Keluar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
