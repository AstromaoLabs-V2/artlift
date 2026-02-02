"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { deleteArtwork } from "@/app/lib/Artists/[id]/deleteArtwork";
import ArtworkForm from "@/app/components/editForm/ArtworkForm";
import SnsSystem from "@/app/components/features/SnsSystem";
import Navigation from "@/app/components/nav/navigation";
import DeleteButton from "@/app/components/DeleteButton";
import EditButton from "@/app/components/EditButton";
import { Artwork, Artist, Comments } from "@/types/props";
import CommentHandle from "@/app/components/commentSection/CommentHandle";
import { getComments } from "@/app/lib/Artwork/[id]/comments/ListComments";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

type ArtworkClientProps = {
  artwork: Artwork;
  artist:Artist;
  id: string;
  token:string;
};

export default function ArtworkDetailPage(props:ArtworkClientProps) {
  const params = useParams();
  const router = useRouter();
  const [artworks, setArtworks] = useState<Artwork | null>(null);
//  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
 // const [token, setToken] = useState<string | null>(null);
 // const [isOwner, setIsOwner] = useState(false);
  const [comments, setComments] = useState<Comments[]>([]);

    const { id, token, artwork } = props;

useEffect(() => {
   setArtworks(artwork);
   }, [artwork]);
  //delete for staff
  //const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
    // Get token and username from localStorage
   // const storedToken = localStorage.getItem("access_token");
   // const username = localStorage.getItem("username");
      //const is_staff = localStorage.getItem("is_staff") === "true";
    // if (!storedToken) {
    //  router.push("/auth/login");
    //  return;

  const fetchCommentsData = async () => {
    try {
      const commentData = await getComments(id, token);
      setComments(commentData || []);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    }
  };

  useEffect(() => {
    fetchCommentsData();
  }, [id, token]);

  const handleDeleteArtwork = async()=>{
    if (!artwork || !token) return;

    try{
      await deleteArtwork(artwork.id, token);
      router.push("/artwork");
    }
    catch(errr){
      console.error("Failed to delete artwork:", errr);
      alert("Failed to delete artwork");
    }
  }

  const handleArtworkUpdated = (updatedArtwork: Artwork) => {
    setArtworks(updatedArtwork);
    setEditMode(false);
  };

  if (!artworks) return <p className="text-center py-8">Artwork not found.</p>;


  function handleCommentAdded(): void {
    throw new Error("Function not implemented.");
  }

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
                  src={artworks.img}
                  alt={artworks.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Artwork Info */}
              <div className="p-6">
                <h1 className="text-3xl font-bold mb-2">{artworks.title}</h1>

                {/* Artist Name */}
                <p className="text-lg text-gray-600 mb-4">
                  by{" "}
                  <span
                    className="font-semibold cursor-pointer hover:underline text-blue-600"
                    onClick={() => router.push(`/artist/${artworks.artist.id}`)}
                  >
                   {artworks.artist.first_name} {artworks.artist.last_name}
                  </span>
                </p>

                {/* Artwork Details */}
                <div className="border-t pt-4 mb-4">
                  {artworks.size && (
                    <p className="text-sm text-gray-700 mb-2">
                      <span className="font-semibold">Size:</span>{" "}
                      {artworks.size}
                    </p>
                  )}
                  <p className="text-sm text-gray-700 mb-2">
                    <span className="font-semibold">Status:</span>{" "}
                    {artworks.is_active ? "Active" : "Inactive"}
                  </p>
            
                </div>

                {/* Description */}
                {artworks.description && (
                  <div className="border-t pt-4 mb-6">
                    <h3 className="font-semibold text-lg mb-2">Description</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {artworks.description}
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


