"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteArtist } from "@/app/lib/Artists/[id]/deleteArtists";
import FollowSubscribe from "@/app/components/features/FollowSubscribe";
import ArtistForm from "@/app/components/editForm/ArtistEdit";
import DeleteButton from "@/components/ui/DeleteButton";

import { Artist } from "@/types/props";

type ArtistClientProps = {
  artist: Artist;
  id: string;
};

export default function ArtistClient({
  artist: Artist,
  id,
}: ArtistClientProps) {
  const router = useRouter();
  const [artist, setArtist] = useState<Artist>(Artist);
  // const [token, setToken] = useState<string | null>(null); //this are not needed

  // useEffect(() => { //not needed
  //   const storedToken = localStorage.getItem("access_token");
  //   if (!storedToken) {
  //     router.push("/auth/login");
  //     return;
  //   }
  //   setToken(storedToken);
  // }, [router]);

  const handleDeleteArtist = async () => {
    try {
      await deleteArtist(artist.id);
      router.push("/artists");
    } catch (err) {
      console.error(err);
      alert("Failed to delete artist.");
    }
  };

  return (
    <>
      {artist.bg && (
        <img
          className="w-full object-cover"
          src={artist.bg}
          alt="Artist background"
        />
      )}

      <FollowSubscribe artistIcon={artist.img} artistName={artist.first_name} />

      <h2>About</h2>
      <p>{artist.about}</p>

      <ArtistForm artist={artist} mode="edit" onUpdated={setArtist} />

      <DeleteButton onDelete={handleDeleteArtist} />
    </>
  );
}
