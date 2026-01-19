"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {getArtist} from "@/app/lib/Artists/[id]/getArtists";
import Navigation from "@/app/components/nav/navigation";
import FollowSubscribe from "@/app/components/features/FollowSubscribe";
import ArtistEdit from "@/app/components/editForm/ArtistEdit";
import { Artist } from "@/app/types/props";


export default function ArtistPage({
  params,
}: {
  params: { id: string };

}) {
  const { id } = params;
  const [artist, setArtist] = useState<Artist | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      router.push("/login");
      return; 
    }

    getArtist(id,token).then((data)=>{
      setArtist(data);
    })
    .catch((err)=>{
      if (err.message === "UNAUTHORIZED") {
        router.push("/login");
      } else {
        console.error(err);
      }
    });
  }, [id, router]);

  if (!artist) return <p>Loading artist...</p>;

  return (
    <>
    <Navigation />
     <img className="w-full"src={artist.bg} />
    <FollowSubscribe
  artistIcon={artist.img}
  artistName={artist.first_name}/>

  <h2>Popular Artworks</h2>
  {/*This component is coming from artrok section. It is related to users ID*/}

  <h2>About</h2>
  <p>{artist.about}</p>

  {token &&(
        <ArtistEdit artist={artist} token={token} onUpdated={setArtist} />

      )}


    </>
   

  );
}
