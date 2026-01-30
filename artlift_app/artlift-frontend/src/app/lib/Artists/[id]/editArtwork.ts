import { Artwork } from "@/app/types/props";

export const editArtwork = async (
  id: number,
  token: string,
  body: Partial<Artwork>
) => {
  try {
    const res = await fetch(`http://localhost:8000/artwork/${id}/`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (res.status === 401) {
      throw new Error("UNAUTHORIZED");
    }
    if (res.status === 403) {
      throw new Error("FORBIDDEN");
    }
    if (!res.ok) {
      throw new Error(`Failed to update artwork: ${res.status}`);
    }
    const data: Artwork = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
};
