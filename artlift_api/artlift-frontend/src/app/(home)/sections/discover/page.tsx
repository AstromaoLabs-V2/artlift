import { getDiscover } from "./getDiscover";
import { Artist, Artwork } from "@/app/types/props";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default async function DiscoverView() {
  const discover: { artists: Artist[]; artworks: Artwork[] } =
    await getDiscover();

  return (
    <div className="bg-amber-100 text-black space-y-6 p-6">
      {/* <div>
        <h2 className="text-2xl font-bold mb-2">Artists</h2>
        <ul className="space-y-1">
          {discover.artists.map((artist: Artist) => (
            <li key={artist.id}>
              <strong>{artist.user__username}</strong>            
            </li>
          ))}
        </ul>
      </div> */}
      <Carousel>
        <CarouselContent>
          {discover.artworks.map((art: Artwork, index) => (
            <CarouselItem key={index} className="md:basis-1/3 lg:basis-1/4">
              <div className="p-1">
                <Card className="group relative overflow-hidden">
                  <CardContent className="aspect-square p-0">
                    <div className="flex h-full w-full items-center justify-center bg-amber-200 text-3xl font-semibold group-hover:scale-105 transition-transform duration-300">
                      {index + 1}
                      <img src={art.img} />
                    </div>

                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col p-4 text-white">
                      <div className="font-semibold flex-2/3"></div>
                      <div className="text-sm opacity-80 flex items-center justify-center">
                        <Button>
                          View Artist
                        </Button>
                        </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="sm:hidden md:hidden lg:flex" />
        <CarouselNext className="sm:hidden md:hidden lg:flex"/>
      </Carousel>
    </div>
  );
}
