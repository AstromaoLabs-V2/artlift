import NotFound from "@/components/auth/not-found";
import { commentAPI } from "@/lib/comment/comment";
import { artworkAPI } from "@/lib/artwork/artwork";
import { constructMetadata } from "@/types/props";
import { Metadata } from "next";
import { getCurrentUser } from "@/lib/user/getCurrentUser";
import ArtworkDetailComponent from "@/components/artworks/ArtworkClient";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const { id } = await params;
  const artwork = await artworkAPI.get(Number(id));

  if (!artwork) {
    return constructMetadata({
      title: "Artwork Not Found | Artwork",
    });
  }

  return constructMetadata({
    title: `${artwork.title} | Artworks`,
    description: "Sign in to your account",
    canonical: "/signin",
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
    const { id } = await params;

  const artwork = await artworkAPI.get(Number(id));
if (!artwork) return <NotFound message="Artwork not found" />;

const comments = await commentAPI.get(Number(id));
const currentUser = await getCurrentUser();
const artist = artwork.artist;
const isOwnProfile = currentUser?.id && artist?.user ? currentUser.id === artist.user.id : false;

// this is for debugging -kai
// if (!isOwnProfile) {
//   console.log("debug: isOwnProfile is false");
//   console.log("currentUser:", currentUser);
//   console.log("artist:", artist);
//   console.log("artwork raw:", artwork);
// }

  return (
    <ArtworkDetailComponent artwork={artwork} initialComments={comments} isOwnProfile={isOwnProfile} currentUser={currentUser} />
  );
}
