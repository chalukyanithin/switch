"use client";
import React, { useState, useEffect, Suspense, use } from "react";
import Link from "next/link";
import { notFound, useSearchParams } from "next/navigation";
import {
  Code2,
  Sparkles,
  Trophy,
  Terminal,
  Play,
  RotateCcw,
  GitFork,
  Mic,
  Plus,
  Share2,
  Cpu,
  Layers,
  ArrowLeft,
  ArrowRight,
  Flame,
  Radio,
  ExternalLink,
  ChevronRight,
  Bookmark,
  Heart,
  MessageCircle,
  Image as ImageIcon,
  Video,
  ChevronDown,
  TrendingUp,
  Clock,
  Users,
  Compass,
  Brain,
  MessageSquare,
  BookOpen,
  HelpCircle,
  Search,
  User,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { INITIAL_SWITCH_POSTS, SwitchPost } from "@/lib/data/worldsData";
import Card from "@/components/ui/Card";
import MemeEditorModal from "@/components/worlds/MemeEditorModal";
import MemeHeroBanner from "@/components/worlds/meme/MemeHeroBanner";
import MemeBattlesSection from "@/components/worlds/meme/MemeBattlesSection";
import MemeTemplatesSection, { MemeTemplateItem } from "@/components/worlds/meme/MemeTemplatesSection";
import MemeCreateModal from "@/components/worlds/meme/MemeCreateModal";
import MemeRightBar from "@/components/worlds/meme/MemeRightBar";
import AudioCommentRecorder from "@/components/ui/AudioCommentRecorder";
import { addAudioComment } from "@/lib/actions/thought.actions";
import TechComposer, { TECH_TOPICS } from "@/components/worlds/TechComposer";
import TechQuizSection from "@/components/worlds/tech/TechQuizSection";
import TechDiscussionsSection from "@/components/worlds/tech/TechDiscussionsSection";
import TechProjectsSection from "@/components/worlds/tech/TechProjectsSection";
import TechLearnSection from "@/components/worlds/tech/TechLearnSection";
import TechContributionModal, { ContributionType } from "@/components/worlds/tech/TechContributionModal";

interface WorldPageProps {
  params: Promise<{ id: string }>;
}

export default function DedicatedWorldPage({ params }: WorldPageProps) {
  const { id } = use(params);
  const normalizedId = id.toLowerCase();

  if (normalizedId === "tech" || normalizedId === "technology") {
    return (
      <Suspense fallback={<div className="p-8 text-center text-xs text-muted-foreground font-mono">Loading Tech World...</div>}>
        <TechnologyWorldView />
      </Suspense>
    );
  }

  if (normalizedId === "meme" || normalizedId === "memes") {
    return (
      <Suspense fallback={<div className="p-8 text-center text-xs text-muted-foreground font-mono">Loading Meme World...</div>}>
        <MemeWorldView />
      </Suspense>
    );
  }

  if (normalizedId === "cricket") {
    return <CricketWorldView />;
  }

  notFound();
}

// Reusable World Navigation Bar
function WorldNavigationHeader({ currentWorld }: { currentWorld: "Technology" | "Meme" | "Cricket" }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg bg-card border border-border text-xs">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 font-medium text-muted-foreground hover:text-foreground transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        <span>Exit to All Worlds Feed</span>
      </Link>

      {/* Direct World Switcher Pills */}
      <div className="flex items-center gap-1.5 self-start sm:self-center">
        <span className="text-[11px] font-medium text-muted-foreground mr-1 hidden sm:inline">Switch World:</span>
        <Link
          href="/world/tech"
          className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${currentWorld === "Technology"
              ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-900/40"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
        >
          Tech
        </Link>
        <Link
          href="/world/cricket"
          className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${currentWorld === "Cricket"
              ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/40"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
        >
          Cricket
        </Link>
        <Link
          href="/world/meme"
          className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${currentWorld === "Meme"
              ? "bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-900/40"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
        >
          Memes
        </Link>
      </div>
    </div>
  );
}

// =========================================================================
// 1. TECHNOLOGY WORLD VIEW (Minimal Editorial Developer Community)
// =========================================================================
type TechSection = "discover" | "quiz" | "discussions" | "projects" | "learn";

function TechnologyWorldView() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const tabParam = searchParams?.get("tab");
  const topicParam = searchParams?.get("topic");

  const [activeSection, setActiveSection] = useState<TechSection>("discover");
  const [feedSubTab, setFeedSubTab] = useState<"for_you" | "following" | "discussions" | "projects" | "news">("for_you");
  const [feedSort, setFeedSort] = useState<"latest" | "top">("latest");
  const [selectedTopic, setSelectedTopic] = useState<string>("All Topics");
  const [activeToolTab, setActiveToolTab] = useState<"none" | "sandbox">("none");

  const [allTechPosts, setAllTechPosts] = useState<SwitchPost[]>(() =>
    INITIAL_SWITCH_POSTS.filter((p) => p.world.toLowerCase() === "technology")
  );

  // Sync section & subtabs with searchParams
  useEffect(() => {
    if (tabParam) {
      if (tabParam === "quiz") {
        setActiveSection("quiz");
      } else if (tabParam === "discussions") {
        setActiveSection("discussions");
        setFeedSubTab("discussions");
      } else if (tabParam === "projects") {
        setActiveSection("projects");
        setFeedSubTab("projects");
      } else if (tabParam === "learn") {
        setActiveSection("learn");
      } else if (tabParam === "discover") {
        setActiveSection("discover");
        setFeedSubTab("for_you");
      }
    }
  }, [tabParam]);

  useEffect(() => {
    if (topicParam) {
      setSelectedTopic(topicParam);
      setActiveSection("discover");
      setFeedSubTab("for_you");
    }
  }, [topicParam]);

  // Contribution Modal State
  const [showContributionModal, setShowContributionModal] = useState(false);
  const [contributionInitialType, setContributionInitialType] = useState<ContributionType | null>(null);

  const openContributionModal = (type?: ContributionType) => {
    setContributionInitialType(type || null);
    setShowContributionModal(true);
  };

  // Live Playground State
  const [playgroundCode, setPlaygroundCode] = useState(
    `// Switch V8 Isolated Execution Sandbox
function benchmarkRingBuffer(iterations) {
  const start = performance.now();
  const buffer = new Float32Array(512);
  let sum = 0;
  
  for (let i = 0; i < iterations; i++) {
    buffer[i % 512] = Math.sin(i * 0.05);
    sum += buffer[i % 512];
  }
  
  const elapsed = (performance.now() - start).toFixed(2);
  console.log("Executed " + iterations.toLocaleString() + " operations in " + elapsed + "ms");
  console.log("Throughput: " + Math.round(iterations / (elapsed / 1000)).toLocaleString() + " ops/sec");
  return { elapsedMs: elapsed, status: "OK" };
}

benchmarkRingBuffer(1000000);`
  );
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<{ stdout: string; stderr: string; time: number; memory: number } | null>(null);

  const handleRunPlayground = async () => {
    setIsRunning(true);
    setOutput(null);
    try {
      const res = await fetch("/api/v1/worlds/tech/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: "javascript", code: playgroundCode }),
      });
      const data = await res.json();
      setOutput({
        stdout: data.stdout,
        stderr: data.stderr,
        time: data.executionTimeMs,
        memory: data.memoryUsedKb,
      });
    } catch (e: any) {
      setOutput({ stdout: "", stderr: e.message, time: 0, memory: 0 });
    } finally {
      setIsRunning(false);
    }
  };

  // Filter & sort logic for Section 01 Discover
  const filteredPosts = allTechPosts
    .filter((post) => {
      if (selectedTopic !== "All Topics") {
        const postTopics = post.tech?.topics || [];
        const techStack = post.tech?.techStack || [];
        const matchesTopic =
          postTopics.some((t) => t.toLowerCase() === selectedTopic.toLowerCase()) ||
          techStack.some((s) => s.toLowerCase().includes(selectedTopic.toLowerCase()));
        if (!matchesTopic) return false;
      }
      if (feedSubTab === "news") {
        const isNews = post.tech?.postType === "explanation" || post.tech?.docAttachment !== undefined;
        if (!isNews) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (feedSort === "latest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return (b.likes?.length || 0) - (a.likes?.length || 0);
    });

  return (
    <div className="world-tech w-full space-y-5 pb-12 animate-in fade-in duration-150">
      {/* Top Feed Sub-Tabs (Pixel-Matched to Screenshot) */}
      <div className="flex items-center justify-between border-b border-[#E2E8F0] dark:border-border">
        <div className="flex items-center gap-6 text-sm font-semibold overflow-x-auto no-scrollbar">
          <button
            onClick={() => {
              setFeedSubTab("for_you");
              setActiveSection("discover");
            }}
            className={`pb-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeSection === "discover" && feedSubTab === "for_you"
                ? "border-[#2463D3] text-[#2463D3] dark:text-blue-400 font-bold"
                : "border-transparent text-muted-foreground hover:text-[#17243A] dark:hover:text-white"
            }`}
          >
            For you
          </button>

          <button
            onClick={() => {
              setFeedSubTab("following");
              setActiveSection("discover");
            }}
            className={`pb-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeSection === "discover" && feedSubTab === "following"
                ? "border-[#2463D3] text-[#2463D3] dark:text-blue-400 font-bold"
                : "border-transparent text-muted-foreground hover:text-[#17243A] dark:hover:text-white"
            }`}
          >
            Following
          </button>

          <button
            onClick={() => {
              setFeedSubTab("discussions");
              setActiveSection("discussions");
            }}
            className={`pb-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeSection === "discussions"
                ? "border-[#2463D3] text-[#2463D3] dark:text-blue-400 font-bold"
                : "border-transparent text-muted-foreground hover:text-[#17243A] dark:hover:text-white"
            }`}
          >
            Discussions
          </button>

          <button
            onClick={() => {
              setFeedSubTab("projects");
              setActiveSection("projects");
            }}
            className={`pb-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeSection === "projects"
                ? "border-[#2463D3] text-[#2463D3] dark:text-blue-400 font-bold"
                : "border-transparent text-muted-foreground hover:text-[#17243A] dark:hover:text-white"
            }`}
          >
            Projects
          </button>

          <button
            onClick={() => {
              setFeedSubTab("news");
              setActiveSection("discover");
            }}
            className={`pb-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeSection === "discover" && feedSubTab === "news"
                ? "border-[#2463D3] text-[#2463D3] dark:text-blue-400 font-bold"
                : "border-transparent text-muted-foreground hover:text-[#17243A] dark:hover:text-white"
            }`}
          >
            News
          </button>
        </div>

        {/* Quick Sandbox Tool Pill */}
        <button
          onClick={() => setActiveToolTab((prev) => (prev === "sandbox" ? "none" : "sandbox"))}
          className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 mb-2 rounded-md text-xs font-mono font-medium border transition-colors cursor-pointer ${
            activeToolTab === "sandbox"
              ? "bg-[#2463D3] text-white border-transparent"
              : "bg-[#F8FAFC] dark:bg-secondary/40 text-muted-foreground hover:text-foreground border-[#E2E8F0] dark:border-border"
          }`}
          title="Open interactive V8 execution sandbox"
        >
          <Terminal className="w-3 h-3 text-[#2463D3]" />
          <span>V8 Sandbox</span>
        </button>
      </div>

      {/* Feature Tab: Interactive Sandbox Drawer */}
      {activeToolTab === "sandbox" && (
        <div className="rounded-xl border border-[#0f172a] bg-[#0f172a] text-slate-100 overflow-hidden animate-in fade-in">
          <div className="flex items-center justify-between px-4 py-2.5 bg-[#1e293b] border-b border-slate-800">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-200">
              <Terminal className="w-4 h-4 text-blue-400" />
              <span className="font-bold">LIVE V8 SANDBOX SCRATCHPAD</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPlaygroundCode(`console.log("Memory: " + (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) + " MB");`)}
                className="text-[11px] font-mono text-slate-400 hover:text-slate-200 transition-colors"
              >
                Heap Profiler
              </button>
              <button
                onClick={handleRunPlayground}
                disabled={isRunning}
                className="px-3 py-1 rounded bg-[#2463D3] hover:bg-[#2463D3]/90 text-white font-mono font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {isRunning ? (
                  <>
                    <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                    <span>Running...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Execute in V8</span>
                  </>
                )}
              </button>
              <button
                onClick={() => setActiveToolTab("none")}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="p-3">
            <textarea
              value={playgroundCode}
              onChange={(e) => setPlaygroundCode(e.target.value)}
              rows={8}
              className="w-full bg-transparent font-mono text-xs text-slate-100 outline-none leading-relaxed resize-y"
            />
          </div>

          {output && (
            <div className="border-t border-slate-800 bg-black/60 p-3.5 font-mono text-xs space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-1.5">
                <span className="text-slate-300 font-bold uppercase tracking-wider">Console Output</span>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-blue-400">
                    <Cpu className="w-3 h-3" />
                    {output.time}ms
                  </span>
                  <span>{output.memory} KB RAM</span>
                </div>
              </div>
              {output.stdout && <pre className="text-emerald-400 whitespace-pre-wrap leading-relaxed">{output.stdout}</pre>}
              {output.stderr && <pre className="text-red-400 whitespace-pre-wrap leading-relaxed">{output.stderr}</pre>}
            </div>
          )}
        </div>
      )}

      {/* Active Section Back Header (if not on Discover) */}
      {activeSection !== "discover" && (
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              setActiveSection("discover");
              setFeedSubTab("for_you");
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2463D3] hover:underline cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Tech Feed</span>
          </button>

          <span className="text-xs font-mono text-muted-foreground uppercase">
            Viewing: {activeSection}
          </span>
        </div>
      )}

      {/* =========================================================================
          SECTION 01: DISCOVER (Feed, Quiz Card, Composer & Discussions)
          ========================================================================= */}
      {activeSection === "discover" && (
        <div className="space-y-4">
          {/* 1. Daily Tech Quiz Signature Card (Pixel-matched to Screenshot) */}
          <div className="rounded-xl border border-[#E2E8F0] dark:border-border bg-white dark:bg-card p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#2463D3] flex items-center justify-center">
                  <Trophy className="w-3.5 h-3.5" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#EBF2FF] dark:bg-blue-950/60 text-[#2463D3]">
                  DAILY TECH QUIZ
                </span>
                <span className="text-xs text-muted-foreground ml-auto md:hidden">
                  Question of the day
                </span>
              </div>

              <div className="space-y-1">
                <h2 className="text-lg sm:text-xl font-bold text-[#17243A] dark:text-white tracking-tight flex items-center gap-2 flex-wrap">
                  <span>How does</span>
                  <code className="px-1.5 py-0.5 rounded bg-[#F1F5F9] dark:bg-slate-800 text-[#17243A] dark:text-blue-300 font-mono text-base font-bold">
                    fork()
                  </code>
                  <span>behave in Linux?</span>
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Test your systems knowledge. Can you get it right?
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium pt-0.5">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  <span>5 questions</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>3 minutes</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  <span>Systems / Linux</span>
                </span>
              </div>
            </div>

            <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 shrink-0">
              <span className="text-xs text-muted-foreground font-medium hidden md:block">
                Question of the day
              </span>

              {/* Terminal Window Mockup matching screenshot */}
              <div className="w-28 h-16 rounded-xl bg-gradient-to-br from-[#1E293B] to-[#0F172A] p-2.5 border border-slate-700/60 shadow-sm flex flex-col justify-between hidden sm:flex">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </div>
                <div className="font-mono text-xs text-blue-400 font-bold">&gt;_</div>
              </div>

              <button
                onClick={() => setActiveSection("quiz")}
                className="px-4 py-2 rounded-lg bg-[#2463D3] hover:bg-[#2463D3]/90 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-xs cursor-pointer"
              >
                <span>Play now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 2. Composer Bar (Pixel-matched to Screenshot) */}
          <div className="rounded-xl border border-[#E2E8F0] dark:border-border bg-white dark:bg-card p-4 space-y-3 shadow-xs">
            <div
              onClick={() => openContributionModal()}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-950/50 text-[#2463D3] flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-900/40">
                <User className="w-4 h-4" />
              </div>
              <div className="flex-1 px-4 py-2.5 rounded-lg bg-[#F8FAFC] dark:bg-secondary/40 border border-[#E2E8F0] dark:border-border text-xs sm:text-sm text-muted-foreground group-hover:border-[#2463D3]/50 transition-colors">
                What do you want to share with the Tech World?
              </div>
            </div>

            {/* 4 Action Pills matching screenshot */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1 text-xs">
              <button
                type="button"
                onClick={() => openContributionModal("discussion")}
                className="px-3.5 py-1.5 rounded-lg border border-[#E2E8F0] dark:border-border bg-white dark:bg-card hover:border-[#2463D3] hover:text-[#2463D3] font-semibold text-muted-foreground flex items-center gap-2 transition-colors shrink-0 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#2463D3]" />
                <span>Discussion</span>
              </button>
              <button
                type="button"
                onClick={() => openContributionModal("question")}
                className="px-3.5 py-1.5 rounded-lg border border-[#E2E8F0] dark:border-border bg-white dark:bg-card hover:border-[#2463D3] hover:text-[#2463D3] font-semibold text-muted-foreground flex items-center gap-2 transition-colors shrink-0 cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5 text-[#2463D3]" />
                <span>Ask a question</span>
              </button>
              <button
                type="button"
                onClick={() => openContributionModal("project")}
                className="px-3.5 py-1.5 rounded-lg border border-[#E2E8F0] dark:border-border bg-white dark:bg-card hover:border-[#2463D3] hover:text-[#2463D3] font-semibold text-muted-foreground flex items-center gap-2 transition-colors shrink-0 cursor-pointer"
              >
                <Code2 className="w-3.5 h-3.5 text-[#2463D3]" />
                <span>Show a project</span>
              </button>
              <button
                type="button"
                onClick={() => openContributionModal("explanation")}
                className="px-3.5 py-1.5 rounded-lg border border-[#E2E8F0] dark:border-border bg-white dark:bg-card hover:border-[#2463D3] hover:text-[#2463D3] font-semibold text-muted-foreground flex items-center gap-2 transition-colors shrink-0 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#2463D3]" />
                <span>Share knowledge</span>
              </button>
            </div>
          </div>

          {/* Filter Alert if Topic Selected */}
          {selectedTopic !== "All Topics" && (
            <div className="flex items-center justify-between px-3 py-2 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/40 rounded-lg text-xs">
              <span className="font-semibold text-blue-900 dark:text-blue-300">
                Filtered by topic: #{selectedTopic}
              </span>
              <button
                onClick={() => setSelectedTopic("All Topics")}
                className="text-[#2463D3] hover:underline font-bold cursor-pointer"
              >
                Clear filter
              </button>
            </div>
          )}

          {/* 3. Section Header matching screenshot */}
          <div className="flex items-center justify-between pt-1">
            <h2 className="text-base sm:text-lg font-bold text-[#17243A] dark:text-white">
              Your technology feed
            </h2>
            <button
              onClick={() => setFeedSort((prev) => (prev === "latest" ? "top" : "latest"))}
              className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground px-2.5 py-1 rounded-md border border-[#E2E8F0] dark:border-border bg-white dark:bg-card cursor-pointer"
            >
              <span>{feedSort === "latest" ? "Latest" : "Top"}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Feed Stream */}
          <div className="space-y-4 pt-1">
            {filteredPosts.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-card rounded-lg border border-[#E2E8F0] dark:border-border space-y-3">
                <Code2 className="w-8 h-8 text-muted-foreground mx-auto opacity-50" />
                <div>
                  <h3 className="font-bold text-[#17243A] dark:text-white text-sm">
                    No technical posts found in #{selectedTopic}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Be the first engineer to share code, an architecture breakdown, or a question here.
                  </p>
                </div>
                <button
                  onClick={() => openContributionModal("discussion")}
                  className="px-3.5 py-1.5 rounded-md bg-[#2463D3] text-white font-semibold text-xs cursor-pointer"
                >
                  Share Code in #{selectedTopic}
                </button>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <Card key={post._id} thought={post} />
              ))
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 02: DAILY TECH QUIZ (Retention Signature Feature)
          ========================================================================= */}
      {activeSection === "quiz" && <TechQuizSection />}

      {/* =========================================================================
          SECTION 03: DISCUSSIONS (Structured Q&A & Debates)
          ========================================================================= */}
      {activeSection === "discussions" && (
        <TechDiscussionsSection onAskQuestion={() => openContributionModal("question")} />
      )}

      {/* =========================================================================
          SECTION 04: PROJECTS (Builder Directory & Showcase)
          ========================================================================= */}
      {activeSection === "projects" && (
        <TechProjectsSection onShowcaseProject={() => openContributionModal("project")} />
      )}

      {/* =========================================================================
          SECTION 05: LEARN (Learning Roadmaps & Curated Papers)
          ========================================================================= */}
      {activeSection === "learn" && <TechLearnSection />}

      {/* Multi-Type Contribution Modal */}
      <TechContributionModal
        isOpen={showContributionModal}
        onClose={() => setShowContributionModal(false)}
        initialType={contributionInitialType}
        onPublished={(newPost) => {
          setAllTechPosts((prev) => [newPost, ...prev]);
        }}
      />
    </div>
  );
}

// =========================================================================
// 2. MEME WORLD VIEW (Creative Studio & Community Playground)
// =========================================================================
function MemeWorldView() {
  const searchParams = useSearchParams();
  const tabParam = searchParams?.get("tab");

  const [activeTab, setActiveTab] = useState<string>("home");
  const [activeCategory, setActiveCategory] = useState<string>("For You");
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [selectedTemplateForCreate, setSelectedTemplateForCreate] = useState<MemeTemplateItem | null>(null);

  const [allMemePosts, setAllMemePosts] = useState<SwitchPost[]>(() =>
    INITIAL_SWITCH_POSTS.filter((p) => p.world.toLowerCase() === "meme")
  );

  useEffect(() => {
    if (tabParam) {
      if (tabParam === "trending") {
        setActiveTab("home");
        setActiveCategory("Trending");
      } else if (tabParam === "fresh") {
        setActiveTab("home");
        setActiveCategory("Fresh Memes");
      } else if (tabParam === "templates") {
        setActiveTab("templates");
      } else if (tabParam === "battles") {
        setActiveTab("battles");
      } else if (tabParam === "collections") {
        setActiveTab("collections");
      } else {
        setActiveTab(tabParam);
      }
    } else {
      setActiveTab("home");
    }
  }, [tabParam]);

  const CATEGORY_TABS = [
    { id: "For You", label: "For You", icon: "⭐" },
    { id: "Trending", label: "Trending", icon: "🔥" },
    { id: "Relatable", label: "Relatable", icon: "👤" },
    { id: "Office", label: "Office", icon: "💼" },
    { id: "College", label: "College", icon: "🎓" },
    { id: "Indian", label: "Indian", icon: "🇮🇳" },
    { id: "Templates", label: "Templates", icon: "📑" },
  ];

  const filteredPosts = allMemePosts.filter((post) => {
    if (activeCategory === "For You" || activeCategory === "Trending" || activeCategory === "Fresh Memes") {
      return true;
    }
    const cat = post.meme?.category?.toLowerCase() || "";
    const tags = (post.meme?.tags || []).map((t) => t.toLowerCase());
    return cat.includes(activeCategory.toLowerCase()) || tags.includes(activeCategory.toLowerCase());
  }).sort((a, b) => {
    if (activeCategory === "Trending") {
      return (b.meme?.upvotes || 0) - (a.meme?.upvotes || 0);
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="world-meme w-full space-y-6 pb-12 animate-in fade-in duration-150">
      {/* 1. Main Cover Banner on Top of Meme World (Spans Full Width across feed & right bar) */}
      {activeTab === "home" && (
        <MemeHeroBanner
          onCreateMeme={() => {
            setSelectedTemplateForCreate(null);
            setShowCreateModal(true);
          }}
          onScrollToFeed={() => {}}
        />
      )}

      {/* 2. Main Content & Right Column Area (Positioned cleanly below the wide Cover Banner) */}
      <div className="flex flex-col xl:flex-row gap-6 items-start">
        {/* Left Column: Category Filter Pills + Meme Feed / Specialized Sections (Constrained so cards don't stretch) */}
        <div className="w-full xl:max-w-[580px] flex-1 min-w-0 space-y-4">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {CATEGORY_TABS.map((tab) => {
              const isActive = activeTab === "home" && activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (tab.id === "Templates") {
                      setActiveTab("templates");
                    } else {
                      setActiveTab("home");
                      setActiveCategory(tab.id);
                    }
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "bg-[#2463D3] text-white shadow-xs"
                      : "bg-white dark:bg-card border border-[#E2E8F0] dark:border-border text-muted-foreground hover:text-foreground hover:border-[#2463D3]"
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}

            <button
              onClick={() => setActiveCategory("Office")}
              className="p-1.5 rounded-full border border-[#E2E8F0] dark:border-border bg-white dark:bg-card text-muted-foreground hover:text-foreground hover:border-[#2463D3] cursor-pointer shrink-0"
              title="See more categories"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Section Dispatcher */}
          {activeTab === "home" && (
            <div className="space-y-4 pt-1">
              {filteredPosts.length === 0 ? (
                <div className="p-8 text-center bg-white dark:bg-card rounded-2xl border border-[#E2E8F0] dark:border-border space-y-3">
                  <span className="text-3xl">🐱💤</span>
                  <div>
                    <h3 className="font-bold text-[#17243A] dark:text-white text-sm">
                      Nothing here yet. Even the memes are taking a break.
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Be the first to post a meme in #{activeCategory}!
                    </p>
                  </div>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-4 py-2 rounded-xl bg-[#2463D3] text-white font-bold text-xs cursor-pointer"
                  >
                    Create First Meme
                  </button>
                </div>
              ) : (
                filteredPosts.map((post) => (
                  <Card key={post._id} thought={post} />
                ))
              )}
            </div>
          )}

          {/* Meme Battles */}
          {activeTab === "battles" && (
            <MemeBattlesSection
              onSubmitEntry={() => {
                setSelectedTemplateForCreate(null);
                setShowCreateModal(true);
              }}
            />
          )}

          {/* Templates Studio */}
          {activeTab === "templates" && (
            <MemeTemplatesSection
              onSelectTemplate={(tpl) => {
                setSelectedTemplateForCreate(tpl);
                setShowCreateModal(true);
              }}
            />
          )}

          {/* Collections View */}
          {activeTab === "collections" && (
            <div className="space-y-4">
              <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-card border border-[#E2E8F0] dark:border-border space-y-1.5 shadow-xs">
                <h2 className="font-extrabold text-base sm:text-lg text-[#17243A] dark:text-white">
                  Your Saved Bangers 🔖
                </h2>
                <p className="text-xs text-muted-foreground">
                  Memes you bookmarked for emergency laughter during meetings.
                </p>
              </div>
              <div className="space-y-4">
                {allMemePosts.slice(0, 2).map((post) => (
                  <Card key={`saved-${post._id}`} thought={post} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: MemeRightBar (Curated Meme of Day, Challenge & Leaderboard below the wide Cover Banner) */}
        <aside className="hidden xl:block w-80 shrink-0 sticky top-20">
          <MemeRightBar
            onOpenCreate={() => {
              setSelectedTemplateForCreate(null);
              setShowCreateModal(true);
            }}
            onOpenBattles={() => setActiveTab("battles")}
          />
        </aside>
      </div>

      {/* Meme Creation Modal */}
      <MemeCreateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        initialTemplate={selectedTemplateForCreate}
        initialCategory={activeCategory !== "For You" && activeCategory !== "Trending" ? activeCategory : "Office"}
        onPublished={(newPost) => {
          setAllMemePosts((prev) => [newPost, ...prev]);
        }}
      />
    </div>
  );
}

// =========================================================================
// 3. CRICKET WORLD VIEW (Match Center & Audio Commentary Dugout)
// =========================================================================
function CricketWorldView() {
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [recordSuccess, setRecordSuccess] = useState(false);

  const posts = INITIAL_SWITCH_POSTS.filter(
    (p) => p.world.toLowerCase() === "cricket"
  );

  const handleAudioReady = async (audioData: any) => {
    try {
      await addAudioComment(posts[0]._id, "current-user", audioData, "You");
      setShowVoiceRecorder(false);
      setRecordSuccess(true);
      setTimeout(() => setRecordSuccess(false), 3000);
    } catch (e) {
      console.warn("Failed to record voice comment:", e);
    }
  };

  return (
    <div className="world-cricket w-full space-y-4 pb-12 animate-in fade-in duration-150">
      {/* Seamless World Navigation Header */}
      <WorldNavigationHeader currentWorld="Cricket" />

      {/* Editorial Cricket Banner */}
      <div className="rounded-lg border border-border bg-card p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-md bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/40">
                <Trophy className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </span>
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                  Cricket
                </h1>
                <p className="text-xs font-mono text-muted-foreground">
                  scorecards // tactical analysis // voice dugout
                </p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed pt-1">
              Match journalism, tactical breakdowns, ball-by-ball analysis, and 30-second dugout audio commentary.
            </p>
          </div>

          <button
            onClick={() => setShowVoiceRecorder(!showVoiceRecorder)}
            className="px-3.5 py-1.5 rounded-md bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Record 30s Audio Note</span>
          </button>
        </div>

        {/* Professional Scoreboard Panel */}
        <div className="p-3.5 rounded-md bg-secondary/60 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold font-mono text-foreground">
                  AUS 184 & 92/4 (31.4 ov) vs IND
                </span>
                <span className="text-[10px] font-mono text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-900/40">
                  Simulated Match
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Perth Stadium Simulation • Target: 240 runs
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 font-mono text-xs">
            <span className="text-muted-foreground text-[11px] mr-1">Last 6 balls:</span>
            <span className="w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center font-bold">0</span>
            <span className="w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center font-bold">4</span>
            <span className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center font-bold">W</span>
            <span className="w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center font-bold">1</span>
            <span className="w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center font-bold">0</span>
            <span className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center font-bold">W</span>
          </div>
        </div>

        {/* Structured Capability Metrics */}
        <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border text-xs">
          <div>
            <div className="font-bold text-foreground text-sm">Simulated Data</div>
            <div className="text-muted-foreground text-[11px]">Match Scenario Demo</div>
          </div>
          <div>
            <div className="font-bold text-foreground text-sm">Ball-by-Ball</div>
            <div className="text-muted-foreground text-[11px]">Tactical Outcome Stream</div>
          </div>
          <div>
            <div className="font-bold text-foreground text-sm">30s Dugout</div>
            <div className="text-muted-foreground text-[11px]">Voice Notes Enabled</div>
          </div>
        </div>
      </div>

      {/* Voice Recorder Lounge if triggered */}
      {showVoiceRecorder && (
        <div className="p-3 rounded-lg bg-card border border-border space-y-2 animate-in fade-in">
          <div className="text-xs font-semibold text-foreground flex items-center gap-2">
            <Radio className="w-4 h-4 text-red-500 animate-pulse" />
            <span>Broadcast a 30-Second Crowd Voice Note</span>
          </div>
          <AudioCommentRecorder
            onAudioReady={handleAudioReady}
            onCancel={() => setShowVoiceRecorder(false)}
            maxSeconds={30}
          />
        </div>
      )}

      {recordSuccess && (
        <div className="p-3 rounded-md bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-center animate-in fade-in">
          ✓ Your 30-second audio reaction has been broadcasted to Cricket World!
        </div>
      )}

      {/* Cricket Match Stream */}
      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post._id} thought={post} />
        ))}
      </div>
    </div>
  );
}
