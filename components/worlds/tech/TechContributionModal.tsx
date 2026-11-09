"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import {
  MessageSquare,
  HelpCircle,
  Code2,
  BookOpen,
  X,
  Plus,
  Send,
  Loader2,
  Github,
  ExternalLink,
  ChevronLeft,
  Check,
  Terminal,
  Layers,
  Sparkles,
} from "lucide-react";
import { createThought } from "@/lib/actions/thought.actions";
import { TECH_TOPICS } from "../TechComposer";

export type ContributionType = "discussion" | "question" | "project" | "explanation";

interface TechContributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublished?: (post: any) => void;
  initialType?: ContributionType | null;
}

const PROGRAMMING_LANGUAGES = [
  { id: "javascript", label: "JavaScript" },
  { id: "typescript", label: "TypeScript" },
  { id: "rust", label: "Rust" },
  { id: "python", label: "Python" },
  { id: "cpp", label: "C++" },
  { id: "c", label: "C" },
  { id: "go", label: "Go" },
  { id: "sql", label: "SQL" },
  { id: "shell", label: "Bash / Shell" },
];

export const TechContributionModal: React.FC<TechContributionModalProps> = ({
  isOpen,
  onClose,
  onPublished,
  initialType = null,
}) => {
  const { data: session } = useSession();
  const currentUserId = (session?.user as any)?.id || "current-user";
  const currentUsername = session?.user?.name || "You";
  const userPhoto =
    session?.user?.image ||
    `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(currentUsername)}`;

  const [selectedType, setSelectedType] = useState<ContributionType | null>(initialType);

  // Common fields
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>(["Software"]);

  // Code snippet fields
  const [includeCode, setIncludeCode] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState("javascript");
  const [codeSnippet, setCodeSnippet] = useState("");

  // Project fields
  const [projectName, setProjectName] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [techStackInput, setTechStackInput] = useState("Next.js, TypeScript, TailwindCSS");

  // Question fields
  const [expectedBehavior, setExpectedBehavior] = useState("");

  // Knowledge / Tutorial fields
  const [docReferenceUrl, setDocReferenceUrl] = useState("");

  const [isPublishing, setIsPublishing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic)
        ? prev.filter((t) => t !== topic)
        : prev.length < 3
        ? [...prev, topic]
        : prev
    );
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !title.trim()) {
      setErrorMsg("Please enter a title and description before publishing.");
      return;
    }

    setIsPublishing(true);
    setErrorMsg(null);

    const fullContent = title.trim()
      ? `### ${title.trim()}\n\n${content.trim()}${
          expectedBehavior.trim() ? `\n\n**Expected Behavior:**\n${expectedBehavior.trim()}` : ""
        }`
      : content.trim();

    const techStackArray = techStackInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const finalTechData = {
      techStack: techStackArray.length > 0 ? techStackArray : selectedTopics,
      topics: selectedTopics,
      githubUrl: githubUrl.trim() || undefined,
      demoUrl: demoUrl.trim() || undefined,
      docUrl: docReferenceUrl.trim() || undefined,
      codeSnippet: includeCode && codeSnippet.trim() ? codeSnippet.trim() : undefined,
      language: includeCode ? codeLanguage : undefined,
      isExecutable: includeCode && (codeLanguage === "javascript" || codeLanguage === "typescript"),
      postType: selectedType || "discussion",
    };

    try {
      const res = await createThought({
        author: currentUserId,
        content: fullContent,
        world: "Technology",
        tech: finalTechData,
      });

      const newPost = {
        _id: res?._id || `tech-${Date.now()}`,
        content: fullContent,
        world: "Technology",
        author: {
          _id: currentUserId,
          username: currentUsername,
          photo: userPhoto,
          verified: true,
        },
        createdAt: new Date().toISOString(),
        likes: [],
        comments: [],
        tech: finalTechData,
      };

      if (onPublished) onPublished(newPost);
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Failed to publish to Tech World. Please try again.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 animate-in fade-in duration-150 world-tech">
      <div className="bg-white dark:bg-card w-full max-w-2xl rounded-lg border border-[#E2E8F0] dark:border-border shadow-xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E2E8F0] dark:border-border bg-white dark:bg-card">
          <div className="flex items-center gap-2">
            {selectedType && (
              <button
                type="button"
                onClick={() => setSelectedType(null)}
                className="p-1 rounded hover:bg-[#F5F7FA] dark:hover:bg-secondary text-muted-foreground mr-1"
                title="Choose different contribution type"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <h3 className="font-bold text-[#17243A] dark:text-white text-sm sm:text-base">
                {selectedType === "discussion" && "Start an Engineering Discussion"}
                {selectedType === "question" && "Ask a Technical Question"}
                {selectedType === "project" && "Showcase What You Built"}
                {selectedType === "explanation" && "Share Knowledge or Tutorial"}
                {!selectedType && "Create something in Tech"}
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Contributing as @{currentUsername} in Tech World
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-[#F5F7FA] dark:hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* STEP 1: Select Type if not chosen yet (Directly matches the screenshot!) */}
          {!selectedType ? (
            <div className="space-y-4">
              <div className="text-center sm:text-left space-y-1">
                <p className="text-xs text-muted-foreground">
                  Don&apos;t just post into a generic textbox. Choose the format tailored to your contribution:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                {/* 1. Discussion */}
                <button
                  type="button"
                  onClick={() => setSelectedType("discussion")}
                  className="p-4 rounded-lg border border-[#E2E8F0] dark:border-border hover:border-[#2463D3] bg-[#F5F7FA]/50 dark:bg-secondary/20 hover:bg-white dark:hover:bg-card transition-all text-left space-y-2 group cursor-pointer"
                >
                  <div className="p-2 w-fit rounded-md bg-[#2463D3]/10 text-[#2463D3] group-hover:bg-[#2463D3] group-hover:text-white transition-colors">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#17243A] dark:text-white group-hover:text-[#2463D3] transition-colors">
                      Discussion
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Share an opinion, architectural debate, or start a technical conversation.
                    </p>
                  </div>
                </button>

                {/* 2. Ask a question */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedType("question");
                    setIncludeCode(true);
                  }}
                  className="p-4 rounded-lg border border-[#E2E8F0] dark:border-border hover:border-[#2463D3] bg-[#F5F7FA]/50 dark:bg-secondary/20 hover:bg-white dark:hover:bg-card transition-all text-left space-y-2 group cursor-pointer"
                >
                  <div className="p-2 w-fit rounded-md bg-[#2463D3]/10 text-[#2463D3] group-hover:bg-[#2463D3] group-hover:text-white transition-colors">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#17243A] dark:text-white group-hover:text-[#2463D3] transition-colors">
                      Ask a question
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Get help with technical bugs, compiler errors, or algorithmic hurdles.
                    </p>
                  </div>
                </button>

                {/* 3. Show a project */}
                <button
                  type="button"
                  onClick={() => setSelectedType("project")}
                  className="p-4 rounded-lg border border-[#E2E8F0] dark:border-border hover:border-[#2463D3] bg-[#F5F7FA]/50 dark:bg-secondary/20 hover:bg-white dark:hover:bg-card transition-all text-left space-y-2 group cursor-pointer"
                >
                  <div className="p-2 w-fit rounded-md bg-[#2463D3]/10 text-[#2463D3] group-hover:bg-[#2463D3] group-hover:text-white transition-colors">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#17243A] dark:text-white group-hover:text-[#2463D3] transition-colors">
                      Show a project
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Showcase what you&apos;ve built with GitHub repo, tech stack, and live demo.
                    </p>
                  </div>
                </button>

                {/* 4. Share knowledge */}
                <button
                  type="button"
                  onClick={() => setSelectedType("explanation")}
                  className="p-4 rounded-lg border border-[#E2E8F0] dark:border-border hover:border-[#2463D3] bg-[#F5F7FA]/50 dark:bg-secondary/20 hover:bg-white dark:hover:bg-card transition-all text-left space-y-2 group cursor-pointer"
                >
                  <div className="p-2 w-fit rounded-md bg-[#2463D3]/10 text-[#2463D3] group-hover:bg-[#2463D3] group-hover:text-white transition-colors">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#17243A] dark:text-white group-hover:text-[#2463D3] transition-colors">
                      Share knowledge
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Publish a step-by-step tutorial, system breakdown, or deep explanation.
                    </p>
                  </div>
                </button>
              </div>
            </div>
          ) : (
            /* STEP 2: Tailored Composition Form */
            <form onSubmit={handlePublish} className="space-y-4">
              {errorMsg && (
                <div className="p-2.5 rounded-md text-xs bg-red-50 text-red-600 border border-red-200">
                  {errorMsg}
                </div>
              )}

              {/* Title Input */}
              <div>
                <label className="block text-xs font-semibold text-[#17243A] dark:text-white mb-1">
                  {selectedType === "question" && "What problem are you trying to solve?"}
                  {selectedType === "project" && "Project Name & Tagline"}
                  {selectedType === "explanation" && "Topic / Tutorial Title"}
                  {selectedType === "discussion" && "Discussion Title or Topic"}
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    selectedType === "question"
                      ? "e.g. Why does tokio::spawn require 'static lifetime when moving closures?"
                      : selectedType === "project"
                      ? "e.g. NanoRuntimes — Embeddable V8 Web Worker Sandbox"
                      : selectedType === "explanation"
                      ? "e.g. Understanding Virtual Memory & 4-Level Page Table Walks"
                      : "e.g. Event-driven architecture with Kafka vs RabbitMQ"
                  }
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#F5F7FA] dark:bg-secondary/40 border border-[#E2E8F0] dark:border-border rounded-md px-3.5 py-2 text-xs sm:text-sm text-foreground outline-none focus:border-[#2463D3]"
                />
              </div>

              {/* Main Description / Body Textarea */}
              <div>
                <label className="block text-xs font-semibold text-[#17243A] dark:text-white mb-1">
                  {selectedType === "question" && "Details & What You Have Tried"}
                  {selectedType === "project" && "Project Description & Architecture"}
                  {selectedType === "explanation" && "In-Depth Explanation & Walkthrough"}
                  {selectedType === "discussion" && "Your Analysis or Perspective"}
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder={
                    selectedType === "question"
                      ? "Describe the context, reproduction steps, and what behavior you expected..."
                      : selectedType === "project"
                      ? "What problem does this project solve? What is the architecture?"
                      : selectedType === "explanation"
                      ? "Write your detailed technical explanation. Support markdown formatting..."
                      : "Share your engineering insights or start the debate..."
                  }
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-[#F5F7FA] dark:bg-secondary/40 border border-[#E2E8F0] dark:border-border rounded-md p-3 text-xs sm:text-sm text-foreground outline-none focus:border-[#2463D3]"
                />
              </div>

              {/* Project Specific Fields: GitHub & Demo Links */}
              {selectedType === "project" && (
                <div className="space-y-3 p-3.5 rounded-md bg-[#F5F7FA] dark:bg-secondary/30 border border-[#E2E8F0] dark:border-border">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                        GitHub Repository URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://github.com/..."
                        value={githubUrl}
                        onChange={(e) => setGithubUrl(e.target.value)}
                        className="w-full bg-white dark:bg-card border border-border rounded-md px-3 py-1.5 text-xs text-foreground outline-none focus:border-[#2463D3]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                        Live Demo URL (Optional)
                      </label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={demoUrl}
                        onChange={(e) => setDemoUrl(e.target.value)}
                        className="w-full bg-white dark:bg-card border border-border rounded-md px-3 py-1.5 text-xs text-foreground outline-none focus:border-[#2463D3]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                      Tech Stack (Comma-separated)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Rust, WebAssembly, Next.js, Tokio"
                      value={techStackInput}
                      onChange={(e) => setTechStackInput(e.target.value)}
                      className="w-full bg-white dark:bg-card border border-border rounded-md px-3 py-1.5 text-xs text-foreground outline-none focus:border-[#2463D3]"
                    />
                  </div>
                </div>
              )}

              {/* Code Snippet Toggle & Editor */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#17243A] dark:text-white flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-[#2463D3]" />
                    <span>Include Code Snippet</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setIncludeCode(!includeCode)}
                    className="text-xs font-semibold text-[#2463D3] hover:underline cursor-pointer"
                  >
                    {includeCode ? "Remove Code" : "+ Add Code Snippet"}
                  </button>
                </div>

                {includeCode && (
                  <div className="rounded-md border border-[#0f172a] bg-[#0f172a] overflow-hidden text-slate-100">
                    <div className="flex items-center justify-between px-3 py-2 bg-[#1e293b] border-b border-slate-800 text-xs">
                      <select
                        value={codeLanguage}
                        onChange={(e) => setCodeLanguage(e.target.value)}
                        className="bg-transparent text-slate-300 font-mono text-xs outline-none cursor-pointer"
                      >
                        {PROGRAMMING_LANGUAGES.map((l) => (
                          <option key={l.id} value={l.id} className="bg-slate-900 text-slate-100">
                            {l.label}
                          </option>
                        ))}
                      </select>
                      <span className="text-[11px] font-mono text-slate-400">
                        {codeLanguage === "javascript" || codeLanguage === "typescript"
                          ? "✓ Runnable in V8 Sandbox"
                          : "Syntax Highlighted"}
                      </span>
                    </div>

                    <textarea
                      rows={5}
                      placeholder="// Paste your code or reproduction snippet here..."
                      value={codeSnippet}
                      onChange={(e) => setCodeSnippet(e.target.value)}
                      className="w-full bg-transparent p-3 font-mono text-xs text-slate-100 outline-none resize-y"
                    />
                  </div>
                )}
              </div>

              {/* Knowledge / Docs Link */}
              {selectedType === "explanation" && (
                <div>
                  <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                    Official Documentation / Reference Paper URL (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={docReferenceUrl}
                    onChange={(e) => setDocReferenceUrl(e.target.value)}
                    className="w-full bg-[#F5F7FA] dark:bg-secondary/40 border border-[#E2E8F0] dark:border-border rounded-md px-3 py-1.5 text-xs text-foreground outline-none focus:border-[#2463D3]"
                  />
                </div>
              )}

              {/* Topic Selector */}
              <div>
                <label className="block text-xs font-semibold text-[#17243A] dark:text-white mb-1.5">
                  Select Topics (Up to 3)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {TECH_TOPICS.map((topic) => {
                    const isSelected = selectedTopics.includes(topic);
                    return (
                      <button
                        key={topic}
                        type="button"
                        onClick={() => toggleTopic(topic)}
                        className={`px-2.5 py-1 rounded-md text-xs font-mono transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-[#2463D3] text-white font-semibold"
                            : "bg-[#F5F7FA] dark:bg-secondary text-muted-foreground hover:text-[#17243A] dark:hover:text-white border border-[#E2E8F0] dark:border-border"
                        }`}
                      >
                        {topic}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0] dark:border-border">
                <button
                  type="button"
                  onClick={() => setSelectedType(null)}
                  className="px-3.5 py-1.5 rounded-md text-xs font-medium text-muted-foreground hover:bg-[#F5F7FA] dark:hover:bg-secondary transition-colors"
                >
                  Change Format
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-3.5 py-1.5 rounded-md text-xs font-medium text-muted-foreground hover:bg-[#F5F7FA] dark:hover:bg-secondary transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isPublishing}
                    className="px-4 py-1.5 rounded-md bg-[#2463D3] hover:bg-[#2463D3]/95 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {isPublishing ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Publishing...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Publish to Tech World</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default TechContributionModal;

