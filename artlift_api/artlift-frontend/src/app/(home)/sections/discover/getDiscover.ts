export const getDiscover = async () => {
  try {
    const res = await fetch("http://127.0.0.1:8000/discover/", {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await res.json();
    return data; 
  } catch (error) {
    console.error("Discover fetch failed:", error);
    return {
      artists: [],
      artworks: [],
    };
  }
};
