import DiscoverCarousel from "../components/discover-carousel";
import { getDiscover } from "./home/getDiscover";

export default async function HomePage() {
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
