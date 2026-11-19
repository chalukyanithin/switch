"use client";

import React from "react";

// ─────────────────────────────────────────────
// Skeleton shimmer — matches card dimensions
// ─────────────────────────────────────────────
const shimmerClass =
  "relative overflow-hidden before:absolute before:inset-0 before:translate-x-[-100%] before:bg-gradient-to-r before:from-transparent before:via-white/40 dark:before:via-white/5 before:to-transparent before:animate-[shimmer_1.6s_infinite] rounded-md";

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = "" }) => (
  <div className={`bg-muted ${shimmerClass} ${className}`} />
);

// ─────────────────────────────────────────────
// Feed card skeleton
// ─────────────────────────────────────────────
export const CardSkeleton: React.FC = () => (
  <article className="switch-card w-full p-5 space-y-4" aria-busy="true" aria-label="Loading post…">
    {/* Header */}
    <div className="flex items-center gap-3">
      <Skeleton className="w-9 h-9 rounded-full shrink-0" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-2.5 w-20" />
      </div>
    </div>

    {/* Body */}
    <div className="space-y-2">
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
      <Skeleton className="h-3 w-4/6" />
    </div>

    {/* Image placeholder - shown sometimes */}
    <Skeleton className="h-44 w-full rounded-xl" />

    {/* Footer */}
    <div className="flex items-center gap-6 pt-1">
      <Skeleton className="h-4 w-12" />
      <Skeleton className="h-4 w-12" />
      <Skeleton className="h-4 w-10" />
    </div>
  </article>
);

// ─────────────────────────────────────────────
// RightBar widget skeleton
// ─────────────────────────────────────────────
export const RightBarSkeleton: React.FC = () => (
  <div className="space-y-3 p-4" aria-busy="true">
    <Skeleton className="h-4 w-32" />
    {[0, 1, 2].map((i) => (
      <div key={i} className="flex items-center gap-3">
        <Skeleton className="w-8 h-8 rounded-full shrink-0" />
        <div className="flex-1 space-y-1">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-2.5 w-20" />
        </div>
      </div>
    ))}
  </div>
);

// ─────────────────────────────────────────────
// Leaderboard row skeleton
// ─────────────────────────────────────────────
export const LeaderboardSkeleton: React.FC = () => (
  <div className="space-y-2.5 p-4" aria-busy="true">
    <Skeleton className="h-4 w-28 mb-3" />
    {[0, 1, 2].map((i) => (
      <div key={i} className="flex items-center gap-3">
        <Skeleton className="w-5 h-5 rounded-full shrink-0" />
        <Skeleton className="w-7 h-7 rounded-full shrink-0" />
        <Skeleton className="flex-1 h-3" />
        <Skeleton className="h-3 w-16" />
      </div>
    ))}
  </div>
);

// ─────────────────────────────────────────────
// Feed loading list
// ─────────────────────────────────────────────
export const FeedSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => (
  <div className="space-y-6" aria-busy="true" aria-label="Loading feed…">
    {Array.from({ length: count }).map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);

