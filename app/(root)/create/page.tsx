"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Code2, Sparkles, Trophy, Plus, X, Send, Loader2, GitFork
} from "lucide-react";
import { createThought } from "@/lib/actions/thought.actions";
import TechComposer from "@/components/worlds/TechComposer";

const WORLDS = [
  { id: "Technology", label: "Technology World", icon: Code2, color: "text-cyan-500", bg: "bg-cyan-50 dark:bg-cyan-950/30" },
  { id: "Meme", label: "Meme World", icon: Sparkles, color: "text-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-950/30" },
  { id: "Cricket", label: "Cricket World", icon: Trophy, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/30" },
];

const PRESET_IMAGES: Record<string, string[]> = {
  Technology: [
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1000&q=80",
  ],
  Meme: [
    "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=1000&q=80",
  ],
  Cricket: [
    "https://images.unsplash.com/photo-1531415074868-036b1c57e329?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1000&q=80",
  ],
  Thoughts: [
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80",
  ]
};

export default function CreatePostPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedWorld = searchParams?.get("world");

  const { data: session } = useSession();

  const [activeWorld, setActiveWorld] = useState<string>(
    requestedWorld && WORLDS.some((w) => w.id.toLowerCase() === requestedWorld.toLowerCase())
      ? requestedWorld
      : "Technology"
  );
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Technology
  const [githubUrl, setGithubUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [techStackInput, setTechStackInput] = useState("JavaScript, Algorithms, Concurrency");
  const [codeSnippet, setCodeSnippet] = useState("");

  // Meme
  const [memeTopText, setMemeTopText] = useState("WHEN YOU RUN YOUR CODE");
  const [memeBottomText, setMemeBottomText] = useState("AND IT WORKS FIRST TRY");

  // Cricket
  const [matchTitle, setMatchTitle] = useState("India vs Australia — Border-Gavaskar Series");
  const [scoreSnippet, setScoreSnippet] = useState("AUS 184 & 92/4 • Target 240");
  const [venue, setVenue] = useState("Perth Stadium, Australia");

  const handlePublish = async () => {
    if (!content.trim()) {
      setErrorMessage("Please enter a caption or description for your post.");
      return;
    }

    setIsPosting(true);
    setErrorMessage("");

    try {
      const authorId = (session?.user as any)?.id || "creator-current";

      let specializedData: any = {};
      if (activeWorld === "Technology") {
        specializedData.tech = {
          techStack: techStackInput.split(",").map((s) => s.trim()).filter(Boolean),
          githubUrl: githubUrl || undefined,
          demoUrl: demoUrl || undefined,
          codeSnippet: codeSnippet || undefined,
          isExecutable: true,
          language: "javascript"
        };
      } else if (activeWorld === "Meme") {
        specializedData.meme = {
          isTemplate: true,
          remixCount: 0,
          templateImageUrl: imageUrl || PRESET_IMAGES.Meme[0],
          canvasWidth: 600,
          canvasHeight: 400,
          layers: [
            {
              id: "t1",
              text: memeTopText,
              x: 300,
              y: 45,
              fontSize: 32,
              fontFamily: "Impact",
              fillColor: "#ffffff",
              strokeColor: "#000000",
              strokeWidth: 3,
              rotation: 0,
              isAllCaps: true
            },
            {
              id: "t2",
              text: memeBottomText,
              x: 300,
              y: 350,
              fontSize: 32,
              fontFamily: "Impact",
              fillColor: "#ffffff",
              strokeColor: "#000000",
              strokeWidth: 3,
              rotation: 0,
              isAllCaps: true
            }
          ]
        };
      } else if (activeWorld === "Cricket") {
        specializedData.cricket = {
          matchTitle,
          scoreSnippet,
          venue,
          matchFormat: "Test"
        };
      }

      await createThought({
        content,
        world: activeWorld,
        authorId,
        image: imageUrl || (PRESET_IMAGES[activeWorld] ? PRESET_IMAGES[activeWorld][0] : undefined),
        ...specializedData
      });

      router.push("/");
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to publish post.");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 pb-12">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
          Create New Post
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Publish specialized content directly into Technology, Meme, or Cricket world.
        </p>
      </div>

      {/* World Selection Grid */}
      <div className="bg-card rounded-lg border border-border p-4">
        <label className="block text-xs font-semibold text-foreground mb-2">
          Select Interest World
        </label>
        <div className="grid grid-cols-3 gap-2">
          {WORLDS.map((w) => {
            const Icon = w.icon;
            const isSelected = activeWorld === w.id;
            return (
              <button
                key={w.id}
                type="button"
                onClick={() => {
                  setActiveWorld(w.id);
                  if (PRESET_IMAGES[w.id]) setImageUrl(PRESET_IMAGES[w.id][0]);
                }}
                className={`flex items-center justify-center sm:justify-start gap-2 p-2.5 rounded-md border text-xs sm:text-sm font-semibold transition-colors cursor-pointer text-left ${
                  isSelected
                    ? "bg-primary text-primary-foreground border-transparent"
                    : "bg-card border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{w.label.replace(" World", "")}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* World Content Surface */}
      {activeWorld === "Technology" ? (
        <TechComposer
          onPublished={() => router.push("/world/tech")}
          onCancel={() => router.back()}
        />
      ) : (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          {/* Content Caption */}
          <div className="p-4 sm:p-5 space-y-4">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              placeholder={`What's happening in ${activeWorld} World? Share your perspective, process or question...`}
              className="w-full bg-transparent text-sm sm:text-base text-foreground placeholder-muted-foreground outline-none resize-none"
            />

            {/* Image URL input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Paste Image URL or use preset..."
                className="flex-1 bg-secondary border border-border rounded-md px-3.5 py-2 text-xs text-foreground outline-none focus:border-primary"
              />
              {imageUrl && (
                <button
                  type="button"
                  onClick={() => setImageUrl("")}
                  className="p-2 rounded-md text-muted-foreground hover:text-red-500 hover:bg-secondary cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {imageUrl && (
              <div className="relative aspect-video rounded-md overflow-hidden border border-border max-h-56">
                <img src={imageUrl} alt="Selected preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {activeWorld === "Meme" && (
            <div className="p-4 sm:p-5 border-t border-border bg-amber-500/5 space-y-4">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-sm">
                <Sparkles className="w-4 h-4" />
                <span>Meme World Template Overlay</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-muted-foreground mb-1 font-semibold">Default Top Text</label>
                  <input
                    type="text"
                    value={memeTopText}
                    onChange={(e) => setMemeTopText(e.target.value)}
                    className="w-full bg-card border border-border rounded-md p-2 text-foreground font-mono"
                  />
                </div>
                <div>
                  <label className="block text-muted-foreground mb-1 font-semibold">Default Bottom Text</label>
                  <input
                    type="text"
                    value={memeBottomText}
                    onChange={(e) => setMemeBottomText(e.target.value)}
                    className="w-full bg-card border border-border rounded-md p-2 text-foreground font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {activeWorld === "Cricket" && (
            <div className="p-4 sm:p-5 border-t border-border bg-emerald-500/5 space-y-4">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
                <Trophy className="w-4 h-4" />
                <span>Cricket World Match Context</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-muted-foreground mb-1 font-semibold">Match / Series Title</label>
                  <input
                    type="text"
                    value={matchTitle}
                    onChange={(e) => setMatchTitle(e.target.value)}
                    className="w-full bg-card border border-border rounded-md p-2 text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-muted-foreground mb-1 font-semibold">Score Snippet</label>
                  <input
                    type="text"
                    value={scoreSnippet}
                    onChange={(e) => setScoreSnippet(e.target.value)}
                    className="w-full bg-card border border-border rounded-md p-2 text-foreground font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Error message */}
          {errorMessage && (
            <div className="px-5 py-2.5 bg-red-500/10 border-t border-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold">
              {errorMessage}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between p-4 sm:p-5 border-t border-border bg-secondary/30">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-3.5 py-1.5 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handlePublish}
              disabled={isPosting || !content.trim()}
              className="flex items-center gap-2 px-5 py-2 rounded-md bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            >
              {isPosting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish to {activeWorld}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
