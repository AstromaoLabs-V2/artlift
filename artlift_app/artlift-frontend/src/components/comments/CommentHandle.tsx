
"use client";

import { Comments } from "@/app/types/props";
import { useState } from "react";
import { commentAPI } from "@/lib/comment/comment";
import CommentCard from "@/components/comments/CommentCard";

type Props = {
  comments: Comments[];
  onCommentAdded: (newComment:Comments) => void;
  artworkId: number;
};

export default function CommentHandle({
  comments,
  onCommentAdded,
  artworkId,
}: Props) {
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("text", commentText);
      const newComment = await commentAPI.create(artworkId, formData);
      setCommentText("");
      onCommentAdded(newComment); 
    } catch (err) {
      console.error("Failed to add comment:", err);
      alert("Failed to add comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmitComment}>
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button type="submit">Post</button>
      </form>

      {comments.map((comment) => (
        <CommentCard
          key={comment.id}
          comment={comment}
          artworkId={artworkId}
          onReplyAdded={onCommentAdded}
        />
      ))}
    </div>
     
    
  );
}
