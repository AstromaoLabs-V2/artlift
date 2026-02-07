// dashboard/artwork/edit/page.tsx
import { artworkAPI } from "@/lib/artwork/artwork";
import { cookies } from "next/headers";
import EditArtworkForm from "@/components/artworks/EditArtworkClient";

//It is really depends on how you make a file structure. Need consultant - Soki
type PageProps = {
  searchParams: {
    id?: string;
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
    return <div>Please login to edit artwork.</div>;
  }

  const artwork = await artworkAPI.get(id);
  return (
    <EditArtworkForm
      artwork={artwork}
    />
  );
}
