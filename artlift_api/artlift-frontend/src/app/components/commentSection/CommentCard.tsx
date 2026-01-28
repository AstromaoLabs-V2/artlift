
"use client";

import { Comments } from "@/app/types/props";
import{replyComments } from "@/app/lib/Artwork/[id]/comments/[id]/ReplyComments";
import Image from "next/image";
import { useState } from "react";
import {deleteComments} from "@/app/lib/Artwork/[id]/comments/[id]/DeleteComments";
import DeleteButton from "../DeleteButton";

type Props = {
  comment: Comments;
  token: string;
  onCommentDeleted?: () => void;
  onReplyAdded?: () => void;
  //currentUser: { username: string; is_staff: boolean } | null;

};

export default function CommentCard({ comment, token, onCommentDeleted, onReplyAdded, /*currentUser*/}: Props) {
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Debug logging
  console.log("Comment data:", comment);
  console.log("User img:", comment.user_img);
  //console.log("isStaff:", currentUser?.is_staff);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  
  const handleDelete = async () => {
    await deleteComments(comment.id, token); 
    onCommentDeleted?.();
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setIsSubmittingReply(true);
    try {
      await replyComments(String(comment.id), token, { text: replyText });
      setReplyText("");
      setShowReplyForm(false);
      onReplyAdded?.();
    } catch (err) {
      console.error("Failed to add reply:", err);
      alert("Failed to add reply");
    } finally {
      setIsSubmittingReply(false);
    }
  };

  return (
    <div className="border-l-2 border-gray-300 pl-4 py-3">
      {/* Comment Header */}
      <div className="flex items-center gap-3 mb-2">
        {comment.user_img && !imageError ? (
          <img
            src={comment.user_img}
            alt={comment.user}
            width={32}
            height={32}
            className="rounded-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-xs font-bold text-gray-600">
              {comment.user.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="flex-1">
          <p className="font-semibold text-sm">{comment.user}</p>
          <p className="text-gray-500 text-xs">{formatDate(comment.created_at)}</p>
        </div>

        {/*currentUser?.is_staff &&*/ <DeleteButton onDelete={handleDelete} />}
      </div>

      {/* Comment Text */}
      <p className="text-gray-800 text-sm mb-2">{comment.text}</p>

      {/* Reply Button */}
      <button
        onClick={() => setShowReplyForm(!showReplyForm)}
        className="text-blue-600 hover:text-blue-800 text-xs font-medium mb-2"
      >
        {showReplyForm ? "Cancel" : "Reply"}
      </button>

      {/* Reply Form */}
      {showReplyForm && (
        <form onSubmit={handleReplySubmit} className="mb-3 space-y-2 bg-gray-50 p-3 rounded">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a reply..."
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={2}
            disabled={isSubmittingReply}
          />
          <button
            type="submit"
            disabled={isSubmittingReply || !replyText.trim()}
            className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {isSubmittingReply ? "Posting..." : "Post Reply"}
          </button>
        </form>
      )}

      {/* Replies Section */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3">
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="text-blue-600 hover:text-blue-800 text-xs font-medium"
          >
            {showReplies ? "Hide" : "Show"} {comment.replies.length} {comment.replies.length === 1 ? "reply" : "replies"}
          </button>

          {showReplies && (
            <div className="space-y-3 mt-3">
              {comment.replies.map((reply) => (
                <CommentCard
                  key={reply.id}
                  comment={reply}
                  token={token}
                  onCommentDeleted={onReplyAdded}
                  onReplyAdded={onReplyAdded}
                  //currentUser={currentUser}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
