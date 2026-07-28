"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Cari Lapangan", href: "/courts" },
  { label: "Daftarkan Lapanganmu", href: "/renter" },
  { label: "Tentang Kami", href: "/about" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 10);
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "sticky top-0 left-0 z-50 w-full flex items-center justify-between px-5 py-3 bg-background transition-all duration-500 md:px-10 lg:px-20 ",
        scrolled
          ? "border-b shadow-xl"
          : "border-b border-transparent shadow-none",
      )}
    >
      <Link href="/" className="flex items-center shrink-0">
        <Image
          src="/logo/logo-text-orange.png"
          alt="Kourt"
          width={350}
          height={100}
          className="w-20"
        />
      </Link>

      <div className="hidden lg:flex items-center gap-2">
        <NavigationMenu>
          <NavigationMenuList>
            {navItems.map((item) => (
              <NavigationMenuItem key={item.href}>
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle()}
                  render={<Link href={item.href}>{item.label}</Link>}
                />
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <Button
          className="font-semibold"
          variant="ghost"
          render={<Link href="/login">Login</Link>}
        />
        <Button
          className="font-semibold"
          render={<Link href="/register">Daftar</Link>}
        />
      </div>

      <div className="lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            }
          />
          <SheetContent side="top">
            <div className="flex flex-col gap-6 m-4 font-semibold">
              <Link href="/">
                <Image
                  src="/logo/logo-text-orange.png"
                  alt="Kourt"
                  width={350}
                  height={100}
                  className="w-20 mb-5"
                />
              </Link>
              {navItems.map((item, index) => (
                <div key={index} className="flex flex-col gap-5">
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="text-sm text-foreground"
                  >
                    {item.label}
                  </Link>
                </div>
              ))}
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="text-sm"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className="text-sm"
              >
                Daftar
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
