"use client";

import { Comments } from "@/app/types/props";
import { createComments } from "@/app/lib/Artwork/[id]/comments/CreateComments";
import { useState } from "react";
import CommentCard from "./CommentCard";

type Props = {
  comments: Comments[];
  token: string;
  onCommentAdded: () => void;
  artworkId: number;
  //currentUser: { username: string; is_staff: boolean } | null;
};

export default function CommentHandle({
  comments,
  token,
  onCommentAdded,
  artworkId,
 // currentUser,
}: Props) {
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
 // const isStaff = currentUser?.is_staff || false;

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    try {
      await createComments(String(artworkId), token, {
        text: commentText,
      });
      setCommentText("");
      onCommentAdded();
    } catch (err) {
      console.error("Failed to add comment:", err);
      alert("Failed to add comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Comment Form */}
      <form onSubmit={handleSubmitComment} className="space-y-3">
        <div className="flex gap-3">
          {/* User Avatar Placeholder */}
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-sm font-bold text-gray-600">U</span>
            </div>
          </div>
          {/* Comment Input */}
          <div className="flex-1">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Enter your comment"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={isSubmitting || !commentText.trim()}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
            >
              {isSubmitting ? "Submitting..." : "Posted"}
            </button>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Comment</h3>
        {comments.length === 0 ? (
          <p className="text-gray-500 text-sm">No comments yet</p>
        ) : (
          <div className="space-y-3">
            {comments.map((comment) => (
              <CommentCard
                key={comment.id}
                comment={comment}
                token={token}
                onCommentDeleted={onCommentAdded}
                onReplyAdded={onCommentAdded}
               // currentUser={currentUser}

              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
