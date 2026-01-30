

import DiscoverCarousel from "@/components/discover-carousel";
import { getDiscover } from "@/lib/api";
import { constructMetadata } from "@/types/props";
import { Metadata } from "next";

export const metadata: Metadata = constructMetadata({
  title: "Artlift",
  description: "Art, Elevated.",
  canonical: "/home",
});

export default async function Home() {
  const discover = await getDiscover();

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
