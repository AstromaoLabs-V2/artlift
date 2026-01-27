"use client";

import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { Artist } from "@/types/props";
import Image from "next/image";
import {
  Mail,
  MapPin,
  Link2,
  FileText,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface ProfileComponentProps {
  artist: Artist;
}

export default function ProfileComponent({ artist }: ProfileComponentProps) {
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
            </div>
          )}

          <div className="flex flex-col items-center sm:flex-row sm:items-end sm:gap-6 px-4">
            {artist.img && (
              <div className="relative w-32 h-32 -mt-16 sm:ml-6 border-4 border-white rounded-full overflow-hidden bg-gray-200">
                <Image
                  src={artist.img}
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div className="mt-3 sm:mt-0 lg:-mt-2 self-center sm:self-end w-full sm:w-auto text-center sm:text-left *:lg:mb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                <div>
                  <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                    {artist.first_name} {artist.last_name}
                  </h4>

                  <p className="text-sm text-gray-500">{artist.followers_count} followers</p>
                </div>

                <div className="mt-3 sm:mt-0 flex justify-center sm:justify-start">
                          <Button onClick={() => router.push("/dashboard/me/edit")}>
          Edit Profile
        </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

       <div className="rounded-lg border p-6 space-y-4">
               {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <div className="relative">
    <div className="absolute -top-4 left-6 z-10">
      <div className="px-5 py-2 bg-white border rounded-full shadow text-sm font-medium">
        Profile Information
      </div>
    </div>

    <div className="rounded-lg border bg-white shadow p-6 pt-10 min-h-[220px]">
      <p className="text-gray-600">
        This is your main content area. Add forms, text, images,
        anything here.
      </p>
    </div>
  </div> */}

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

  {artist.about && (
    <div className="flex items-start gap-3 text-sm">
      <FileText className="size-4 text-muted-foreground mt-0.5" />
      <p className="whitespace-pre-wrap">{artist.about}</p>
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
</div>
  );
}
