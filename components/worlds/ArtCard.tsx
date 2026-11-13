"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Palette, Sparkles, Eye, Bookmark, Heart, MessageCircle, Share2, ChevronDown, ChevronUp, Layers } from "lucide-react";
import { SwitchPost } from "@/lib/data/worldsData";

interface ArtCardProps {
  post: SwitchPost;
  currentUserId?: string;
  onLike?: (id: string) => void;
  onComment?: (id: string, text: string) => void;
  onShare?: (post: SwitchPost) => void;
}

export const ArtCard: React.FC<ArtCardProps> = ({
  post,
  currentUserId,
  onLike,
  onComment,
  onShare,
}) => {
  const [showProcess, setShowProcess] = useState(false);
  const [isSaved, setIsSaved] = useState(post.saved || false);
  const [isLiked, setIsLiked] = useState(currentUserId ? post.likes.includes(currentUserId) : false);
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [commentOpen, setCommentOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentsList, setCommentsList] = useState(post.comments || []);
  const [saveToast, setSaveToast] = useState(false);

  const art = post.art;

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    if (onLike) onLike(post._id);
  };

  const handleSaveClick = () => {
    setIsSaved(!isSaved);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      _id: `c-${Date.now()}`,
      text: commentText.trim(),
      author: {
        _id: currentUserId || "you",
        username: "You",
        photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=300&q=80"
      },
      createdAt: "Just now"
    };

    setCommentsList([...commentsList, newComment]);
    if (onComment) onComment(post._id, commentText.trim());
    setCommentText("");
  };

  return (
    <article className="switch-card w-full flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border">
        <div className="flex items-center gap-3">
          <Link href={`/profile/${post.author._id}`}>
            <img
              src={post.author.photo || "https://api.dicebear.com/7.x/adventurer/svg?seed=Artist"}
              alt={post.author.username}
              className="w-10 h-10 rounded-full object-cover border border-border hover:ring-2 hover:ring-purple-500/50 transition-all shrink-0"
            />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <Link href={`/profile/${post.author._id}`} className="font-semibold text-sm text-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-colors truncate">
                {post.author.username}
              </Link>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 shrink-0">
                <Palette className="w-3 h-3" />
                Art
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
              {art?.medium || "Visual Artwork"} • {art?.style || "Contemporary"}
            </p>
          </div>
        </div>

        <button
          onClick={handleSaveClick}
          className={`p-2 rounded-xl transition-all cursor-pointer ${
            isSaved
              ? "bg-purple-600 text-white shadow-xs shadow-purple-600/30"
              : "text-muted-foreground hover:text-purple-600 hover:bg-secondary"
          }`}
          title={isSaved ? "Saved to Gallery Collection" : "Save to Collection"}
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? "fill-white" : ""}`} />
        </button>
      </div>

      {/* Save Notification Toast */}
      {saveToast && (
        <div className="bg-purple-600 text-white text-xs px-4 py-2 text-center font-medium transition-all">
          {isSaved ? "✓ Curated into your private Art Collection" : "Removed from Art Collection"}
        </div>
      )}

      {/* Visual Artwork Showcase */}
      {post.image && (
        <div className="relative aspect-4/3 w-full overflow-hidden bg-secondary group">
          <img
            src={post.image}
            alt="Artwork"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <div className="text-white text-xs space-y-1">
              <p className="font-semibold text-sm">{art?.dimensions ? `Format: ${art.dimensions}` : "Fine Art Exhibition"}</p>
              <p className="opacity-80">Created: {art?.year || "2026"} • Archival Specimen</p>
            </div>
          </div>
        </div>
      )}

      {/* Content & Palette */}
      <div className="p-4 sm:p-5 space-y-3.5 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <p className="text-foreground text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
            {post.content}
          </p>

          {/* Color Palette Swatches */}
          {art?.palette && art.palette.length > 0 && (
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                Palette:
              </span>
              <div className="flex items-center gap-1.5">
                {art.palette.map((color, idx) => (
                  <div
                    key={idx}
                    className="w-5 h-5 rounded-md border border-border shadow-xs cursor-pointer hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Creative Process Details */}
        {art?.processSteps && art.processSteps.length > 0 && (
          <div className="border border-purple-200/60 dark:border-purple-900/40 rounded-xl bg-purple-50/30 dark:bg-purple-950/20 overflow-hidden">
            <button
              onClick={() => setShowProcess(!showProcess)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 text-left font-semibold text-xs text-purple-900 dark:text-purple-300 hover:bg-purple-100/40 dark:hover:bg-purple-900/30 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                {showProcess ? "Hide Technique Notes" : `Inspect Technique (${art.processSteps.length} stages)`}
              </span>
              {showProcess ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showProcess && (
              <div className="p-3.5 border-t border-purple-200/60 dark:border-purple-900/40 space-y-2 animate-in fade-in duration-200 text-xs">
                <h4 className="font-bold uppercase tracking-wider text-purple-950 dark:text-purple-300 text-[10px]">
                  Glaze Progression & Technique
                </h4>
                <ol className="space-y-1.5">
                  {art.processSteps.map((step, idx) => (
                    <li key={idx} className="flex gap-2.5 text-foreground">
                      <span className="flex-shrink-0 w-4 h-4 rounded-full bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="leading-snug">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Engagement Actions */}
      <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-t border-border bg-card/60 text-muted-foreground text-xs mt-auto">
        <div className="flex items-center gap-5">
          <button
            onClick={handleLikeClick}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
              isLiked ? "text-purple-600 font-semibold" : "hover:text-purple-600"
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? "fill-purple-600 text-purple-600" : ""}`} />
            <span>{likeCount}</span>
          </button>

          <button
            onClick={() => setCommentOpen(!commentOpen)}
            className="flex items-center gap-1.5 hover:text-purple-600 transition-colors cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{commentsList.length}</span>
          </button>

          <button
            onClick={() => onShare && onShare(post)}
            className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        <span className="text-[11px] text-muted-foreground">
          Art World Gallery
        </span>
      </div>

      {/* Comments Thread */}
      {commentOpen && (
        <div className="p-4 border-t border-border bg-secondary/40 space-y-3">
          <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
            {commentsList.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-1">
                No critiques yet. Be the first to share feedback!
              </p>
            ) : (
              commentsList.map((c, i) => (
                <div key={c._id || i} className="flex gap-2 text-xs">
                  <img
                    src={c.author.photo || "https://api.dicebear.com/7.x/adventurer/svg?seed=ArtCritic"}
                    alt={c.author.username}
                    className="w-6 h-6 rounded-full object-cover shrink-0"
                  />
                  <div className="flex-1 bg-card p-2 rounded-xl border border-border">
                    <span className="font-semibold text-foreground mr-1.5 text-[11px]">
                      {c.author.username}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {c.text}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleCommentSubmit} className="flex gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Leave an artistic reflection..."
              className="flex-1 text-xs bg-card border border-border rounded-full px-3.5 py-1.5 text-foreground outline-none focus:border-purple-600"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="px-3.5 py-1.5 rounded-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-[11px] font-bold transition-colors cursor-pointer"
            >
              Post
            </button>
          </form>
        </div>
      )}
    </article>
  );
};

export default ArtCard;
