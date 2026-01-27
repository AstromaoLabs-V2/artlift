import EditProfileComponent from "@/components/dashboard/editProfile";
import { cookies } from "next/headers";

export default async function Page() {
  const cookieStore = await cookies();
  const session = cookieStore.get("access_token")?.value;

  if (!session) throw new Error("Not authenticated");

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/artist/me/`, {
    headers: { Authorization: `Bearer ${session}` },
    cache: "no-store",
  });

  if (!res.ok) {
    if (res.status === 404) {
      return (
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Artist Profile Not Found</h1>
          <p className="text-gray-600">
            You haven't created an artist profile yet. Please create one first.
          </p>
        </div>
      );
    }
    throw new Error("Failed to fetch artist profile");
  }

  const artist = await res.json();

  return <EditProfileComponent initialData={artist} />;
}