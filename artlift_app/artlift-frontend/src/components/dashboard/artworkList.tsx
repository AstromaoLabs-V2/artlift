"use client";

import { Artwork } from "@/types/props";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Pencil, Trash2, Plus } from "lucide-react";

interface ArtworkListProps {
  artworks: Artwork[];
}

export default function ArtworkListComponent({ artworks }: ArtworkListProps) {
  const router = useRouter();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Artworks</h1>
          <p className="text-gray-600 mt-1">{artworks.length} artwork{artworks.length !== 1 ? "s" : ""}</p>
        </div>
        <Button onClick={() => router.push("/dashboard/artwork/create")}>
          <Plus className="size-4 mr-2" />
          Upload Artwork
        </Button>
      </div>

      {artworks.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg">No artworks yet.</p>
          <p className="text-sm mt-1">Upload your first artwork!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {artworks.map((artwork) => (
            <Card key={artwork.id} className="group relative overflow-hidden">
              <CardContent className="p-0">
                <div className="relative aspect-square">
                  <Image
                    src={artwork.img}
                    alt={artwork.title}
                    fill={true}
                    className="object-cover"
                  />
                  {/* Hover overlay with edit/delete */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-white/90"
                      onClick={() => router.push(`/dashboard/artwork/${artwork.id}/edit`)}
                    >
                      <Pencil className="size-4" />
                    </Button>
                   
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-semibold truncate">{artwork.title}</h3>
                  {artwork.description && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{artwork.description}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}