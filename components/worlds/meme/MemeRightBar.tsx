"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Trophy, Zap, Crown, Clock, ArrowRight, Heart, Share2, Sparkles, Check } from "lucide-react";

interface MemeRightBarProps {
  onOpenCreate?: (defaultTag?: string) => void;
  onOpenLeaderboard?: () => void;
  onOpenBattles?: () => void;
}

export const MemeRightBar: React.FC<MemeRightBarProps> = ({
  onOpenCreate,
  onOpenLeaderboard,
  onOpenBattles,
}) => {
  const [participated, setParticipated] = useState(false);

  return (
    <div className="w-full space-y-4 p-4 sm:p-5 text-sm overflow-y-auto max-h-screen no-scrollbar world-meme">
      {/* 1. Meme of the Day (Pixel-Matched to Screenshot) */}
      <div className="p-4 rounded-xl bg-white dark:bg-card border border-[#E2E8F0] dark:border-border space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm text-[#17243A] dark:text-white">
              Meme of the Day
            </span>
            <span className="text-base">🏆</span>
          </div>
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
            Curated Daily
          </span>
        </div>

        {/* Featured Meme with Laurel Wreaths */}
        <div className="relative rounded-xl overflow-hidden border border-[#E2E8F0] dark:border-border bg-slate-900 group">
          <div className="flex items-center justify-between px-2 py-1 absolute top-2 inset-x-2 z-10">
            <span className="text-xl select-none filter drop-shadow">🌿</span>
            <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-[10px] font-bold text-amber-300">
              #1 Today
            </span>
            <span className="text-xl select-none filter drop-shadow transform scale-x-[-1]">🌿</span>
          </div>

          <div className="w-full aspect-video relative flex items-center justify-center overflow-hidden bg-slate-900">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
              alt="Meme of the day"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80";
              }}
            />
            {/* Hindi / Desi Subtitle Overlay matching screenshot */}
            <div className="absolute bottom-3 inset-x-3 text-center px-3 py-1.5 rounded-lg bg-black/75 backdrop-blur-xs border border-white/20">
              <p className="text-xs sm:text-sm font-bold text-white tracking-wide">
                Aaj kuch productive nahi karenge
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
          <span className="font-medium text-[#17243A] dark:text-slate-200">
            by @desi.banter
          </span>
          <span className="font-bold text-[#2463D3] flex items-center gap-1">
            🔥 3.4K upvotes
          </span>
        </div>
      </div>

      {/* 2. This Week's Challenge Card (Pixel-Matched to Screenshot) */}
      <div className="p-4 rounded-xl bg-white dark:bg-card border border-[#E2E8F0] dark:border-border space-y-3 shadow-xs">
        <div className="flex items-center gap-1.5">
          <h3 className="font-bold text-sm text-[#17243A] dark:text-white">
            This Week&apos;s Challenge
          </h3>
          <span className="text-amber-500 font-bold">⚡</span>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#2463D3] flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-900/40">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="space-y-0.5 min-w-0">
            <h4 className="font-bold text-xs sm:text-sm text-[#17243A] dark:text-white">
              Office Life Memes
            </h4>
            <p className="text-[11px] text-muted-foreground leading-tight">
              Show us your office/remote life in memes.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setParticipated(true);
            if (onOpenCreate) onOpenCreate("Office");
          }}
          className="w-full py-2 px-3 rounded-xl bg-[#2463D3] hover:bg-[#2463D3]/90 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-98"
        >
          {participated ? (
            <>
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>Create Entry</span>
            </>
          ) : (
            <span>Participate</span>
          )}
        </button>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground font-mono">
          <Clock className="w-3.5 h-3.5" />
          <span>Ends in 3 days</span>
        </div>
      </div>

      {/* 3. Meme Leaderboard (Pixel-Matched to Screenshot) */}
      <div className="p-4 rounded-xl bg-white dark:bg-card border border-[#E2E8F0] dark:border-border space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <h3 className="font-bold text-sm text-[#17243A] dark:text-white">
              Meme Leaderboard
            </h3>
            <span className="text-amber-500">👑</span>
          </div>
          <Link
            href="/world/meme?tab=battles"
            className="text-[11px] font-semibold text-[#2463D3] hover:underline flex items-center gap-0.5"
          >
            <span>Battles</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="space-y-2.5">
          {/* #1 */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/30">
            <div className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-900 font-black text-[11px] flex items-center justify-center shrink-0">
                1
              </span>
              <img
                src="https://api.dicebear.com/7.x/bottts/svg?seed=memeengineer"
                alt="meme.engineer"
                className="w-7 h-7 rounded-full object-cover border border-amber-300 shrink-0"
              />
              <span className="font-bold text-xs text-[#17243A] dark:text-white truncate max-w-[110px]">
                meme.engineer
              </span>
            </div>
            <span className="text-[11px] font-mono font-bold text-amber-700 dark:text-amber-300">
              12,340 pts
            </span>
          </div>

          {/* #2 */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-secondary/40 border border-[#E2E8F0] dark:border-border">
            <div className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-full bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-[11px] flex items-center justify-center shrink-0">
                2
              </span>
              <img
                src="https://api.dicebear.com/7.x/adventurer/svg?seed=sleepycoder"
                alt="sleepycoder"
                className="w-7 h-7 rounded-full object-cover border border-border shrink-0"
              />
              <span className="font-semibold text-xs text-[#17243A] dark:text-white truncate max-w-[110px]">
                sleepycoder
              </span>
            </div>
            <span className="text-[11px] font-mono font-semibold text-muted-foreground">
              9,870 pts
            </span>
          </div>

          {/* #3 */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-secondary/40 border border-[#E2E8F0] dark:border-border">
            <div className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-full bg-amber-600/30 text-amber-800 dark:text-amber-200 font-bold text-[11px] flex items-center justify-center shrink-0">
                3
              </span>
              <img
                src="https://api.dicebear.com/7.x/adventurer/svg?seed=dailydoge"
                alt="daily.doge"
                className="w-7 h-7 rounded-full object-cover border border-border shrink-0"
              />
              <span className="font-semibold text-xs text-[#17243A] dark:text-white truncate max-w-[110px]">
                daily.doge
              </span>
            </div>
            <span className="text-[11px] font-mono font-semibold text-muted-foreground">
              8,920 pts
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemeRightBar;

