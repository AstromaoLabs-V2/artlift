
"use client";

import { Comments, User } from "@/types/props";
import { useState } from "react";
import { commentAPI } from "@/lib/comment/comment";
import CommentCard from "@/components/comments/CommentCard";
import { Card, CardContent } from "../ui/card";


//comments variable is data of commments
type Props = {
  comments: Comments[];
  onCommentAdded: (newComment:Comments) => void;
  onReplyAdded: (parentId: number, newReply: Comments) => void;
  artworkId: number;
  currentUser?: User;
  className?: string; 
};

export default function CommentHandle({
  comments,
  onCommentAdded,
  artworkId,
  onReplyAdded,
  currentUser,
  
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

      const enrichedComment = {
      ...newComment,
      user: currentUser?.username ?? newComment.user,
      user_img: currentUser?.img ?? newComment.user_img,
    };
    
      setCommentText("");
      onCommentAdded(enrichedComment); 
    } catch (err) {
      console.error("Failed to add comment:", err);
      alert("Failed to add comment");
    } finally {
      setIsSubmitting(false);
    }
  };

   return (
    <div className="w-full">
      <Card className="shadow-md border border-gray-300"> 
        <CardContent className="border-none m-0 mt-2">
          {/* New Comment Form */}
          <form onSubmit={handleSubmitComment} className="flex gap-2 mt-2 sm:m-0">
            <input
              type="text"
              className="flex-1 border rounded-2xl px-3 py-1 text-sm"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary text-white px-3 py-1 rounded text-sm disabled:opacity-50 hover:bg-white hover:border-primary hover:text-primary hover:border hover:border-solid"
            >
              Post
            </button>
          </form>

          {/* Comment List */}
          {comments.length === 0 ? (
            <p className="text-secondary text-sm">No comments yet. Be the first!</p>
          ) : (
            comments.map((comment) => (
              <CommentCard 
              className="dark:text-white"
                key={comment.id}
                comment={comment}
                onReplyAdded={onReplyAdded}
                currentUser={currentUser}
              />
            ))
          )}
        </CardContent>
      </Card>
    </div>
   
     
    
  );

 
}
