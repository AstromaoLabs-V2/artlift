

import DiscoverCarousel from "@/components/discover-carousel";
import { getDiscover } from "@/lib/api";
import { constructMetadata } from "@/types/props";
import { Metadata } from "next";

export const metadata: Metadata = constructMetadata({
  title: "Artlift",
  description: "Art, Elevated.",
  canonical: "/home",
}); //meta data for SEO in server components

export default async function Home() {
  const discover = await getDiscover(); //getting data using server side


  //this DiscoverCar(clients components are for interactivity which is not in server folders. do u get it?)
  //DiscoverCar?
  return (
    <div>
    <div className="py-5">
      <DiscoverCarousel artworks={discover.artworks} /> 
      
      {/* <NewArtistsSection artists={discover.artists} /> */}
      {/* <PopularArtworksSection artworks={discover.artworks} /> */}
    </div>
    </div>

  );
}

