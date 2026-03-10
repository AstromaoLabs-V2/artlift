import ProfileComponent from "@/components/dashboard/profile";
import { cookies } from "next/headers";

export default async function Page() {
  const cookieStore = await cookies();
  const session = cookieStore.get("access_token")?.value;

  if (!session) throw new Error("Not authenticated");

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}artist/me/`, {
    headers: { Authorization: `Bearer ${session}` },
    cache: "no-store",
  });

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

  const artist = await res.json();

  const artworkRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}short-artwork-details/`, {
    headers: { Authorization: `Bearer ${session}` },
    cache: "no-store",
  });

 if (!artworkRes.ok) {
    throw new Error("Failed to fetch artworks");
  }

  const artworksData = await artworkRes.json();
  const artworks = Array.isArray(artworksData)
    ? artworksData
    : artworksData?.results ?? [];

  console.log(artworks)

  return <ProfileComponent artist={artist} artworks={artworks} />;
}