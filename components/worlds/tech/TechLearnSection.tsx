"use client";
import React, { useState } from "react";
import {
  BookOpen,
  Map,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Layers,
  Sparkles,
  Compass,
  ArrowRight,
  Bookmark,
  FileText,
  Clock,
  Terminal,
} from "lucide-react";

interface RoadmapStage {
  title: string;
  summary: string;
  skills: string[];
  docLink?: string;
}

interface Roadmap {
  id: string;
  title: string;
  targetAudience: string;
  estimatedTime: string;
  description: string;
  stages: RoadmapStage[];
}

const LEARNING_ROADMAPS: Roadmap[] = [
  {
    id: "systems-rust",
    title: "Systems Programming & Rust",
    targetAudience: "Intermediate Engineers",
    estimatedTime: "6-8 Weeks",
    description:
      "Master memory safety without garbage collection, low-level concurrency, and writing high-throughput system services.",
    stages: [
      {
        title: "Stage 01: Memory Model & Ownership",
        summary:
          "Stack vs heap allocations, RAII, move semantics, borrow checking, and static lifetime rules (&'a T).",
        skills: ["Stack vs Heap", "Ownership & Moves", "Borrow Checker", "Lifetimes"],
        docLink: "https://doc.rust-lang.org/book/ch04-00-understanding-ownership.html",
      },
      {
        title: "Stage 02: Fearless Concurrency & Channels",
        summary:
          "Threads, Send and Sync traits, crossbeam/tokio mpsc message passing, and avoiding lock contention with Arc<RwLock<T>>.",
        skills: ["Send & Sync Traits", "Tokio Async Runtime", "MPSC Channels", "Lock-free Queues"],
        docLink: "https://tokio.rs/tokio/tutorial",
      },
      {
        title: "Stage 03: Linux Kernel Interfaces & Systems I/O",
        summary:
          "POSIX syscalls, epoll event loops, non-blocking sockets, memory-mapped files (mmap), and zero-copy packet buffering.",
        skills: ["epoll & kqueue", "mmap", "Zero-copy I/O", "Syscall Overhead"],
        docLink: "https://man7.org/linux/man-pages/man7/epoll.7.html",
      },
      {
        title: "Stage 04: Unsafe Rust & C FFI",
        summary:
          "Raw pointer dereferencing, memory layouts with #[repr(C)], SIMD intrinsics, and building foreign function interfaces.",
        skills: ["Raw Pointers", "C FFI", "SIMD", "Memory Alignment"],
        docLink: "https://doc.rust-lang.org/nomicon/",
      },
    ],
  },
  {
    id: "frontend-arch",
    title: "Modern Frontend Architecture",
    targetAudience: "Web Engineers",
    estimatedTime: "4-6 Weeks",
    description:
      "Deep dive into browser rendering pipelines, React 19 / Server Components, and optimizing Core Web Vitals for scale.",
    stages: [
      {
        title: "Stage 01: Browser Internals & V8 Execution",
        summary:
          "How browsers parse HTML/CSS, calculate layout reflow, composite GPU layers, and JIT-compile JavaScript with V8 Ignition and TurboFan.",
        skills: ["Critical Rendering Path", "GPU Compositing", "V8 Hidden Classes", "Deoptimizations"],
        docLink: "https://v8.dev/blog",
      },
      {
        title: "Stage 02: React Fiber & Streaming SSR",
        summary:
          "Fiber tree reconciliation, concurrent rendering prioritization, Selective Hydration, and React Server Components (RSC) wire formats.",
        skills: ["React Fiber Tree", "Concurrent Mode", "RSC Protocol", "Streaming HTML"],
        docLink: "https://react.dev/reference/rsc/server-components",
      },
      {
        title: "Stage 03: Core Web Vitals Optimization",
        summary:
          "Profiling Largest Contentful Paint (LCP), Interaction to Next Paint (INP), and Cumulative Layout Shift (CLS) in Chrome DevTools.",
        skills: ["INP Tuning", "LCP Preloading", "Main Thread Budgeting", "Resource Hints"],
        docLink: "https://web.dev/vitals/",
      },
    ],
  },
  {
    id: "distributed-systems",
    title: "Distributed Systems & Cloud Architecture",
    targetAudience: "Backend & Platform Engineers",
    estimatedTime: "8-10 Weeks",
    description:
      "Understand fault tolerance, distributed consensus, event sourcing, and operating reliable systems under partial failure.",
    stages: [
      {
        title: "Stage 01: Failure Models & CAP Theorem",
        summary:
          "Network partitions, latency vs throughput trade-offs, linearizability, and eventual consistency models.",
        skills: ["Network Partitions", "CAP Theorem", "Split-brain", "Vector Clocks"],
        docLink: "https://github.com/aphyr/dist-sys-class",
      },
      {
        title: "Stage 02: Consensus Protocols (Raft & Paxos)",
        summary:
          "Leader election, replicated state machine logs, safety invariants, and dynamic cluster membership changes.",
        skills: ["Raft Consensus", "Leader Elections", "Log Compaction", "Quorums"],
        docLink: "https://raft.github.io/",
      },
      {
        title: "Stage 03: Storage Engines & Event Streams",
        summary:
          "LSM-trees vs B-Trees, write-ahead logs (WAL), bloom filters, and scalable partitioning with Kafka and ClickHouse.",
        skills: ["LSM-Trees", "Write-Ahead Logs", "Bloom Filters", "Kafka Partitions"],
        docLink: "https://dataintensive.net/",
      },
    ],
  },
];

const CURATED_PAPERS = [
  {
    title: "In Search of an Understandable Consensus Algorithm (Raft)",
    authors: "Diego Ongaro and John Ousterhout (Stanford University)",
    year: "2014",
    tag: "Distributed Systems",
    summary:
      "The definitive paper establishing the Raft protocol as an understandable, production-grade alternative to Multi-Paxos.",
    link: "https://raft.github.io/raft.pdf",
  },
  {
    title: "Spanner: Google’s Globally-Distributed Database",
    authors: "James C. Corbett et al. (Google)",
    year: "2012",
    tag: "Database Architecture",
    summary:
      "How Google uses atomic clocks and GPS receivers (TrueTime API) to provide externally consistent transactions at global scale.",
    link: "https://research.google/pubs/pub39966/",
  },
  {
    title: "The Log: What Every Software Engineer Should Know About Real-Time Data's Unifying Abstraction",
    authors: "Jay Kreps (LinkedIn / Confluent)",
    year: "2013",
    tag: "Event-Driven Systems",
    summary:
      "The foundational mental model for event streaming, distributed state replication, and table-log duality.",
    link: "https://engineering.linkedin.com/distributed-systems/log-what-every-software-engineer-should-know-about-real-time-datas-unifying",
  },
];

export const TechLearnSection: React.FC = () => {
  const [activeRoadmapId, setActiveRoadmapId] = useState<string>("systems-rust");

  const currentRoadmap =
    LEARNING_ROADMAPS.find((r) => r.id === activeRoadmapId) || LEARNING_ROADMAPS[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Editorial Header */}
      <div className="rounded-lg border border-[#E2E8F0] dark:border-border bg-white dark:bg-card p-5 sm:p-6 space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-[#2463D3]/10 text-[#2463D3] dark:text-blue-400 border border-[#2463D3]/20">
              LEARNING HUB & ROADMAPS
            </span>
            <span className="text-xs font-mono text-muted-foreground">
              Beginner & Intermediate Engineering Paths
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#17243A] dark:text-white tracking-tight">
            Curated Knowledge & Learning Roadmaps
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
            Step-by-step tracks through systems engineering, modern frontend architecture, and distributed services. Designed to be accessible for students and junior engineers.
          </p>
        </div>

        {/* Roadmap Switcher Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-3 border-t border-[#E2E8F0] dark:border-border">
          {LEARNING_ROADMAPS.map((r) => (
            <button
              key={r.id}
              onClick={() => setActiveRoadmapId(r.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                activeRoadmapId === r.id
                  ? "bg-[#2463D3] text-white font-semibold"
                  : "bg-[#F5F7FA] dark:bg-secondary text-muted-foreground hover:text-[#17243A] dark:hover:text-white border border-[#E2E8F0] dark:border-border"
              }`}
            >
              {r.title}
            </button>
          ))}
        </div>
      </div>

      {/* Active Roadmap Container */}
      <div className="rounded-lg border border-[#E2E8F0] dark:border-border bg-white dark:bg-card p-5 sm:p-7 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E2E8F0] dark:border-border">
          <div>
            <h3 className="text-lg font-bold text-[#17243A] dark:text-white">
              {currentRoadmap.title}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              {currentRoadmap.description}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="px-2.5 py-1 rounded bg-[#F5F7FA] dark:bg-secondary text-muted-foreground text-xs font-mono border border-[#E2E8F0] dark:border-border">
              {currentRoadmap.targetAudience}
            </span>
            <span className="px-2.5 py-1 rounded bg-blue-50 dark:bg-blue-950/40 text-[#2463D3] dark:text-blue-300 text-xs font-mono font-semibold border border-blue-200 dark:border-blue-900/40">
              {currentRoadmap.estimatedTime}
            </span>
          </div>
        </div>

        {/* Stepper Timeline */}
        <div className="space-y-4">
          {currentRoadmap.stages.map((stage, idx) => (
            <div
              key={idx}
              className="p-4 sm:p-5 rounded-md border border-[#E2E8F0] dark:border-border bg-[#F5F7FA]/40 dark:bg-secondary/20 hover:border-[#2463D3]/40 transition-colors space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded flex items-center justify-center font-mono font-bold text-xs bg-[#2463D3] text-white shrink-0">
                    {idx + 1}
                  </span>
                  <h4 className="font-bold text-sm text-[#17243A] dark:text-white">
                    {stage.title}
                  </h4>
                </div>

                {stage.docLink && (
                  <a
                    href={stage.docLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#2463D3] hover:underline shrink-0"
                  >
                    <span>Official Guide</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed pl-8">
                {stage.summary}
              </p>

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-1.5 pl-8 pt-1">
                {stage.skills.map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    className="px-2 py-0.5 rounded bg-white dark:bg-card text-muted-foreground text-[10px] font-mono border border-[#E2E8F0] dark:border-border"
                  >
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Classic Computer Science Papers Section */}
      <div className="rounded-lg border border-[#E2E8F0] dark:border-border bg-white dark:bg-card p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#2463D3]" />
          <h3 className="font-bold text-sm text-[#17243A] dark:text-white uppercase tracking-wider">
            Foundational Engineering Papers & Blueprints
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {CURATED_PAPERS.map((paper, i) => (
            <a
              key={i}
              href={paper.link}
              target="_blank"
              rel="noreferrer"
              className="p-4 rounded-md border border-[#E2E8F0] dark:border-border bg-[#F5F7FA]/30 dark:bg-secondary/20 hover:border-[#2463D3]/50 transition-colors flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                  <span className="px-1.5 py-0.5 rounded bg-secondary border border-border">
                    {paper.tag}
                  </span>
                  <span>{paper.year}</span>
                </div>

                <h4 className="font-bold text-xs sm:text-sm text-[#17243A] dark:text-white group-hover:text-[#2463D3] transition-colors leading-snug">
                  {paper.title}
                </h4>

                <p className="text-[11px] text-muted-foreground">
                  By {paper.authors}
                </p>

                <p className="text-xs text-foreground/80 leading-relaxed">
                  {paper.summary}
                </p>
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-between text-xs font-semibold text-[#2463D3]">
                <span>Read Original PDF</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechLearnSection;

