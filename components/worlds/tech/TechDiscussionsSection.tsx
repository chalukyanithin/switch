"use client";
import React, { useState } from "react";
import {
  MessageSquare,
  HelpCircle,
  CheckCircle2,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Search,
  Filter,
  Plus,
  ArrowRight,
  Code2,
  Layers,
  MessageCircle,
} from "lucide-react";

export interface DiscussionItem {
  id: string;
  category: "Architecture" | "Debugging" | "Beginner Questions" | "Opinions & Debates";
  title: string;
  author: {
    name: string;
    username: string;
    avatar: string;
    badge?: string;
  };
  votes: number;
  answersCount: number;
  isSolved: boolean;
  createdAt: string;
  snippet: string;
  codePreview?: string;
  tags: string[];
  acceptedAnswer?: {
    author: string;
    summary: string;
  };
}

const SAMPLE_DISCUSSIONS: DiscussionItem[] = [
  {
    id: "disc-1",
    category: "Architecture",
    title: "Designing event-driven architecture with Kafka vs RabbitMQ for transactional audio packets",
    author: {
      name: "Marcus Vance",
      username: "marcus_kernel",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300&q=80",
      badge: "Systems Architect",
    },
    votes: 48,
    answersCount: 14,
    isSolved: true,
    createdAt: "2 hours ago",
    snippet:
      "We're streaming 30-second audio comments with low-latency waveforms. At 50K concurrent uploads, should we ingest through Kafka log partitions or use RabbitMQ exchange queues with dead-letter buffering?",
    codePreview: `// Sample partition hash strategy
const partition = murmurHash3(commentId) % TOTAL_AUDIO_PARTITIONS;
await kafkaProducer.send({ topic: 'audio.transcode', partition, messages: [packet] });`,
    tags: ["Distributed Systems", "Kafka", "RabbitMQ", "Audio Pipeline"],
    acceptedAnswer: {
      author: "sarah_chen",
      summary:
        "For audio transcoding with discrete chunk processing, Kafka gives you replayability and backpressure resilience. Use RabbitMQ only if you require complex AMQP header routing per client tenant.",
    },
  },
  {
    id: "disc-2",
    category: "Debugging",
    title: "V8 memory leak: Detached DOM elements accumulating during repeated canvas meme re-renders",
    author: {
      name: "Elena Rostova",
      username: "elena_cooks",
      avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=300&h=300&q=80",
    },
    votes: 31,
    answersCount: 7,
    isSolved: true,
    createdAt: "4 hours ago",
    snippet:
      "When users edit and re-render memes in the HTML5 canvas modal 20+ times, Chrome DevTools memory snapshot shows 140MB of detached HTMLCanvasElement nodes that GC refuses to scavenge.",
    codePreview: `// Leak source: Event listener closure retaining canvas reference
window.addEventListener('resize', () => {
  ctx.drawImage(offscreenCanvas, 0, 0); // offscreenCanvas pinned forever!
});`,
    tags: ["JavaScript", "V8", "Memory Leaks", "Canvas API"],
    acceptedAnswer: {
      author: "alex_dev",
      summary:
        "Set canvas.width = 0; canvas.height = 0; explicitly and disconnect resize listeners in the component unmount cleanup callback. V8's Oilpan GC requires explicit nullification of ImageBitmap bindings.",
    },
  },
  {
    id: "disc-3",
    category: "Beginner Questions",
    title: "Why does Rust disallow having multiple mutable references (&mut T) in the same scope?",
    author: {
      name: "Jordan Lee",
      username: "jordan_codes",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&h=300&q=80",
    },
    votes: 62,
    answersCount: 19,
    isSolved: true,
    createdAt: "1 day ago",
    snippet:
      "Coming from JavaScript and Python, aliasing pointers is standard. Why is having two mutable references so strictly prohibited by the compiler even in single-threaded code?",
    tags: ["Rust", "Ownership", "Memory Safety", "Beginners"],
    acceptedAnswer: {
      author: "marcus_kernel",
      summary:
        "Iterator invalidation! In single-threaded code, if one reference appends to a vector, the vector may reallocate its backing buffer in heap memory. The second reference now points to deallocated junk memory (use-after-free). Rust prevents this at compile time.",
    },
  },
  {
    id: "disc-4",
    category: "Opinions & Debates",
    title: "Server Actions vs REST/tRPC: Are we recreating monolithic coupling in full-stack frameworks?",
    author: {
      name: "Sarah Chen",
      username: "sarah_chen",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&h=300&q=80",
      badge: "Staff Engineer",
    },
    votes: 89,
    answersCount: 36,
    isSolved: false,
    createdAt: "1 day ago",
    snippet:
      "Server Actions offer unparalleled DX for form submissions and mutations without boilerplate API endpoints. But how do mobile native apps, third-party webhook integrations, and external CLI tools consume them without duplicating business logic?",
    tags: ["Web Architecture", "Next.js", "Server Actions", "API Design"],
  },
];

interface TechDiscussionsSectionProps {
  onAskQuestion?: () => void;
}

export const TechDiscussionsSection: React.FC<TechDiscussionsSectionProps> = ({
  onAskQuestion,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All Discussions");
  const [searchQuery, setSearchQuery] = useState("");
  const [userVotes, setUserVotes] = useState<Record<string, number>>({});

  const categories = [
    "All Discussions",
    "Architecture",
    "Debugging",
    "Beginner Questions",
    "Opinions & Debates",
  ];

  const handleVote = (id: string, delta: number) => {
    setUserVotes((prev) => {
      const current = prev[id] || 0;
      const updated = current === delta ? 0 : delta;
      return { ...prev, [id]: updated };
    });
  };

  const filtered = SAMPLE_DISCUSSIONS.filter((item) => {
    if (selectedCategory !== "All Discussions" && item.category !== selectedCategory) {
      return false;
    }
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(query) ||
      item.snippet.toLowerCase().includes(query) ||
      item.tags.some((t) => t.toLowerCase().includes(query))
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Editorial Header */}
      <div className="rounded-lg border border-[#E2E8F0] dark:border-border bg-white dark:bg-card p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-[#2463D3]/10 text-[#2463D3] dark:text-blue-400 border border-[#2463D3]/20">
                STRUCTURED Q&A & DEBATES
              </span>
              <span className="text-xs font-mono text-muted-foreground">
                Technical Knowledge Base
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#17243A] dark:text-white tracking-tight">
              Engineering Discussions
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
              Deep questions, architecture tradeoffs, and debugging investigations. Don&apos;t force complex systems into tweet-sized blurbs.
            </p>
          </div>

          <button
            onClick={onAskQuestion}
            className="px-4 py-2 rounded-md bg-[#2463D3] hover:bg-[#2463D3]/90 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Ask a Question</span>
          </button>
        </div>

        {/* Category Pills & Search */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-3 border-t border-[#E2E8F0] dark:border-border">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#2463D3] text-white font-semibold"
                    : "bg-[#F5F7FA] dark:bg-secondary text-muted-foreground hover:text-[#17243A] dark:hover:text-white border border-[#E2E8F0] dark:border-border"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search discussions & tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F5F7FA] dark:bg-secondary/40 border border-[#E2E8F0] dark:border-border rounded-md pl-8 pr-3 py-1.5 text-xs text-foreground outline-none focus:border-[#2463D3]"
            />
          </div>
        </div>
      </div>

      {/* Discussions Feed */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="p-10 text-center bg-white dark:bg-card rounded-lg border border-[#E2E8F0] dark:border-border space-y-3">
            <HelpCircle className="w-8 h-8 text-muted-foreground mx-auto opacity-50" />
            <p className="font-bold text-sm text-[#17243A] dark:text-white">
              No discussions found matching your filter
            </p>
            <p className="text-xs text-muted-foreground">
              Try adjusting your search or start the conversation.
            </p>
          </div>
        ) : (
          filtered.map((item) => {
            const currentVoteOffset = userVotes[item.id] || 0;
            const netVotes = item.votes + currentVoteOffset;

            return (
              <div
                key={item.id}
                className="rounded-lg border border-[#E2E8F0] dark:border-border bg-white dark:bg-card p-5 transition-colors hover:border-[#2463D3]/50 flex gap-4"
              >
                {/* Left Vote Column */}
                <div className="flex flex-col items-center justify-start shrink-0 pt-0.5">
                  <button
                    onClick={() => handleVote(item.id, 1)}
                    className={`p-1 rounded hover:bg-[#F5F7FA] dark:hover:bg-secondary transition-colors cursor-pointer ${
                      currentVoteOffset === 1
                        ? "text-[#2463D3] font-bold"
                        : "text-muted-foreground"
                    }`}
                    title="Upvote"
                  >
                    <ChevronUp className="w-5 h-5" />
                  </button>

                  <span className="text-xs font-mono font-bold text-[#17243A] dark:text-white my-0.5">
                    {netVotes}
                  </span>

                  <button
                    onClick={() => handleVote(item.id, -1)}
                    className={`p-1 rounded hover:bg-[#F5F7FA] dark:hover:bg-secondary transition-colors cursor-pointer ${
                      currentVoteOffset === -1
                        ? "text-red-500 font-bold"
                        : "text-muted-foreground"
                    }`}
                    title="Downvote"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </button>
                </div>

                {/* Right Content Column */}
                <div className="flex-1 space-y-3 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    {item.isSolved ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Solved</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                        <span>Open</span>
                      </span>
                    )}

                    <span className="px-2 py-0.5 rounded text-[11px] font-mono text-muted-foreground bg-secondary border border-border">
                      {item.category}
                    </span>

                    <span className="text-xs text-muted-foreground font-mono">
                      • {item.createdAt}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-[#17243A] dark:text-white hover:text-[#2463D3] transition-colors leading-snug cursor-pointer">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed">
                    {item.snippet}
                  </p>

                  {/* Code Snippet preview if applicable */}
                  {item.codePreview && (
                    <div className="rounded-md border border-slate-900 bg-[#0f172a] text-slate-200 font-mono text-xs p-3 overflow-x-auto">
                      <pre className="leading-relaxed">
                        <code>{item.codePreview}</code>
                      </pre>
                    </div>
                  )}

                  {/* Accepted Answer Highlight */}
                  {item.acceptedAnswer && (
                    <div className="p-3.5 rounded-md border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-1.5 text-xs">
                      <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-semibold font-mono text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Accepted Solution by @{item.acceptedAnswer.author}:</span>
                      </div>
                      <p className="text-foreground/90 leading-relaxed">
                        {item.acceptedAnswer.summary}
                      </p>
                    </div>
                  )}

                  {/* Footer Row: Tags, Author, Answers count */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#E2E8F0] dark:border-border text-xs">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {item.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-[#F5F7FA] dark:bg-secondary text-muted-foreground text-[11px] font-mono border border-[#E2E8F0] dark:border-border"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-muted-foreground text-xs font-mono">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{item.answersCount} answers</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <img
                          src={item.author.avatar}
                          alt={item.author.username}
                          className="w-4 h-4 rounded-full object-cover"
                        />
                        <span className="font-mono text-xs text-[#17243A] dark:text-foreground">
                          @{item.author.username}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TechDiscussionsSection;

