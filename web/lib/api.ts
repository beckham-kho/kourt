const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Terjadi kesalahan");
  }

  return json;
}
