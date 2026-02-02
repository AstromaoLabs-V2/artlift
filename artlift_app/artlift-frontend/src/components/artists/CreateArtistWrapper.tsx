"use client";

import { useRouter } from "next/navigation";
import { Artist } from "@/types/props";
import ArtistForm from "@/components/artists/ArtistEdit";

type Props = {
  api_token: string;
};

export default function CreateArtistPageWrapper({ api_token }: Props) {
  const router = useRouter();

  const handleUpdated = (updated: Artist) => {
    router.push(`/artists/${updated.id}`);
  };

  return (
    <ArtistForm
      api_token={api_token}
      mode="edit"
      onUpdated={handleUpdated}
    />
  );
}