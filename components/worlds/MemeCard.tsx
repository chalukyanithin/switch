"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  GitFork,
  ArrowBigUp,
  ArrowBigDown,
  MoreHorizontal,
  Check,
  CheckSquare,
} from "lucide-react";
import { SwitchPost } from "@/lib/data/worldsData";
import MemeEditorModal from "./MemeEditorModal";
import AudioCommentPlayer from "../ui/AudioCommentPlayer";
import AudioCommentRecorder from "../ui/AudioCommentRecorder";
import { addComment, addAudioComment } from "@/lib/actions/thought.actions";

interface MemeCardProps {
  post: SwitchPost;
  currentUserId?: string;
  onLike?: (id: string) => void;
  onShare?: (post: SwitchPost) => void;
}

const FUNNY_REACTIONS = [
  { emoji: "💀", label: "I'm Dead", key: "dead" },
  { emoji: "😂", label: "Certified Banger", key: "banger" },
  { emoji: "🤡", label: "Clown Moment", key: "clown" },
  { emoji: "🗿", label: "Absolute Cinema", key: "cinema" },
  { emoji: "🫠", label: "Too Real", key: "tooReal" },
  { emoji: "🔥", label: "Cooking", key: "cooking" },
] as const;

function formatTimeAgo(isoString?: string): string {
  if (!isoString) return "Just now";
  try {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  } catch {
    return "Recently";
  }
}

export const MemeCard: React.FC<MemeCardProps> = ({
  post,
  currentUserId = "current-user",
  onLike,
  onShare,
}) => {
  const [upvotes, setUpvotes] = useState(post.meme?.upvotes || post.likes.length || 2400);
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null);
  const [selectedReaction, setSelectedReaction] = useState<string | null>(post.meme?.userReaction || null);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isSaved, setIsSaved] = useState(post.saved || false);
  const [commentOpen, setCommentOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentsList, setCommentsList] = useState(post.comments || []);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [showAudioRecorder, setShowAudioRecorder] = useState(false);

  const meme = post.meme;

  const handleUpvote = () => {
    if (userVote === "up") {
      setUserVote(null);
      setUpvotes((prev) => prev - 1);
    } else {
      if (userVote === "down") setUpvotes((prev) => prev + 2);
      else setUpvotes((prev) => prev + 1);
      setUserVote("up");
    }
  };

  const handleDownvote = () => {
    if (userVote === "down") {
      setUserVote(null);
      setUpvotes((prev) => prev + 1);
    } else {
      if (userVote === "up") setUpvotes((prev) => prev - 2);
      else setUpvotes((prev) => prev - 1);
      setUserVote("down");
    }
  };

  const handleSelectReaction = (emoji: string) => {
    setSelectedReaction(emoji === selectedReaction ? null : emoji);
    setShowReactionPicker(false);
    if (!userVote) {
      setUserVote("up");
      setUpvotes((prev) => prev + 1);
    }
  };

  const handleTextCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      _id: `c-${Date.now()}`,
      type: "text" as const,
      text: commentText.trim(),
      author: {
        _id: currentUserId,
        username: "You",
        photo: "https://api.dicebear.com/7.x/bottts/svg?seed=YouMemer",
      },
      createdAt: "Just now",
    };

    setCommentsList([...commentsList, newComment]);
    setCommentText("");
    await addComment(post._id, currentUserId, commentText.trim());
  };

  const formatVotes = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
    }
    return num.toString();
  };

  return (
    <>
      <article className="world-meme w-full bg-white dark:bg-card rounded-2xl border border-[#E2E8F0] dark:border-border transition-colors overflow-hidden shadow-xs hover:shadow-sm">
        {/* Header Matching Screenshot */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#E2E8F0] dark:border-border">
          <div className="flex items-center gap-3">
            <Link href={`/profile/${post.author._id}`}>
              <img
                src={post.author.photo || "https://api.dicebear.com/7.x/bottts/svg?seed=memeengineer"}
                alt={post.author.username}
                className="w-10 h-10 rounded-full object-cover border border-[#E2E8F0] dark:border-border hover:ring-2 hover:ring-[#2463D3]/40 transition-all shrink-0"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(post.author.username)}`;
                }}
              />
            </Link>
            <div>
              <div className="flex items-center gap-1.5">
                <Link
                  href={`/profile/${post.author._id}`}
                  className="font-extrabold text-[#17243A] dark:text-white hover:text-[#2463D3] transition-colors text-sm"
                >
                  {post.author.username}
                </Link>
                {post.author.verified && (
                  <span className="w-3.5 h-3.5 rounded-full bg-[#2463D3] text-white flex items-center justify-center text-[9px] font-bold">
                    ✓
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                {formatTimeAgo(post.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFollowing(!isFollowing)}
              className={`px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                isFollowing
                  ? "bg-slate-100 dark:bg-secondary text-foreground border border-border"
                  : "border border-[#2463D3] text-[#2463D3] hover:bg-blue-50 dark:hover:bg-blue-950/40"
              }`}
            >
              {isFollowing ? "Following" : "Follow"}
            </button>

            <button
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-slate-50 dark:hover:bg-secondary/40 transition-colors"
              title="Options"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Caption */}
        <div className="px-4 sm:px-5 pt-3.5 pb-2">
          <p className="text-[#17243A] dark:text-white font-extrabold text-sm sm:text-base leading-snug">
            {post.content}
          </p>
        </div>

        {/* Meme Image Preview (Pixel-Matched with Overlay) */}
        {post.image && (
          <div className="relative bg-[#0b1120] overflow-hidden flex items-center justify-center border-y border-[#E2E8F0] dark:border-border min-h-[260px] max-h-[580px]">
            <img
              src={post.image}
              alt="Meme Content"
              className="w-full h-auto max-h-[580px] object-contain mx-auto"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=1200&q=80";
              }}
            />

            {/* Checklist Overlay (for meme-quick-fix matching screenshot) */}
            {meme?.checklist && (
              <div className="absolute inset-0 flex items-center justify-between p-4 sm:p-8 pointer-events-none">
                {/* Left "The fix:" Label */}
                <div className="px-3 py-1.5 rounded-lg bg-black/85 text-white font-bold text-sm sm:text-base border border-white/20 shadow-md">
                  The fix:
                </div>

                {/* Right Checklist Card */}
                <div className="p-3.5 sm:p-4 rounded-xl bg-black/85 backdrop-blur-xs text-white border border-white/20 shadow-xl space-y-2 min-w-[150px] sm:min-w-[190px]">
                  {meme.checklist.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
                      <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3] shrink-0" />
                      <span className="leading-tight">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Reaction Bar & Engagement Actions (Pixel-Matched to Screenshot) */}
        <div className="relative flex items-center justify-between px-4 sm:px-5 py-3 border-t border-[#E2E8F0] dark:border-border bg-white dark:bg-card text-muted-foreground text-xs sm:text-sm">
          {/* Reaction Picker Popover */}
          {showReactionPicker && (
            <div className="absolute -top-12 left-4 z-30 flex items-center gap-1.5 p-1.5 rounded-full bg-white dark:bg-card border border-[#E2E8F0] dark:border-border shadow-lg animate-in fade-in slide-from-bottom-2">
              {FUNNY_REACTIONS.map((r) => (
                <button
                  key={r.key}
                  onClick={() => handleSelectReaction(r.emoji)}
                  className="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-secondary flex items-center justify-center text-lg hover:scale-125 transition-transform cursor-pointer"
                  title={r.label}
                >
                  {r.emoji}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4 sm:gap-6">
            {/* Upvote / Downvote Pill matching screenshot */}
            <div className="flex items-center rounded-full border border-[#E2E8F0] dark:border-border bg-[#F8FAFC] dark:bg-secondary/40 px-2 py-1 text-xs font-bold">
              <button
                onClick={handleUpvote}
                onMouseEnter={() => setShowReactionPicker(true)}
                className={`p-0.5 rounded-full transition-colors cursor-pointer ${
                  userVote === "up" ? "text-[#2463D3]" : "text-muted-foreground hover:text-[#2463D3]"
                }`}
                title="Upvote"
              >
                <ArrowBigUp className={`w-4 h-4 ${userVote === "up" ? "fill-current" : ""}`} />
              </button>

              <button
                onClick={() => setShowReactionPicker(!showReactionPicker)}
                className="px-1.5 text-foreground hover:text-[#2463D3] transition-colors cursor-pointer flex items-center gap-1"
              >
                {selectedReaction && <span className="text-sm">{selectedReaction}</span>}
                <span>{formatVotes(upvotes)}</span>
              </button>

              <button
                onClick={handleDownvote}
                className={`p-0.5 rounded-full transition-colors cursor-pointer ${
                  userVote === "down" ? "text-amber-600" : "text-muted-foreground hover:text-amber-600"
                }`}
                title="Downvote"
              >
                <ArrowBigDown className={`w-4 h-4 ${userVote === "down" ? "fill-current" : ""}`} />
              </button>
            </div>

            {/* Comment Count */}
            <button
              onClick={() => setCommentOpen(!commentOpen)}
              className="flex items-center gap-1.5 hover:text-[#2463D3] transition-colors cursor-pointer font-medium"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{commentsList.length}</span>
            </button>

            {/* Share */}
            <button
              onClick={() => onShare && onShare(post)}
              className="flex items-center gap-1.5 hover:text-[#2463D3] transition-colors cursor-pointer font-medium"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditorOpen(true)}
              className="px-2.5 py-1 rounded-lg border border-[#E2E8F0] dark:border-border hover:border-[#2463D3] hover:text-[#2463D3] text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <GitFork className="w-3.5 h-3.5 text-[#2463D3]" />
              <span className="hidden sm:inline">Remix</span>
            </button>

            <button
              onClick={() => setIsSaved(!isSaved)}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isSaved
                  ? "text-[#2463D3]"
                  : "text-muted-foreground hover:text-[#2463D3] hover:bg-slate-50 dark:hover:bg-secondary/40"
              }`}
              title={isSaved ? "Saved to collections" : "Save"}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? "fill-[#2463D3]" : ""}`} />
            </button>
          </div>
        </div>

        {/* Comments Thread */}
        {commentOpen && (
          <div className="p-4 sm:p-5 border-t border-[#E2E8F0] dark:border-border bg-[#F8FAFC] dark:bg-secondary/20 space-y-3">
            <form onSubmit={handleTextCommentSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder="Say something questionable..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 bg-white dark:bg-card border border-[#E2E8F0] dark:border-border rounded-xl px-3.5 py-2 text-xs text-foreground outline-none focus:border-[#2463D3]"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#2463D3] text-white font-bold text-xs hover:bg-[#2463D3]/90 transition-colors cursor-pointer"
              >
                Send
              </button>
            </form>

            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {commentsList.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-2 font-mono italic">
                  Be the first to say something questionable.
                </p>
              ) : (
                commentsList.map((c, i) => (
                  <div key={c._id || i} className="flex gap-2.5 text-xs">
                    <img
                      src={c.author.photo || "https://api.dicebear.com/7.x/bottts/svg?seed=Commenter"}
                      alt={c.author.username}
                      className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                    />
                    <div className="flex-1 bg-white dark:bg-card p-2.5 rounded-xl border border-[#E2E8F0] dark:border-border shadow-xs">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-bold text-[#17243A] dark:text-white">
                          @{c.author.username}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {c.createdAt}
                        </span>
                      </div>
                      <p className="text-muted-foreground">{c.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </article>

      {/* Editor Modal for Remixing */}
      {isEditorOpen && (
        <MemeEditorModal
          templatePost={post}
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
        />
      )}
    </>
  );
};

export default MemeCard;
