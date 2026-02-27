import React, { useState } from "react";
import Image from "next/image";
import { commentAPI } from "@/lib/comment/comment";
import { Comments, User } from "@/types/props";

type Props = {
  comment: Comments;
  onReplyAdded: (parentId: number, newReply: Comments) => void;
  currentUser?: User; 
};

export default function CommentCard({ comment, onReplyAdded, currentUser }: Props) {
  const [replyText, setReplyText] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("text", replyText);
      const newReply = await commentAPI.replyCreate(comment.id, formData);
      const enrichedReply = {
        ...newReply,
        user: currentUser?.username ?? newReply.user,
        user_img: currentUser?.img ?? newReply.user_img,
      };

      onReplyAdded(comment.id, enrichedReply);
      setReplyText("");
      setIsReplying(false);
    } catch (err) {
      console.error("Failed to add reply:", err);
    } finally {
      setIsSubmitting(false);
    }
  };
  console.log("comment data:", comment);

  return (
    <div className="flex gap-3 border-b pb-3 mt-3 mb-2">
      {/* Avatar */}
      <span className="relative flex shrink-0 overflow-hidden rounded-full size-10">
        <Image
          src={comment.user_img || "/default-avatar.png"}
          alt={comment.user}
          fill
          className="object-cover"
        />
      </span>

      <div className="flex-1 space-y-1">
        {/* Comment Body */}
        <p className="font-semibold text-sm">{comment.user}</p>
        <p className="text-sm text-secondary">{comment.text}</p>

        {/* Reply Toggle */}
        <button
          onClick={() => setIsReplying((prev) => !prev)}
          className="text-xs text-primary hover:underline"
        >
          Reply
        </button>

        {/* Reply Form */}
        {isReplying && (
          <form onSubmit={handleReplySubmit} className="flex gap-2 mt-1">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              className="flex-1 border rounded px-2 py-1 text-sm"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary text-white px-2 py-1 rounded text-sm disabled:opacity-50"
            >
              Post
            </button>
          </form>
        )}

        {/* Nested Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="ml-4 mt-2">
            {comment.replies.map((reply) => (
              <div key={reply.id} className="flex gap-2 mt-2">
                <span className="relative flex shrink-0 overflow-hidden rounded-full size-8">
                  <Image
                    src={reply.user_img || "/default-avatar.png"}
                    alt={reply.user}
                    fill
                    className="object-cover"
                  />
                </span>
                <div>
                  <p className="font-semibold text-xs">{reply.user}</p>
                  <p className="text-xs text-secondary">{reply.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
