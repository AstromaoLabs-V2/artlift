import { Artwork } from "@/app/types/props";

export const createArtwork = async (
  token: string,
  file: File,
  body: Partial<Artwork>
) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", body.title || "");
    formData.append("size", body.size || "");
    formData.append("description", body.description || "");

    const res = await fetch(`http://localhost:8000/artworks/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    if (res.status === 401) {
      throw new Error("UNAUTHORIZED");
    }
    if (!res.ok) {
      throw new Error(`Failed to create artwork: ${res.status}`);
    }
    const data: Artwork = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
};
