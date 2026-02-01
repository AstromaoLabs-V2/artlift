import { cookies } from "next/headers";
import { getArtist} from "@/lib/Artists/[id]/artist-artwork";
import ArtistClient from "@/components/artists/ArtistClient";
import { constructMetadata } from "@/types/props";

//export async function generateMetadata({ params }) {
  //return constructMetadata({
   // title: "Artist",
  //  description: "Artist page",
   // canonical: `/artist/${params.id}`,
 // });
//}

export default async function ArtistPage({params,}:{params:{id:string}}){
  const {id} = await params;
  const cookieStore = await cookies();

  const token = cookieStore.get("access_token")?.value || "";
  const artist = await getArtist(id, token);

    return <ArtistClient artist={artist} id={id} />;

}
