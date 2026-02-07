//get artwork details and comments component (form)
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getArtist } from "@/app/lib/Artists/[id]/getArtists";
import Navigation from "@/app/components/nav/navigation";
import { Artwork, Artist, Comments } from "@/types/props";
import CommentHandle from "@/components/comments/CommentHandle";
//import { getComments } from "@/app/lib/Artwork/[id]/comments/ListComments";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

type ArtworkClientProps ={
  artwork: Artwork;
  comments: Comments[];
}

export default function ArtworkDetailPage({artwork:Artwork, comments}:ArtworkClientProps) {

  const router = useRouter();
  const [artwork, setArtwork] = useState<Artwork>(Artwork);
  //const [loading, setLoading] = useState(true);
  //const [isOwner, setIsOwner] = useState(false);
  const [localComments, setLocalComments] = useState<Comments[]>(comments);

  //if new comment added, update local comments and new one is one the top
  const handleCommentAdded = (newComment: Comments) => {
    setLocalComments((prev) => [newComment, ...prev]);
  };
  const handleReplyUpdated = (updated: Comments[]) => {
  setLocalComments(updated);
};


  //delete for staff
  //const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

    //const fetchData = async () => {
      //try {
 
    

        // Check if current user is the owner
       // const username = localStorage.getItem("username");
        //if (data?.user__username === username) {
       //   setIsOwner(true);
       // }

     // }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-r from-[#9ac3c6] to-[#4d858d] p-8">
        <div className="max-w-6xl mx-auto">
          {/* Artwork Detail Grid */}
          <div className="grid grid-cols-3 gap-6 mb-12">
            {/* Main Artwork Section */}
            <div className="col-span-2 bg-white rounded-lg overflow-hidden shadow-lg">
              <div className="aspect-[4/5] overflow-hidden bg-gray-200">
                <img
                  src={artwork.img}
                  alt={artwork.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Artwork Info */}
              <div className="p-6">
                <h1 className="text-3xl font-bold mb-2">{artwork.title}</h1>

                {/* Artist Name */}
                <p className="text-lg text-gray-600 mb-4">
                  by{" "}
                  <span
                    className="font-semibold cursor-pointer hover:underline text-blue-600"
                    onClick={() => router.push(`/artist/${artwork.artist__id}`)}
                  >
                    {/*{artist.first_name}*/}
                  </span>
                </p>

                {/* Artwork Details */}
                <div className="border-t pt-4 mb-4">
                  {artwork.size && (
                    <p className="text-sm text-gray-700 mb-2">
                      <span className="font-semibold">Size:</span>{" "}
                      {artwork.size}
                    </p>
                  )}
                  <p className="text-sm text-gray-700 mb-2">
                    <span className="font-semibold">Status:</span>{" "}
                    {artwork.is_active ? "Active" : "Inactive"}
                  </p>
            
                </div>

                {/* Description */}
                {artwork.description && (
                  <div className="border-t pt-4 mb-6">
                    <h3 className="font-semibold text-lg mb-2">Description</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {artwork.description}
                    </p>
                  </div>
                )}

              </div>
            </div>
      
          </div>

            {/* Comments Section */}
            <div className="comment bg-white rounded-lg shadow-lg p-6">
            <CommentHandle
              comments={localComments}
              artworkId={artwork.id}
              onCommentAdded={handleCommentAdded}
              onReplyUpdated={handleReplyUpdated} 
            />
          </div>
        </div>
      </div>
    </>
  );
}
