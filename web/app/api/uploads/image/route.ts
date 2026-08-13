import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return NextResponse.json(
      { success: false, message: "Belum login" },
      { status: 401 },
    );
  }

  const formData = await request.formData();

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/uploads/image`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  const result = await res.json();
  return NextResponse.json(result, { status: res.status });
}
