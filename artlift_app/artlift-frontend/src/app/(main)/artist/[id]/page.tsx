
import { getArtist } from "@/lib/Artists/[id]/getArtists";
import ArtistClient from "@/components/artists/ArtistClient";
import { constructMetadata } from "@/types/props";



export async function generateMetadata({ params }) {
  return constructMetadata({
    title: "Artist",
    description: "Artist page",
    canonical: `/artist/${params.id}`,
  });
}

export default async function Page({ params }) {
  const artist = await getArtist(params.id); // ← server fetchapp

  return <ArtistClient artist={artist} id={params.id}  />;   // ← client component
}