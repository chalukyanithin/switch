"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { TrendingUp, Users, Sparkles, Check, Plus, ExternalLink, Globe2, BookOpen, Compass } from "lucide-react";
import { useActiveWorld } from "../ActiveWorldContext";
import { WORLD_DEFINITIONS } from "@/lib/data/worldsData";

interface CreatorSuggestion {
  id: string;
  name: string;
  handle: string;
  world: string;
  photo: string;
  bio: string;
}

const WORLD_CREATORS: Record<string, CreatorSuggestion[]> = {
  Cooking: [
    {
      id: "user-elena",
      name: "Elena Vance",
      handle: "elena_vance",
      world: "Cooking",
      photo: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=300&h=300&q=80",
      bio: "Head Baker • 82% Hydration Sourdoughs"
    },
    {
      id: "user-marco",
      name: "Marco Rossi",
      handle: "marco_rossi",
      world: "Cooking",
      photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&h=300&q=80",
      bio: "Roman Traditions • Guanciale & Pasta"
    }
  ],
  Art: [
    {
      id: "user-maya",
      name: "Maya Lin",
      handle: "maya_lin",
      world: "Art",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=300&q=80",
      bio: "Atmospheric Oil Painter • Stockholm"
    },
    {
      id: "user-kenji",
      name: "Kenji Sato",
      handle: "kenji_sato",
      world: "Art",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300&q=80",
      bio: "Generative Shaders & WebGL Sculptures"
    }
  ],
  Technology: [
    {
      id: "user-sarah",
      name: "Sarah Chen",
      handle: "sarah_chen",
      world: "Technology",
      photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&h=300&q=80",
      bio: "Distributed Systems • Rust & Tokio"
    },
    {
      id: "user-alex",
      name: "Alex Rivera",
      handle: "alex_rivera",
      world: "Technology",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&h=300&q=80",
      bio: "React 19 & Next.js Streaming Architecture"
    }
  ],
  Music: [
    {
      id: "user-jordan",
      name: "Jordan Vance",
      handle: "jordan_vance",
      world: "Music",
      photo: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&h=300&q=80",
      bio: "Modular Synthesist • 1/2-Inch Reel Tapes"
    }
  ],
  Fitness: [
    {
      id: "user-marcus",
      name: "Coach Marcus",
      handle: "coach_marcus",
      world: "Fitness",
      photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&h=300&q=80",
      bio: "Gymnastics Strength • Strict Tension"
    }
  ],
  All: [
    {
      id: "user-elena",
      name: "Elena Vance",
      handle: "elena_vance",
      world: "Cooking",
      photo: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=300&h=300&q=80",
      bio: "Head Baker • Artisanal Patisserie"
    },
    {
      id: "user-maya",
      name: "Maya Lin",
      handle: "maya_lin",
      world: "Art",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=300&q=80",
      bio: "Contemporary Oil Painter"
    },
    {
      id: "user-sarah",
      name: "Sarah Chen",
      handle: "sarah_chen",
      world: "Technology",
      photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&h=300&q=80",
      bio: "Distributed Systems • Rust"
    }
  ]
};

const WORLD_TRENDING: Record<string, { tag: string; count: string; highlight: string }[]> = {
  Cooking: [
    { tag: "SourdoughFerment", count: "1.4k posts", highlight: "Cold proofing schedules" },
    { tag: "GuancialeCarbonara", count: "820 posts", highlight: "Roman pasta technique" },
    { tag: "Hydration82", count: "650 posts", highlight: "High hydration bread doughs" }
  ],
  Art: [
    { tag: "BelgianLinenStudies", count: "890 works", highlight: "Oil glaze progression" },
    { tag: "AtmosphericFog", count: "540 works", highlight: "Light scattering techniques" },
    { tag: "GenerativeShaders", count: "730 works", highlight: "WebGL biomimicry" }
  ],
  Technology: [
    { tag: "LockFreeConcurrency", count: "2.1k discussions", highlight: "Ring buffer atomics" },
    { tag: "TokioRuntime", count: "1.3k discussions", highlight: "Async cooperative scheduling" },
    { tag: "SolarCache", count: "980 discussions", highlight: "v0.8 release benchmarks" }
  ],
  Music: [
    { tag: "ModularSynthJams", count: "650 tracks", highlight: "Eurorack generative patches" },
    { tag: "ReelToReelTape", count: "420 tracks", highlight: "Revox tape saturation" }
  ],
  Fitness: [
    { tag: "StrictCalisthenics", count: "1.2k logs", highlight: "No-momentum muscle-ups" },
    { tag: "CoreControl", count: "840 logs", highlight: "L-sit to planche progressions" }
  ],
  All: [
    { tag: "SourdoughFerment", count: "1.4k posts", highlight: "Cooking World" },
    { tag: "LockFreeConcurrency", count: "2.1k posts", highlight: "Technology World" },
    { tag: "BelgianLinenStudies", count: "890 posts", highlight: "Art World" },
    { tag: "StrictCalisthenics", count: "1.2k posts", highlight: "Fitness World" }
  ]
};

const WORLD_RECOMMENDATIONS: Record<string, { title: string; subtitle: string; linkText: string }> = {
  Cooking: {
    title: "Culinary Recommendation",
    subtitle: "The 36-Hour Cold Fermentation Guide for Open Crumb Bread",
    linkText: "Read Baking Guide →"
  },
  Art: {
    title: "Curated Exhibition",
    subtitle: "Atmospheric Reverie: Light & Scumbled Pigments 2026",
    linkText: "View Exhibition →"
  },
  Technology: {
    title: "Open Source Spotlight",
    subtitle: "SolarCache: High-throughput Lock-free In-Memory Engine",
    linkText: "Explore Repo →"
  },
  Music: {
    title: "Tape Studio Session",
    subtitle: "Midnight Echoes Live Reel-to-Reel Take",
    linkText: "Listen Preview →"
  },
  Fitness: {
    title: "Training Protocol",
    subtitle: "Gymnastics Upper Body Tension Routine",
    linkText: "Inspect Circuit →"
  },
  All: {
    title: "Switch Spotlight",
    subtitle: "Discover how every passion thrives in its dedicated world",
    linkText: "Explore All Worlds →"
  }
};

export const RightBar: React.FC = () => {
  const { data: session } = useSession();
  const { activeWorld } = useActiveWorld();
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});

  const toggleFollow = (creatorId: string) => {
    setFollowingMap((prev) => ({
      ...prev,
      [creatorId]: !prev[creatorId]
    }));
  };

  const creators = WORLD_CREATORS[activeWorld] || WORLD_CREATORS.All;
  const trending = WORLD_TRENDING[activeWorld] || WORLD_TRENDING.All;
  const recommendation = WORLD_RECOMMENDATIONS[activeWorld] || WORLD_RECOMMENDATIONS.All;

  return (
    <div className="w-full space-y-4 p-4 sm:p-5 text-sm overflow-y-auto max-h-screen no-scrollbar">
      {/* Contextual World Header */}
      <div className="p-3.5 rounded-2xl bg-card border border-border flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <Globe2 className="w-4 h-4 text-primary" />
          <span className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
            Current Context
          </span>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
          {activeWorld === "All" ? "All Worlds" : `${activeWorld} World`}
        </span>
      </div>

      {/* Contextual Recommendation Card */}
      <div className="p-4 rounded-2xl bg-secondary/70 border border-border space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
          <BookOpen className="w-3.5 h-3.5" />
          <span>{recommendation.title}</span>
        </div>
        <p className="text-xs font-semibold text-foreground leading-snug">
          {recommendation.subtitle}
        </p>
        <Link
          href={`/search?q=${activeWorld === "All" ? "Switch" : activeWorld}`}
          className="inline-block text-xs font-bold text-primary hover:underline pt-1"
        >
          {recommendation.linkText}
        </Link>
      </div>

      {/* Suggested Creators in this World */}
      <div className="bg-card rounded-2xl border border-border p-4 shadow-xs space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <h4 className="font-bold text-foreground text-xs uppercase tracking-wider">
              {activeWorld === "All" ? "Featured Creators" : `Top in ${activeWorld}`}
            </h4>
          </div>
          <Link href="/explore" className="text-xs text-primary hover:underline font-semibold">
            See all
          </Link>
        </div>

        <div className="space-y-3">
          {creators.map((creator) => {
            const isFollowing = !!followingMap[creator.id];
            return (
              <div key={creator.id} className="flex items-center justify-between gap-3">
                <Link href={`/profile/${creator.id}`} className="flex items-center gap-2.5 overflow-hidden group">
                  <img
                    src={creator.photo}
                    alt={creator.name}
                    className="w-9 h-9 rounded-full object-cover border border-border group-hover:scale-105 transition-transform shrink-0"
                  />
                  <div className="overflow-hidden">
                    <p className="font-semibold text-xs text-foreground truncate group-hover:text-primary transition-colors">
                      {creator.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {creator.bio}
                    </p>
                  </div>
                </Link>

                <button
                  onClick={() => toggleFollow(creator.id)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                    isFollowing
                      ? "bg-secondary text-foreground border border-border"
                      : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs"
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-500" />
                      <span>Following</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3 h-3" />
                      <span>Follow</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Contextual Trending Topics */}
      <div className="bg-card rounded-2xl border border-border p-4 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-500" />
          <h4 className="font-bold text-foreground text-xs uppercase tracking-wider">
            {activeWorld === "All" ? "Trending Across Switch" : `Trending in ${activeWorld}`}
          </h4>
        </div>

        <div className="space-y-2">
          {trending.map((topic, i) => (
            <Link
              key={i}
              href={`/search?q=${topic.tag}`}
              className="block p-2 rounded-xl hover:bg-secondary/60 transition-colors group"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-foreground group-hover:text-primary transition-colors">
                  #{topic.tag}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {topic.count}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">{topic.highlight}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer Meta */}
      <div className="px-2 text-[11px] text-muted-foreground space-y-1 pt-1">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          <Link href="/explore" className="hover:underline">Explore Worlds</Link>
          <Link href="/search" className="hover:underline">Search</Link>
          <Link href="/create" className="hover:underline">Studio</Link>
        </div>
        <p>© 2026 Switch Platform • Multi-World Architecture</p>
      </div>
    </div>
  );
};

export default RightBar;
