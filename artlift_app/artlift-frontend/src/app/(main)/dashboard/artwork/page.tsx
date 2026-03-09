import { cookies } from "next/headers";
import ArtworkListComponent from "@/components/dashboard/artworkList";

export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) throw new Error("Not authenticated");

  // Fetch current artist
  const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}artist/me/`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!userRes.ok) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Artist Profile Not Found</h1>
        <p className="text-gray-600">You haven't created an artist profile yet.</p>
      </div>
    );
  }

  const currentArtist = await userRes.json();

  // Fetch artworks (filtered by backend ideally)
  const artworkRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}artworks/`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!artworkRes.ok) throw new Error("Failed to fetch artworks");

  const artworks: any[] = await artworkRes.json();

  // If backend already filters by user, you don't need this
  // Otherwise, frontend filtering:
  const myArtworks = artworks.filter(
    (artwork) => artwork.artist?.id === currentArtist.id
  );

  return <ArtworkListComponent artworks={myArtworks} />;
}