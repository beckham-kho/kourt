import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

interface TokenPayload {
  exp: number;
}

const REFRESH_THRESHOLD_SECONDS = 120;

export async function proxy(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  if (!accessToken || !refreshToken) {
    return NextResponse.next();
  }

  let shouldRefresh = false;

  try {
    const decoded = jwtDecode<TokenPayload>(accessToken);
    const secondsLeft = decoded.exp - Math.floor(Date.now() / 1000);
    shouldRefresh = secondsLeft < REFRESH_THRESHOLD_SECONDS;
  } catch {
    shouldRefresh = true;
  }

  if (!shouldRefresh) {
    return NextResponse.next();
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!res.ok) {
      const response = NextResponse.next();
      response.cookies.delete("access_token");
      response.cookies.delete("refresh_token");
      return response;
    }

    const result = await res.json();
    const response = NextResponse.next();

    response.cookies.set("access_token", result.data.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 15,
    });
    response.cookies.set("refresh_token", result.data.refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
};
