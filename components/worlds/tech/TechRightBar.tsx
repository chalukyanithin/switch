"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Cpu,
  Terminal,
  Network,
  Code2,
  Brain,
  Database,
  Flame,
  Check,
  ArrowRight,
  MessageSquare,
  Sparkles,
} from "lucide-react";

interface TechRightBarProps {
  onSelectTopic?: (topic: string) => void;
  onOpenQuiz?: () => void;
}

const TOPICS_GRID = [
  { id: "Operating Systems", label: "Operating Systems", icon: Terminal },
  { id: "Networking", label: "Networking", icon: Network },
  { id: "Programming", label: "Programming", icon: Code2 },
  { id: "AI / ML", label: "AI / ML", icon: Brain },
  { id: "Databases", label: "Databases", icon: Database },
  { id: "Computer Architecture", label: "Computer Architecture", icon: Cpu },
];

const WEEKDAY_STREAKS = [
  { day: "Mon", completed: true },
  { day: "Tue", completed: true },
  { day: "Wed", completed: true },
  { day: "Thu", completed: true },
  { day: "Fri", completed: true },
  { day: "Sat", completed: true },
  { day: "Sun", completed: false }, // Today
];

const TRENDING_DISCUSSIONS = [
  {
    id: "trend-1",
    title: "Is Rust a good choice for system programming in 2025?",
    upvotes: 186,
    comments: 47,
  },
  {
    id: "trend-2",
    title: "How does Docker differ from a virtual machine at a fundamental level?",
    upvotes: 152,
    comments: 36,
  },
  {
    id: "trend-3",
    title: "What are the best resources to learn Operating Systems from scratch?",
    upvotes: 129,
    comments: 28,
  },
];

export const TechRightBar: React.FC<TechRightBarProps> = ({
  onSelectTopic,
  onOpenQuiz,
}) => {
  return (
    <div className="w-full space-y-4 p-4 sm:p-5 text-sm overflow-y-auto max-h-screen no-scrollbar world-tech">
      {/* 1. Explore Topics (2-Column Grid matching screenshot) */}
      <div className="p-4 rounded-xl bg-white dark:bg-card border border-[#E2E8F0] dark:border-border space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-[#17243A] dark:text-white">
            Explore topics
          </h3>
          <Link
            href="/world/tech?tab=discover"
            className="text-xs font-semibold text-[#2463D3] hover:underline flex items-center gap-1"
          >
            <span>See all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {TOPICS_GRID.map((t) => {
            const Icon = t.icon;
            if (onSelectTopic) {
              return (
                <button
                  key={t.id}
                  onClick={() => onSelectTopic(t.id)}
                  className="p-2.5 rounded-lg border border-[#E2E8F0] dark:border-border bg-[#F8FAFC] dark:bg-secondary/40 hover:bg-white dark:hover:bg-card hover:border-[#2463D3] transition-all text-left flex items-center gap-2 group cursor-pointer"
                >
                  <div className="p-1.5 rounded-md bg-white dark:bg-card border border-[#E2E8F0] dark:border-border text-[#2463D3] shrink-0">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-[#17243A] dark:text-white leading-tight line-clamp-2">
                    {t.label}
                  </span>
                </button>
              );
            }
            return (
              <Link
                key={t.id}
                href={`/world/tech?topic=${encodeURIComponent(t.id)}`}
                className="p-2.5 rounded-lg border border-[#E2E8F0] dark:border-border bg-[#F8FAFC] dark:bg-secondary/40 hover:bg-white dark:hover:bg-card hover:border-[#2463D3] transition-all text-left flex items-center gap-2 group cursor-pointer"
              >
                <div className="p-1.5 rounded-md bg-white dark:bg-card border border-[#E2E8F0] dark:border-border text-[#2463D3] shrink-0">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-[#17243A] dark:text-white leading-tight line-clamp-2">
                  {t.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 2. Daily Quiz Streak Card (Matching screenshot) */}
      <div className="p-4 rounded-xl bg-white dark:bg-card border border-[#E2E8F0] dark:border-border space-y-3">
        <div className="flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-amber-500 fill-current" />
          <h3 className="font-bold text-xs uppercase tracking-wider text-[#17243A] dark:text-white">
            Daily Quiz Streak
          </h3>
        </div>

        <div className="flex items-baseline justify-between">
          <div>
            <div className="text-2xl font-extrabold font-mono text-[#17243A] dark:text-white">
              7 days
            </div>
            <div className="text-xs text-muted-foreground font-medium">
              Keep it up!
            </div>
          </div>

          <Link
            href="/world/tech?tab=quiz"
            onClick={onOpenQuiz}
            className="px-3 py-1.5 rounded-md bg-[#2463D3] hover:bg-[#2463D3]/90 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
          >
            <span>Play today</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* 7 Weekday Bubbles */}
        <div className="flex items-center justify-between pt-1">
          {WEEKDAY_STREAKS.map((item) => (
            <div key={item.day} className="flex flex-col items-center gap-1">
              <span className="text-[10px] text-muted-foreground font-medium font-mono">
                {item.day}
              </span>
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                  item.completed
                    ? "bg-[#2463D3] text-white shadow-xs"
                    : "border-2 border-[#CBD5E1] dark:border-slate-700 bg-transparent"
                }`}
              >
                {item.completed && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Trending Discussions (Matching screenshot) */}
      <div className="p-4 rounded-xl bg-white dark:bg-card border border-[#E2E8F0] dark:border-border space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-[#17243A] dark:text-white">
            Trending Discussions
          </h3>
          <Link
            href="/world/tech?tab=discussions"
            className="text-xs font-semibold text-[#2463D3] hover:underline flex items-center gap-1"
          >
            <span>See all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-3">
          {TRENDING_DISCUSSIONS.map((item) => (
            <Link
              key={item.id}
              href="/world/tech?tab=discussions"
              className="flex items-start gap-2.5 group cursor-pointer"
            >
              <div className="p-1 rounded bg-[#2463D3]/10 text-[#2463D3] mt-0.5 shrink-0">
                <TrendingUp className="w-3.5 h-3.5" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <h4 className="text-xs font-bold text-[#17243A] dark:text-white group-hover:text-[#2463D3] transition-colors leading-snug line-clamp-2">
                  {item.title}
                </h4>
                <p className="text-[11px] text-muted-foreground font-mono">
                  {item.upvotes} upvotes • {item.comments} comments
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechRightBar;
