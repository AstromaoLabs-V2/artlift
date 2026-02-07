type Props = {
  comment: Comments;
  artworkId: number;
  onReplyAdded?: (updated: Comments[]) => void; 
};

export default function CommentCard({ comment, artworkId, onReplyAdded }: Props) {
  const [replyText, setReplyText] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setIsSubmittingReply(true);
    try {
      const formData = new FormData();
      formData.append("text", replyText);

      await commentAPI.Replycreate(comment.id, formData);

      setReplyText("");

      const updated = await commentAPI.get(artworkId);
      onReplyAdded?.(updated);  // ← Comments[] を返す

    } catch (err) {
      console.error("Failed to add reply:", err);
    } finally {
      setIsSubmittingReply(false);
    }
  };
}
