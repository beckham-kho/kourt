import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const result = await res.json();

  if (!res.ok) {
    return NextResponse.json(result, { status: res.status });
  }

  const cookieStore = await cookies();
  cookieStore.set("access_token", result.data.tokens.access_token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 60 * 15,
  });
  cookieStore.set("refresh_token", result.data.tokens.refresh_token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7,
  });

  return NextResponse.json(result);
}
