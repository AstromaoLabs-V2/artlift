import { Artist } from "@/types/props";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const getArtist = async (id: number, api_token: string) => {
  const res = await fetch(`${BASE_URL}/artist/${id}/`, {
    headers: {
      Authorization: `Bearer ${api_token}`,
      "Content-Type": "application/json",
    },
  });
  console.log("status:", res.status);
  const text = await res.text();
  console.log("response body:", text);

  if (res.status === 401) throw new Error("UNAUTHORIZED");
  if (!res.ok) throw new Error(`Failed to fetch artist: ${res.status}`);

  return res.json();
};

export const editArtist = async (
  id: number,
  api_token: string,
  body: Partial<Artist>,
) => {
  const res = await fetch(`${BASE_URL}/artist/${id}/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${api_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (res.status === 401) throw new Error("UNAUTHORIZED");
  if (!res.ok) throw new Error(`Failed to update artist: ${res.status}`);

  return res.json();
};

export const deleteArtist = async (id: number, api_token: string) => {
  const res = await fetch(`${BASE_URL}/artist/${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${api_token}`,
      "Content-Type": "application/json",
    },
  });

  if (res.status === 401) throw new Error("UNAUTHORIZED");
  if (!res.ok) throw new Error(`Failed to delete artist: ${res.status}`);
};

//artworks

export const getArtwork = async (id: string, api_token?: string) => {
  try {
    const res = await fetch(`http://localhost:8000/artwork/${id}/`, {
      headers: {
        Authorization: `Bearer ${api_token}`,
        "Content-Type": "application/json",
      },
    });

    if (res.status === 401) {
      throw new Error("UNAUTHORIZED");
    }
    if (!res.ok) {
      console.error("Failed to fetch artwork", res.status);
      return;
    }
    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
};
