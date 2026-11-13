"use client";
import React from "react";
import Link from "next/link";
import {
  Compass,
  Sparkles,
  Code2,
  Trophy,
  ArrowRight,
  Flame,
  Terminal,
  Radio,
  Layers,
} from "lucide-react";
import { INITIAL_SWITCH_POSTS } from "@/lib/data/worldsData";
import Card from "@/components/ui/Card";

const WORLD_PORTALS = [
  {
    id: "tech",
    title: "Technology World",
    slug: "/world/tech",
    tagline: "Sandboxed Code Runner, Engineering Runtimes & Open Source",
    icon: Code2,
    accentColor: "text-blue-600 dark:text-blue-400",
    badgeBg: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800",
    borderColor: "border-border hover:border-blue-300 dark:hover:border-blue-700",
    description: "Write, test and run JavaScript & TypeScript in an isolated sandbox. Attach GitHub repositories, inspect memory footprints, and discuss systems architecture.",
    stats: "V8 Sandbox • GitHub Integration",
    features: ["Interactive Code Runner", "GitHub Repo Integration", "30s Audio Discussions"]
  },
  {
    id: "meme",
    title: "Meme World",
    slug: "/world/meme",
    tagline: "Canvas Meme Studio & Non-Destructive Remixes",
    icon: Sparkles,
    accentColor: "text-amber-600 dark:text-amber-400",
    badgeBg: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
    borderColor: "border-border hover:border-amber-300 dark:hover:border-amber-700",
    description: "Instant in-browser meme studio. Select community templates, adjust captions, font sizes and stroke outlines, and publish new remixes non-destructively.",
    stats: "Canvas Studio • Lineage Tracking",
    features: ["Mini Meme Canvas Editor", "Lineage Tracking", "30s Voice Banter"]
  },
  {
    id: "cricket",
    title: "Cricket World",
    slug: "/world/cricket",
    tagline: "Match Journalism, Scoreboards & Audio Crowd Notes",
    icon: Trophy,
    accentColor: "text-emerald-700 dark:text-emerald-400",
    badgeBg: "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
    borderColor: "border-border hover:border-emerald-300 dark:hover:border-emerald-700",
    description: "A tailored digital stadium for cricket fans. Follow simulated match scenarios, share tactical bowling analyses, and drop 30-second voice reactions.",
    stats: "Simulated Match Center • 30s Audio Reactions",
    features: ["Live Match Center", "30s Voice Commentary", "Tactical Discussions"]
  }
];

export default function ExplorePage() {
  return (
    <div className="w-full space-y-8 pb-12">
      {/* Header */}
      <div className="space-y-2 border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-primary/10 text-primary">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
              Explore Worlds
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Select a specialized world to enter its dedicated realm and tools.
            </p>
          </div>
        </div>
      </div>

      {/* 3 Dedicated World Portals */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <h2 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
            Available Worlds
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {WORLD_PORTALS.map((portal) => {
            const Icon = portal.icon;
            return (
              <div
                key={portal.id}
                className={`switch-card p-6 ${portal.borderColor} relative group`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-md bg-secondary border border-border">
                      <Icon className={`w-5 h-5 ${portal.accentColor}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base sm:text-lg text-foreground">
                          {portal.title}
                        </h3>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium border ${portal.badgeBg}`}>
                          ENTER WORLD
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {portal.tagline}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={portal.slug}
                    className="px-4 py-2 rounded-md bg-primary hover:bg-primary/95 text-primary-foreground font-semibold text-xs flex items-center gap-1.5 transition-colors shrink-0"
                  >
                    <span>Enter {portal.title.replace(" World", "")}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>

                <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed mb-4 max-w-2xl">
                  {portal.description}
                </p>

                {/* Features & Stats row */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border text-xs">
                  <div className="flex flex-wrap gap-2">
                    {portal.features.map((feat, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-secondary text-foreground text-[11px] font-medium border border-border"
                      >
                        ✓ {feat}
                      </span>
                    ))}
                  </div>

                  <span className="font-mono text-[11px] text-muted-foreground">
                    {portal.stats}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Collective Cross-World Stream */}
      <section className="space-y-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-muted-foreground" />
            <h2 className="font-bold text-sm text-foreground uppercase tracking-wider">
              Recent Highlights Across All Worlds
            </h2>
          </div>
          <span className="text-xs text-muted-foreground font-medium">
            {INITIAL_SWITCH_POSTS.length} posts
          </span>
        </div>

        <div className="space-y-5">
          {INITIAL_SWITCH_POSTS.map((post) => (
            <Card key={post._id} thought={post} />
          ))}
        </div>
      </section>
    </div>
  );
}
