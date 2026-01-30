"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams} from "next/navigation";
import { getArtist } from "@/app/lib/Artists/[id]/getArtists";
import { deleteArtist } from "@/app/lib/Artists/[id]/deleteArtists";
import Navigation from "@/app/components/nav/navigation";
import FollowSubscribe from "@/app/components/features/FollowSubscribe";
import ArtistForm from "@/app/components/editForm/ArtistEdit";
import DeleteButton from "@/app/components/DeleteButton";
import { Artist } from "@/types/props";

export default function ArtistPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [artist, setArtist] = useState<Artist | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    if (!storedToken) {
      router.push("/auth/login");
      return;
    }
    setToken(storedToken);

    const fetchArtist = async () => {
      try {
        const data = await getArtist(id, storedToken);
        setArtist(data);
      } catch (err: any) {
        if (err.message === "UNAUTHORIZED") {
          router.push("/auth/login");
        } else if (err.message.includes("404")) {
          console.error("Artist not found");
        } else {
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchArtist();
  }, [id, router]);

  

  const handleDeleteArtist = async () => {
    if (!artist || !token) return;
    try {
      await deleteArtist(artist.id, token);
      router.push("/artists");
    } catch (err) {
      console.error(err);
      alert("Failed to delete artist.");
    }
  };
  

  if (loading) return <p>Loading artist...</p>;
  if (!artist) return <p>Artist not found.</p>;

  return (
    <>
      <Navigation />
      {artist.bg && <img className="w-full" src={artist.bg} alt="Artist BG" />}
      <FollowSubscribe artistIcon={artist.img} artistName={artist.first_name} />

      <h2>Popular Artworks</h2>

      <h2>About</h2>
      <p>{artist.about}</p>

      {token && (
        <ArtistForm artist={artist} token={token} mode="edit" onUpdated={setArtist} />
      )}

      {token && <DeleteButton onDelete={handleDeleteArtist} />}
    </>
  );
}
