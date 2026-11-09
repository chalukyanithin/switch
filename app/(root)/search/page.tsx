"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Loader2, Users, FileText, X, Sparkles, Utensils, Palette, Code2, Music2, Dumbbell } from "lucide-react";
import { globalSearch } from "@/lib/actions/search.actions";
import Link from "next/link";
import Card from "@/components/ui/Card";
import { INITIAL_SWITCH_POSTS } from "@/lib/data/worldsData";

const POPULAR_QUERIES = [
  "Rust", "WebAssembly", "Meme Template", "Cricket Live", "BBL", "V8 Engine", "Compiler"
];

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQ = searchParams?.get("q") || "";

  const [query, setQuery] = useState(initialQ);
  const [activeTab, setActiveTab] = useState<"all" | "thoughts" | "people">("all");
  const [selectedWorld, setSelectedWorld] = useState<string>("All");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<{ users: any[]; thoughts: any[] } | null>(null);

  useEffect(() => {
    if (initialQ) {
      executeSearch(initialQ);
    }
  }, [initialQ]);

  const executeSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setResults(null);
      return;
    }
    setIsSearching(true);
    try {
      const data = await globalSearch(searchTerm.trim());
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    executeSearch(val);
  };

  const handleChipClick = (term: string) => {
    setQuery(term);
    executeSearch(term);
  };

  const filteredThoughts = (results?.thoughts || []).filter((t: any) => {
    if (selectedWorld === "All") return true;
    return t.world?.toLowerCase() === selectedWorld.toLowerCase();
  });

  return (
    <div className="w-full space-y-6">
      {/* Search Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          Universal Search
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Find code repositories, meme templates, match updates, and creators across Switch.
        </p>
      </div>

      {/* Search Bar Input */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search code, memes, cricket scores, creators..."
          className="w-full bg-card border border-border text-foreground text-sm rounded-md py-2.5 pl-10 pr-10 outline-none focus:border-primary transition-colors placeholder:text-muted-foreground"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults(null);
            }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Suggested Search Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap mr-1">Trending:</span>
        {POPULAR_QUERIES.map((term) => (
          <button
            key={term}
            onClick={() => handleChipClick(term)}
            className="px-2.5 py-1 rounded-md text-xs font-medium bg-secondary border border-border text-foreground hover:border-primary/50 transition-colors whitespace-nowrap cursor-pointer"
          >
            {term}
          </button>
        ))}
      </div>

      {/* Filter Tabs & World Filter */}
      {results && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
          <div className="flex gap-1.5 text-xs font-semibold">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                activeTab === "all" ? "bg-primary text-primary-foreground font-bold" : "text-muted-foreground hover:bg-secondary"
              }`}
            >
              All Results ({results.users.length + filteredThoughts.length})
            </button>
            <button
              onClick={() => setActiveTab("thoughts")}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                activeTab === "thoughts" ? "bg-primary text-primary-foreground font-bold" : "text-muted-foreground hover:bg-secondary"
              }`}
            >
              Thoughts ({filteredThoughts.length})
            </button>
            <button
              onClick={() => setActiveTab("people")}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                activeTab === "people" ? "bg-primary text-primary-foreground font-bold" : "text-muted-foreground hover:bg-secondary"
              }`}
            >
              People ({results.users.length})
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-muted-foreground">World:</span>
            <select
              value={selectedWorld}
              onChange={(e) => setSelectedWorld(e.target.value)}
              className="bg-card border border-border rounded-md px-2.5 py-1 text-xs font-semibold text-foreground outline-none cursor-pointer"
            >
              <option value="All">All Worlds</option>
              <option value="Technology">Technology</option>
              <option value="Cricket">Cricket</option>
              <option value="Meme">Meme</option>
            </select>
          </div>
        </div>
      )}

      {/* Main Results / Empty State */}
      <div>
        {isSearching ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Searching through Switch worlds...</p>
          </div>
        ) : !query.trim() ? (
          <div className="p-8 text-center bg-card rounded-lg border border-border space-y-3">
            <div className="w-10 h-10 mx-auto rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-foreground">
              Search by Interest, Topic or Creator
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Type keywords like &quot;Rust&quot;, &quot;Compiler&quot;, &quot;Remix&quot;, or &quot;Scoreboard&quot; to discover specialized content.
            </p>
          </div>
        ) : results ? (
          <div className="space-y-6">
            {/* Creators Section */}
            {(activeTab === "all" || activeTab === "people") && results.users.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-primary" />
                  <span>People ({results.users.length})</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {results.users.map((u: any) => (
                    <Link
                      key={u._id}
                      href={`/profile/${u._id}`}
                      className="flex items-center gap-3 p-3.5 rounded-xl bg-card border border-border hover:border-primary transition-all group shadow-xs"
                    >
                      <img
                        src={u.photo || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(u.username || "User")}`}
                        alt={u.username}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(u.username || "User")}`;
                        }}
                        className="w-11 h-11 rounded-full object-cover border border-border group-hover:scale-105 transition-transform shrink-0"
                      />
                      <div className="flex-1 overflow-hidden">
                        <p className="font-bold text-sm text-foreground group-hover:text-primary transition-colors truncate">
                          {u.username}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {u.bio || "Switch Creator"}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Thoughts Section */}
            {(activeTab === "all" || activeTab === "thoughts") && filteredThoughts.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-primary" />
                  <span>Thoughts & World Posts ({filteredThoughts.length})</span>
                </h3>
                <div className="space-y-6">
                  {filteredThoughts.map((t: any) => (
                    <Card key={t._id} thought={t} />
                  ))}
                </div>
              </div>
            )}

            {results.users.length === 0 && filteredThoughts.length === 0 && (
              <div className="p-10 text-center bg-card rounded-2xl border border-border space-y-2">
                <p className="text-base font-semibold text-foreground">
                  No exact matches found for &quot;{query}&quot;
                </p>
                <p className="text-xs text-muted-foreground">
                  Try checking for typos or searching a broader topic like &quot;Technology&quot;, &quot;Meme&quot;, or &quot;Cricket&quot;.
                </p>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
