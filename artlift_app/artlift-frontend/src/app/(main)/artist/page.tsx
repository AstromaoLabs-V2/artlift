"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ArtistForm from "@/app/components/editForm/ArtistEdit";

export default function CreateArtistPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    setToken(storedToken);
  }, []);

  if (!token) return <p>Loading...</p>;

  return (
    <ArtistForm
      token={token}
      mode="create"
      onUpdated={(artist) => router.push(`/artists/${artist.id}`)}
    />
  );
}
