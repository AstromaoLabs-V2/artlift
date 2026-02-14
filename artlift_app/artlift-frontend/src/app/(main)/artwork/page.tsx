//This is originally create artwork page. However, I think I did not make this one properly. So, help this
import Navigation from "@/app/components/nav/navigation";
import CreateArtworkForm from "@/components/artworks/CreateArtwork";

export default function Page({ searchParams }) {
  const artistId = searchParams.artistId ?? ""; // server で受け取る

  return (
    <>
      <Navigation />
      <CreateArtworkForm artistId={artistId} />
    </>
  );
}
