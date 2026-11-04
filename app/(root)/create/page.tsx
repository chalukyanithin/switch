"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Utensils, Palette, Code2, Music2, Dumbbell, Sparkles, Image as ImageIcon,
  Link as LinkIcon, Send, Loader2, Plus, Trash2, Check, Eye, X, Terminal, Clock, Flame
} from "lucide-react";
import { createThought } from "@/lib/actions/thought.actions";

const WORLDS = [
  { id: "Cooking", label: "Cooking World", icon: Utensils, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-950/30" },
  { id: "Art", label: "Art World", icon: Palette, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-950/30" },
  { id: "Technology", label: "Technology World", icon: Code2, color: "text-cyan-500", bg: "bg-cyan-50 dark:bg-cyan-950/30" },
  { id: "Music", label: "Music World", icon: Music2, color: "text-pink-500", bg: "bg-pink-50 dark:bg-pink-950/30" },
  { id: "Fitness", label: "Fitness World", icon: Dumbbell, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/30" },
  { id: "Thoughts", label: "General Thoughts", icon: Sparkles, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/30" },
];

const PRESET_IMAGES: Record<string, string[]> = {
  Cooking: [
    "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80"
  ],
  Art: [
    "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1000&q=80"
  ],
  Technology: [
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=80"
  ],
  Music: [
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1000&q=80"
  ],
  Fitness: [
    "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=80"
  ],
  Thoughts: [
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80"
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
      : "Cooking"
  );
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Specialized fields: Cooking
  const [prepTime, setPrepTime] = useState("20 mins");
  const [cookTime, setCookTime] = useState("25 mins");
  const [difficulty, setDifficulty] = useState<"Easy" | "Intermediate" | "Advanced">("Intermediate");
  const [servings, setServings] = useState("4 portions");
  const [ingredients, setIngredients] = useState<string[]>([
    "400g Artisanal pasta or flour",
    "Extra virgin olive oil",
    "Fresh sea salt"
  ]);
  const [newIngredient, setNewIngredient] = useState("");
  const [instructions, setInstructions] = useState<string[]>([
    "Prepare all ingredients and pre-heat oven/pan.",
    "Combine and gently rest dough or sauce.",
    "Cook to perfection and serve warm."
  ]);
  const [newInstruction, setNewInstruction] = useState("");

  // Specialized fields: Technology
  const [githubUrl, setGithubUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [techStackInput, setTechStackInput] = useState("Rust, Distributed, HighPerf");
  const [codeSnippet, setCodeSnippet] = useState("");

  // Specialized fields: Art
  const [medium, setMedium] = useState("Oil on Linen Canvas");
  const [artStyle, setArtStyle] = useState("Contemporary Impressionism");

  // Specialized fields: Music
  const [trackTitle, setTrackTitle] = useState("");
  const [genre, setGenre] = useState("Neo-Classical Ambient");
  const [bpm, setBpm] = useState("80");
  const [keyScale, setKeyScale] = useState("D Minor");

  // Specialized fields: Fitness
  const [routineType, setRoutineType] = useState("Calisthenics & Functional Core");
  const [duration, setDuration] = useState("40 mins");
  const [intensity, setIntensity] = useState<"Low" | "Moderate" | "High" | "Extreme">("High");

  const handleAddIngredient = () => {
    if (!newIngredient.trim()) return;
    setIngredients([...ingredients, newIngredient.trim()]);
    setNewIngredient("");
  };

  const handleRemoveIngredient = (idx: number) => {
    setIngredients(ingredients.filter((_, i) => i !== idx));
  };

  const handleAddInstruction = () => {
    if (!newInstruction.trim()) return;
    setInstructions([...instructions, newInstruction.trim()]);
    setNewInstruction("");
  };

  const handleRemoveInstruction = (idx: number) => {
    setInstructions(instructions.filter((_, i) => i !== idx));
  };

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
      if (activeWorld === "Cooking") {
        specializedData.cooking = {
          prepTime,
          cookTime,
          difficulty,
          servings,
          ingredients,
          instructions
        };
      } else if (activeWorld === "Technology") {
        specializedData.tech = {
          techStack: techStackInput.split(",").map((s) => s.trim()).filter(Boolean),
          githubUrl: githubUrl || undefined,
          demoUrl: demoUrl || undefined,
          codeSnippet: codeSnippet || undefined
        };
      } else if (activeWorld === "Art") {
        specializedData.art = {
          medium,
          style: artStyle,
          palette: ["#1B263B", "#415A77", "#778DA9", "#E0E1DD", "#DDA15E"]
        };
      } else if (activeWorld === "Music") {
        specializedData.music = {
          trackTitle: trackTitle || "Original Session",
          duration: "3:30",
          genre,
          bpm: parseInt(bpm) || 80,
          key: keyScale
        };
      } else if (activeWorld === "Fitness") {
        specializedData.fitness = {
          routineType,
          duration,
          intensity,
          targetMuscles: ["Core", "Upper Body", "Full Body"],
          caloriesBurned: "~380 kcal",
          exercises: [
            { name: "Dynamic Warm-up & Joint Mobility", sets: "2 sets", reps: "5 mins", rest: "None" },
            { name: "Primary Movement Sequence", sets: "4 sets", reps: "10-12 reps", rest: "60 sec" }
          ]
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
    } catch (e) {
      console.error(e);
      setErrorMessage("Failed to create post. Please try again.");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Creator Studio
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Publish specialized content tuned for your interest world.
        </p>
      </div>

      {errorMessage && (
        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-sm">
          {errorMessage}
        </div>
      )}

      {/* Main Form Container */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-sm overflow-hidden">
        {/* World Selection */}
        <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-gray-800 space-y-2.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Select Your Target World
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {WORLDS.map((w) => {
              const Icon = w.icon;
              const isSelected = activeWorld === w.id;
              return (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => {
                    setActiveWorld(w.id);
                    if (!imageUrl && PRESET_IMAGES[w.id]) {
                      setImageUrl(PRESET_IMAGES[w.id][0]);
                    }
                  }}
                  className={`flex items-center gap-2 p-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    isSelected
                      ? "border-[#506ffc] bg-blue-50/50 dark:bg-blue-950/30 text-[#506ffc] shadow-xs scale-[1.02]"
                      : "border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${w.color}`} />
                  <span>{w.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Textarea */}
        <div className="p-4 sm:p-5 space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Thought Description / Overview
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              activeWorld === "Cooking"
                ? "Describe your dish, crumb hydration, cooking technique, or recipe background..."
                : activeWorld === "Art"
                ? "Describe your artwork concept, medium, palette choices, and inspiration..."
                : activeWorld === "Technology"
                ? "Explain the architecture, design choices, latency benchmarks, or tutorial..."
                : activeWorld === "Music"
                ? "Share notes on the track production, instruments, analog gear, or live take..."
                : "Describe your training workout routine, target muscle focus, and tips..."
            }
            rows={4}
            className="w-full bg-gray-50/60 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 rounded-xl p-3.5 text-sm text-gray-900 dark:text-white outline-none focus:border-[#506ffc] focus:ring-1 focus:ring-[#506ffc] leading-relaxed resize-y"
          />
          <div className="flex justify-between items-center text-xs text-gray-400">
            <span>Markdown supported</span>
            <span>{content.length} characters</span>
          </div>
        </div>

        {/* Media Attachment Selector */}
        <div className="p-4 sm:p-5 border-t border-gray-100 dark:border-gray-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Imagery & Visual Media
            </span>
            <button
              type="button"
              onClick={() => setShowImagePicker(!showImagePicker)}
              className="text-xs font-bold text-[#506ffc] hover:underline cursor-pointer"
            >
              {showImagePicker ? "Hide Presets" : "Select Curated Media"}
            </button>
          </div>

          {/* Curated Preset Picker */}
          {showImagePicker && PRESET_IMAGES[activeWorld] && (
            <div className="grid grid-cols-3 gap-2.5 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 animate-in fade-in duration-200">
              {PRESET_IMAGES[activeWorld].map((url, i) => (
                <div
                  key={i}
                  onClick={() => setImageUrl(url)}
                  className={`aspect-video rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                    imageUrl === url ? "border-[#506ffc] ring-2 ring-[#506ffc]/30" : "border-transparent opacity-80 hover:opacity-100"
                  }`}
                >
                  <img src={url} alt="Preset" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}

          {/* Custom URL or Current Image Preview */}
          <div className="flex gap-2">
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Or paste custom image URL (Unsplash, Imgur, CDN)..."
              className="flex-1 bg-gray-50/60 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2 text-xs text-gray-900 dark:text-white outline-none focus:border-[#506ffc]"
            />
            {imageUrl && (
              <button
                type="button"
                onClick={() => setImageUrl("")}
                className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                title="Clear Image"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {imageUrl && (
            <div className="relative aspect-video rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 max-h-56">
              <img src={imageUrl} alt="Selected preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        {/* Specialized World-Specific Section */}
        {activeWorld === "Cooking" && (
          <div className="p-4 sm:p-5 border-t border-gray-100 dark:border-gray-800 bg-orange-50/20 dark:bg-orange-950/10 space-y-4">
            <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-bold text-sm">
              <Utensils className="w-4 h-4" />
              <span>Cooking World Recipe Data</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-gray-500 mb-1 font-semibold">Prep Time</label>
                <input
                  type="text"
                  value={prepTime}
                  onChange={(e) => setPrepTime(e.target.value)}
                  className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-2 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-gray-500 mb-1 font-semibold">Cook Time</label>
                <input
                  type="text"
                  value={cookTime}
                  onChange={(e) => setCookTime(e.target.value)}
                  className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-2 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-gray-500 mb-1 font-semibold">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e: any) => setDifficulty(e.target.value)}
                  className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-2 text-gray-900 dark:text-white"
                >
                  <option value="Easy">Easy</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-500 mb-1 font-semibold">Servings</label>
                <input
                  type="text"
                  value={servings}
                  onChange={(e) => setServings(e.target.value)}
                  className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-2 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Ingredients builder */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300">
                Ingredients List ({ingredients.length})
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newIngredient}
                  onChange={(e) => setNewIngredient(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddIngredient())}
                  placeholder="e.g. 500g Tipo 00 Flour..."
                  className="flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-xs text-gray-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={handleAddIngredient}
                  className="px-3 py-1.5 rounded-lg bg-orange-500 text-white text-xs font-bold hover:bg-orange-600"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {ingredients.map((ing, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200"
                  >
                    <span>{ing}</span>
                    <X
                      onClick={() => handleRemoveIngredient(i)}
                      className="w-3 h-3 text-gray-400 hover:text-red-500 cursor-pointer"
                    />
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeWorld === "Technology" && (
          <div className="p-4 sm:p-5 border-t border-gray-100 dark:border-gray-800 bg-cyan-50/20 dark:bg-cyan-950/10 space-y-4">
            <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-bold text-sm">
              <Code2 className="w-4 h-4" />
              <span>Technology World Architecture Data</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-gray-500 mb-1 font-semibold">GitHub Repository URL</label>
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-2 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-gray-500 mb-1 font-semibold">Live Interactive Demo URL</label>
                <input
                  type="url"
                  value={demoUrl}
                  onChange={(e) => setDemoUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-2 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                Tech Stack Tags (comma separated)
              </label>
              <input
                type="text"
                value={techStackInput}
                onChange={(e) => setTechStackInput(e.target.value)}
                placeholder="Rust, Tokio, Distributed, Next.js"
                className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-2 text-xs text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                Code Snippet / Implementation Preview
              </label>
              <textarea
                value={codeSnippet}
                onChange={(e) => setCodeSnippet(e.target.value)}
                rows={4}
                placeholder="// Enter your core function or algorithm here..."
                className="w-full font-mono text-xs bg-[#0d1117] text-gray-200 border border-gray-800 rounded-xl p-3 leading-relaxed"
              />
            </div>
          </div>
        )}

        {activeWorld === "Art" && (
          <div className="p-4 sm:p-5 border-t border-gray-100 dark:border-gray-800 bg-purple-50/20 dark:bg-purple-950/10 space-y-3 text-xs">
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-sm">
              <Palette className="w-4 h-4" />
              <span>Art World Medium & Dimensions</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-500 mb-1 font-semibold">Medium & Surface</label>
                <input
                  type="text"
                  value={medium}
                  onChange={(e) => setMedium(e.target.value)}
                  placeholder="e.g. Oil on Belgian Linen"
                  className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-2 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-gray-500 mb-1 font-semibold">Artistic Style / Movement</label>
                <input
                  type="text"
                  value={artStyle}
                  onChange={(e) => setArtStyle(e.target.value)}
                  placeholder="e.g. Contemporary Impressionism"
                  className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-2 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Footer Action Bar */}
        <div className="p-4 sm:p-5 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/40 flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 rounded-xl text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 text-xs font-semibold"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handlePublish}
            disabled={!content.trim() || isPosting}
            className="px-6 py-2.5 rounded-full bg-[#506ffc] hover:bg-blue-600 disabled:opacity-50 text-white font-bold text-sm flex items-center gap-2 shadow-md shadow-[#506ffc]/25 transition-all cursor-pointer"
          >
            {isPosting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Publishing to {activeWorld}...</span>
              </>
            ) : (
              <>
                <span>Publish to {activeWorld}</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
