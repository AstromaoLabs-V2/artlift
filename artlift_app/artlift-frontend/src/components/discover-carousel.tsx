import { Artist, Artwork } from "../types/props";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import Image from "next/image";

interface DiscoverCarouselProps {
  artworks: Artwork[];
}

export default function DiscoverCarousel({
  artworks,
}: DiscoverCarouselProps) {

  console.log("DiscoverCarousel artworks:", artworks);

  return (
    <>
      <div className="text-black space-y-6 p-6">
        <Carousel>
          <CarouselContent>
            {/*logic is if user name and artwork artist name match, then show the artist into the carousel item, icon as well*/}
            {/*Current problem is username and artist name does not match because of icluding kai22, sota22, not sota or kai/*/}
            {(artworks ?? []).map((art) => (
              <CarouselItem key={art.id} className="md:basis-1/3 lg:basis-1/4">
                <div className="p-1">
                  <Card className="group relative overflow-hidden">
                    <CardContent className="relative aspect-4/5 p-0 m-0 overflow-hidden">
                    <Link href={`/artwork/${art.id}`} className="absolute inset-0 block z-index-10">
                      <Image
                        src={art.img || "/default-artwork.png"}
                        alt={art.title}
                        fill ={true}
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, 25vw"
                      />
                      </Link>

                      <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col text-white p-6 m-0 pointer-events-none z-20">
                        <div className="flex-1 flex flex-col items-center justify-center">
                          <Image
                            src={art.artist__img} 
                            alt={art.artist__user__username || "Artist"}
                            width={96}
                            height={96}
                            className="size-24 rounded-full object-cover"
                          />
                          <p className="p-2 font-semibold">
                            {art.artist__user__username}
                          </p>
                        </div>

                        <div className="flex items-center justify-center">
                          <Link href={`/artist/${art.artist__id}`} className="w-full">
                          <Button variant="discover" className="h-12 pointer-events-auto">
                            View Artist
                          </Button>
                          </Link>
                        </div>
                      </div>
                      
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="sm:hidden md:hidden lg:flex" />
          <CarouselNext className="sm:hidden md:hidden lg:flex" />
        </Carousel>
      </div>
    </>
  );
}
