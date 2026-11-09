"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Trophy, Heart, MessageCircle, Share2, Bookmark, Mic, Radio, Play } from "lucide-react";
import { SwitchPost } from "@/lib/data/worldsData";
import AudioCommentPlayer from "../ui/AudioCommentPlayer";
import AudioCommentRecorder from "../ui/AudioCommentRecorder";
import { addComment, addAudioComment } from "@/lib/actions/thought.actions";

interface CricketCardProps {
  post: SwitchPost;
  currentUserId?: string;
  onLike?: (id: string) => void;
  onShare?: (post: SwitchPost) => void;
}

export const CricketCard: React.FC<CricketCardProps> = ({
  post,
  currentUserId = "current-user",
  onLike,
  onShare,
}) => {
  const [isLiked, setIsLiked] = useState(post.likes.includes(currentUserId));
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [isSaved, setIsSaved] = useState(post.saved || false);
  const [commentOpen, setCommentOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentsList, setCommentsList] = useState(post.comments || []);
  const [showAudioRecorder, setShowAudioRecorder] = useState(false);

  const cricket = post.cricket;

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    if (onLike) onLike(post._id);
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
        photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=300&q=80",
      },
      createdAt: "Just now",
    };

    setCommentsList([...commentsList, newComment]);
    setCommentText("");
    await addComment(post._id, currentUserId, commentText.trim());
  };

  const handleAudioCommentReady = async (audioData: any) => {
    const newComment = {
      _id: `caudio-${Date.now()}`,
      type: "audio" as const,
      audio: audioData,
      author: {
        _id: currentUserId,
        username: "You",
        photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=300&q=80",
      },
      createdAt: "Just now",
    };

    setCommentsList([...commentsList, newComment]);
    setShowAudioRecorder(false);
    await addAudioComment(post._id, currentUserId, audioData);
  };

  return (
    <article className="world-cricket w-full bg-card rounded-lg border border-border transition-colors overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <Link href={`/profile/${post.author._id}`}>
            <img
              src={post.author.photo || "https://api.dicebear.com/7.x/adventurer/svg?seed=Cricket"}
              alt={post.author.username}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(post.author.username)}`;
              }}
              className="w-9 h-9 rounded-full object-cover border border-border hover:ring-2 hover:ring-primary/40 transition-all shrink-0"
            />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <Link
                href={`/profile/${post.author._id}`}
                className="font-bold text-foreground hover:text-primary transition-colors text-sm"
              >
                {post.author.username}
              </Link>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
                <Trophy className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                Cricket
              </span>
              <span className="hidden sm:inline-block text-[10px] font-mono text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-900/40">
                Simulated Match
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {cricket?.venue ? `${cricket.venue} • ` : ""}Tactical Analysis & Voice Dugout
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsSaved(!isSaved)}
          className={`p-2 rounded-md transition-colors cursor-pointer ${
            isSaved
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-primary hover:bg-secondary"
          }`}
          title="Save Match Discussion"
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
        </button>
      </div>

      {/* Match Scoreboard Snippet if available */}
      {cricket && (
        <div className="px-4 sm:px-5 py-2.5 bg-secondary/60 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span className="text-xs font-mono font-semibold text-foreground">
              {cricket.matchTitle || "Match Discussion"}
            </span>
          </div>
          {cricket.scoreSnippet && (
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-card text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
              {cricket.scoreSnippet}
            </span>
          )}
        </div>
      )}

      {/* Body Content */}
      <div className="p-4 sm:p-5 space-y-3">
        <p className="text-foreground text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>

        {post.image && (
          <div className="rounded-md overflow-hidden bg-secondary border border-border max-h-[460px] relative">
            <img
              src={post.image}
              alt="Cricket Match"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.style.display = 'none';
              }}
              className="w-full h-auto object-cover"
            />
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-t border-border bg-card text-muted-foreground text-sm">
        <div className="flex items-center gap-6">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
              isLiked ? "text-primary font-semibold" : "hover:text-primary"
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? "fill-primary text-primary" : ""}`} />
            <span>{likeCount}</span>
          </button>

          <button
            onClick={() => setCommentOpen(!commentOpen)}
            className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer"
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

        <button
          onClick={() => {
            setCommentOpen(true);
            setShowAudioRecorder(true);
          }}
          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1.5 cursor-pointer"
        >
          <Mic className="w-3.5 h-3.5" />
          <span>Record Voice Reaction</span>
        </button>
      </div>

      {/* Comments Drawer */}
      {commentOpen && (
        <div className="p-4 sm:p-5 border-t border-border bg-secondary/40 space-y-4">
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {commentsList.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-2">
                No discussion yet. Drop an audio match reaction!
              </p>
            ) : (
              commentsList.map((c, i) => (
                <div key={c._id || i} className="flex gap-2.5 text-sm">
                  <img
                    src={c.author.photo || "https://api.dicebear.com/7.x/adventurer/svg?seed=CricketFan"}
                    alt={c.author.username}
                    className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                  />
                  <div className="flex-1 bg-card p-3 rounded-xl border border-border shadow-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-foreground text-xs">
                        {c.author.username}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {c.createdAt}
                      </span>
                    </div>

                    {c.type === "audio" && c.audio ? (
                      <AudioCommentPlayer audio={c.audio} authorName={c.author.username} />
                    ) : (
                      <p className="text-muted-foreground text-xs sm:text-sm">{c.text}</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Audio Recorder Drawer */}
          {showAudioRecorder && (
            <AudioCommentRecorder
              onAudioReady={handleAudioCommentReady}
              onCancel={() => setShowAudioRecorder(false)}
              maxSeconds={30}
            />
          )}

          {!showAudioRecorder && (
            <form onSubmit={handleTextCommentSubmit} className="flex items-center gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Share your match analysis..."
                className="flex-1 text-sm bg-card border border-border rounded-full px-4 py-2 text-foreground outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={() => setShowAudioRecorder(true)}
                className="p-2 rounded-full bg-secondary hover:bg-primary/20 text-muted-foreground hover:text-primary border border-border transition-colors cursor-pointer"
                title="Record 30-second audio reaction"
              >
                <Mic className="w-4 h-4" />
              </button>
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="px-4 py-2 rounded-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground font-bold text-xs transition-colors cursor-pointer"
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

export default CricketCard;
