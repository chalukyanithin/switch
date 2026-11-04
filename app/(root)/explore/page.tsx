"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  Compass, Sparkles, TrendingUp, Utensils, Palette, Code2, Music2, Dumbbell,
  ArrowRight, Users, Star, Flame, Bookmark
} from "lucide-react";
import { WORLD_DEFINITIONS, INITIAL_SWITCH_POSTS } from "@/lib/data/worldsData";
import Card from "@/components/ui/Card";

const WORLD_SHOWCASES = [
  {
    id: "Cooking",
    title: "Cooking World",
    tagline: "Artisanal Bakeries, Culinary Science & Recipe Cookbooks",
    icon: Utensils,
    color: "from-orange-500/20 to-amber-500/10",
    border: "border-orange-500/30",
    badge: "bg-orange-500 text-white",
    description: "Explore authentic sourdough bread fermentation, Roman pasta traditions, and seasonal kitchen secrets.",
    creatorCount: "12.4k Chefs",
    postCount: "48k Recipes"
  },
  {
    id: "Art",
    title: "Art World",
    tagline: "Galleries, Glazing Techniques & Atmospheric Studies",
    icon: Palette,
    color: "from-purple-500/20 to-indigo-500/10",
    border: "border-purple-500/30",
    badge: "bg-purple-600 text-white",
    description: "From Belgian linen oil studies to procedural WebGL generative shaders, explore visual craft in detail.",
    creatorCount: "8.9k Artists",
    postCount: "32k Works"
  },
  {
    id: "Technology",
    title: "Technology World",
    tagline: "Distributed Systems, Rust & Next-Gen Protocols",
    icon: Code2,
    color: "from-cyan-500/20 to-blue-500/10",
    border: "border-cyan-500/30",
    badge: "bg-cyan-600 text-white",
    description: "Deep dive into lock-free concurrency, open source engines, and micro-architecture engineering.",
    creatorCount: "24.1k Engineers",
    postCount: "94k Repos"
  },
  {
    id: "Music",
    title: "Music World",
    tagline: "Modular Synthesis, Tape Saturation & Live Sessions",
    icon: Music2,
    color: "from-pink-500/20 to-rose-500/10",
    border: "border-pink-500/30",
    badge: "bg-pink-600 text-white",
    description: "Listen to real reel-to-reel analog tape sessions, ambient synth patches, and underground performances.",
    creatorCount: "6.7k Musicians",
    postCount: "18k Tracks"
  },
  {
    id: "Fitness",
    title: "Fitness World",
    tagline: "Calisthenics Conditioning, Core Tension & Endurance",
    icon: Dumbbell,
    color: "from-emerald-500/20 to-teal-500/10",
    border: "border-emerald-500/30",
    badge: "bg-emerald-600 text-white",
    description: "Strict gymnastics strength programming, aerobic engine building, and progressive movement protocols.",
    creatorCount: "15.3k Athletes",
    postCount: "52k Routines"
  }
];

export default function ExplorePage() {
  const [selectedWorld, setSelectedWorld] = useState<string>("All");

  const filteredPosts = INITIAL_SWITCH_POSTS.filter((p) => {
    if (selectedWorld === "All") return true;
    return p.world.toLowerCase() === selectedWorld.toLowerCase();
  });

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-[#506ffc]/10 text-[#506ffc]">
            <Compass className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Explore Worlds
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Discover dedicated realms built specifically for your passions.
            </p>
          </div>
        </div>
      </div>

      {/* Featured World Portals Grid */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h2 className="font-bold text-sm text-gray-900 dark:text-white uppercase tracking-wider">
              Specialized World Portals
            </h2>
          </div>
          {selectedWorld !== "All" && (
            <button
              onClick={() => setSelectedWorld("All")}
              className="text-xs font-bold text-[#506ffc] hover:underline cursor-pointer"
            >
              Reset to All Worlds
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {WORLD_SHOWCASES.map((world) => {
            const Icon = world.icon;
            const isSelected = selectedWorld.toLowerCase() === world.id.toLowerCase();
            return (
              <div
                key={world.id}
                onClick={() => setSelectedWorld(isSelected ? "All" : world.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                  isSelected
                    ? "border-[#506ffc] bg-blue-50/50 dark:bg-blue-950/30 ring-2 ring-[#506ffc]/30 shadow-md"
                    : `bg-gradient-to-br ${world.color} border-gray-200/80 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 shadow-xs hover:shadow-md`
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-white dark:bg-gray-800 shadow-xs">
                      <Icon className="w-5 h-5 text-gray-900 dark:text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-gray-900 dark:text-white group-hover:text-[#506ffc] transition-colors">
                        {world.title}
                      </h3>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400">
                        {world.creatorCount} • {world.postCount}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${world.badge}`}>
                    {isSelected ? "Active Filter" : "Enter"}
                  </span>
                </div>

                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                  {world.description}
                </p>

                <div className="flex items-center justify-between text-xs font-semibold text-[#506ffc] pt-2 border-t border-black/5 dark:border-white/5">
                  <span>{isSelected ? "Showing this world below" : "Filter feed by this world"}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Filter indicator */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <h2 className="font-bold text-sm text-gray-900 dark:text-white uppercase tracking-wider">
              {selectedWorld === "All" ? "Curated Feed Across All Worlds" : `Top Content in ${selectedWorld} World`}
            </h2>
          </div>
          <span className="text-xs text-gray-400 font-medium">
            {filteredPosts.length} posts found
          </span>
        </div>

        {/* Content stream using specialized cards */}
        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <Card key={post._id} thought={post} />
          ))}
        </div>
      </section>
    </div>
  );
}
