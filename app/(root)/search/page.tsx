"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Loader2, Users, FileText, X, Sparkles, Utensils, Palette, Code2, Music2, Dumbbell } from "lucide-react";
import { globalSearch } from "@/lib/actions/search.actions";
import Link from "next/link";
import Card from "@/components/ui/Card";
import { INITIAL_SWITCH_POSTS } from "@/lib/data/worldsData";

const POPULAR_QUERIES = [
  "Sourdough", "Rust", "Oil Linen", "Analog Tape", "Calisthenics", "Carbonara", "SolarCache"
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
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Universal Search
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          Find recipes, artists, code repositories, audio sessions, and creators.
        </p>
      </div>

      {/* Search Bar Input */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#506ffc] transition-colors">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search recipes, code, mediums, creators..."
          className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100 text-sm sm:text-base rounded-2xl py-3.5 pl-11 pr-10 shadow-xs outline-none focus:border-[#506ffc] focus:ring-2 focus:ring-[#506ffc]/20 transition-all placeholder:text-gray-400"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults(null);
            }}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Suggested Search Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        <span className="text-xs font-semibold text-gray-400 whitespace-nowrap mr-1">Trending:</span>
        {POPULAR_QUERIES.map((term) => (
          <button
            key={term}
            onClick={() => handleChipClick(term)}
            className="px-3 py-1 rounded-full text-xs font-medium bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:border-[#506ffc] hover:text-[#506ffc] transition-all whitespace-nowrap cursor-pointer shadow-xs"
          >
            {term}
          </button>
        ))}
      </div>

      {/* Filter Tabs & World Filter */}
      {results && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 dark:border-gray-800 pb-3">
          <div className="flex gap-2 text-xs font-semibold">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === "all" ? "bg-[#506ffc] text-white" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              All Results ({results.users.length + filteredThoughts.length})
            </button>
            <button
              onClick={() => setActiveTab("thoughts")}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === "thoughts" ? "bg-[#506ffc] text-white" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              Thoughts ({filteredThoughts.length})
            </button>
            <button
              onClick={() => setActiveTab("people")}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === "people" ? "bg-[#506ffc] text-white" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              People ({results.users.length})
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-gray-400">World:</span>
            <select
              value={selectedWorld}
              onChange={(e) => setSelectedWorld(e.target.value)}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-2.5 py-1 text-xs font-semibold text-gray-800 dark:text-gray-200"
            >
              <option value="All">All Worlds</option>
              <option value="Cooking">Cooking</option>
              <option value="Art">Art</option>
              <option value="Technology">Technology</option>
              <option value="Music">Music</option>
              <option value="Fitness">Fitness</option>
            </select>
          </div>
        </div>
      )}

      {/* Main Results / Empty State */}
      <div>
        {isSearching ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#506ffc]" />
            <p className="text-sm text-gray-400">Searching through Switch worlds...</p>
          </div>
        ) : !query.trim() ? (
          <div className="p-10 text-center bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-blue-50 dark:bg-blue-950/40 text-[#506ffc] flex items-center justify-center">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-gray-900 dark:text-white">
              Search by Interest, Topic or Creator
            </h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Type keywords like &quot;Focaccia&quot;, &quot;Tokio&quot;, &quot;Atmospheric Fog&quot;, or &quot;Elena Vance&quot; to discover specialized content.
            </p>
          </div>
        ) : results ? (
          <div className="space-y-6">
            {/* Creators Section */}
            {(activeTab === "all" || activeTab === "people") && results.users.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#506ffc]" />
                  <span>People ({results.users.length})</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {results.users.map((u: any) => (
                    <Link
                      key={u._id}
                      href={`/profile/${u._id}`}
                      className="flex items-center gap-3 p-3.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 hover:border-[#506ffc] transition-all group shadow-xs"
                    >
                      <img
                        src={u.photo || "https://api.dicebear.com/7.x/adventurer/svg?seed=User"}
                        alt={u.username}
                        className="w-11 h-11 rounded-full object-cover border border-gray-200 dark:border-gray-700 group-hover:scale-105 transition-transform"
                      />
                      <div className="flex-1 overflow-hidden">
                        <p className="font-bold text-sm text-gray-900 dark:text-gray-100 group-hover:text-[#506ffc] transition-colors truncate">
                          {u.username}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
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
                <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#506ffc]" />
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
              <div className="p-10 text-center bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-2">
                <p className="text-base font-semibold text-gray-800 dark:text-gray-200">
                  No exact matches found for &quot;{query}&quot;
                </p>
                <p className="text-xs text-gray-500">
                  Try checking for typos or searching a broader topic like &quot;Cooking&quot;, &quot;Code&quot;, or &quot;Art&quot;.
                </p>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
