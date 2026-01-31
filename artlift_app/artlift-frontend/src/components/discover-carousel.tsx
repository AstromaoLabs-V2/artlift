//this uses "use client" but here it's not since it's not funtioning yet this is initial client components
//this discovercar... Oh okay. Still server side right? uhm no this is client side
import { Artist, Artwork } from "../types/props";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

interface DiscoverCarouselProps {
  artworks: Artwork[];
}
//don't have state or events yet so no "use client" here that's why Yes. But still this is client's since its gonna have other function later
export default function DiscoverCarousel({ artworks }: DiscoverCarouselProps) {
  return (
    <div className="bg-amber-100 text-black space-y-6 p-6">
      <Carousel>
        <CarouselContent>
          {artworks.map((art: Artwork, index) => (
            <CarouselItem key={index} className="md:basis-1/3 lg:basis-1/4">
              <div className="p-1">
                <Card className="group relative overflow-hidden">
                  <CardContent className="aspect-square p-0">
                    <div className="flex h-full w-full items-center justify-center bg-amber-200 text-3xl font-semibold group-hover:scale-105 transition-transform duration-300">
                      <img src={art.img} />
                    </div>

                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col p-4 text-white">
                      <div className="font-semibold flex-2/3"></div>
                      <div className="text-sm opacity-80 flex items-center justify-center">
                        <Button>View Artist</Button>
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
  );
}
