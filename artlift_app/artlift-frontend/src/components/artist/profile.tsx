"use client";

import { Artist } from "@/types/props";
import { useRouter } from "next/navigation";
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
  CircleX,
} from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
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
import FollowButton from "../followBtn";

type ArtistClientProps = {
  artist: Artist;
  id: string;
  isOwnProfile: boolean;
};

export default function ArtistProfileComponent({
  artist,
  id,
  isOwnProfile
}: ArtistClientProps) {
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
                {!isOwnProfile &&(
                <Button
                  className="bg-background/50 rounded-full size-8"
                  onClick={() => router.push("/dashboard/me/edit")}
                  title="Edit Profile"
                >
                  <Pencil />
                </Button>
                )}
              </div>
            </div>
          )}

          <div className="-mt-10 px-4 pb-4 text-center lg:-mt-14">
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
              </TabsList>
              <div className="flex items-center space-x-1">
                {!isOwnProfile && (
              <FollowButton artistId={artist.id} initialFollowing={artist.is_followed_by_current_user} className="ml-2"/>
                )}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center justify-center w-10 h-10 rounded-lg border-2 hover:bg-gray-200 cursor-pointer">
                 <Ellipsis className="w-5 h-5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="bg-white">
                  <DropdownMenuItem>
                    <UserIcon /> View Activity Logs
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CircleX /> Block 
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
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
                        <CardHeader>
                          <CardTitle>Followers</CardTitle>
                        </CardHeader>
                        <CardContent>{artist.followers_count}</CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle>Following</CardTitle>
                        </CardHeader>
                        <CardContent>{artist.followers_count}</CardContent>
                      </Card>
                    </div>
                    <Card>
                      <CardHeader>
                        <CardTitle>About</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {artist.about && (
                          <div>
                            <p className="whitespace-pre-wrap">
                              {artist.about}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="2" className="mt-4">
                artworks examples here HAHA
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
