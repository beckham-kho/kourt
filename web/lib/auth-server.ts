import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

export interface TokenPayload {
  user_id: string;
  role: string;
  jti: string;
  exp: number;
}

export interface CurrentUser extends TokenPayload {
  name: string;
  email: string;
  avatar_url: string;
  is_verified: boolean;
  is_active: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export async function getAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  return token ?? null;
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return null;
  }

  let decoded: TokenPayload;
  try {
    decoded = jwtDecode<TokenPayload>(token);
  } catch {
    return null;
  }

  if (decoded.exp * 1000 < Date.now()) {
    return null;
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) {
    return null;
  }

  const result: ApiResponse<{
    name: string;
    email: string;
    avatar_url: string;
    is_verified: boolean;
    is_active: boolean;
  }> = await res.json();

  return { ...decoded, ...result.data };
}