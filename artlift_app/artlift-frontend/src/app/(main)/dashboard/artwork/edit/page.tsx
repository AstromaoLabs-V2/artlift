// dashboard/artwork/edit/page.tsx
import { artworkAPI } from "@/lib/artwork/artwork";
import ArtworkForm from "@/components/artworks/CreateArtwork";
import { cookies } from "next/headers";

//It is really depends on how you make a file structure. Need consultant - Soki
type PageProps = {
  searchParams: {
    id?: string;
    [key: string]: string | undefined;
  };
};
export default async function EditPage({ searchParams }: PageProps) {
  const id = searchParams.id;
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!id) {
    return <div>Artwork ID is missing.</div>;
  }

  if (!token) {
    return <div>Please log in to edit artwork.</div>;
  }

  const artwork = await artworkAPI.get(id);
  return (
    <ArtworkForm
      artwork={artwork}
      mode="edit"
      artworkId={id}
      artistId={artwork.artist.id}
      onUpdated={() => {}}
    />
  );
}
