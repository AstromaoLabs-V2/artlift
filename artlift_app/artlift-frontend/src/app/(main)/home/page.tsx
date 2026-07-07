import { Suspense } from "react";
import Image from "next/image";
import DiscoverCarousel from "@/components/discover-carousel";
import { getDiscover } from "@/lib/api";
import { constructMetadata } from "@/types/props";
import { Metadata } from "next";

export const metadata: Metadata = constructMetadata({
  title: "Artlift",
  description: "Art, Elevated.",
  canonical: "/",
});

async function DiscoverSection() {
  const discover = await getDiscover();
  return <DiscoverCarousel artworks={discover.artworks} />;
}

export default function Home() {
  return (
    <div>
      <section className="glid-cols-2 ">
        <div className="hero-text">
          <h1>Discover Best Artwork to match Your House</h1>
        </div>
        <div className="hero-image">
          <Image
            src="/img/artlift-hero-pic.png"
            alt="Artlift Hero Image"
            width={800}
            height={600}
            priority
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
      </section>
      <div className="py-5">
        <Suspense fallback={<div className="h-64 animate-pulse bg-gray-200 rounded-lg" />}>
          <DiscoverSection />
        </Suspense>

        {/* <NewArtistsSection artists={discover.artists} /> */}
        {/* <PopularArtworksSection artworks={discover.artworks} /> */}
      </div>
    </div>
  );
}
