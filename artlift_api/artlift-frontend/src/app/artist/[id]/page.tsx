"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Artist {
  first_name: string;
  last_name: string;
}

export default function ArtistPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const [artist, setArtist] = useState<Artist | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      router.push("/login");
      return; 
    }
    const fetchArtist = async () => {
      try {
        const res = await fetch(`http://localhost:8000/artist/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        if (!res.ok) {
          console.error("Failed to fetch artist", res.status);
          return;
        }
        const data = await res.json();
        setArtist(data);
      } catch (err) {
        console.error(err);
        router.push("/login");
      }
    };

    fetchArtist();
  }, [id, router]);

  if (!artist) return <p>Loading artist...</p>;

  return (
    <p className="text-2xl text-amber-200">
      {artist.first_name} {artist.last_name}
    </p>
  );
}
