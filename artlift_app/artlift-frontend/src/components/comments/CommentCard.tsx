import React, { useState } from "react";
import { commentAPI } from "@/lib/comment/comment";
import { Comments } from "@/types/props";

type Props = {
  key:number;
  comment: Comments;
  artworkId: number;
  onReplyAdded?: (updated: Comments[]) => void; 
};

export default function CommentCard({ key, comment, artworkId, onReplyAdded }: Props) {
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

      await commentAPI.replyCreate(key, formData);

      setReplyText("");

      const updated = await commentAPI.get(artworkId);
      onReplyAdded?.(updated);  

    } catch (err) {
      console.error("Failed to add reply:", err);
    } finally {
      setIsSubmittingReply(false);
    }

  };
   return (
    <div className="border-b py-2">
      <p className="font-semibold">{comment.user}</p>
      <p>{comment.text}</p>

 
      {/* Replyfor */}
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
