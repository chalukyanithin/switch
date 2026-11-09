"use client";
import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { WORLD_DEFINITIONS } from "@/lib/data/worldsData";
import { Code2, Globe2, ChevronLeft, ChevronRight, Sparkles, Trophy } from "lucide-react";

interface WorldSwitcherProps {
  activeWorld?: string;
  onSelectWorld?: (worldId: string) => void;
  variant?: "pills" | "compact";
}

const WORLD_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  All: Globe2,
  Technology: Code2,
  Meme: Sparkles,
  Cricket: Trophy,
};

export const WorldSwitcher: React.FC<WorldSwitcherProps> = ({
  activeWorld = "All",
  onSelectWorld,
  variant = "pills",
}) => {
  const router = useRouter();
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

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && el.scrollWidth > el.clientWidth) {
      el.scrollLeft += e.deltaY;
      checkScroll();
    }
  };

  const handleWorldClick = (world: (typeof WORLD_DEFINITIONS)[number]) => {
    if (onSelectWorld) {
      onSelectWorld(world.id);
    }
    // Navigate into the dedicated world!
    router.push(world.slug);
  };

  return (
    <div className="relative w-full group">
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-md bg-card border border-border shadow-xs items-center justify-center text-foreground hover:bg-secondary cursor-pointer"
          aria-label="Scroll worlds left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}

      {/* Main row with only the 3 core worlds + All */}
      <div
        ref={scrollContainerRef}
        onScroll={checkScroll}
        onWheel={handleWheel}
        className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1.5 px-0.5 scroll-smooth"
        role="tablist"
        aria-label="Filter or enter worlds"
      >
        {WORLD_DEFINITIONS.map((world) => {
          const Icon = WORLD_ICONS[world.id] || Globe2;
          const isActive = activeWorld.toLowerCase() === world.id.toLowerCase();

          return (
            <button
              key={world.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => handleWorldClick(world)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer border select-none shrink-0 ${
                isActive
                  ? "bg-primary text-primary-foreground border-transparent"
                  : "bg-card border-border text-foreground hover:bg-secondary"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{world.id === "All" ? "All Worlds" : world.label}</span>
              {world.id !== "All" && (
                <span className="text-[10px] opacity-70 font-normal">→</span>
              )}
            </button>
          );
        })}
      </div>

      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-md bg-card border border-border shadow-xs items-center justify-center text-foreground hover:bg-secondary cursor-pointer"
          aria-label="Scroll worlds right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default WorldSwitcher;
