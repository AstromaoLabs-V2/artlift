import { Artwork } from "@/app/data/artists";
import Image from "next/image";

type Props ={
  artworks:Artwork[];
}

export default function MyArtworks({artworks}: Props){
return(
  <>
  <div className="flex gap-6 mt-8">
   
    {artworks.map((artwork) => (
      <div className="flex items-center flex-col gap-2  w-[220px] h-[300px]" key={artwork.id}>
        <Image src={artwork.thumbnail} alt={`Artwork ${artwork.id}`} width={200} height={200} className="object-cover w-[200px] h-full"/>
      </div>
      
      
    ))}
     </div>
  

  </>
)
}