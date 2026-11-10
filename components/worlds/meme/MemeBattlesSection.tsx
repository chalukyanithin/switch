"use client";
import React, { useState } from "react";
import { Swords, Trophy, Clock, Flame, ThumbsUp, Plus, Check } from "lucide-react";

interface MemeBattle {
  id: string;
  title: string;
  description: string;
  deadline: string;
  status: "active" | "voting" | "ended";
  entriesCount: number;
  entries: {
    id: string;
    creator: string;
    creatorAvatar: string;
    caption: string;
    imageUrl: string;
    votes: number;
  }[];
}

const MEME_BATTLES: MemeBattle[] = [
  {
    id: "battle-1",
    title: "Monday Survival Challenge",
    description: "Describe the psychological warfare of opening Slack on Monday morning.",
    deadline: "2 days left",
    status: "active",
    entriesCount: 38,
    entries: [
      {
        id: "e1",
        creator: "meme.engineer",
        creatorAvatar: "https://api.dicebear.com/7.x/bottts/svg?seed=memeengineer",
        caption: "9:01 AM: 47 unread messages, 3 incident reports, 1 meeting already in progress.",
        imageUrl: "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=800&q=80",
        votes: 412,
      },
      {
        id: "e2",
        creator: "sleepycoder",
        creatorAvatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=sleepycoder",
        caption: "My face when my camera accidentally turns on during standup:",
        imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
        votes: 385,
      },
    ],
  },
  {
    id: "battle-2",
    title: "Expectation vs Reality: Tech Edition",
    description: "What movies think coding is like vs what actual software engineering is.",
    deadline: "5 days left",
    status: "active",
    entriesCount: 52,
    entries: [
      {
        id: "e3",
        creator: "daily.doge",
        creatorAvatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=dailydoge",
        caption: "Movie hacker: *types furiously for 8 seconds* 'I am in.' Me: *spends 6 hours missing a semicolon*.",
        imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
        votes: 560,
      },
    ],
  },
  {
    id: "battle-3",
    title: "Indian Parents vs Technology",
    description: "When Mom receives a WhatsApp forward claiming 5G causes headaches.",
    deadline: "Voting ended",
    status: "ended",
    entriesCount: 64,
    entries: [
      {
        id: "e4",
        creator: "desi.banter",
        creatorAvatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=desibanter",
        caption: "Winner 🏆: 'Beta, delete this app immediately, NASA has issued warning.'",
        imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
        votes: 1420,
      },
    ],
  },
];

export const MemeBattlesSection: React.FC<{ onSubmitEntry?: (battleTitle: string) => void }> = ({
  onSubmitEntry,
}) => {
  const [battles, setBattles] = useState<MemeBattle[]>(MEME_BATTLES);
  const [votedEntries, setVotedEntries] = useState<Record<string, boolean>>({});

  const handleVote = (battleId: string, entryId: string) => {
    if (votedEntries[entryId]) return;
    setVotedEntries((prev) => ({ ...prev, [entryId]: true }));
    setBattles((prev) =>
      prev.map((b) => {
        if (b.id !== battleId) return b;
        return {
          ...b,
          entries: b.entries.map((e) => (e.id === entryId ? { ...e, votes: e.votes + 1 } : e)),
        };
      })
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-card border border-[#E2E8F0] dark:border-border space-y-2 shadow-xs">
        <div className="flex items-center gap-2 text-[#2463D3]">
          <Swords className="w-5 h-5" />
          <h2 className="font-extrabold text-lg text-[#17243A] dark:text-white">
            Community Meme Battles
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Submit your funniest takes to weekly themed battle arenas. Community votes decide who takes home the Meme Crown!
        </p>
      </div>

      {/* Battles List */}
      <div className="space-y-6">
        {battles.map((battle) => (
          <div
            key={battle.id}
            className="p-5 rounded-2xl bg-white dark:bg-card border border-[#E2E8F0] dark:border-border space-y-4 shadow-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E8F0] dark:border-border pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-[#17243A] dark:text-white">
                    {battle.title}
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      battle.status === "active"
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/40"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                    }`}
                  >
                    {battle.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {battle.description}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>{battle.deadline}</span>
                </span>
                {battle.status === "active" && (
                  <button
                    onClick={() => onSubmitEntry && onSubmitEntry(battle.title)}
                    className="px-3 py-1.5 rounded-xl bg-[#2463D3] hover:bg-[#2463D3]/90 text-white font-bold text-xs flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Submit Meme</span>
                  </button>
                )}
              </div>
            </div>

            {/* Entries Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {battle.entries.map((entry) => {
                const hasVoted = votedEntries[entry.id];
                return (
                  <div
                    key={entry.id}
                    className="rounded-xl border border-[#E2E8F0] dark:border-border bg-[#F8FAFC] dark:bg-secondary/30 p-3 space-y-2.5 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={entry.creatorAvatar}
                          alt={entry.creator}
                          className="w-6 h-6 rounded-full object-cover border border-border"
                        />
                        <span className="font-bold text-xs text-[#17243A] dark:text-white">
                          @{entry.creator}
                        </span>
                      </div>
                      <p className="text-xs text-[#17243A] dark:text-slate-200 font-medium leading-relaxed">
                        {entry.caption}
                      </p>
                      <div className="rounded-lg overflow-hidden border border-[#E2E8F0] dark:border-border aspect-video bg-black/40">
                        <img
                          src={entry.imageUrl}
                          alt={entry.caption}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs font-mono font-bold text-[#2463D3]">
                        🔥 {entry.votes} votes
                      </span>
                      {battle.status === "active" ? (
                        <button
                          onClick={() => handleVote(battle.id, entry.id)}
                          disabled={hasVoted}
                          className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                            hasVoted
                              ? "bg-emerald-500 text-white"
                              : "bg-white dark:bg-card border border-[#E2E8F0] dark:border-border text-foreground hover:border-[#2463D3] hover:text-[#2463D3]"
                          }`}
                        >
                          {hasVoted ? (
                            <>
                              <Check className="w-3 h-3 stroke-[3]" />
                              <span>Voted</span>
                            </>
                          ) : (
                            <>
                              <ThumbsUp className="w-3 h-3" />
                              <span>Vote</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <span className="text-[11px] font-bold text-amber-500 flex items-center gap-1">
                          <Trophy className="w-3.5 h-3.5" />
                          <span>Winner</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemeBattlesSection;

