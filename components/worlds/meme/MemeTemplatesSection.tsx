"use client";
import React from "react";
import { Layers, GitFork, Sparkles, Plus } from "lucide-react";

export interface MemeTemplateItem {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  defaultTopText?: string;
  defaultBottomText?: string;
  remixCount: number;
}

export const MEME_TEMPLATES_LIST: MemeTemplateItem[] = [
  {
    id: "tpl-1",
    name: "Leonardo DiCaprio Laughing",
    category: "Office",
    imageUrl: "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=800&q=80",
    defaultTopText: "WHEN THE BUG DISAPPEARS",
    defaultBottomText: "AFTER YOU ADD CONSOLE.LOG",
    remixCount: 1420,
  },
  {
    id: "tpl-2",
    name: "Distracted Boyfriend",
    category: "Relatable",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    defaultTopText: "NEW TECH STACK",
    defaultBottomText: "MY CURRENT STABLE CODEBASE",
    remixCount: 2340,
  },
  {
    id: "tpl-3",
    name: "3 Idiots - Productive Day",
    category: "Indian",
    imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
    defaultTopText: "AAJ KUCH PRODUCTIVE",
    defaultBottomText: "NAHI KARENGE",
    remixCount: 980,
  },
  {
    id: "tpl-4",
    name: "Buff Doge vs Cheems",
    category: "Tech",
    imageUrl: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80",
    defaultTopText: "PROGRAMMERS IN 1995 WRITING C",
    defaultBottomText: "ME WHEN NPM INSTALL FAILS",
    remixCount: 1890,
  },
  {
    id: "tpl-5",
    name: "Spider-Man Pointing",
    category: "Relatable",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
    defaultTopText: "FRONTEND BLAMING BACKEND",
    defaultBottomText: "BACKEND BLAMING DEVOPS",
    remixCount: 1650,
  },
  {
    id: "tpl-6",
    name: "Drake Hotline Bling",
    category: "College",
    imageUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=800&q=80",
    defaultTopText: "STUDYING WEEKS IN ADVANCE",
    defaultBottomText: "3-HOUR YOUTUBE ONE-SHOT VIDEO",
    remixCount: 3100,
  },
];

export const MemeTemplatesSection: React.FC<{
  onSelectTemplate: (template: MemeTemplateItem) => void;
}> = ({ onSelectTemplate }) => {
  return (
    <div className="space-y-5 animate-in fade-in">
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-card border border-[#E2E8F0] dark:border-border space-y-1.5 shadow-xs">
        <div className="flex items-center gap-2 text-[#2463D3]">
          <Layers className="w-5 h-5" />
          <h2 className="font-extrabold text-lg text-[#17243A] dark:text-white">
            Meme Template Studio
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Select any classic or trending community format to open directly in the canvas editor. Add your own captions, text overlays, and hit publish!
        </p>
      </div>

      {/* Templates 2-Column or 3-Column Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {MEME_TEMPLATES_LIST.map((tpl) => (
          <div
            key={tpl.id}
            onClick={() => onSelectTemplate(tpl)}
            className="group rounded-2xl border border-[#E2E8F0] dark:border-border bg-white dark:bg-card hover:border-[#2463D3] transition-all p-3 space-y-3 shadow-xs hover:shadow-md cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-900 border border-border/50 relative">
                <img
                  src={tpl.imageUrl}
                  alt={tpl.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-[10px] font-bold text-white">
                  #{tpl.category}
                </span>
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-[#17243A] dark:text-white group-hover:text-[#2463D3] transition-colors leading-snug">
                {tpl.name}
              </h3>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-[#E2E8F0] dark:border-border text-xs text-muted-foreground">
              <span className="font-mono text-[11px] font-medium">
                {tpl.remixCount.toLocaleString()} remixes
              </span>
              <button
                type="button"
                className="px-2.5 py-1 rounded-lg bg-[#2463D3] group-hover:bg-[#2463D3]/90 text-white font-bold text-[11px] flex items-center gap-1 transition-colors"
              >
                <GitFork className="w-3 h-3" />
                <span>Remix</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemeTemplatesSection;

