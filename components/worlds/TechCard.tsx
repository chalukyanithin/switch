"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Code2, GitFork, ExternalLink, Copy, Check, Bookmark, Heart, MessageCircle, Share2, Terminal } from "lucide-react";
import { SwitchPost } from "@/lib/data/worldsData";

interface TechCardProps {
  post: SwitchPost;
  currentUserId?: string;
  onLike?: (id: string) => void;
  onComment?: (id: string, text: string) => void;
  onShare?: (post: SwitchPost) => void;
}

export const TechCard: React.FC<TechCardProps> = ({
  post,
  currentUserId,
  onLike,
  onComment,
  onShare,
}) => {
  const [copied, setCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(post.saved || false);
  const [isLiked, setIsLiked] = useState(currentUserId ? post.likes.includes(currentUserId) : false);
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [commentOpen, setCommentOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentsList, setCommentsList] = useState(post.comments || []);
  const [saveToast, setSaveToast] = useState(false);

  const tech = post.tech;

  const handleCopyCode = () => {
    if (!tech?.codeSnippet) return;
    navigator.clipboard.writeText(tech.codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
    <article className="w-full bg-card rounded-2xl border border-border shadow-xs hover:shadow-md transition-shadow overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border">
        <div className="flex items-center gap-3">
          <Link href={`/profile/${post.author._id}`}>
            <img
              src={post.author.photo || "https://api.dicebear.com/7.x/adventurer/svg?seed=Coder"}
              alt={post.author.username}
              className="w-11 h-11 rounded-full object-cover border border-border hover:ring-2 hover:ring-cyan-500/50 transition-all"
            />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <Link href={`/profile/${post.author._id}`} className="font-semibold text-foreground hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                {post.author.username}
              </Link>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                <Code2 className="w-3 h-3" />
                Technology World
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {post.author.bio ? `${post.author.bio} • ` : ""}Software Engineer
            </p>
          </div>
        </div>

        <button
          onClick={handleSaveClick}
          className={`p-2 rounded-xl transition-all cursor-pointer ${
            isSaved
              ? "bg-cyan-600 text-white shadow-xs shadow-cyan-600/30"
              : "text-muted-foreground hover:text-cyan-600 hover:bg-secondary"
          }`}
          title={isSaved ? "Saved to Bookmarks" : "Save Project"}
        >
          <Bookmark className={`w-5 h-5 ${isSaved ? "fill-white" : ""}`} />
        </button>
      </div>

      {/* Save Notification Toast */}
      {saveToast && (
        <div className="bg-cyan-600 text-white text-xs px-4 py-2 text-center font-medium transition-all">
          {isSaved ? "✓ Added to your Saved Code & Repositories" : "Removed from Saved"}
        </div>
      )}

      {/* Content */}
      <div className="p-4 sm:p-5 space-y-4">
        <p className="text-foreground text-base leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>

        {/* Tech Stack Pills */}
        {tech?.techStack && tech.techStack.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {tech.techStack.map((tag, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-secondary text-foreground border border-border"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Code Snippet Box */}
        {tech?.codeSnippet && (
          <div className="rounded-xl overflow-hidden border border-border bg-[#0d1117] text-gray-200 text-xs font-mono shadow-inner">
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#161b22] border-b border-gray-800">
              <div className="flex items-center gap-2 text-gray-400">
                <Terminal className="w-3.5 h-3.5" />
                <span className="font-semibold text-xs tracking-wide">SNIPPET</span>
              </div>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs text-gray-300 hover:text-white bg-gray-800/80 hover:bg-gray-700 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>
            <pre className="p-4 overflow-x-auto leading-relaxed text-gray-300 text-[13px] no-scrollbar">
              <code>{tech.codeSnippet}</code>
            </pre>
          </div>
        )}

        {/* Project Links / Action Bar */}
        {(tech?.githubUrl || tech?.demoUrl) && (
          <div className="flex flex-wrap gap-3 pt-1">
            {tech.githubUrl && (
              <a
                href={tech.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-secondary text-foreground border border-border hover:bg-secondary/80 transition-colors"
              >
                <GitFork className="w-3.5 h-3.5 text-cyan-500" />
                <span>GitHub Repository</span>
              </a>
            )}
            {tech.demoUrl && (
              <a
                href={tech.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Live Interactive Demo</span>
              </a>
            )}
          </div>
        )}
      </div>

      {/* Engagement Actions */}
      <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-t border-border bg-card/60 text-muted-foreground text-sm">
        <div className="flex items-center gap-6">
          <button
            onClick={handleLikeClick}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
              isLiked ? "text-cyan-600 font-semibold" : "hover:text-cyan-600"
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? "fill-cyan-600 text-cyan-600" : ""}`} />
            <span>{likeCount}</span>
          </button>

          <button
            onClick={() => setCommentOpen(!commentOpen)}
            className="flex items-center gap-1.5 hover:text-cyan-600 transition-colors cursor-pointer"
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

        <span className="text-xs text-muted-foreground font-mono">
          Technology World
        </span>
      </div>

      {/* Comments Thread */}
      {commentOpen && (
        <div className="p-4 sm:p-5 border-t border-border bg-secondary/40">
          <div className="space-y-3 mb-4 max-h-56 overflow-y-auto pr-1">
            {commentsList.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-2">
                No engineering discussions yet. Leave a question or review!
              </p>
            ) : (
              commentsList.map((c, i) => (
                <div key={c._id || i} className="flex gap-2.5 text-sm">
                  <img
                    src={c.author.photo || "https://api.dicebear.com/7.x/adventurer/svg?seed=Engineer"}
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
              placeholder="Ask a technical question or share feedback..."
              className="flex-1 text-sm bg-card border border-border rounded-full px-4 py-2 text-foreground outline-none focus:border-cyan-600"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="px-4 py-2 rounded-full bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Post
            </button>
          </form>
        </div>
      )}
    </article>
  );
};

export default TechCard;
