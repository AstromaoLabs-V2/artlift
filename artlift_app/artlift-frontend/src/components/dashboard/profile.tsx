"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "../ui/button";
import { Artist, Artwork } from "@/types/props";
import Image from "next/image";
import {
  Mail,
  MapPin,
  Link2,
  CheckCircle,
  XCircle,
  TrendingUp,
  Calendar,
  Ellipsis,
  Pencil,
  UserIcon,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Field, FieldLabel } from "../ui/field";
import { Progress } from "../ui/progress";
import {
  DropdownMenuItem,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface ProfileComponentProps {
  artist: Artist;
  artworks?: Artwork[];
}

export default function ProfileComponent({
  artist,
  artworks,
}: ProfileComponentProps) {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="space-y-6">
        <div className="space-y-1">
          {artist.bg && (
            <div className="relative w-full h-48 bg-gray-200 rounded-lg overflow-hidden">
              <Image
                src={artist.bg}
                alt="Background"
                fill
                className="object-cover"
              />
              <div className="absolute end-4 top-4">
                <Button
                  className="bg-background/50 rounded-full size-8"
                  onClick={() => router.push("/dashboard/me/edit")}
                  title="Edit Profile"
                >
                  <Pencil />
                </Button>
              </div>
            </div>
          )}

          <div className="mt-10 px-4 pb-4 text-center lg:-mt-14">
            {artist.img && (
              <div className="relative flex shrink-0 overflow-hidden rounded-full border-background mx-auto size-20 border-4 lg:size-28">
                <Image
                  src={artist.img}
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div className="flex items-center justify-center gap-2">
              <h4 className="text-lg font-semibold lg:text-2xl">
                {artist.first_name} {artist.last_name}
              </h4>
            </div>
            <div className="text-muted-foreground mt-3 flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-1.5">
                <TrendingUp /> Artist
              </div>

              {artist.address && (
                <div className="flex items-center gap-1.5">
                  <MapPin />
                  <span>{artist.address}</span>
                </div>
              )}
              {artist.address && (
                <div className="hidden items-center gap-1.5 lg:flex">
                  <Calendar />
                  <span>Joined {artist.joined_date}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="px-4 overflow-x-hidden">
          <Tabs defaultValue="1" className="w-full max-w-full">
            <div className="flex items-center justify-between pb-4">
              <TabsList>
                <TabsTrigger value="1">Profile</TabsTrigger>
                <TabsTrigger value="2">Artworks</TabsTrigger>
                <TabsTrigger value="3">Commissions</TabsTrigger>
              </TabsList>

              <DropdownMenu>
                <DropdownMenuTrigger className="shrink-0">
                  <Ellipsis />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="bg-white ">
                  <DropdownMenuItem className="dark:text-background dark:hover:text-white">
                    <UserIcon /> View Activity Logs
                  </DropdownMenuItem>
                  <DropdownMenuItem className="dark:text-background dark:hover:text-white">
                    <UserIcon /> Samples
                  </DropdownMenuItem>
                  <DropdownMenuItem className="dark:text-background dark:hover:text-white"
                    onClick={() => router.push("/dashboard/me/edit")}
                  >
                    <Pencil />
                    Edit Profile
                  </DropdownMenuItem>

                  <DropdownMenuItem className="dark:text-background dark:hover:text-white"
                    onClick={() => router.push("/dashboard/artwork/create")}
                  >
                    <Pencil />
                    Create Artwork
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="max-w-full overflow-x-hidden">
              <TabsContent value="1" className="mt-4 w-full overflow-hidden">
                <div className="w-full gap-4 space-y-4 lg:grid lg:grid-cols-1 lg:space-y-0 xl:grid-cols-[360px_1fr]">
                  <div className="space-y-4 w-full">
                    <Card className="w-full bg-card text-card-foreground flex flex-col gap-6 rounded-xl py-6">
                      <CardContent>
                        <Field className="w-full max-w-sm">
                          <FieldLabel htmlFor="progress-upload">
                            <span>Complete your profile</span>
                            <span className="ml-auto">66%</span>
                          </FieldLabel>
                          <Progress value={66} id="progress-upload" />
                        </Field>
                      </CardContent>
                    </Card>

                    <h3 className="font-semibold">Profile</h3>
                    <div className="space-y-4 lg:space-y-8">
                      <div className="flex flex-col gap-y-4">
                        {artist.email && (
                          <div className="flex items-center gap-3 text-sm">
                            <Mail className="size-4 text-muted-foreground" />
                            <span>{artist.email}</span>
                          </div>
                        )}

                        {artist.address && (
                          <div className="flex items-center gap-3 text-sm">
                            <MapPin className="size-4 text-muted-foreground" />
                            <span>{artist.address}</span>
                          </div>
                        )}

                        {artist.website_URL && (
                          <div className="flex items-center gap-3 text-sm">
                            <Link2 className="size-4 text-muted-foreground" />
                            <a
                              href={artist.website_URL}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-primary hover:underline"
                            >
                              {artist.website_URL}
                            </a>
                          </div>
                        )}

                        {artist.social_links && (
                          <div className="flex items-center gap-3 text-sm">
                            <Link2 className="size-4 text-muted-foreground" />
                            <span>{artist.social_links}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-3 text-sm">
                          {artist.accept_commisions ? (
                            <>
                              <CheckCircle className="size-4 text-green-600" />
                              <span>Accepting commissions</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="size-4 text-red-500" />
                              <span>Not accepting commissions</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6 w-full">
                    <div className="grid gap-6 lg:grid-cols-2">
                      <Card>
                        <CardHeader className="pb-2 pt-4 px-4">
                          <CardTitle>Followers</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground font-medium">
                          {artist.followers_count}
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2 pt-4 px-4">
                          <CardTitle>Following</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground font-medium">
                          {artist.following_count}
                        </CardContent>
                      </Card>
                    </div>
                    <Card>
                      <CardHeader className="pt-4 px-4 pb-2">
                        <CardTitle className="text-base">About</CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-4">
                        {artist.about ? (
                          <p className="whitespace-pre-wrap text-sm text-muted-foreground leading-relaxed">
                            {artist.about}
                          </p>
                        ) : (
                          <p className="text-sm text-muted-foreground italic">
                            No bio yet.
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="2" className="mt-4">
                <Card>
                  <CardHeader className="pt-4 px-4 pb-2">
                    <CardTitle className="text-base">Artworks</CardTitle>
                  </CardHeader>

                  <CardContent className="px-4 pb-4">
                    {(artworks ?? []).length === 0 ? (
                      <p className="text-gray-500 text-sm">No artworks yet.</p>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {(artworks ?? []).map((artwork) => (
                          <div
                            key={artwork.id}
                            className="group relative aspect-square overflow-hidden rounded-lg cursor-pointer z-0"
                          >
                            <Link href={`/artwork/${artwork.id}`}>
                              <Image
                                src={artwork.img}
                                alt={artwork.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </Link>

                            <div className="absolute end-2 top-2 z-10">
                              <Button
                                className="bg-background/50 rounded-full size-8 "
                                onClick={() =>
                                  router.push(
                                    `/dashboard/artwork/${artwork.id}/edit`,
                                  )
                                }
                                title="Edit Artwork"
                              >
                                <Pencil />
                              </Button>
                            </div>

                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3 pointer-events-none">
                              <p className="text-white text-sm font-semibold truncate">
                                {artwork.title}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="3" className="mt-4">
                commissions
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
