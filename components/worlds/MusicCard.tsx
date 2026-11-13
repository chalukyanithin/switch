"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Music2, Play, Pause, Volume2, Bookmark, Heart, MessageCircle, Share2, Disc3, Radio } from "lucide-react";
import { SwitchPost } from "@/lib/data/worldsData";

interface MusicCardProps {
  post: SwitchPost;
  currentUserId?: string;
  onLike?: (id: string) => void;
  onComment?: (id: string, text: string) => void;
  onShare?: (post: SwitchPost) => void;
}

export const MusicCard: React.FC<MusicCardProps> = ({
  post,
  currentUserId,
  onLike,
  onComment,
  onShare,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(25);
  const [isSaved, setIsSaved] = useState(post.saved || false);
  const [isLiked, setIsLiked] = useState(currentUserId ? post.likes.includes(currentUserId) : false);
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [commentOpen, setCommentOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentsList, setCommentsList] = useState(post.comments || []);
  const [saveToast, setSaveToast] = useState(false);

  const music = post.music;

  // Waveform heights array
  const waveBars = [30, 60, 45, 80, 95, 40, 70, 85, 100, 75, 50, 90, 65, 40, 80, 55, 70, 95, 60, 40, 75, 85, 50, 30];

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 1.5));
      }, 300);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

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
    <article className="switch-card w-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border">
        <div className="flex items-center gap-3">
          <Link href={`/profile/${post.author._id}`}>
            <img
              src={post.author.photo || "https://api.dicebear.com/7.x/adventurer/svg?seed=Musician"}
              alt={post.author.username}
              className="w-11 h-11 rounded-full object-cover border border-border hover:ring-2 hover:ring-pink-500/50 transition-all"
            />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <Link href={`/profile/${post.author._id}`} className="font-semibold text-foreground hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
                {post.author.username}
              </Link>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/20">
                <Music2 className="w-3 h-3" />
                Music World
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {music?.genre || "Sound Producer"} • {post.author.bio || "Artist"}
            </p>
          </div>
        </div>

        <button
          onClick={handleSaveClick}
          className={`p-2 rounded-xl transition-all cursor-pointer ${
            isSaved
              ? "bg-pink-600 text-white shadow-xs shadow-pink-600/30"
              : "text-muted-foreground hover:text-pink-600 hover:bg-secondary"
          }`}
          title={isSaved ? "Saved to Playlist" : "Save to Playlist"}
        >
          <Bookmark className={`w-5 h-5 ${isSaved ? "fill-white" : ""}`} />
        </button>
      </div>

      {/* Save Notification Toast */}
      {saveToast && (
        <div className="bg-pink-600 text-white text-xs px-4 py-2 text-center font-medium transition-all">
          {isSaved ? "✓ Added to your Saved Music & Playlists" : "Removed from Playlist"}
        </div>
      )}

      {/* Hero / Studio Session Banner */}
      {post.image && (
        <div className="relative aspect-16/9 w-full overflow-hidden bg-secondary">
          <img
            src={post.image}
            alt="Studio session"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex items-end p-5">
            <div className="flex items-center gap-4 w-full">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-13 h-13 rounded-full bg-pink-500 hover:bg-pink-600 text-white flex items-center justify-center shadow-lg shadow-pink-500/40 transition-transform active:scale-95 cursor-pointer"
              >
                {isPlaying ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white ml-0.5" />}
              </button>
              <div className="flex-1 text-white">
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wider text-pink-400 font-bold flex items-center gap-1">
                    <Radio className="w-3.5 h-3.5 animate-pulse text-pink-400" />
                    {isPlaying ? "Playing Audio Stream" : "Audio Preview Ready"}
                  </span>
                </div>
                <h3 className="font-bold text-base sm:text-lg truncate">
                  {music?.trackTitle || "Original Performance"}
                </h3>
                <p className="text-xs text-white/70">
                  {music?.duration || "3:30"} • {music?.bpm || 80} BPM • Key: {music?.key || "C Minor"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Waveform Player Bar */}
      <div className="px-5 pt-4">
        <div className="bg-secondary/60 p-3.5 rounded-xl border border-border">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span className="font-mono">0:{Math.floor((progress * 2.2) / 100).toString().padStart(2, "0")}</span>
            <span className="flex items-center gap-1 font-semibold text-pink-600 dark:text-pink-400">
              <Disc3 className={`w-3.5 h-3.5 ${isPlaying ? "animate-spin" : ""}`} />
              {music?.genre || "Electronic / Acoustic"}
            </span>
            <span className="font-mono">{music?.duration || "3:40"}</span>
          </div>

          {/* Interactive animated waveform */}
          <div
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              setProgress(Math.max(0, Math.min(100, (clickX / rect.width) * 100)));
            }}
            className="flex items-end gap-1 h-9 cursor-pointer py-1"
          >
            {waveBars.map((height, i) => {
              const barPercent = (i / waveBars.length) * 100;
              const isPast = barPercent <= progress;
              return (
                <div
                  key={i}
                  className={`flex-1 rounded-full transition-all duration-150 ${
                    isPast
                      ? "bg-pink-500 dark:bg-pink-400"
                      : "bg-secondary hover:bg-pink-300"
                  } ${isPlaying && isPast ? "animate-pulse" : ""}`}
                  style={{ height: `${height}%` }}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 space-y-3">
        <p className="text-foreground text-base leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>

        {/* Instruments / Gear Tags */}
        {music?.instruments && music.instruments.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="text-xs text-muted-foreground py-0.5 mr-1 font-medium">Gear:</span>
            {music.instruments.map((item, i) => (
              <span
                key={i}
                className="px-2.5 py-0.5 rounded-full text-xs bg-secondary text-foreground border border-border"
              >
                {item}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Engagement Actions */}
      <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-t border-border bg-card/60 text-muted-foreground text-sm">
        <div className="flex items-center gap-6">
          <button
            onClick={handleLikeClick}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
              isLiked ? "text-pink-600 font-semibold" : "hover:text-pink-600"
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? "fill-pink-600 text-pink-600" : ""}`} />
            <span>{likeCount}</span>
          </button>

          <button
            onClick={() => setCommentOpen(!commentOpen)}
            className="flex items-center gap-1.5 hover:text-pink-600 transition-colors cursor-pointer"
          >
            <MessageCircle className="w-5 h-5" />
            <span>{commentsList.length}</span>
          </button>

          <button
            onClick={() => onShare && onShare(post)}
            className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        <span className="text-xs text-muted-foreground">
          Music World
        </span>
      </div>

      {/* Comments Thread */}
      {commentOpen && (
        <div className="p-4 sm:p-5 border-t border-border bg-secondary/40">
          <div className="space-y-3 mb-4 max-h-56 overflow-y-auto pr-1">
            {commentsList.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-2">
                No listener comments yet. Tell the artist what you felt!
              </p>
            ) : (
              commentsList.map((c, i) => (
                <div key={c._id || i} className="flex gap-2.5 text-sm">
                  <img
                    src={c.author.photo || "https://api.dicebear.com/7.x/adventurer/svg?seed=Listener"}
                    alt={c.author.username}
                    className="w-7 h-7 rounded-full object-cover shrink-0"
                  />
                  <div className="flex-1 bg-card p-2.5 rounded-xl border border-border shadow-xs">
                    <span className="font-semibold text-foreground mr-2 text-xs">
                      {c.author.username}
                    </span>
                    <span className="text-muted-foreground text-xs sm:text-sm">
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
              placeholder="Leave feedback on the mix or instrumentation..."
              className="flex-1 text-sm bg-card border border-border rounded-full px-4 py-2 text-foreground outline-none focus:border-pink-600"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="px-4 py-2 rounded-full bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Post
            </button>
          </form>
        </div>
      )}
    </article>
  );
};

export default MusicCard;
