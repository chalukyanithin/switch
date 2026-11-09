"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { TrendingUp, Users, Sparkles, Check, Plus, ExternalLink, Globe2, BookOpen, Compass, Code2, Trophy, ArrowLeft, Radio } from "lucide-react";
import { useActiveWorld } from "../ActiveWorldContext";
import { WORLD_DEFINITIONS } from "@/lib/data/worldsData";
import TechRightBar from "../worlds/tech/TechRightBar";

interface CreatorSuggestion {
  id: string;
  name: string;
  handle: string;
  world: string;
  photo: string;
  bio: string;
}

const WORLD_CREATORS: Record<string, CreatorSuggestion[]> = {
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
      bio: "Systems Architect & Sandbox Runtime"
    }
  ],
  Meme: [
    {
      id: "user-devmemes",
      name: "Dev Humor",
      handle: "devhumor",
      world: "Meme",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=300&q=80",
      bio: "Turning bugs into cultural memes"
    },
    {
      id: "user-remixking",
      name: "Template Master",
      handle: "remix_king",
      world: "Meme",
      photo: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&h=300&q=80",
      bio: "Original Canvas Meme Templates"
    }
  ],
  Cricket: [
    {
      id: "user-cricketinsider",
      name: "Cricket Pundit",
      handle: "cricketpundit",
      world: "Cricket",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300&q=80",
      bio: "Tactical Match Analysis & Ball-by-ball Voice Notes"
    },
    {
      id: "user-ravicomms",
      name: "Ravi Commentary",
      handle: "ravi_commentary",
      world: "Cricket",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&h=300&q=80",
      bio: "Pitch Reports & 30s Voice Reaction Highlights"
    }
  ],
  All: [
    {
      id: "user-sarah",
      name: "Sarah Chen",
      handle: "sarah_chen",
      world: "Technology",
      photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&h=300&q=80",
      bio: "Tokio Contributor • Tech World"
    },
    {
      id: "user-devmemes",
      name: "Dev Humor",
      handle: "devhumor",
      world: "Meme",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=300&q=80",
      bio: "Friday Deploy Panic • Meme World"
    },
    {
      id: "user-cricketinsider",
      name: "Cricket Pundit",
      handle: "cricketpundit",
      world: "Cricket",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300&q=80",
      bio: "Perth Test Analysis • Cricket World"
    }
  ]
};

const WORLD_TRENDING: Record<string, { tag: string; count: string; highlight: string }[]> = {
  Technology: [
    { tag: "LockFreeConcurrency", count: "24 discussions", highlight: "Ring buffer atomics" },
    { tag: "TokioRuntime", count: "18 snippets", highlight: "Async cooperative scheduling" },
    { tag: "SolarCache", count: "12 benchmarks", highlight: "v0.8 release discussion" }
  ],
  Meme: [
    { tag: "FridayDeployMeme", count: "16 remixes", highlight: "Production outage templates" },
    { tag: "DistractedDev", count: "11 remixes", highlight: "Rewriting in Rust format" },
    { tag: "CSSinProduction", count: "8 remixes", highlight: "Flexbox vs Grid chaos" }
  ],
  Cricket: [
    { tag: "BorderGavaskarTrophy", count: "19 voice notes", highlight: "Perth Test final day" },
    { tag: "BallOfTheCentury", count: "14 discussions", highlight: "Outswinger seam analysis" },
    { tag: "SuperOverDugout", count: "9 audio reactions", highlight: "Crowd audio snippets" }
  ],
  All: [
    { tag: "LockFreeConcurrency", count: "Technology", highlight: "Ring buffer atomics" },
    { tag: "FridayDeployMeme", count: "Meme", highlight: "Community canvas remix" },
    { tag: "BorderGavaskarTrophy", count: "Cricket", highlight: "Simulated match notes" }
  ]
};

const WORLD_RECOMMENDATIONS: Record<string, { title: string; subtitle: string; linkText: string; url: string }> = {
  Technology: {
    title: "Open Source Spotlight",
    subtitle: "SolarCache: High-throughput Lock-free In-Memory Engine",
    linkText: "Inspect Repository & Sandbox →",
    url: "/world/tech"
  },
  Meme: {
    title: "Trending Meme Template",
    subtitle: "Friday Deploy Panic: Community template ready to remix",
    linkText: "Launch Canvas Editor →",
    url: "/world/meme"
  },
  Cricket: {
    title: "Match Audio Recap",
    subtitle: "Perth Test Scenario: 30-second crowd audio reactions",
    linkText: "Listen to Voice Notes →",
    url: "/world/cricket"
  },
  All: {
    title: "Dedicated World Portals",
    subtitle: "Explore dedicated experiences for Technology, Meme, and Cricket",
    linkText: "Explore Portals →",
    url: "/explore"
  }
};

export const RightBar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const { activeWorld, setActiveWorld } = useActiveWorld();
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});

  const toggleFollow = (creatorId: string) => {
    setFollowingMap((prev) => ({
      ...prev,
      [creatorId]: !prev[creatorId]
    }));
  };

  // Derive contextual active world strictly from the route
  let effectiveWorld = activeWorld;
  if (pathname?.startsWith("/world/tech")) {
    effectiveWorld = "Technology";
  } else if (pathname?.startsWith("/world/meme")) {
    effectiveWorld = "Meme";
  } else if (pathname?.startsWith("/world/cricket")) {
    effectiveWorld = "Cricket";
  }

  const worldClass =
    effectiveWorld === "Technology"
      ? "world-tech"
      : effectiveWorld === "Meme"
      ? "world-meme"
      : effectiveWorld === "Cricket"
      ? "world-cricket"
      : "";

  const creators = WORLD_CREATORS[effectiveWorld] || WORLD_CREATORS.All;
  const trending = WORLD_TRENDING[effectiveWorld] || WORLD_TRENDING.All;
  const recommendation = WORLD_RECOMMENDATIONS[effectiveWorld] || WORLD_RECOMMENDATIONS.All;

  const isInsideDedicatedWorld = pathname?.startsWith("/world/");

  if (effectiveWorld === "Technology") {
    return <TechRightBar />;
  }

  return (
    <div className={`w-full space-y-3.5 p-4 sm:p-5 text-sm overflow-y-auto max-h-screen no-scrollbar ${worldClass}`}>
      {/* Contextual World Header */}
      <div className="p-3.5 rounded-lg bg-card border border-border space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="font-bold text-xs text-foreground uppercase tracking-wider">
              {effectiveWorld === "All" ? "Global Stream" : `${effectiveWorld} World`}
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-secondary text-muted-foreground border border-border">
            {effectiveWorld === "All" ? "Multiverse" : "Dedicated"}
          </span>
        </div>

        {/* Quick jump/exit actions */}
        {isInsideDedicatedWorld ? (
          <Link
            href="/"
            className="w-full py-1.5 px-3 rounded-md bg-secondary hover:bg-secondary/80 text-foreground text-xs font-semibold flex items-center justify-center gap-1.5 border border-border transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Exit to Main Feed</span>
          </Link>
        ) : effectiveWorld !== "All" ? (
          <Link
            href={recommendation.url}
            className="w-full py-1.5 px-3 rounded-md bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-primary/90 transition-colors"
          >
            <span>Enter Dedicated {effectiveWorld} UI →</span>
          </Link>
        ) : null}
      </div>

      {/* World Switcher Fast-Nav */}
      <div className="p-3 rounded-lg bg-secondary/40 border border-border space-y-2">
        <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground px-1">
          <span>Switch World Focus</span>
          <Globe2 className="w-3.5 h-3.5 text-primary" />
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          <button
            onClick={() => router.push("/world/tech")}
            className={`px-2 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
              effectiveWorld === "Technology"
                ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-900/40 font-bold"
                : "bg-card text-muted-foreground hover:text-foreground border border-border"
            }`}
          >
            Tech
          </button>
          <button
            onClick={() => router.push("/world/cricket")}
            className={`px-2 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
              effectiveWorld === "Cricket"
                ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/40 font-bold"
                : "bg-card text-muted-foreground hover:text-foreground border border-border"
            }`}
          >
            Cricket
          </button>
          <button
            onClick={() => router.push("/world/meme")}
            className={`px-2 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
              effectiveWorld === "Meme"
                ? "bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-900/40 font-bold"
                : "bg-card text-muted-foreground hover:text-foreground border border-border"
            }`}
          >
            Memes
          </button>
        </div>
      </div>

      {/* Contextual Recommendation */}
      <div className="p-3.5 rounded-lg bg-card border border-border space-y-2">
        <div className="flex items-center gap-1.5 text-primary text-xs font-bold uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5" />
          <span>{recommendation.title}</span>
        </div>
        <p className="text-xs text-foreground font-semibold leading-relaxed">
          {recommendation.subtitle}
        </p>
        <Link
          href={recommendation.url}
          className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline pt-0.5"
        >
          <span>{recommendation.linkText}</span>
        </Link>
      </div>

      {/* Trending Topics Contextual to Current World */}
      <div className="bg-card rounded-lg border border-border p-3.5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
              Trending in {effectiveWorld === "All" ? "Switch" : effectiveWorld}
            </h3>
          </div>
          <span className="text-[10px] text-muted-foreground font-mono">Live</span>
        </div>

        <div className="space-y-2.5">
          {trending.map((item, idx) => (
            <div key={idx} className="group cursor-pointer">
              <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                #{item.tag}
              </p>
              <div className="flex items-center justify-between text-[11px] text-muted-foreground mt-0.5">
                <span>{item.highlight}</span>
                <span className="font-mono text-[10px] bg-secondary px-1.5 py-0.5 rounded border border-border">{item.count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contextual Creators for Current World */}
      <div className="bg-card rounded-lg border border-border p-3.5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
              {effectiveWorld === "All" ? "Featured Creators" : `${effectiveWorld} Creators`}
            </h3>
          </div>
        </div>

        <div className="space-y-3">
          {creators.map((c) => {
            const isFollowing = followingMap[c.id];
            return (
              <div key={c.id} className="flex items-center justify-between gap-3">
                <Link href={`/profile/${c.id}`} className="flex items-center gap-2.5 overflow-hidden group">
                  <img
                    src={c.photo}
                    alt={c.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(c.handle)}`;
                    }}
                    className="w-8 h-8 rounded-full object-cover border border-border group-hover:ring-1 group-hover:ring-primary transition-all shrink-0"
                  />
                  <div className="overflow-hidden">
                    <p className="font-semibold text-xs text-foreground truncate group-hover:underline">
                      {c.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {c.bio}
                    </p>
                  </div>
                </Link>

                <button
                  onClick={() => toggleFollow(c.id)}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                    isFollowing
                      ? "bg-secondary text-foreground hover:bg-secondary/80 border border-border"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  }`}
                >
                  {isFollowing ? (
                    <span className="flex items-center gap-1">
                      <Check className="w-3 h-3" /> Following
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Plus className="w-3 h-3" /> Follow
                    </span>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RightBar;
