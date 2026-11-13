"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  Code2,
  GitFork,
  ExternalLink,
  Copy,
  Check,
  Bookmark,
  Heart,
  MessageCircle,
  Share2,
  Terminal,
  Play,
  RotateCcw,
  Mic,
  Cpu,
  BookOpen,
  ChevronDown,
  ChevronUp,
  FileText,
  MoreHorizontal,
} from "lucide-react";
import { SwitchPost } from "@/lib/data/worldsData";
import AudioCommentPlayer from "../ui/AudioCommentPlayer";
import AudioCommentRecorder from "../ui/AudioCommentRecorder";
import { addComment, addAudioComment } from "@/lib/actions/thought.actions";

interface TechCardProps {
  post: SwitchPost;
  currentUserId?: string;
  onLike?: (id: string) => void;
  onComment?: (id: string, text: string) => void;
  onShare?: (post: SwitchPost) => void;
}

export const TechCard: React.FC<TechCardProps> = ({
  post,
  currentUserId = "current-user",
  onLike,
  onComment,
  onShare,
}) => {
  const [copied, setCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(post.saved || false);
  const [isLiked, setIsLiked] = useState(post.likes.includes(currentUserId));
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [commentOpen, setCommentOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentsList, setCommentsList] = useState(post.comments || []);
  const [saveToast, setSaveToast] = useState(false);
  const [showAudioRecorder, setShowAudioRecorder] = useState(false);
  const [isCodeExpanded, setIsCodeExpanded] = useState(false);

  // Embedded Mini Compiler / Execution Sandbox state
  const [isRunning, setIsRunning] = useState(false);
  const [executionResult, setExecutionResult] = useState<{
    status: string;
    exitCode: number;
    stdout: string;
    stderr: string;
    executionTimeMs: number;
    memoryUsedKb: number;
  } | null>(null);

  const tech = post.tech;
  const codeLines = tech?.codeSnippet ? tech.codeSnippet.split("\n") : [];
  const isLongSnippet = codeLines.length > 10;
  const displayedCodeLines = isLongSnippet && !isCodeExpanded ? codeLines.slice(0, 10) : codeLines;

  const handleCopyCode = () => {
    if (!tech?.codeSnippet) return;
    navigator.clipboard.writeText(tech.codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunCode = async () => {
    if (!tech?.codeSnippet) return;
    setIsRunning(true);
    setExecutionResult(null);

    try {
      const res = await fetch("/api/v1/worlds/tech/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: tech.language || "javascript",
          code: tech.codeSnippet,
        }),
      });
      const data = await res.json();
      setExecutionResult(data);
    } catch (err: any) {
      setExecutionResult({
        status: "error",
        exitCode: 1,
        stdout: "",
        stderr: err.message || "Failed to reach sandbox runner",
        executionTimeMs: 0,
        memoryUsedKb: 0,
      });
    } finally {
      setIsRunning(false);
    }
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

  const handleCommentSubmit = async (e: React.FormEvent) => {
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
    if (onComment) onComment(post._id, commentText.trim());
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

  const timeAgo = (() => {
    try {
      const diffMs = Date.now() - new Date(post.createdAt).getTime();
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHrs < 1) return "Just now";
      if (diffHrs < 24) return `${diffHrs}h ago`;
      return `${Math.floor(diffHrs / 24)}d ago`;
    } catch {
      return "2h ago";
    }
  })();

  const contentParts = post.content.split("\n\n");
  const hasTitle = contentParts.length > 1;
  const postTitle = hasTitle ? contentParts[0] : null;
  const postBody = hasTitle ? contentParts.slice(1).join("\n\n") : post.content;

  return (
    <article className="world-tech switch-card w-full">
      {/* Header matching screenshot */}
      <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#E2E8F0] dark:border-border bg-white dark:bg-card">
        <div className="flex items-center gap-3">
          <Link href={`/profile/${post.author._id}`}>
            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#2463D3] dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-900/40 hover:scale-105 transition-transform">
              <Code2 className="w-5 h-5" />
            </div>
          </Link>
          <div>
            <div className="flex items-center gap-1.5">
              <Link
                href={`/profile/${post.author._id}`}
                className="font-bold text-[#17243A] dark:text-white hover:text-[#2463D3] transition-colors text-sm"
              >
                {post.author.username}
              </Link>
              {post.author.verified && (
                <span className="w-4 h-4 rounded-full bg-[#2463D3] text-white flex items-center justify-center text-[9px] shrink-0">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {post.author.bio ? `${post.author.bio} • ` : ""}{timeAgo}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleSaveClick}
            className={`p-2 rounded-md transition-colors cursor-pointer ${
              isSaved
                ? "bg-[#2463D3] text-white"
                : "text-muted-foreground hover:text-[#2463D3] hover:bg-slate-50 dark:hover:bg-secondary/40"
            }`}
            title={isSaved ? "Saved to Bookmarks" : "Save"}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
          </button>
          <button
            className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-slate-50 dark:hover:bg-secondary/40 transition-colors"
            title="Options"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Save Notification Toast */}
      {saveToast && (
        <div className="bg-[#2463D3] text-white text-xs px-4 py-2 text-center font-medium transition-all">
          {isSaved ? "✓ Added to your Saved Code & Repositories" : "Removed from Saved"}
        </div>
      )}

      {/* Content */}
      <div className="p-4 sm:p-5 space-y-3.5">
        {/* Post Title matching screenshot */}
        {postTitle && (
          <h3 className="font-bold text-base sm:text-lg text-[#17243A] dark:text-white leading-snug">
            {postTitle.split(/(`[^`]+`|\b\w+\(\))/g).map((segment, idx) => {
              if (segment.startsWith("`") && segment.endsWith("`")) {
                return (
                  <code
                    key={idx}
                    className="font-mono bg-slate-100 dark:bg-slate-800 text-[#17243A] dark:text-blue-300 px-1 py-0.5 rounded text-sm font-bold"
                  >
                    {segment.slice(1, -1)}
                  </code>
                );
              }
              if (/\b\w+\(\)/.test(segment)) {
                return (
                  <code
                    key={idx}
                    className="font-mono bg-slate-100 dark:bg-slate-800 text-[#17243A] dark:text-blue-300 px-1 py-0.5 rounded text-sm font-bold"
                  >
                    {segment}
                  </code>
                );
              }
              return <span key={idx}>{segment}</span>;
            })}
          </h3>
        )}

        <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
          {postBody}
        </p>

        {/* Media Preview if attached */}
        {post.image && (
          <div className="rounded-xl overflow-hidden border border-border bg-black/40 max-h-96">
            <img
              src={post.image}
              alt="Technical diagram"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.style.display = "none";
              }}
              className="w-full h-auto object-contain"
            />
          </div>
        )}

        {/* First-Class Code Snippet Box with Line Numbers & Syntax Bar */}
        {tech?.codeSnippet && (
          <div className="rounded-md overflow-hidden border border-border bg-[#0f172a] text-slate-100 text-xs font-mono">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-3.5 py-2 bg-[#1e293b] border-b border-border/80">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-blue-400" />
                <span className="font-bold text-slate-200 text-xs uppercase tracking-wider">
                  {tech.language || "CODE"}
                </span>
                <span className="text-[10px] text-slate-400 font-sans hidden sm:inline">
                  • {codeLines.length} lines
                </span>
              </div>

              <div className="flex items-center gap-2">
                {tech.isExecutable && (
                  <button
                    type="button"
                    onClick={handleRunCode}
                    disabled={isRunning}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 transition-colors cursor-pointer"
                    title="Run code in isolated execution sandbox"
                  >
                    {isRunning ? (
                      <>
                        <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                        <span>Running...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Run Code</span>
                      </>
                    )}
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="flex items-center gap-1 px-2 py-1 rounded text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>

            {/* Code Body with Line Numbers Column */}
            <div className="flex overflow-x-auto leading-relaxed text-[13px] font-mono">
              {/* Line Numbers Column */}
              <div className="w-10 bg-[#0b1120] border-r border-slate-800 select-none py-3 px-1 text-right text-slate-500 text-xs shrink-0">
                {displayedCodeLines.map((_, i) => (
                  <div key={i}>{String(i + 1).padStart(2, "0")}</div>
                ))}
              </div>

              {/* Code Lines */}
              <pre className="p-3 overflow-x-auto text-slate-100 text-[13px] leading-relaxed flex-1 whitespace-pre">
                <code>{displayedCodeLines.join("\n")}</code>
              </pre>
            </div>

            {/* Expand / Collapse Toggle for Long Snippets */}
            {isLongSnippet && (
              <div className="border-t border-slate-800 bg-[#0b1120] px-3 py-1.5 flex items-center justify-between text-xs text-slate-400">
                <span>{isCodeExpanded ? `Showing all ${codeLines.length} lines` : `Showing 10 of ${codeLines.length} lines`}</span>
                <button
                  type="button"
                  onClick={() => setIsCodeExpanded(!isCodeExpanded)}
                  className="text-blue-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  {isCodeExpanded ? (
                    <>
                      <span>Collapse Code</span>
                      <ChevronUp className="w-3.5 h-3.5" />
                    </>
                  ) : (
                    <>
                      <span>Expand Full Code ({codeLines.length - 10} more lines)</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Embedded Terminal Sandbox Output */}
            {executionResult && (
              <div className="border-t border-border bg-[#04070a] p-3.5 space-y-2 animate-in fade-in">
                <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground border-b border-border/60 pb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${
                        executionResult.status === "success"
                          ? "bg-emerald-400"
                          : executionResult.status === "timeout"
                          ? "bg-amber-400"
                          : "bg-red-400"
                      }`}
                    />
                    <span className="font-semibold text-foreground">
                      SANDBOX OUTPUT (Exit Code: {executionResult.exitCode})
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-primary">
                      <Cpu className="w-3 h-3" />
                      {executionResult.executionTimeMs}ms
                    </span>
                    <span>{executionResult.memoryUsedKb} KB RAM</span>
                  </div>
                </div>

                {executionResult.stdout && (
                  <pre className="text-emerald-400 text-xs font-mono whitespace-pre-wrap leading-relaxed">
                    {executionResult.stdout}
                  </pre>
                )}
                {executionResult.stderr && (
                  <pre className="text-red-400 text-xs font-mono whitespace-pre-wrap leading-relaxed">
                    {executionResult.stderr}
                  </pre>
                )}
              </div>
            )}
          </div>
        )}

        {/* Document / Article Attachment Card (Matching Screenshot) */}
        {tech?.docAttachment && (
          <a
            href={tech.docAttachment.url}
            target="_blank"
            rel="noreferrer"
            className="p-3.5 rounded-lg border border-[#E2E8F0] dark:border-border bg-[#F8FAFC] dark:bg-secondary/40 hover:border-[#2463D3] transition-colors flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-white dark:bg-card border border-[#E2E8F0] dark:border-border text-[#2463D3]">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                  {tech.docAttachment.category}
                </div>
                <div className="text-sm font-bold text-[#17243A] dark:text-white group-hover:text-[#2463D3] transition-colors">
                  {tech.docAttachment.title}
                </div>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-[#2463D3] transition-colors" />
          </a>
        )}

        {/* Optional Contextual Attachments (Cleanly separated from main content) */}
        {(tech?.githubUrl || tech?.demoUrl || tech?.docUrl) && (
          <div className="space-y-1.5 pt-1">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Optional Context Links
            </div>
            <div className="flex flex-wrap gap-2">
              {tech.githubUrl && (
                <a
                  href={tech.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium bg-secondary text-foreground border border-border hover:border-primary/50 transition-colors group"
                >
                  <GitFork className="w-3.5 h-3.5 text-primary group-hover:scale-110 transition-transform" />
                  <span>GitHub Repository</span>
                  <ExternalLink className="w-3 h-3 text-muted-foreground ml-0.5" />
                </a>
              )}
              {tech.docUrl && (
                <a
                  href={tech.docUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium bg-secondary text-foreground border border-border hover:border-primary/50 transition-colors group"
                >
                  <BookOpen className="w-3.5 h-3.5 text-primary group-hover:scale-110 transition-transform" />
                  <span>Documentation</span>
                  <ExternalLink className="w-3 h-3 text-muted-foreground ml-0.5" />
                </a>
              )}
              {tech.demoUrl && (
                <a
                  href={tech.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold bg-primary/10 text-primary border border-primary/25 hover:bg-primary/20 transition-colors group"
                >
                  <ExternalLink className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                  <span>Interactive Demo</span>
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Engagement Actions matching screenshot */}
      <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-t border-[#E2E8F0] dark:border-border bg-white dark:bg-card text-muted-foreground text-xs sm:text-sm">
        <div className="flex items-center gap-6">
          <button
            onClick={handleLikeClick}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
              isLiked ? "text-[#2463D3] font-semibold" : "hover:text-[#2463D3]"
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? "fill-[#2463D3] text-[#2463D3]" : ""}`} />
            <span>{likeCount}</span>
          </button>

          <button
            onClick={() => setCommentOpen(!commentOpen)}
            className="flex items-center gap-1.5 hover:text-[#2463D3] transition-colors cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{commentsList.length} comments</span>
          </button>

          <button
            onClick={handleSaveClick}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
              isSaved ? "text-[#2463D3] font-semibold" : "hover:text-[#2463D3]"
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? "fill-[#2463D3] text-[#2463D3]" : ""}`} />
            <span>{isSaved ? "Saved" : "Save"}</span>
          </button>

          <button
            onClick={() => onShare && onShare(post)}
            className="flex items-center gap-1.5 hover:text-[#2463D3] transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Comments Thread with Audio Comment Support */}
      {commentOpen && (
        <div className="p-4 sm:p-5 border-t border-border bg-secondary/40 space-y-4">
          <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
            {commentsList.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-2">
                No engineering discussions yet. Leave a question or 30s audio review!
              </p>
            ) : (
              commentsList.map((c, i) => (
                <div key={c._id || i} className="flex gap-2.5 text-sm">
                  <img
                    src={c.author.photo || "https://api.dicebear.com/7.x/adventurer/svg?seed=Engineer"}
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
            <form onSubmit={handleCommentSubmit} className="flex items-center gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Ask a technical question or share feedback..."
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
                disabled={!commentText.trim()}
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

export default TechCard;
