import { apiFetch } from "./api";

interface LoginInput {
  email: string;
  password: string;
}

interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: "customer" | "provider";
}

export async function loginUser(input: LoginInput) {
  return apiFetch<{ user: User; tokens: AuthTokens }>("/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
  role: "customer" | "provider";
}) {
  return apiFetch<User>("/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
