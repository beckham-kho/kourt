"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginFormInline from "@/components/auth/login-form-inline";
import RegisterFormInline from "@/components/auth/register-form-inline";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function AuthDialog({
  open,
  onOpenChange,
  onSuccess,
}: AuthDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Masuk untuk melanjutkan</DialogTitle>
          <DialogDescription>
            Kamu perlu masuk atau daftar dulu sebelum melanjutkan booking.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="login">
          <TabsList className="w-full">
            <TabsTrigger value="login" className="flex-1">
              Masuk
            </TabsTrigger>
            <TabsTrigger value="register" className="flex-1">
              Daftar
            </TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="pt-4">
            <LoginFormInline onSuccess={onSuccess} />
          </TabsContent>
          <TabsContent value="register" className="pt-4">
            <RegisterFormInline onSuccess={onSuccess} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
