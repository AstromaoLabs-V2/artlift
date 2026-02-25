"use client";

import { useState } from "react";
import { Artwork, Comments, User } from "@/types/props";
import Image from "next/image";
import { Card, CardContent } from "../ui/card";
import FollowButton from "../followBtn";

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
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");

const handleReplyAdded = async (parentId: number, text: string) => {
  if (!text.trim() || !currentUser) return;

  const endpoint =
    parentId === 0
      ? `${process.env.NEXT_PUBLIC_API_URL}/artwork/${artwork.id}/comments/create/`
      : `${process.env.NEXT_PUBLIC_API_URL}/comments/${parentId}/reply/`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Comment failed:", errorText);
      return;
    }

    const newCommentData: Comments = await response.json();

    if (parentId === 0) {
      setLocalComments((prev) => [newCommentData, ...prev]);
    } else {
      setLocalComments((prev) =>
        prev.map((comment) =>
          comment.id === parentId
            ? { ...comment, replies: [...(comment.replies || []), newCommentData] }
            : comment
        )
      );
    }

    setReplyingTo(null);
    setReplyText("");
  } catch (err) {
    console.error("Error adding comment/reply:", err);
  }
};

  return (
    <div className="max-w-5xl mx-auto bg-[#F8F8F8] p-6 space-y-6">
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
          <Card className="shadow-none">
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
          <h2 className="mb-3 text-lg font-semibold text-primary">
            {artwork.title}
          </h2>
          <span className="text-secondary leading-relaxed whitespace-pre-line">
            {artwork.description}
          </span>
        </div>
      </div>

      {/* Comments Section */}
<div className="space-y-4">
        <h2 className="text-lg font-semibold">Comments</h2>
        {localComments.length === 0 && <p className="text-secondary">No comments yet. Be the first!</p>}

        {localComments.map((comment) => (
          <Card key={comment.id}>
            <CardContent>
              <div className="flex gap-3">
                <span className="relative flex shrink-0 overflow-hidden rounded-full size-12">
                  <Image
                    src={comment.user_img || "/default-avatar.png"}
                    alt={comment.user}
                    fill
                    className="aspect-square size-full object-cover"
                  />
                </span>
                <div className="flex-1">
                  <p className="font-semibold">{comment.user}</p>
                  <p className="text-sm text-secondary">{comment.text}</p>

                  <button
                    onClick={() => setReplyingTo(comment.id)}
                    className="mt-1 text-sm text-primary hover:underline"
                  >
                    Reply
                  </button>

                  {replyingTo === comment.id && (
                    <div className="mt-2 flex gap-2">
                      <input
                        type="text"
                        className="flex-1 border rounded px-2 py-1"
                        placeholder="Write a reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                      />
                      <button
                        onClick={() => handleReplyAdded(comment.id, replyText)}
                        className="px-3 py-1 bg-primary text-white rounded"
                      >
                        Send
                      </button>
                    </div>
                  )}

                  {/* Nested replies */}
                  {comment.replies?.length > 0 && (
                    <div className="ml-6 mt-2 space-y-2">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex gap-3">
                          <span className="relative flex shrink-0 overflow-hidden rounded-full size-10">
                            <Image
                              src={reply.user_img || "/default-avatar.png"}
                              alt={reply.user}
                              fill
                              className="aspect-square size-full object-cover"
                            />
                          </span>
                          <div>
                            <p className="font-semibold text-sm">{reply.user}</p>
                            <p className="text-sm text-secondary">{reply.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}