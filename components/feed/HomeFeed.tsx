"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Plus, Sparkles, Utensils, Palette, Code2, Music2, Dumbbell, Globe2, Layers, Filter } from "lucide-react";
import WorldSwitcher from "../ui/WorldSwitcher";
import Card from "../ui/Card";
import { SwitchPost, WORLD_DEFINITIONS } from "@/lib/data/worldsData";
import { useActiveWorld } from "../ActiveWorldContext";

interface HomeFeedProps {
  initialThoughts: SwitchPost[];
}

const SUB_FILTERS: Record<string, string[]> = {
  Cooking: ["All Recipes", "Baking & Sourdough", "Traditional Italian", "Quick Dinners", "Technique"],
  Art: ["All Mediums", "Oil on Linen", "Generative WebGL", "Contemporary", "Exhibitions"],
  Technology: ["All Projects", "Rust & Systems", "Web Architecture", "Distributed Consensus", "Benchmarks"],
  Music: ["All Audio", "Modular Synth", "Tape Loops", "Ambient", "Acoustic"],
  Fitness: ["All Routines", "Calisthenics", "Core Control", "Cardio Conditioning", "Mobility"]
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
              Switch Feed
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Every interest deserves its own specialized world.
            </p>
          </div>

          <Link
            href={`/create${activeWorld !== "All" ? `?world=${activeWorld}` : ""}`}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs sm:text-sm shadow-md shadow-primary/20 transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Thought</span>
          </Link>
        </div>

        {/* Global World Switcher Bar with hidden scrollbar and controls */}
        <div className="pt-1">
          <WorldSwitcher activeWorld={activeWorld} onSelectWorld={setActiveWorld} />
        </div>
      </div>

      {/* World-Specific Banner & Sub-Category Filters */}
      {activeWorld !== "All" && (
        <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border shadow-xs space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${activeWorldMeta.badgeBg}`}>
                {activeWorld === "Cooking" && <Utensils className="w-5 h-5" />}
                {activeWorld === "Art" && <Palette className="w-5 h-5" />}
                {activeWorld === "Technology" && <Code2 className="w-5 h-5" />}
                {activeWorld === "Music" && <Music2 className="w-5 h-5" />}
                {activeWorld === "Fitness" && <Dumbbell className="w-5 h-5" />}
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
              href={`/create?world=${activeWorld}`}
              className="text-xs font-bold text-primary hover:underline whitespace-nowrap pl-2"
            >
              Post in {activeWorld} →
            </Link>
          </div>

          {/* Sub-Filters for this World */}
          {SUB_FILTERS[activeWorld] && (
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 border-t border-border/60">
              <span className="text-[11px] font-semibold text-muted-foreground mr-1">Categories:</span>
              {SUB_FILTERS[activeWorld].map((sub, i) => (
                <button
                  key={i}
                  onClick={() => setSubFilter(sub)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    (sub.startsWith("All") && subFilter === "All") || subFilter === sub
                      ? "bg-secondary text-foreground font-bold"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* World Presentation Layouts */}
      {filteredPosts.length === 0 ? (
        <div className="p-12 text-center bg-card rounded-2xl border border-border space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-secondary text-primary flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-foreground">
              No thoughts in {activeWorldMeta.label} yet
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-1">
              Be the first to share an artisanal recipe, creative artwork, or code repository here!
            </p>
          </div>
          <Link
            href={`/create?world=${activeWorld === "All" ? "Thoughts" : activeWorld}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create in {activeWorldMeta.label}</span>
          </Link>
        </div>
      ) : activeWorld === "Art" ? (
        /* Art World: Visual Masonry / 2-Column Gallery Layout */
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground px-1 font-semibold uppercase tracking-wider">
            <span>Visual Exhibition Discovery</span>
            <span>Gallery Mode</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredPosts.map((thought) => (
              <div key={thought._id} className="h-full">
                <Card thought={thought} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Standard / Cooking / Tech / Music stream */
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
