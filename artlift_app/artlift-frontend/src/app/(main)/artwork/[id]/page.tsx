
import ArtistClient from "@/components/artist/profile";
import ArtworkDetailPage from "@/components/artworks/ArtworkClient";
import NotFound from "@/components/auth/not-found";
import { commentAPI } from "@/lib/comment/comment";
import{artworkAPI} from "@/lib/artwork/artwork";
import { getCurrentUser } from "@/lib/user/getCurrentUser";
import { constructMetadata } from "@/types/props";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const { id } = await params; //needs to be unwrapped in docs -kai
  const artwork = await artworkAPI.get(Number(id));
  console.log(artworkAPI.get(id))
  console.log("get id",id);

  if (!artwork) {
    return constructMetadata({
      title: "Artwork Not Found | Artwork",
    });
  }

  return constructMetadata({
    title: `${artwork.title} | Artworks`, //idea like facebook -kai
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
const artwork = await artworkAPI.get(Number(id));
//get comment
const comments = await commentAPI.get(Number(id));

  if (!artwork) {
    return <NotFound message="Artwork not found" />;
  }
  //const isOwnProfile = currentUser?.id === artist.user_id;
  // return <ArtistClient artist={artist} id={id} />;
  return (
    <ArtworkDetailPage
      artwork={artwork}
      id={id}
      comments={comments}
    //  isOwnProfile={isOwnProfile}
    />
  );
}

