"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Plus, Sparkles, Code2, Trophy, ArrowRight, Layers } from "lucide-react";
import WorldSwitcher from "../ui/WorldSwitcher";
import Card from "../ui/Card";
import { SwitchPost, WORLD_DEFINITIONS } from "@/lib/data/worldsData";
import { useActiveWorld } from "../ActiveWorldContext";

interface HomeFeedProps {
  initialThoughts: SwitchPost[];
}

const SUB_FILTERS: Record<string, string[]> = {
  Technology: ["All Projects", "Algorithms & Rust", "Web Architecture", "Distributed Systems", "Benchmarks"],
  Meme: ["All Memes", "Templates", "Dev Banter", "Trending Remixes", "Audio Reactions"],
  Cricket: ["All Matches", "Test Series", "T20 Super Overs", "Voice Commentary", "Bowling Spells"]
};

export const HomeFeed: React.FC<HomeFeedProps> = ({ initialThoughts }) => {
  const { activeWorld, setActiveWorld } = useActiveWorld();
  const [subFilter, setSubFilter] = useState<string>("All");

  const activeWorldMeta =
    WORLD_DEFINITIONS.find((w) => w.id.toLowerCase() === activeWorld.toLowerCase()) || WORLD_DEFINITIONS[0];

  const filteredPosts = initialThoughts.filter((post) => {
    if (activeWorld === "All") return true;
    return post.world.toLowerCase() === activeWorld.toLowerCase();
  });

  return (
    <div className="w-full space-y-6">
      {/* Feed Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Switch Stream
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Every interest deserves its own specialized world.
            </p>
          </div>

          <Link
            href={`/create${activeWorld !== "All" ? `?world=${activeWorld}` : ""}`}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs sm:text-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Post</span>
          </Link>
        </div>

        {/* Global World Switcher Bar with the 3 Core Worlds + All */}
        <div className="pt-1">
          <WorldSwitcher activeWorld={activeWorld} onSelectWorld={setActiveWorld} />
        </div>
      </div>

      {/* World-Specific Banner */}
      {activeWorld !== "All" && (
        <div className="switch-card p-5 sm:p-6 space-y-3 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-secondary text-foreground">
                {activeWorld === "Technology" && <Code2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
                {activeWorld === "Meme" && <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
                {activeWorld === "Cricket" && <Trophy className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
              </div>
              <div>
                <h3 className="font-bold text-sm text-foreground">
                  {activeWorldMeta.label}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {activeWorldMeta.tagline}
                </p>
              </div>
            </div>

            <Link
              href={activeWorldMeta.slug}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors self-start sm:self-center"
            >
              <span>Enter Dedicated {activeWorld} UI</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Sub-Filters for this World */}
          {SUB_FILTERS[activeWorld] && (
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2 border-t border-border">
              <span className="text-[11px] font-semibold text-muted-foreground mr-1">Filter:</span>
              {SUB_FILTERS[activeWorld].map((sub, i) => (
                <button
                  key={i}
                  onClick={() => setSubFilter(sub)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    (sub.startsWith("All") && subFilter === "All") || subFilter === sub
                      ? "bg-secondary text-foreground font-bold border border-border"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* World Presentation Feed */}
      {filteredPosts.length === 0 ? (
        <div className="p-12 text-center bg-card rounded-lg border border-border space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-secondary text-primary flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-foreground">
              No posts in {activeWorldMeta.label} yet
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-1">
              Be the first to share an engineering project, meme template, or cricket match discussion!
            </p>
          </div>
          <Link
            href={`/create?world=${activeWorld === "All" ? "Technology" : activeWorld}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create in {activeWorldMeta.label}</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredPosts.map((thought) => (
            <Card key={thought._id} thought={thought} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomeFeed;
