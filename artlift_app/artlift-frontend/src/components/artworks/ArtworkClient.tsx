"use client";

import { useState } from "react";
import { Artwork, Comments, User } from "@/types/props";
import Image from "next/image";
import { Card, CardContent } from "../ui/card";
import FollowButton from "../followBtn";
import CommentHandle from "../comments/CommentHandle";

type ArtworkClientProps = {
  artwork: Artwork;
  initialComments: Comments[];
  isOwnProfile?: boolean;
  currentUser?: User;
};

export default function ArtworkDetailComponent({
  artwork,
  initialComments,
  isOwnProfile,
  currentUser,
}: ArtworkClientProps) {
  const [localComments, setLocalComments] = useState(initialComments);

  const handleCommentAdded = (newComment: Comments) => {
    setLocalComments((prev) => [newComment, ...prev]);
  };

  const handleReplyAdded = (parentId: number, newReply: Comments) => {
    setLocalComments((prev) =>
      prev.map((comment) =>
        comment.id === parentId
          ? { ...comment, replies: [...(comment.replies || []), newReply] }
          : comment,
      ),
    );
  };

  return (
    <div className="max-w-5xl mx-auto bg-[#F8F8F8] m-2 sm:m-5 ">
      {/* Artwork and Artist */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="relative aspect-3/3 overflow-hidden rounded-sm">
            <Image
              src={artwork.img}
              alt="Artwork"
              fill
              className="object-cover"
            />
          </div>
          <Card className="shadow-md rounded-2xl border-none bg-white">
            <CardContent>
              <div className="flex items-center gap-4">
                <span className="relative flex shrink-0 overflow-hidden rounded-full size-12">
                  <Image
                    src={artwork.artist.img}
                    alt="user-avatar"
                    fill
                    className="aspect-square size-full object-cover"
                  />
                </span>
                <div className="flex-1">
                  <h3 className="font-semibold">
                    {artwork.artist.first_name} {artwork.artist.last_name}
                  </h3>
                  <p className="text-secondary text-sm">3D artist</p>
                </div>
                <div className="flex gap-2">
                  {!isOwnProfile && (
                    <FollowButton
                      artistId={artwork.artist.id}
                      initialFollowing={
                        artwork.artist.is_followed_by_current_user
                      }
                      className="ml-2"
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Artwork Details */}
        <div className="space-y-4 lg:col-span-1 text-primary">
          <div className="mb-6">
            <h2 className="mb-4">What is this artwork?</h2>
            <h3>
              {artwork.title}
            </h3>
            <span className="text-secondary leading-relaxed whitespace-pre-line">
              {artwork.description}
            </span>
          </div>

          {/* Comments Section */}

          <div className="mb-4 flex gap-2">
            {/*create comment*/}
            <CommentHandle
              comments={localComments}
              artworkId={artwork.id}
              onCommentAdded={handleCommentAdded}
              onReplyAdded={handleReplyAdded}
              currentUser={currentUser}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
