export const deleteArtwork = async (id: number, token: string) => {
  try {
    const res = await fetch(`http://localhost:8000/artwork/${id}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (res.status === 401) {
      throw new Error("UNAUTHORIZED");
    }
    if (!res.ok) {
      throw new Error(`Failed to delete artwork: ${res.status}`);
    }
    return;
  } catch (error) {
    throw error;
  }
};
