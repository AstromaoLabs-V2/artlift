'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import ArtworkThumbnail from "@/app/components/features/ArtworkThumbnail"
import FollowSubscribe from "@/app/components/features/FollowSubscribe"
import FavoriteArtwork from "@/app/components/features/FavoriteArtwork"
import ArtistAbout from "@/app/components/features/ArtistAbout"
import MyArtworks from "@/app/components/features/MyArtworks"

export default function ArtistClient({ artistId }: { artistId: string }) {
  const router = useRouter()
  const [artist, setArtist] = useState<any>(null)

  useEffect(() => {
    const token = localStorage.getItem("access_token")

    if (!token) {
      router.push("/login")
      return
    }

    fetch(`http://localhost:8000/api/artists/${artistId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then(res => {
        if (!res.ok) throw new Error("Unauthorized")
        return res.json()
      })
      .then(data => setArtist(data))
      .catch(() => router.push("/login"))
  }, [artistId])

  if (!artist) return <p>Loading...</p>

  return (
    <>
      <div className="relative w-full h-[350px]">
        <ArtworkThumbnail artworkThumbnail={artist.artistThumbnail} />
      </div>

      <div className="artist-icons-container flex items-center mt-4">
        <FollowSubscribe
          artistIcon={artist.artistIcon}
          artistName={artist.artistName}
        />
      </div>

      <div className="favorite-about-section mt-4">
        <FavoriteArtwork artworks={artist.popularArtworks} />
        <h2>About</h2>
        <ArtistAbout
          aboutPicture={artist.aboutPicture}
          aboutText={artist.aboutText}
        />
      </div>

      <div className="my-artworks-section mt-8">
        <h2>My Artworks</h2>
        <MyArtworks artworks={artist.popularArtworks} />
      </div>
    </>
  )
}
