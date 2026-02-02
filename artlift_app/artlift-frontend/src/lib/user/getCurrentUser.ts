import { cookies } from "next/headers";

export const getCurrentUser = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/current_user`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (res.status === 401) {
      throw new Error("UNAUTHORIZED");
    }
    if (!res.ok) {
      console.error("Failed to fetch artist", res.status);
      return;
    }
    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
};
