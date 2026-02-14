
"use client";

import { Comments } from "@/types/props";
import { useState } from "react";
import { commentAPI } from "@/lib/comment/comment";
import CommentCard from "@/components/comments/CommentCard";

//comments variable is data of commments
type Props = {
  comments: Comments[];
  onCommentAdded: (newComment:Comments) => void;
  onReplyAdded: (parentId: number, newReply: Comments) => void;
  artworkId: number;
};

export default function CommentHandle({
  comments,
  onCommentAdded,
  artworkId,
  onReplyAdded,
}: Props) {
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setIsSubmitting(true);

    try {

      // if this is a form data, keep using this. if not may need to replace
      const formData = new FormData();
      formData.append("text", commentText);
      const newComment = await commentAPI.commentCreate(artworkId, formData);
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
        {/*may need user's icon here?"* need to see display and judge*/}
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button type="submit">Post</button>
      </form>

      {comments.map((comment) => (
        <CommentCard
          comment={comment}
         onReplyAdded={onReplyAdded}  
        />
      ))}
    </div>
     
    
  );

 
}
