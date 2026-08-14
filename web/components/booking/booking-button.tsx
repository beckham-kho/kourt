"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthDialog from "@/components/auth/auth-dialog";

interface BookingButtonProps {
  courtId: string;
  isLoggedIn: boolean;
  className?: string;
  variant?: "default" | "outline";
  children: React.ReactNode;
}

export default function BookingButton({
  courtId,
  isLoggedIn,
  className,
  variant = "default",
  children,
}: BookingButtonProps) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);

  function handleClick() {
    if (isLoggedIn) {
      router.push(`/courts/${courtId}/book`);
      return;
    }
    setDialogOpen(true);
  }

  function handleAuthSuccess() {
    setDialogOpen(false);
    router.push(`/courts/${courtId}/book`);
    router.refresh();
  }

  return (
    <>
      <Button className={className} variant={variant} onClick={handleClick}>
        {children}
      </Button>
      <AuthDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
}
