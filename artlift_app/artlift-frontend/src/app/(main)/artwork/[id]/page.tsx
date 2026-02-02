import { cookies } from "next/headers";
import {getArtwork} from "@/lib/Artists/[id]/artist-artwork";
import ArtworkDetailPage from "@/components/artworks/ArtworkClient";
import { constructMetadata } from "@/types/props";

//export async function generateMetadata({ params }) {
  //return constructMetadata({
   // title: "Artist",
  //  description: "Artist page",
   // canonical: `/artist/${params.id}`,
 // });
//}

export default async function ArtworkPage({params,}:{params:{id:string}}){
  const {id} = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value || "";
  const username = cookieStore.get("username")?.value || "";  

 console.log("id:", id);
  console.log("token:", token ? "あり" : "なし");
  const artwork = await getArtwork(id, token);
  console.log("artwork response:", artwork);

    return <ArtworkDetailPage artwork={artwork} artist={artwork.artist} id={id} token={token}  />;

}






