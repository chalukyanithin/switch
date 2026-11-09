"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Heart, MessageCircle, Share2, MoreHorizontal, Bookmark, Check, Mic } from "lucide-react";
import { likeThought, addComment, addAudioComment } from "@/lib/actions/thought.actions";
import { useSession } from "next-auth/react";
import TechCard from "../worlds/TechCard";
import MemeCard from "../worlds/MemeCard";
import CricketCard from "../worlds/CricketCard";
import AudioCommentPlayer from "./AudioCommentPlayer";
import AudioCommentRecorder from "./AudioCommentRecorder";

interface CardProps {
  thought?: any;
}

export const Card: React.FC<CardProps> = ({ thought }) => {
  const { data: session } = useSession();
  const currentUserId = (session?.user as any)?.id || "current-user";

  const [shareToast, setShareToast] = useState(false);

  const handleShare = (postToShare: any) => {
    const postUrl = typeof window !== "undefined" ? `${window.location.origin}/post/${postToShare._id || 'view'}` : "";
    if (navigator.clipboard) {
      navigator.clipboard.writeText(postUrl);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2200);
    }
  };

  if (!thought) return null;

  const worldLower = (thought.world || "").toLowerCase();

  // Dispatch to the 3 specialized world card components
  if (worldLower === "technology" || worldLower === "coding" || worldLower === "tech" || thought.tech) {
    return (
      <div className="w-full relative">
        <TechCard post={thought} currentUserId={currentUserId} onShare={handleShare} />
        {shareToast && <ShareToastNotification />}
      </div>
    );
  }

  if (worldLower === "meme" || thought.meme) {
    return (
      <div className="w-full relative">
        <MemeCard post={thought} currentUserId={currentUserId} onShare={handleShare} />
        {shareToast && <ShareToastNotification />}
      </div>
    );
  }

  if (worldLower === "cricket" || thought.cricket) {
    return (
      <div className="w-full relative">
        <CricketCard post={thought} currentUserId={currentUserId} onShare={handleShare} />
        {shareToast && <ShareToastNotification />}
      </div>
    );
  }

  // Default Standard Post Card
  return <StandardCard thought={thought} currentUserId={currentUserId} onShare={handleShare} />;
};

const ShareToastNotification = () => (
  <div className="fixed bottom-6 right-6 z-50 bg-foreground text-background px-3.5 py-2 rounded-md shadow-md flex items-center gap-2 text-xs font-medium animate-in fade-in slide-from-bottom-2">
    <Check className="w-4 h-4 text-emerald-400" />
    <span>Link copied to clipboard!</span>
  </div>
);

const StandardCard: React.FC<{ thought: any; currentUserId: string; onShare: (t: any) => void }> = ({
  thought,
  currentUserId,
  onShare,
}) => {
  const [likes, setLikes] = useState<string[]>(thought.likes || []);
  const hasLiked = currentUserId ? likes.includes(currentUserId) : false;
  const [comments, setComments] = useState<any[]>(thought.comments || []);
  const [commentText, setCommentText] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [showAudioRecorder, setShowAudioRecorder] = useState(false);

  const handleLike = async () => {
    if (!currentUserId || !thought._id) return;
    if (hasLiked) {
      setLikes(likes.filter((id) => id !== currentUserId));
    } else {
      setLikes([...likes, currentUserId]);
    }
    try {
      await likeThought(thought._id, currentUserId);
    } catch (e) {
      console.warn("Optimistic like toggle:", e);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!thought._id || !commentText.trim()) return;
    setIsCommenting(true);
    const newComment = {
      _id: `c-${Date.now()}`,
      type: "text",
      text: commentText.trim(),
      author: {
        _id: currentUserId,
        username: "You",
        photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=300&q=80"
      },
      createdAt: "Just now"
    };
    setComments([...comments, newComment]);
    setCommentText("");
    try {
      await addComment(thought._id, currentUserId, commentText.trim());
    } catch (e) {
      console.warn("Comment submit:", e);
    } finally {
      setIsCommenting(false);
    }
  };

  const handleAudioCommentReady = async (audioData: any) => {
    const newComment = {
      _id: `caudio-${Date.now()}`,
      type: "audio",
      audio: audioData,
      author: {
        _id: currentUserId,
        username: "You",
        photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=300&q=80"
      },
      createdAt: "Just now"
    };
    setComments([...comments, newComment]);
    setShowAudioRecorder(false);
    try {
      await addAudioComment(thought._id, currentUserId, audioData);
    } catch (e) {
      console.warn("Audio comment submit:", e);
    }
  };

  const authorPhoto =
    thought.author?.photo && !thought.author.photo.includes("userr.jpg") && !thought.author.photo.includes("ui-avatars.com")
      ? thought.author.photo
      : `https://api.dicebear.com/7.x/adventurer/svg?seed=${thought.author?.username || "SwitchUser"}`;

  return (
    <article className="w-full bg-card rounded-lg border border-border transition-colors overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border">
        <div className="flex items-center gap-3">
          <Link href={`/profile/${thought.author?._id || "view"}`}>
            <img
              src={authorPhoto}
              alt={thought.author?.username || "User"}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(thought.author?.username || "SwitchUser")}`;
              }}
              className="w-9 h-9 rounded-full object-cover border border-border hover:ring-2 hover:ring-primary/40 transition-all shrink-0"
            />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <Link
                href={`/profile/${thought.author?._id || "view"}`}
                className="font-semibold text-foreground hover:underline text-sm"
              >
                {thought.author?.username || "Guest"}
              </Link>
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-secondary text-primary border border-border">
                {thought.world || "General"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              @{thought.author?.username?.toLowerCase() || "guest"} • Switch Community
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsSaved(!isSaved)}
          className={`p-2 rounded-md transition-colors cursor-pointer ${
            isSaved
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary"
          }`}
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
        </button>
      </div>

      {/* Body Content */}
      <div className="p-4 sm:p-5 space-y-3">
        <p className="text-foreground text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
          {thought.content}
        </p>

        {thought.image && (
          <div className="rounded-md overflow-hidden bg-secondary border border-border max-h-96">
            <img src={thought.image} alt="Attachment" className="w-full h-auto object-cover" />
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-t border-border bg-card text-muted-foreground text-sm">
        <div className="flex items-center gap-6">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
              hasLiked ? "text-red-500 font-semibold" : "hover:text-red-500"
            }`}
          >
            <Heart className={`w-5 h-5 ${hasLiked ? "fill-red-500 text-red-500" : ""}`} />
            <span>{likes.length}</span>
          </button>

          <button
            onClick={() => setActiveAction(activeAction === "comment" ? null : "comment")}
            className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer"
          >
            <MessageCircle className="w-5 h-5" />
            <span>{comments.length}</span>
          </button>

          <button
            onClick={() => onShare(thought)}
            className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        <span className="text-xs text-muted-foreground font-medium">
          {thought.world || "Thoughts"} World
        </span>
      </div>

      {/* Comments Drawer */}
      {activeAction === "comment" && (
        <div className="p-4 sm:p-5 border-t border-border bg-secondary/40 space-y-3">
          <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
            {comments.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-2">
                No replies yet. Join the conversation!
              </p>
            ) : (
              comments.map((c: any, i: number) => (
                <div key={i} className="flex gap-2.5 text-sm">
                  <span className="font-semibold text-foreground text-xs shrink-0">
                    {c.author?.username || "User"}:
                  </span>
                  {c.type === "audio" && c.audio ? (
                    <div className="flex-1">
                      <AudioCommentPlayer audio={c.audio} authorName={c.author?.username} />
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-xs sm:text-sm">
                      {c.text}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>

          {showAudioRecorder && (
            <AudioCommentRecorder
              onAudioReady={handleAudioCommentReady}
              onCancel={() => setShowAudioRecorder(false)}
              maxSeconds={30}
            />
          )}

          {!showAudioRecorder && (
            <form onSubmit={handleCommentSubmit} className="flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Reply to this thought..."
                className="flex-1 text-sm bg-card border border-border rounded-full px-4 py-2 text-foreground outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={() => setShowAudioRecorder(true)}
                className="p-2 rounded-full bg-secondary hover:bg-primary/20 text-muted-foreground hover:text-primary border border-border transition-colors cursor-pointer"
                title="Record 30-second audio note"
              >
                <Mic className="w-4 h-4" />
              </button>
              <button
                type="submit"
                disabled={isCommenting || !commentText.trim()}
                className="px-4 py-2 rounded-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground text-xs font-bold transition-colors cursor-pointer"
              >
                Post
              </button>
            </form>
          )}
        </div>
      )}
    </article>
  );
};

export default Card;
