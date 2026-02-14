import React, { useState } from "react";
import { commentAPI } from "@/lib/comment/comment";
import { Comments } from "@/types/props";

type Props = {
  comment: Comments;
  onReplyAdded: (parentId: number, newReply: Comments) => void;
};

export default function CommentCard({ comment, onReplyAdded }: Props) {
  const [replyText, setReplyText] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setIsSubmittingReply(true);
    try {
      //sam as comment data type. Do we use form data?
      const formData = new FormData();
      formData.append("text", replyText);

      const newReply = await commentAPI.replyCreate(comment.id, formData);
      onReplyAdded?.(comment.id, newReply);  

    } catch (err) {
      console.error("Failed to add reply:", err);
    } finally {
      setIsSubmittingReply(false);
    }

  };
   return (
    <div className="border-b py-2">
     <img src={comment.user_img} alt={`${comment.user}'s profile`}  />
      <p className="font-semibold">{comment.user}</p>
      <p>{comment.text}</p>

 
      {/* Replyfor */}
      {/*if we need user icon here, probably need artist?*/}
      <form onSubmit={handleReplySubmit} className="ml-6 mt-2">
        <input
          type="text"
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Write a reply..."
          className="border p-1 text-sm w-full"
        />
        <button type="submit" disabled={isSubmittingReply} className="mt-1 text-sm text-blue-600">
          Reply
        </button>
      </form>
    </div>
  );
}
