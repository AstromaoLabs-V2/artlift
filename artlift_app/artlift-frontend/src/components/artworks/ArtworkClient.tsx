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
    <div className="max-w-5xl mx-auto bg-[#F8F8F8] m-2 sm:m-0 ">
      {/* Artwork and Artist */}
      <div className="grid gap-4 lg:grid-cols-3 m-3">
        <div className="space-y-4 mt-2 lg:col-span-2">
          <div className="relative aspect-3/3 overflow-hidden rounded-sm">
          {artwork.img &&
            <Image
              src={artwork.img}
              alt="Artwork"
              fill
              className="object-cover"
            />
          }
          </div>
          <Card className="shadow-md rounded-2xl border-none bg-white">
            <CardContent>
              <div className="flex items-center gap-4">
                <span className="relative flex shrink-0 overflow-hidden rounded-full size-12">
                  {artwork.artist.img && (
                <Image
                  src={artwork.artist.img}
                  alt="user-avatar"
                  fill
                  className="aspect-square size-full object-cover"
                />
              )}

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
          <div className="mb-6 mt-2">
            {/*<h2 className="mb-4">What is this artwork?</h2>*/}
            <h3>
              {artwork.title}
            </h3>

            {artwork.details?.about && (
              <blockquote className="my-4 border-l-4 border-primary pl-4 italic text-lg leading-relaxed">
                &ldquo;{artwork.details.about}&rdquo;
                <footer className="mt-2 text-sm not-italic text-secondary">
                  — {artwork.artist.first_name} {artwork.artist.last_name}
                </footer>
              </blockquote>
            )}

            <span className="text-secondary leading-relaxed whitespace-pre-line">
              {artwork.description}
            </span>
            {artwork.categories && artwork.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {artwork.categories.map((category) => (
                  <span
                    key={category.id}
                    className="text-xs rounded-full border px-3 py-1 text-secondary"
                  >
                    {category.name}
                  </span>
                ))}
              </div>
            )}
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
