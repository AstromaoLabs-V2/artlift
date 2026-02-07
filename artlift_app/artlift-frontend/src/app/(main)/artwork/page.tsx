import Navigation from "@/app/components/nav/navigation";
import CreateArtworkForm from "@/components/artworks/CreateArtworkForm";

export default function Page({ searchParams }) {
  const artistId = searchParams.artistId ?? ""; // server で受け取る

  return (
    <>
      <Navigation />
      <CreateArtworkForm artistId={artistId} />
    </>
  );
}
