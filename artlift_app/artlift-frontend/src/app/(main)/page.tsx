

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
    <div className="py-5">
      <section className="grid grid-cols-1 sm:grid-cols-2 mt-4 mb-4">
        <div className="hero-text flex justify-center flex-col ">
          <h1 className="relative">Discover Best Artwork to match Your House</h1>
          <div className="relative">
            <img src="/img/Activity.png" alt="Activity image" className=" absolute top-1/2 -translate-y-1/2 -left-20 top-0 w-20 h-20 hidden lg:block" />
          <p className="text-left">Find your best hidden artist and be one of core fun</p>
          </div>
       
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
      <section className="artwork-carousel mb-4">
        <h2 className="mt-8">Discover</h2>
        <Suspense fallback={<div className="h-64 animate-pulse bg-gray-200 rounded-lg" />}>
          <DiscoverSection />
        </Suspense>
      </section>

      {/* <NewArtistsSection artists={discover.artists} /> */}
      {/* <PopularArtworksSection artworks={discover.artworks} /> */}
    </div>
  );
}
