"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Artwork, Artist } from "@/app/types/props";
import {getArtwork} from "@/app/lib/Artists/[id]/getArtwork";
import { getArtist } from "@/app/lib/Artists/[id]/getArtists";
import { deleteArtwork } from "@/app/lib/Artists/[id]/deleteArtwork";
import ArtworkForm from "@/app/components/editForm/ArtworkForm";
import SnsSystem from "@/app/components/features/SnsSystem";
import Navigation from "@/app/components/nav/navigation";
import DeleteButton from "@/app/components/DeleteButton";
import EditButton from "@/app/components/EditButton";

export default function ArtworkDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [comments, setComments] = useState<Comments[]>([]);

  //delete for staff
  //const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    // Get token and username from localStorage
    const storedToken = localStorage.getItem("access_token");
   // const username = localStorage.getItem("username");
      //const is_staff = localStorage.getItem("is_staff") === "true";
     if (!storedToken) {
      router.push("/auth/login");
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch artwork
        const artworkData = await getArtwork(id, storedToken);
        setArtwork(artworkData);

        //fetch Artist
        const data = await getArtist(id, storedToken);
        setArtist(data);

          // Fetch comments
        const commentData = await getComments(id, storedToken);
        setComments(commentData || []);

        // Check if current user is the owner
        const username = localStorage.getItem("username");
        if (data?.user__username === username) {
          setIsOwner(true);
        }

      }

      catch (err: any) {
        if (err.message === "UNAUTHORIZED") {
          router.push("/auth/login");
        } else if (err.message.includes("404")) {
          console.error("Artwork not found");
        } else {
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    setToken(storedToken);
  }, [id, router]);

   const fetchCommentsData = async () => {
    if(!token) return;
    const commentData = await getComments(id, token);
    setComments(commentData);
  };


  const handleDeleteArtwork = async () => {
    if (!artwork || !token) return;

  try {
        await deleteArtwork(artwork.id, token);
        router.push("/artwork");
      } catch (err) {
        console.error(err);
        alert("Failed to delete artwork.");
      }
  };

  const handleArtworkUpdated = (updatedArtwork: Artwork) => {
    setArtwork(updatedArtwork);
    setEditMode(false);
  };

  if (loading) return <p className="text-center py-8">Loading artwork...</p>;
  if (!artwork) return <p className="text-center py-8">Artwork not found.</p>;

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

                {/* Action Buttons */}
              
                  <div className="flex gap-3">
                    {/*token && isOwner && */ token &&(
                      <>
                        <EditButton
                          onClick={() => setEditMode(!editMode)}
                          isEditing={editMode}
                        />
                        <DeleteButton onDelete={handleDeleteArtwork} />
                      </>
                    )}
                  </div>
            
              </div>
            </div>

            {/* Sidebar - SNS System */}
            <aside className="bg-white rounded-lg shadow-lg p-6 h-fit">
              <SnsSystem />
            </aside>
          </div>

          {/* Edit Form */}
          {editMode && token && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-12">
              <ArtworkForm
                artwork={artwork}
                token={token}
                mode="edit"
                onUpdated={handleArtworkUpdated}
              />
            </div>
          )}

            {/* Comments Section */}
          {token && (
            <div className="comment bg-white rounded-lg shadow-lg p-6">
              <CommentHandle
                comments={comments}
                token={token}
                onCommentAdded={handleCommentAdded}
                artworkId={artwork.id}
                /*currentUser={currentUser}*/
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
