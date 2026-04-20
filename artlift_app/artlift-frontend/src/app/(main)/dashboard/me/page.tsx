import ProfileComponent from "@/components/dashboard/profile";
import { cookies } from "next/headers";

export default async function Page() {
  const cookieStore = await cookies();
  const session = cookieStore.get("access_token")?.value;

  if (!session) throw new Error("Not authenticated");

  const [res, artworkRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_API_URL}artist/me/`, {
      headers: { Authorization: `Bearer ${session}` },
      next: { revalidate: 30 },
    }),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}short-artwork-details/`, {
      headers: { Authorization: `Bearer ${session}` },
      next: { revalidate: 30 },
    }),
  ]);

  if (!res.ok) {
    if (res.status === 404) {
      return (
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">No Artist Profile</h1>
          <p className="text-gray-600">
            You have not created an artist profile yet.
          </p>
        </div>
      );
    }
    throw new Error("Failed to fetch artist profile");
  }

  if (!artworkRes.ok) {
    throw new Error("Failed to fetch artworks");
  }

  const [artist, artworksData] = await Promise.all([res.json(), artworkRes.json()]);
  const artworks = Array.isArray(artworksData)
    ? artworksData
    : artworksData?.results ?? [];

  return <ProfileComponent artist={artist} artworks={artworks} />;
}