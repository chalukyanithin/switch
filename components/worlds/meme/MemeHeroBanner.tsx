"use client";
import React from "react";

interface MemeHeroBannerProps {
  onCreateMeme?: () => void;
  onScrollToFeed?: () => void;
}

export const MemeHeroBanner: React.FC<MemeHeroBannerProps> = () => {
  return (
    <div className="w-full rounded-2xl border border-[#E2E8F0] dark:border-border bg-white dark:bg-card shadow-xs overflow-hidden transition-all">
      <img
        src="/meme-world-cover.jpg"
        alt="Welcome to Meme World"
        className="w-full h-auto block select-none object-contain"
      />
    </div>
  );
};

export default MemeHeroBanner;
