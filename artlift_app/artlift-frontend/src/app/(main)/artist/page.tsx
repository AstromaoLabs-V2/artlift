import CreateArtistPageWrapper from "@/components/artists/CreateArtistWrapper";
import {cookies} from "next/headers";
export default async function CreateArtistPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value || "";
  return (
    <CreateArtistPageWrapper api_token={token} />
  );
}
