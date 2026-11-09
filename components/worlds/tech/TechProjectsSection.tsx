"use client";
import React, { useState } from "react";
import {
  Code2,
  GitFork,
  Star,
  ExternalLink,
  Github,
  Plus,
  Users,
  Sparkles,
  ArrowRight,
  Filter,
  Check,
  MessageCircle,
} from "lucide-react";

export interface ProjectShowcase {
  id: string;
  name: string;
  tagline: string;
  description: string;
  author: {
    name: string;
    username: string;
    avatar: string;
    role: string;
  };
  techStack: string[];
  githubUrl: string;
  demoUrl?: string;
  stars: number;
  forks: number;
  status: "Looking for Contributors" | "Open Beta" | "Seeking Feedback" | "Student Showcase";
  image?: string;
  feedbackCount: number;
}

const SAMPLE_PROJECTS: ProjectShowcase[] = [
  {
    id: "proj-1",
    name: "NanoRuntimes / Micro-V8",
    tagline: "Embeddable, zero-dependency sandboxed JavaScript runner with memory limits",
    description:
      "A lightweight isolated worker harness designed for executing untrusted user algorithms and sandboxed scripts in browser tabs without freezing the main thread.",
    author: {
      name: "Alex Dev",
      username: "alex_dev",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&h=300&q=80",
      role: "Core Maintainer",
    },
    techStack: ["TypeScript", "Web Workers", "V8 Isolates", "WebAssembly"],
    githubUrl: "https://github.com/switch-social/nano-runtimes",
    demoUrl: "https://runtimes.switch.social/demo",
    stars: 384,
    forks: 42,
    status: "Looking for Contributors",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
    feedbackCount: 18,
  },
  {
    id: "proj-2",
    name: "eBPF Packet Tracer (KernelLens)",
    tagline: "Visual real-time tracing of TCP/UDP socket lifecycles using Linux eBPF",
    description:
      "Inspect socket states, retransmission storms, and kernel network queues directly from userspace without modifying application code or loading third-party kernel modules.",
    author: {
      name: "Marcus Vance",
      username: "marcus_kernel",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300&q=80",
      role: "Systems Engineer",
    },
    techStack: ["Rust", "eBPF", "Linux C", "Tokio", "TUI"],
    githubUrl: "https://github.com/switch-social/kernellens",
    stars: 820,
    forks: 67,
    status: "Open Beta",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    feedbackCount: 29,
  },
  {
    id: "proj-3",
    name: "Raft Consensus Visualizer",
    tagline: "Interactive educational simulator for distributed leader elections and log replication",
    description:
      "Step through distributed cluster state transitions: heartbeat intervals, candidate quorums, network partitions, and split-brain recovery in real-time.",
    author: {
      name: "Sarah Chen",
      username: "sarah_chen",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&h=300&q=80",
      role: "Staff Distributed Engineer",
    },
    techStack: ["Next.js", "Canvas API", "Rust / Wasm", "TailwindCSS"],
    githubUrl: "https://github.com/switch-social/raft-visualizer",
    demoUrl: "https://raft.switch.social",
    stars: 1240,
    forks: 148,
    status: "Seeking Feedback",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
    feedbackCount: 45,
  },
  {
    id: "proj-4",
    name: "ByteForge: In-Browser Hex & Binary Inspector",
    tagline: "Student project: Inspect executable ELF/Mach-O headers and dissect memory layouts",
    description:
      "Built by university students to learn assembly and object formats. Drag-and-drop compiled binaries to inspect section tables, symbol names, and relocation entries.",
    author: {
      name: "Jordan Lee",
      username: "jordan_codes",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&h=300&q=80",
      role: "CS Student @ Stanford",
    },
    techStack: ["React", "TypeScript", "Binary Parsing", "WebAssembly"],
    githubUrl: "https://github.com/switch-social/byteforge",
    demoUrl: "https://byteforge.app",
    stars: 195,
    forks: 23,
    status: "Student Showcase",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80",
    feedbackCount: 14,
  },
];

interface TechProjectsSectionProps {
  onShowcaseProject?: () => void;
}

export const TechProjectsSection: React.FC<TechProjectsSectionProps> = ({
  onShowcaseProject,
}) => {
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [starredProjects, setStarredProjects] = useState<Record<string, boolean>>({});

  const allTags = ["All", "Rust", "WebAssembly", "TypeScript", "Linux", "Distributed Systems"];

  const toggleStar = (id: string) => {
    setStarredProjects((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filtered = SAMPLE_PROJECTS.filter((proj) => {
    if (selectedTag === "All") return true;
    return proj.techStack.some((t) => t.toLowerCase() === selectedTag.toLowerCase());
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Editorial Header */}
      <div className="rounded-lg border border-[#E2E8F0] dark:border-border bg-white dark:bg-card p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-[#2463D3]/10 text-[#2463D3] dark:text-blue-400 border border-[#2463D3]/20">
                BUILDER DIRECTORY
              </span>
              <span className="text-xs font-mono text-muted-foreground">
                Open Source & Engineering Showcases
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#17243A] dark:text-white tracking-tight">
              Showcase What You&apos;re Building
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
              GitHub-integrated projects, dev tools, and student experiments. Get genuine peer review, contributors, and user feedback.
            </p>
          </div>

          <button
            onClick={onShowcaseProject}
            className="px-4 py-2 rounded-md bg-[#2463D3] hover:bg-[#2463D3]/90 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Showcase a Project</span>
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-3 border-t border-[#E2E8F0] dark:border-border">
          <span className="text-xs font-medium text-muted-foreground mr-1.5">Stack:</span>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                selectedTag === tag
                  ? "bg-[#2463D3] text-white font-semibold"
                  : "bg-[#F5F7FA] dark:bg-secondary text-muted-foreground hover:text-[#17243A] dark:hover:text-white border border-[#E2E8F0] dark:border-border"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((proj) => {
          const isStarred = starredProjects[proj.id];
          const starCount = proj.stars + (isStarred ? 1 : 0);

          return (
            <div
              key={proj.id}
              className="rounded-lg border border-[#E2E8F0] dark:border-border bg-white dark:bg-card overflow-hidden flex flex-col justify-between transition-colors hover:border-[#2463D3]/50"
            >
              <div>
                {/* Visual Cover Header */}
                {proj.image && (
                  <div className="h-36 w-full overflow-hidden border-b border-[#E2E8F0] dark:border-border relative bg-slate-900">
                    <img
                      src={proj.image}
                      alt={proj.name}
                      className="w-full h-full object-cover opacity-85 hover:scale-102 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 right-2.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${
                          proj.status === "Looking for Contributors"
                            ? "bg-blue-900/80 text-blue-200 border-blue-700"
                            : proj.status === "Student Showcase"
                            ? "bg-purple-900/80 text-purple-200 border-purple-700"
                            : "bg-emerald-900/80 text-emerald-200 border-emerald-700"
                        }`}
                      >
                        {proj.status}
                      </span>
                    </div>
                  </div>
                )}

                <div className="p-5 space-y-3">
                  {/* Title & Author */}
                  <div>
                    <h3 className="font-bold text-base text-[#17243A] dark:text-white leading-snug">
                      {proj.name}
                    </h3>
                    <p className="text-xs font-medium text-muted-foreground mt-0.5">
                      {proj.tagline}
                    </p>
                  </div>

                  <p className="text-xs text-foreground/80 leading-relaxed line-clamp-3">
                    {proj.description}
                  </p>

                  {/* Tech Stack Pills */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {proj.techStack.map((tech, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-[#F5F7FA] dark:bg-secondary text-muted-foreground text-[10px] font-mono border border-[#E2E8F0] dark:border-border"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer: Metrics & Links */}
              <div className="p-4 bg-[#F5F7FA]/60 dark:bg-secondary/30 border-t border-[#E2E8F0] dark:border-border flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  {/* Star Action */}
                  <button
                    onClick={() => toggleStar(proj.id)}
                    className={`inline-flex items-center gap-1 font-mono font-semibold transition-colors cursor-pointer ${
                      isStarred ? "text-amber-500" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Star className={`w-3.5 h-3.5 ${isStarred ? "fill-current" : ""}`} />
                    <span>{starCount}</span>
                  </button>

                  {/* Forks */}
                  <div className="inline-flex items-center gap-1 font-mono text-muted-foreground">
                    <GitFork className="w-3.5 h-3.5" />
                    <span>{proj.forks}</span>
                  </div>

                  {/* Feedback Comments */}
                  <div className="inline-flex items-center gap-1 font-mono text-muted-foreground">
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>{proj.feedbackCount}</span>
                  </div>
                </div>

                {/* External Links */}
                <div className="flex items-center gap-2">
                  <a
                    href={proj.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-[#E2E8F0] dark:hover:bg-secondary transition-colors"
                    title="View GitHub Repository"
                  >
                    <Github className="w-4 h-4" />
                  </a>

                  {proj.demoUrl && (
                    <a
                      href={proj.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#2463D3] hover:bg-[#2463D3]/90 text-white text-[11px] font-semibold transition-colors"
                    >
                      <span>Live Demo</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TechProjectsSection;

