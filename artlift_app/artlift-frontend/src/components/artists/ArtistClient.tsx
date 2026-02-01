"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { deleteArtist } from "@/app/lib/Artists/[id]/deleteArtists";
import Navigation from "@/app/components/nav/navigation";
import FollowSubscribe from "@/app/components/features/FollowSubscribe";
import DeleteButton from "@/app/components/DeleteButton";

import { Artist } from "@/types/props";

type ArtistClientProps = {
  artist: Artist;
  id: string;
};

export default function ArtistClient(props:ArtistClientProps) {
  const router = useRouter();
  const [artist, setArtist] = useState<Artist>(props.artist);
  //const [token, setToken] = useState<string | null>(null);

  //useEffect(() => {
    //const storedToken = localStorage.getItem("access_token");
   // if (!storedToken) {
    //  router.push("/auth/login");
    //  return;
   // }
  //  setToken(storedToken);
  //}, [router]);

  const handleDeleteArtist = async () => {
    if (!artist) return;
    /*
    try {
      await deleteArtist(artist.id, token);
      router.push("/artists");
    } catch (err) {
      console.error(err);
      alert("Failed to delete artist.");

    }
      */
  };

  return (
    <>
      <Navigation />

      {artist.bg && <img className="w-full" src={artist.bg} alt="Artist BG" />}

      <FollowSubscribe
        artistIcon={artist.img}
        artistName={artist.first_name}
      />

      <h2>About</h2>
      <p>{artist.about}</p>

      {/*token &&*/ <DeleteButton onDelete={handleDeleteArtist} />}
    </>
  );
}
