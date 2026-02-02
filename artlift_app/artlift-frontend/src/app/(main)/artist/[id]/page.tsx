
import ArtistProfileComponent from "@/components/artist/profile";
import NotFound from "@/components/auth/not-found";
import { artistAPI } from "@/lib/artist/artist";
import { getCurrentUser } from "@/lib/user/getCurrentUser";
import { constructMetadata } from "@/types/props";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const { id } = await params; //needs to be unwrapped in docs -kai
  const artist = await artistAPI.get(id);
  if (!artist) {
    return constructMetadata({
      title: "Artist Not Found | Artlift",
    });
  }

  return constructMetadata({
    title: `${artist.first_name} ${artist.last_name} | Artlift`, //idea like facebook -kai
    description: "Sign in to your account",
    canonical: "/signin",
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; //needs to be unwrapped in docs -kai
  const [artist, currentUser] = await Promise.all([
    artistAPI.get(id),
    getCurrentUser(),
  ]);
  if (!artist) {
    return <NotFound message="Artist not found" />;
  }
  const isOwnProfile = currentUser?.id === artist.user_id;
  // return <ArtistClient artist={artist} id={id} />;
  return (
    <ArtistProfileComponent
      artist={artist}
      id={id}
      isOwnProfile={isOwnProfile}
    />
  );
}
