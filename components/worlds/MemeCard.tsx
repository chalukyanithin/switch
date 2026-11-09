"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Heart, MessageCircle, Share2, Bookmark, GitFork, Mic } from "lucide-react";
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

export const MemeCard: React.FC<MemeCardProps> = ({
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
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [showAudioRecorder, setShowAudioRecorder] = useState(false);

  const meme = post.meme;

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
    <>
      <article className="world-meme w-full bg-card rounded-lg border border-border transition-colors overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border bg-card">
          <div className="flex items-center gap-3">
            <Link href={`/profile/${post.author._id}`}>
              <img
                src={post.author.photo || "https://api.dicebear.com/7.x/adventurer/svg?seed=Meme"}
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
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40">
                  <Sparkles className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                  Memes
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {meme?.parentMemeId ? "Remixed Template Variant" : "Original Meme Template"} • Cultural Media
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditorOpen(true)}
              className="px-2.5 py-1 rounded-md bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/25 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <GitFork className="w-3.5 h-3.5" />
              <span>Remix</span>
            </button>

            <button
              onClick={() => setIsSaved(!isSaved)}
              className={`p-2 rounded-md transition-colors cursor-pointer ${
                isSaved
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-primary hover:bg-secondary"
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
            </button>
          </div>
        </div>

        {/* Caption */}
        <div className="px-4 sm:px-5 pt-3.5 pb-2">
          <p className="text-foreground text-sm sm:text-base leading-relaxed">{post.content}</p>
        </div>

        {/* Meme Image Preview */}
        {post.image && (
          <div className="relative bg-black/90 overflow-hidden flex items-center justify-center border-y border-border min-h-[220px]">
            <img
              src={post.image}
              alt="Meme"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80";
              }}
              className="w-full max-h-[500px] object-contain mx-auto"
            />
            {meme?.remixCount !== undefined && (
              <div className="absolute bottom-3 right-3 bg-black/80 text-amber-400 border border-amber-500/30 text-xs font-mono font-medium px-2 py-0.5 rounded flex items-center gap-1.5">
                <GitFork className="w-3.5 h-3.5" />
                <span>{meme.remixCount} remixes</span>
              </div>
            )}
          </div>
        )}

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
            onClick={() => setIsEditorOpen(true)}
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Open in Editor</span>
            <Sparkles className="w-3 h-3" />
          </button>
        </div>

        {/* Comments Section */}
        {commentOpen && (
          <div className="p-4 sm:p-5 border-t border-border bg-secondary/40 space-y-4">
            {/* Comment Thread List */}
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {commentsList.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-2">
                  No replies yet. Be the first to drop a reaction or 30s voice clip!
                </p>
              ) : (
                commentsList.map((c, i) => (
                  <div key={c._id || i} className="flex gap-2.5 text-sm">
                    <img
                      src={c.author.photo || "https://api.dicebear.com/7.x/adventurer/svg?seed=Commenter"}
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

            {/* Audio Recorder Drawer if triggered */}
            {showAudioRecorder && (
              <AudioCommentRecorder
                onAudioReady={handleAudioCommentReady}
                onCancel={() => setShowAudioRecorder(false)}
                maxSeconds={30}
              />
            )}

            {/* Comment Input Bar */}
            {!showAudioRecorder && (
              <form onSubmit={handleTextCommentSubmit} className="flex items-center gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Drop a caption reaction..."
                  className="flex-1 text-sm bg-card border border-border rounded-full px-4 py-2 text-foreground outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowAudioRecorder(true)}
                  className="p-2 rounded-full bg-secondary hover:bg-primary/20 text-muted-foreground hover:text-primary border border-border transition-colors cursor-pointer"
                  title="Record 30-second audio comment"
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

      {/* Interactive Meme Editor Modal */}
      <MemeEditorModal
        templatePost={post}
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onPublished={(newPost) => {
          if (newPost) {
            window.location.reload();
          }
        }}
      />
    </>
  );
};

export default MemeCard;
