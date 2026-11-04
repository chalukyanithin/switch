"use client";
import React, { useRef, useState, useEffect } from "react";
import { WORLD_DEFINITIONS } from "@/lib/data/worldsData";
import { Utensils, Palette, Code2, Music2, Dumbbell, Globe2, ChevronLeft, ChevronRight } from "lucide-react";

interface WorldSwitcherProps {
  activeWorld: string;
  onSelectWorld: (worldId: string) => void;
  variant?: "pills" | "compact";
}

const WORLD_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  All: Globe2,
  Cooking: Utensils,
  Art: Palette,
  Technology: Code2,
  Music: Music2,
  Fitness: Dumbbell,
};

export const WorldSwitcher: React.FC<WorldSwitcherProps> = ({
  activeWorld,
  onSelectWorld,
  variant = "pills",
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 5);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 5);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const offset = direction === "left" ? -180 : 180;
    scrollContainerRef.current.scrollBy({ left: offset, behavior: "smooth" });
    setTimeout(checkScroll, 250);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const nextIndex = (index + 1) % WORLD_DEFINITIONS.length;
      onSelectWorld(WORLD_DEFINITIONS[nextIndex].id);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prevIndex = (index - 1 + WORLD_DEFINITIONS.length) % WORLD_DEFINITIONS.length;
      onSelectWorld(WORLD_DEFINITIONS[prevIndex].id);
    }
  };

  return (
    <div className="relative w-full group">
      {/* Left Chevron button */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-card/90 border border-border shadow-md items-center justify-center text-foreground hover:bg-secondary cursor-pointer"
          aria-label="Scroll worlds left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}

      {/* Main scrollable row with hidden scrollbar */}
      <div
        ref={scrollContainerRef}
        onScroll={checkScroll}
        className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 px-1 scroll-smooth"
        role="tablist"
        aria-label="Filter feed by world"
      >
        {WORLD_DEFINITIONS.map((world, idx) => {
          const Icon = WORLD_ICONS[world.id] || Globe2;
          const isActive = activeWorld.toLowerCase() === world.id.toLowerCase();

          return (
            <button
              key={world.id}
              role="tab"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              onClick={() => onSelectWorld(world.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer border select-none shrink-0 ${
                isActive
                  ? "bg-[#506ffc] text-white border-transparent shadow-sm shadow-[#506ffc]/30 scale-[1.02]"
                  : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-border/80 shadow-xs"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isActive ? "text-white" : ""}`} />
              <span>{world.id === "All" ? "All Worlds" : world.label}</span>
            </button>
          );
        })}
      </div>

      {/* Right Chevron button */}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-card/90 border border-border shadow-md items-center justify-center text-foreground hover:bg-secondary cursor-pointer"
          aria-label="Scroll worlds right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default WorldSwitcher;
