import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return NextResponse.json(
      { success: false, message: "Belum login" },
      { status: 401 },
    );
  }

  const body = await request.json();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/courts/${id}/active`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    },
  );

  const result = await res.json();
  return NextResponse.json(result, { status: res.status });
}
