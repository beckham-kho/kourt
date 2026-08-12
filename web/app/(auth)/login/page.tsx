"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { loginSchema } from "@/lib/validations/auth-schema";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    e: React.SyntheticEvent<HTMLFormElement, SubmitEvent>,
  ) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const rawData = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const validated = loginSchema.safeParse(rawData);

    if (!validated.success) {
      toast.error(validated.error.issues[0].message, { position: "top-right" });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated.data),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message, {
          position: "top-right",
        });
        return;
      }

      toast.success("Login berhasil!", { position: "top-right" });
      router.push("/dashboard");
    } catch (err) {
      toast.error("Terjadi kesalahan, coba lagi", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-2 h-screen w-full justify-center items-center">
      <div className="h-full w-full flex flex-col gap-10 p-20 justify-center items-start">
        <div className="flex flex-col gap-2">
          <h1 className="text-bold text-5xl font-bold">Welcome Back!</h1>
          <p className="pb-3 text-muted-foreground">
            Enter your email and password to continue
          </p>
        </div>
        <form onSubmit={handleSubmit} className="w-full">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                name="email"
                placeholder="Enter your email"
                disabled={loading}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                disabled={loading}
              />
            </Field>
            <Field orientation="horizontal">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </Field>
          </FieldGroup>
        </form>
        <p className="pb-3 text-muted-foreground">
          Don't have an account?{" "}
          <Link className="underline" href="/register">
            Register here
          </Link>
        </p>
      </div>
      <div className="bg-primary h-full w-full">[images]</div>
    </div>
  );
}
