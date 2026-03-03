//Create artwork page in dashboard

import { cookies } from "next/headers";
import CreateArtworkForm from "@/components/dashboard/createArtwork";

export default async function Page() {
  const cookieStore = await cookies();
  const session = cookieStore.get("access_token")?.value;

  if (!session){
     throw new Error("Not authenticated");
     return(
       <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Not Authenticated</h1>
        <p className="text-gray-600">Please login to create artwork.</p>
      </div>
     );
  }

  return(
    <CreateArtworkForm />
  )

}