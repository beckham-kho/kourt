import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .pipe(z.email("Format email tidak valid")),
  password: z.string().min(1, "Password wajib diisi"),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .pipe(z.email("Format email tidak valid")),
  password: z
    .string()
    .min(8, "Password minimal 8 karakter")
    .regex(/[A-Z]/, "Password harus mengandung huruf besar")
    .regex(/[0-9]/, "Password harus mengandung angka"),
  role: z.enum(["customer", "provider"], {
    message: "Role harus 'customer' atau 'provider'",
  }),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
