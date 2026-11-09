"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import {
  Code2,
  Image as ImageIcon,
  Video,
  ChevronDown,
  GitFork,
  ExternalLink,
  BookOpen,
  Globe,
  X,
  Check,
  Send,
  Loader2,
  Terminal,
  Copy,
  Info,
} from "lucide-react";
import { createThought } from "@/lib/actions/thought.actions";

export const TECH_TOPICS = [
  "Software",
  "AI / ML",
  "Systems & OS",
  "Hardware",
  "Networking",
  "Cybersecurity",
  "Cloud & Infra",
  "Data",
] as const;

export type TechTopic = (typeof TECH_TOPICS)[number];

const PROGRAMMING_LANGUAGES = [
  { id: "javascript", label: "JavaScript" },
  { id: "typescript", label: "TypeScript" },
  { id: "python", label: "Python" },
  { id: "rust", label: "Rust" },
  { id: "cpp", label: "C++" },
  { id: "c", label: "C" },
  { id: "go", label: "Go" },
  { id: "shell", label: "Linux Shell / Bash" },
  { id: "sql", label: "SQL" },
];

interface TechComposerProps {
  onPublished?: (post: any) => void;
  onCancel?: () => void;
  isModal?: boolean;
}

export const TechComposer: React.FC<TechComposerProps> = ({
  onPublished,
  onCancel,
  isModal = false,
}) => {
  const { data: session } = useSession();
  const currentUserId = (session?.user as any)?.id || "current-user";
  const currentUsername = session?.user?.name || "You";
  const userPhoto =
    session?.user?.image ||
    `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(currentUsername)}`;

  const [content, setContent] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>(["Systems & OS"]);

  // Media attachments
  const [showImageInput, setShowImageInput] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [showVideoInput, setShowVideoInput] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

  // Code snippet
  const [showCodeSnippet, setShowCodeSnippet] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState("cpp");
  const [codeContent, setCodeContent] = useState("");
  const [copiedPreview, setCopiedPreview] = useState(false);

  // More dropdown & Optional Attachments
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showGithubInput, setShowGithubInput] = useState(false);
  const [githubUrl, setGithubUrl] = useState("");
  const [showDemoInput, setShowDemoInput] = useState(false);
  const [demoUrl, setDemoUrl] = useState("");
  const [showDocInput, setShowDocInput] = useState(false);
  const [docUrl, setDocUrl] = useState("");
  const [showArticleInput, setShowArticleInput] = useState(false);
  const [articleUrl, setArticleUrl] = useState("");

  const [isPublishing, setIsPublishing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic)
        ? prev.filter((t) => t !== topic)
        : prev.length < 3
        ? [...prev, topic]
        : prev
    );
  };

  const handleCopyCodePreview = () => {
    if (!codeContent) return;
    navigator.clipboard.writeText(codeContent);
    setCopiedPreview(true);
    setTimeout(() => setCopiedPreview(false), 2000);
  };

  const handlePublish = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!content.trim() && !codeContent.trim()) {
      setErrorMsg("Please share your technical concept, explanation, or code snippet.");
      return;
    }

    setIsPublishing(true);
    setErrorMsg(null);

    try {
      const techPayload = {
        techStack: selectedTopics,
        topics: selectedTopics,
        codeSnippet: showCodeSnippet && codeContent.trim() ? codeContent.trim() : undefined,
        language: codeLanguage,
        isExecutable: codeLanguage === "javascript" || codeLanguage === "typescript",
        githubUrl: githubUrl.trim() || undefined,
        demoUrl: demoUrl.trim() || undefined,
        docUrl: docUrl.trim() || undefined,
        postType: "explanation",
      };

      const newPost = await createThought({
        content: content.trim() || (codeContent ? "Code snippet shared via Switch Tech" : ""),
        author: currentUserId,
        world: "Technology",
        image: imageUrl.trim() || undefined,
        tech: techPayload,
      });

      // Clear form
      setContent("");
      setCodeContent("");
      setImageUrl("");
      setVideoUrl("");
      setGithubUrl("");
      setDemoUrl("");
      setDocUrl("");
      setArticleUrl("");
      setShowCodeSnippet(false);
      setShowImageInput(false);
      setShowVideoInput(false);
      setShowGithubInput(false);
      setShowDemoInput(false);
      setShowDocInput(false);
      setShowArticleInput(false);

      if (onPublished) {
        onPublished(newPost);
      }
    } catch (err: any) {
      console.error("Publishing tech thought failed:", err);
      setErrorMsg(err.message || "Failed to publish technical post.");
    } finally {
      setIsPublishing(false);
    }
  };

  const codeLines = codeContent.split("\n");

  return (
    <div className="world-tech w-full bg-card rounded-lg border border-border overflow-hidden text-foreground animate-in fade-in">
      {/* 1. Header: Profile, Destination & Scope */}
      <div className="p-4 sm:p-5 border-b border-border bg-card flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={userPhoto}
            alt={currentUsername}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(currentUsername)}`;
            }}
            className="w-9 h-9 rounded-full object-cover border border-border shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-foreground">{currentUsername}</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-900/40">
                <Code2 className="w-3 h-3" />
                Posting to Tech World
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Public • Technical knowledge & discussions
            </p>
          </div>
        </div>

        {isModal && onCancel && (
          <button
            onClick={onCancel}
            className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* 2. Main Textarea */}
        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            placeholder="What's happening in tech? Share an idea, explain a concept, show what you're building, or start a discussion..."
            className="w-full bg-transparent text-sm sm:text-base text-foreground placeholder:text-muted-foreground outline-none resize-none leading-relaxed"
          />
          <p className="text-[11px] text-muted-foreground italic flex items-center gap-1 mt-1">
            <Info className="w-3 h-3 text-primary shrink-0" />
            <span>Example: I finally understood how Linux handles context switching via CR3 page tables...</span>
          </p>
        </div>

        {/* 3. Topic Tag Selector (Multi-select, max 3) */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">Select relevant topics (max 3):</span>
            <span className="font-mono text-[11px]">{selectedTopics.length}/3 selected</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {TECH_TOPICS.map((topic) => {
              const isSelected = selectedTopics.includes(topic);
              return (
                <button
                  key={topic}
                  type="button"
                  onClick={() => toggleTopic(topic)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer border ${
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-secondary text-muted-foreground hover:text-foreground border-border hover:border-primary/40"
                  }`}
                >
                  #{topic}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Interactive Code Snippet Box (when enabled) */}
        {showCodeSnippet && (
          <div className="rounded-md overflow-hidden border border-border bg-[#0f172a] text-slate-100 text-xs font-mono animate-in fade-in space-y-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-3.5 py-2 bg-[#1e293b] border-b border-border/80">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-blue-400" />
                <span className="font-bold text-slate-200 text-xs tracking-wider">CODE SNIPPET</span>
                <span className="text-[10px] text-slate-400 font-sans hidden sm:inline">
                  (Line numbers & syntax formatting enabled)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={codeLanguage}
                  onChange={(e) => setCodeLanguage(e.target.value)}
                  className="bg-card text-foreground border border-border rounded px-2 py-1 text-xs outline-none cursor-pointer"
                >
                  {PROGRAMMING_LANGUAGES.map((lang) => (
                    <option key={lang.id} value={lang.id}>
                      {lang.label}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={handleCopyCodePreview}
                  className="px-2 py-1 rounded text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {copiedPreview ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedPreview ? "Copied" : "Copy"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowCodeSnippet(false);
                    setCodeContent("");
                  }}
                  className="p-1 rounded text-slate-400 hover:text-white"
                  title="Remove snippet"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Split Line Numbers + Textarea */}
            <div className="flex min-h-[160px] max-h-80 overflow-y-auto">
              {/* Line Numbers Column */}
              <div className="w-10 bg-[#0b1120] border-r border-slate-800 select-none py-3 px-1 text-right text-slate-500 font-mono text-xs leading-relaxed shrink-0">
                {codeLines.map((_, i) => (
                  <div key={i}>{String(i + 1).padStart(2, "0")}</div>
                ))}
              </div>

              {/* Code Input */}
              <textarea
                value={codeContent}
                onChange={(e) => setCodeContent(e.target.value)}
                placeholder="// Paste or write your code snippet here...&#10;void context_switch(struct task *next) {&#10;    switch_to(next);&#10;}"
                className="flex-1 bg-transparent p-3 text-xs font-mono text-slate-100 outline-none leading-relaxed resize-none overflow-x-auto whitespace-pre font-mono"
                spellCheck={false}
              />
            </div>
          </div>
        )}

        {/* 5. Photo Input (when enabled) */}
        {showImageInput && (
          <div className="p-3 rounded-xl bg-secondary/60 border border-border space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between text-xs font-semibold text-foreground">
              <span>Image / Architecture Diagram URL</span>
              <button
                type="button"
                onClick={() => {
                  setShowImageInput(false);
                  setImageUrl("");
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/... or paste image URL"
              className="w-full bg-card border border-border rounded-lg px-3 py-1.5 text-xs text-foreground outline-none focus:border-primary"
            />
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Preview"
                className="max-h-40 rounded-lg object-contain border border-border mt-2"
              />
            )}
          </div>
        )}

        {/* 6. Video Input (when enabled) */}
        {showVideoInput && (
          <div className="p-3 rounded-xl bg-secondary/60 border border-border space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between text-xs font-semibold text-foreground">
              <span>Video / Demo Walkthrough URL</span>
              <button
                type="button"
                onClick={() => {
                  setShowVideoInput(false);
                  setVideoUrl("");
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://... (Direct video link or MP4)"
              className="w-full bg-card border border-border rounded-lg px-3 py-1.5 text-xs text-foreground outline-none focus:border-primary"
            />
          </div>
        )}

        {/* 7. Optional Attachments Inputs (Triggered via "More ▾") */}
        {(showGithubInput || showDemoInput || showDocInput || showArticleInput) && (
          <div className="p-3.5 rounded-xl bg-secondary/40 border border-border space-y-3 animate-in fade-in">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Info className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="font-semibold text-foreground">
                Optional Contextual Attachments (Choose only when they add context)
              </span>
            </div>

            {/* GitHub Repo Input */}
            {showGithubInput && (
              <div className="flex items-center gap-2">
                <GitFork className="w-4 h-4 text-primary shrink-0" />
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="Attach your GitHub repository (e.g. https://github.com/user/repo)"
                  className="flex-1 bg-card border border-border rounded-lg px-3 py-1.5 text-xs text-foreground outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => {
                    setShowGithubInput(false);
                    setGithubUrl("");
                  }}
                  className="p-1 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Project / Demo Link Input */}
            {showDemoInput && (
              <div className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-primary shrink-0" />
                <input
                  type="url"
                  value={demoUrl}
                  onChange={(e) => setDemoUrl(e.target.value)}
                  placeholder="Project or Live Demo link (e.g. https://demo.mysite.com)"
                  className="flex-1 bg-card border border-border rounded-lg px-3 py-1.5 text-xs text-foreground outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => {
                    setShowDemoInput(false);
                    setDemoUrl("");
                  }}
                  className="p-1 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Documentation Link Input */}
            {showDocInput && (
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary shrink-0" />
                <input
                  type="url"
                  value={docUrl}
                  onChange={(e) => setDocUrl(e.target.value)}
                  placeholder="Official Documentation link (e.g. https://docs.kernel.org/...)"
                  className="flex-1 bg-card border border-border rounded-lg px-3 py-1.5 text-xs text-foreground outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => {
                    setShowDocInput(false);
                    setDocUrl("");
                  }}
                  className="p-1 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Website / Article Link Input */}
            {showArticleInput && (
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary shrink-0" />
                <input
                  type="url"
                  value={articleUrl}
                  onChange={(e) => setArticleUrl(e.target.value)}
                  placeholder="Reference Article or Whitepaper URL"
                  className="flex-1 bg-card border border-border rounded-lg px-3 py-1.5 text-xs text-foreground outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => {
                    setShowArticleInput(false);
                    setArticleUrl("");
                  }}
                  className="p-1 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}

        {errorMsg && (
          <div className="p-2.5 rounded-lg bg-destructive/15 text-destructive text-xs font-semibold">
            {errorMsg}
          </div>
        )}
      </div>

      {/* 8. Action Bar & Submissions (The 3 Direct Actions + More ▾ Dropdown) */}
      <div className="px-4 sm:px-5 py-3 border-t border-border bg-card flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 relative">
          {/* Action 1: Photo */}
          <button
            type="button"
            onClick={() => setShowImageInput(!showImageInput)}
            className={`px-2.5 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              showImageInput
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 border border-border"
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-blue-500" />
            <span>Photo</span>
          </button>

          {/* Action 2: Video */}
          <button
            type="button"
            onClick={() => setShowVideoInput(!showVideoInput)}
            className={`px-2.5 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              showVideoInput
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 border border-border"
            }`}
          >
            <Video className="w-3.5 h-3.5 text-purple-500" />
            <span>Video</span>
          </button>

          {/* Action 3: Code Snippet */}
          <button
            type="button"
            onClick={() => setShowCodeSnippet(!showCodeSnippet)}
            className={`px-2.5 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              showCodeSnippet
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 border border-border"
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Code snippet</span>
          </button>

          {/* More ▾ Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="px-2.5 py-1.5 rounded-md text-xs font-medium bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 border border-border transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>More</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {showMoreMenu && (
              <div className="absolute left-0 bottom-full mb-2 w-64 p-1.5 rounded-md bg-card border border-border shadow-md z-30 space-y-1 animate-in fade-in zoom-in-95">
                <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border">
                  Optional Context Links
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowGithubInput(true);
                    setShowMoreMenu(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded text-xs font-medium text-foreground hover:bg-secondary flex items-center gap-2 cursor-pointer"
                >
                  <GitFork className="w-3.5 h-3.5 text-primary" />
                  <span>GitHub repository</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowDemoInput(true);
                    setShowMoreMenu(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded text-xs font-medium text-foreground hover:bg-secondary flex items-center gap-2 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-primary" />
                  <span>Project / Demo link</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowDocInput(true);
                    setShowMoreMenu(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded text-xs font-medium text-foreground hover:bg-secondary flex items-center gap-2 cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5 text-primary" />
                  <span>Documentation link</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowArticleInput(true);
                    setShowMoreMenu(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded text-xs font-medium text-foreground hover:bg-secondary flex items-center gap-2 cursor-pointer"
                >
                  <Globe className="w-3.5 h-3.5 text-primary" />
                  <span>Website / Reference article</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Submit & Optional Reminder */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-muted-foreground hidden sm:inline">
            Attachments optional
          </span>
          <button
            type="button"
            onClick={handlePublish}
            disabled={isPublishing}
            className="px-4 py-1.5 rounded-md bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
          >
            {isPublishing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Publish</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TechComposer;

