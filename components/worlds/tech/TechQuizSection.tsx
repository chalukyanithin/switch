"use client";
import React, { useState } from "react";
import {
  Flame,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  ChevronRight,
  RotateCcw,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Brain,
  Sparkles,
} from "lucide-react";

export interface QuizQuestion {
  id: string;
  topic: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  title: string;
  question: string;
  codeSnippet?: string;
  codeLanguage?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  docUrl?: string;
  docLabel?: string;
}

const DAILY_QUIZZES: QuizQuestion[] = [
  {
    id: "quiz-adv-1",
    topic: "Systems & Memory",
    difficulty: "Advanced",
    title: "Virtual Memory & Page Table Walk Cost",
    question:
      "On modern x86-64 hardware supporting 4-level paging (PML4), what occurs on a TLB miss for a 4KB page that causes significant latency spikes in high-frequency trading and low-latency systems?",
    codeSnippet: `// Virtual Address (48-bit canonical):
// [47..39 PML4] [38..30 PDP] [29..21 PD] [20..12 PT] [11..0 Offset]
// CR3 register holds physical base of PML4`,
    codeLanguage: "c",
    options: [
      "The kernel triggers an immediate software interrupt (INT 14) to resolve the mapping.",
      "The MMU hardware performs a 4-level sequential DRAM walk to dereference each page directory entry.",
      "The CPU flushes all execution pipelines and resets branch predictor tables.",
      "The L3 cache automatically prefetches the target page without memory controller intervention.",
    ],
    correctIndex: 1,
    explanation:
      "When a TLB miss occurs, the Memory Management Unit (MMU) must walk all 4 levels of the page table hierarchy (PML4 -> PDPT -> PD -> PT) in DRAM. If entries are not in CPU cache, each memory dereference incurs 50–80ns of latency (up to 200–300ns total). This is why low-latency systems configure 1GB or 2MB Huge Pages (Transparent Huge Pages / hugetlbfs) to eliminate 2–3 levels of the walk.",
    docUrl: "https://www.kernel.org/doc/html/latest/admin-guide/mm/transhuge.html",
    docLabel: "Linux Kernel Documentation: Huge Pages",
  },
  {
    id: "quiz-int-1",
    topic: "Concurrency & Rust",
    difficulty: "Intermediate",
    title: "Rust Borrow Checker & Channel Ownership",
    question:
      "In Rust's crossbeam or tokio mpsc channels, why does sending a non-Copy struct across a channel guarantee thread safety without requiring a Mutex?",
    codeSnippet: `let (tx, rx) = tokio::sync::mpsc::channel(100);
let packet = AudioPacket { id: 42, payload: vec![0.5; 512] };

tokio::spawn(async move {
    tx.send(packet).await.unwrap();
    // What happens if we try to access packet here?
});`,
    codeLanguage: "rust",
    options: [
      "The channel secretly clones the data on every send operation.",
      "Rust runtime checks ownership at runtime using reference counting pointers.",
      "Send moves ownership of the value to the receiver, preventing data races at compile-time.",
      "Tokio uses an internal hardware lock on the CPU bus during send.",
    ],
    correctIndex: 2,
    explanation:
      "The Send trait in Rust enforces move semantics. When packet is passed into tx.send(packet), ownership is transferred to the channel buffer and ultimately to the receiving thread. The sending thread cannot access packet afterwards, making simultaneous unsynchronized mutation impossible without any runtime locking overhead.",
    docUrl: "https://doc.rust-lang.org/book/ch16-02-message-passing.html",
    docLabel: "The Rust Book: Message Passing Concurrency",
  },
  {
    id: "quiz-beg-1",
    topic: "Web Architecture",
    difficulty: "Beginner",
    title: "HTTP/2 vs HTTP/3 Transport Protocol",
    question:
      "What is the fundamental transport layer difference between HTTP/2 and HTTP/3 that solves the Head-of-Line (HoL) blocking problem?",
    codeSnippet: `HTTP/2: Application -> TLS 1.3 -> TCP (Single Byte Stream)
HTTP/3: Application -> TLS 1.3 -> QUIC over UDP (Independent Streams)`,
    codeLanguage: "shell",
    options: [
      "HTTP/3 uses WebSocket connections instead of standard sockets.",
      "HTTP/3 runs over QUIC (UDP) where packet loss on one stream does not stall unrelated streams.",
      "HTTP/3 eliminates TLS encryption to increase packet throughput.",
      "HTTP/3 requires IPv6 and cannot operate over standard IPv4 networks.",
    ],
    correctIndex: 1,
    explanation:
      "In HTTP/2, multiplexed streams share a single TCP connection. When a single TCP packet is dropped, the entire connection blocks waiting for retransmission. HTTP/3 uses QUIC over UDP, providing independent stream packet sequences so packet loss on one image or stylesheet never blocks other concurrent requests.",
    docUrl: "https://www.rfc-editor.org/rfc/rfc9000.html",
    docLabel: "IETF RFC 9000: QUIC Transport Protocol",
  },
];

export const TechQuizSection: React.FC = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    "Beginner" | "Intermediate" | "Advanced"
  >("Advanced");
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [streakCount, setStreakCount] = useState(5);
  const [solvedToday, setSolvedToday] = useState(false);

  const currentQuiz =
    DAILY_QUIZZES.find((q) => q.difficulty === selectedDifficulty) ||
    DAILY_QUIZZES[0];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);
    if (idx === currentQuiz.correctIndex) {
      if (!solvedToday) {
        setStreakCount((prev) => prev + 1);
        setSolvedToday(true);
      }
    }
  };

  const handleReset = () => {
    setSelectedOption(null);
    setIsAnswered(false);
  };

  const isCorrect = selectedOption === currentQuiz.correctIndex;

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Banner: Editorial Daily Quiz Header & Stats */}
      <div className="rounded-lg border border-[#E2E8F0] dark:border-border bg-white dark:bg-card p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-[#2463D3]/10 text-[#2463D3] dark:text-blue-400 border border-[#2463D3]/20">
                DAILY TECH QUIZ
              </span>
              <span className="text-xs font-mono text-muted-foreground">
                Challenge #043 • November 2026
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#17243A] dark:text-white tracking-tight">
              Test Your Engineering Fundamentals
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
              One signature problem every morning across systems, low-latency algorithms, and web architecture. Detailed explanations and citations with every question.
            </p>
          </div>

          {/* Retention Stats Widget */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-[#F5F7FA] dark:bg-secondary/40 border border-[#E2E8F0] dark:border-border self-start sm:self-auto shrink-0">
            <div className="flex items-center gap-2 pr-3 border-r border-[#E2E8F0] dark:border-border">
              <div className="p-2 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Flame className="w-5 h-5 fill-current" />
              </div>
              <div>
                <div className="text-sm font-bold font-mono text-[#17243A] dark:text-white">
                  {streakCount} Days
                </div>
                <div className="text-[10px] text-muted-foreground uppercase font-semibold">
                  Active Streak
                </div>
              </div>
            </div>

            <div>
              <div className="text-sm font-bold font-mono text-[#2463D3] dark:text-blue-400">
                88%
              </div>
              <div className="text-[10px] text-muted-foreground uppercase font-semibold">
                Accuracy
              </div>
            </div>
          </div>
        </div>

        {/* Difficulty Switcher Tabs */}
        <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0] dark:border-border">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-muted-foreground mr-1.5 hidden sm:inline">
              Difficulty:
            </span>
            {(["Beginner", "Intermediate", "Advanced"] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => {
                  setSelectedDifficulty(diff);
                  handleReset();
                }}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  selectedDifficulty === diff
                    ? "bg-[#2463D3] text-white font-semibold"
                    : "bg-[#F5F7FA] dark:bg-secondary text-muted-foreground hover:text-[#17243A] dark:hover:text-white border border-[#E2E8F0] dark:border-border"
                }`}
              >
                {diff}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-muted-foreground hidden md:inline">
              Topic: {currentQuiz.topic}
            </span>
            {isAnswered && (
              <button
                onClick={handleReset}
                className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-[#2463D3] transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="rounded-lg border border-[#E2E8F0] dark:border-border bg-white dark:bg-card p-5 sm:p-7 space-y-5">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-secondary text-muted-foreground border border-border">
              {currentQuiz.topic}
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              {currentQuiz.difficulty} Tier
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-[#17243A] dark:text-white leading-snug">
            {currentQuiz.title}
          </h3>

          <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
            {currentQuiz.question}
          </p>
        </div>

        {/* Code Snippet if applicable */}
        {currentQuiz.codeSnippet && (
          <div className="rounded-md border border-[#0f172a] bg-[#0f172a] text-slate-100 overflow-hidden font-mono text-xs">
            <div className="flex items-center justify-between px-3 py-1.5 bg-[#1e293b] border-b border-slate-800 text-[11px] text-slate-400">
              <span>{currentQuiz.codeLanguage || "code"}</span>
              <span className="text-slate-500">readonly</span>
            </div>
            <pre className="p-3.5 overflow-x-auto leading-relaxed font-mono">
              <code>{currentQuiz.codeSnippet}</code>
            </pre>
          </div>
        )}

        {/* Multiple Choice Options */}
        <div className="space-y-2.5 pt-1">
          {currentQuiz.options.map((opt, idx) => {
            const letter = String.fromCharCode(65 + idx);
            const isSelected = selectedOption === idx;
            const isCorrectOption = idx === currentQuiz.correctIndex;

            let optionStyle =
              "border-[#E2E8F0] dark:border-border bg-white dark:bg-card hover:border-[#2463D3]/60 hover:bg-[#F5F7FA] dark:hover:bg-secondary/40 text-[#17243A] dark:text-foreground";

            if (isAnswered) {
              if (isCorrectOption) {
                optionStyle =
                  "border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 font-semibold";
              } else if (isSelected && !isCorrectOption) {
                optionStyle =
                  "border-red-400 bg-red-50/70 dark:bg-red-950/30 text-red-900 dark:text-red-200";
              } else {
                optionStyle =
                  "opacity-60 border-[#E2E8F0] dark:border-border bg-white dark:bg-card text-muted-foreground";
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleSelectOption(idx)}
                className={`w-full text-left p-3.5 rounded-md border transition-all flex items-start gap-3 cursor-pointer text-xs sm:text-sm ${optionStyle}`}
              >
                <span
                  className={`w-6 h-6 rounded flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5 ${
                    isAnswered && isCorrectOption
                      ? "bg-emerald-600 text-white"
                      : isAnswered && isSelected
                      ? "bg-red-500 text-white"
                      : "bg-[#F5F7FA] dark:bg-secondary text-[#17243A] dark:text-foreground border border-[#E2E8F0] dark:border-border"
                  }`}
                >
                  {letter}
                </span>

                <span className="flex-1 leading-relaxed">{opt}</span>

                {isAnswered && isCorrectOption && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                )}
                {isAnswered && isSelected && !isCorrectOption && (
                  <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Detailed Explanation Drawer */}
        {isAnswered && (
          <div
            className={`p-4 sm:p-5 rounded-md border space-y-3 animate-in fade-in duration-200 ${
              isCorrect
                ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50"
                : "bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/50"
            }`}
          >
            <div className="flex items-center gap-2">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-xs uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                    Correct Answer! Great Engineering Intuition
                  </span>
                </>
              ) : (
                <>
                  <HelpCircle className="w-4 h-4 text-[#2463D3]" />
                  <span className="font-bold text-xs uppercase tracking-wider text-[#2463D3] dark:text-blue-300">
                    Concept Breakdown & Explanation
                  </span>
                </>
              )}
            </div>

            <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
              {currentQuiz.explanation}
            </p>

            {currentQuiz.docUrl && (
              <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                <a
                  href={currentQuiz.docUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-[#2463D3] hover:underline flex items-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{currentQuiz.docLabel || "Read Official Technical Docs"}</span>
                </a>

                <span className="text-[11px] font-mono text-muted-foreground">
                  +10 XP Earned
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Topic-Wise Performance & Quiz Archive */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg border border-[#E2E8F0] dark:border-border bg-white dark:bg-card space-y-2">
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Systems & OS
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-lg font-bold font-mono text-[#17243A] dark:text-white">
              92%
            </span>
            <span className="text-[11px] text-emerald-600 font-semibold font-mono">
              Top 5%
            </span>
          </div>
          <div className="w-full bg-[#F5F7FA] dark:bg-secondary h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#2463D3] h-full rounded-full" style={{ width: "92%" }} />
          </div>
        </div>

        <div className="p-4 rounded-lg border border-[#E2E8F0] dark:border-border bg-white dark:bg-card space-y-2">
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Algorithms & Math
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-lg font-bold font-mono text-[#17243A] dark:text-white">
              85%
            </span>
            <span className="text-[11px] text-muted-foreground font-mono">
              14 / 17
            </span>
          </div>
          <div className="w-full bg-[#F5F7FA] dark:bg-secondary h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#2463D3] h-full rounded-full" style={{ width: "85%" }} />
          </div>
        </div>

        <div className="p-4 rounded-lg border border-[#E2E8F0] dark:border-border bg-white dark:bg-card space-y-2">
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Web & Distributed
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-lg font-bold font-mono text-[#17243A] dark:text-white">
              90%
            </span>
            <span className="text-[11px] text-muted-foreground font-mono">
              18 / 20
            </span>
          </div>
          <div className="w-full bg-[#F5F7FA] dark:bg-secondary h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#2463D3] h-full rounded-full" style={{ width: "90%" }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechQuizSection;

