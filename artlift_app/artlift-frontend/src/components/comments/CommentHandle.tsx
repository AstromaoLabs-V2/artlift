"use client";

import { Comments, User } from "@/types/props";
import { useState } from "react";
import { commentAPI } from "@/lib/comment/comment";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";

type Props = {
  comments: Comments[];
  onCommentAdded: (newComment: Comments) => void;
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
  const [localComments, setLocalComments] = useState<Comments[]>(comments);

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

<<<<<<< HEAD
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
=======
   const handleDeleteComment = async (commentId: number) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    // Update UI immediately
    const originalComments = [...localComments];
    setLocalComments((prev) => prev.filter((c) => c.id !== commentId));
>>>>>>> d2dc1eb9596fdd4cfc89d08f2e6f43604ef00e7a

    try {
      await commentAPI.delete(commentId);
      console.log("Comment deleted successfully");
    } catch (err) {
      console.error("Failed to delete comment:", err);
      alert("Failed to delete comment");
      // Revert UI on failure
      setLocalComments(originalComments);
    }
  };

return (
  <div className="w-full">
    <Card className="shadow-md border border-gray-300">
      <CardContent className="p-3 space-y-4">
        <form
          onSubmit={handleSubmitComment}
          className="flex items-center gap-2 w-full"
        >
          <input
            type="text"
            className="flex-1 border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary text-white px-4 py-2 rounded-full text-sm disabled:opacity-50 hover:bg-white hover:border-primary hover:text-primary hover:border transition-colors duration-200"
          >
            Post
          </button>
        </form>
        {comments.length === 0 ? (
          <p className="text-muted-foreground text-sm">No comments yet. Be the first!</p>
        ) : (
          <div className="space-y-2">
            {comments.map((comment, index) => (
              <Card key={comment.id ?? index} className="border border-gray-200 shadow-none">
                <CardContent className="p-3">
                  <div className="flex gap-3">
                    <div className="relative h-8 w-8 shrink-0 rounded-full overflow-hidden">
                      <Image
                        src={comment.user_img || "/default-avatar.png"}
                        alt={comment.user || "User"}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-sm font-semibold">{comment.user}</span>
                          <span className="ml-2 text-sm">{comment.text}</span>
                        </div>

                        {/* i'll add like button here -kai */}
                        <button className="inline-flex items-center justify-center gap-1 text-muted-foreground hover:text-red-500 text-xs">
                          ❤️
                        </button>
                      </div>
                     
 {comment.user === currentUser?.username && (
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-red-500 hover:text-red-700 text-xs ml-2"
                          >
                            Delete
                          </button>
                        )}



                      <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{comment.created_at_relative}</span>
                        <button
                          onClick={() => onReplyAdded?.(comment.id, {} as Comments)}
                          className="hover:text-foreground font-medium"
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  </div>
);
}
