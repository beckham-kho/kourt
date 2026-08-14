"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function RegisterFormInline({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      const registerRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.get("name"),
            email: formData.get("email"),
            password: formData.get("password"),
            role: "customer",
          }),
        },
      );

      const registerResult = await registerRes.json();

      if (!registerRes.ok) {
        toast.error(registerResult.message || "Registrasi gagal");
        return;
      }

      const loginRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password"),
        }),
      });

      if (!loginRes.ok) {
        toast.error(
          "Registrasi berhasil, tapi gagal login otomatis. Coba login manual.",
        );
        return;
      }

      toast.success("Akun berhasil dibuat!");
      onSuccess();
    } catch {
      toast.error("Terjadi kesalahan, coba lagi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="register-name">Nama</FieldLabel>
          <Input
            id="register-name"
            name="name"
            placeholder="Nama lengkap"
            required
            disabled={loading}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="register-email">Email</FieldLabel>
          <Input
            id="register-email"
            name="email"
            type="email"
            placeholder="Masukkan email"
            required
            disabled={loading}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="register-password">Password</FieldLabel>
          <Input
            id="register-password"
            name="password"
            type="password"
            placeholder="Minimal 8 karakter"
            required
            minLength={8}
            disabled={loading}
          />
        </Field>
        <Field orientation="horizontal">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Mendaftar...
              </>
            ) : (
              "Daftar"
            )}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
