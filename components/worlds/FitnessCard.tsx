"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Dumbbell, Timer, Flame, Target, Bookmark, Heart, MessageCircle, Share2, ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react";
import { SwitchPost } from "@/lib/data/worldsData";

interface FitnessCardProps {
  post: SwitchPost;
  currentUserId?: string;
  onLike?: (id: string) => void;
  onComment?: (id: string, text: string) => void;
  onShare?: (post: SwitchPost) => void;
}

export const FitnessCard: React.FC<FitnessCardProps> = ({
  post,
  currentUserId,
  onLike,
  onComment,
  onShare,
}) => {
  const [showExercises, setShowExercises] = useState(false);
  const [completedSets, setCompletedSets] = useState<Record<number, boolean>>({});
  const [isSaved, setIsSaved] = useState(post.saved || false);
  const [isLiked, setIsLiked] = useState(currentUserId ? post.likes.includes(currentUserId) : false);
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [commentOpen, setCommentOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentsList, setCommentsList] = useState(post.comments || []);
  const [saveToast, setSaveToast] = useState(false);

  const fitness = post.fitness;

  const toggleSet = (idx: number) => {
    setCompletedSets((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    if (onLike) onLike(post._id);
  };

  const handleSaveClick = () => {
    setIsSaved(!isSaved);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      _id: `c-${Date.now()}`,
      text: commentText.trim(),
      author: {
        _id: currentUserId || "you",
        username: "You",
        photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=300&q=80"
      },
      createdAt: "Just now"
    };

    setCommentsList([...commentsList, newComment]);
    if (onComment) onComment(post._id, commentText.trim());
    setCommentText("");
  };

  return (
    <article className="switch-card w-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border">
        <div className="flex items-center gap-3">
          <Link href={`/profile/${post.author._id}`}>
            <img
              src={post.author.photo || "https://api.dicebear.com/7.x/adventurer/svg?seed=Coach"}
              alt={post.author.username}
              className="w-11 h-11 rounded-full object-cover border border-border hover:ring-2 hover:ring-emerald-500/50 transition-all"
            />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <Link href={`/profile/${post.author._id}`} className="font-semibold text-foreground hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                {post.author.username}
              </Link>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <Dumbbell className="w-3 h-3" />
                Fitness World
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {fitness?.routineType || "Movement Routine"} • {post.author.bio || "Trainer"}
            </p>
          </div>
        </div>

        <button
          onClick={handleSaveClick}
          className={`p-2 rounded-xl transition-all cursor-pointer ${
            isSaved
              ? "bg-emerald-600 text-white shadow-xs shadow-emerald-600/30"
              : "text-muted-foreground hover:text-emerald-600 hover:bg-secondary"
          }`}
          title={isSaved ? "Saved to Workout Logs" : "Save Routine"}
        >
          <Bookmark className={`w-5 h-5 ${isSaved ? "fill-white" : ""}`} />
        </button>
      </div>

      {/* Save Notification Toast */}
      {saveToast && (
        <div className="bg-emerald-600 text-white text-xs px-4 py-2 text-center font-medium transition-all">
          {isSaved ? "✓ Routine saved to your Fitness Library" : "Removed from Workout Library"}
        </div>
      )}

      {/* Hero Banner */}
      {post.image && (
        <div className="relative aspect-16/10 w-full overflow-hidden bg-secondary">
          <img
            src={post.image}
            alt="Workout preview"
            className="w-full h-full object-cover"
          />
          {fitness && (
            <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2">
              <span className="bg-black/75 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium">
                <Timer className="w-3.5 h-3.5 text-emerald-400" />
                {fitness.duration}
              </span>
              <span className="bg-black/75 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium">
                <Flame className="w-3.5 h-3.5 text-emerald-400" />
                Intensity: {fitness.intensity}
              </span>
              <span className="bg-black/75 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium">
                <Target className="w-3.5 h-3.5 text-emerald-400" />
                {fitness.caloriesBurned}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-4 sm:p-5 space-y-4">
        <p className="text-foreground text-base leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>

        {/* Target Muscles Pills */}
        {fitness?.targetMuscles && fitness.targetMuscles.length > 0 && (
          <div className="flex flex-wrap gap-1.5 items-center pt-1">
            <span className="text-xs text-muted-foreground mr-1 font-medium">Target:</span>
            {fitness.targetMuscles.map((muscle, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
              >
                {muscle}
              </span>
            ))}
          </div>
        )}

        {/* Exercise Breakdown Drawer */}
        {fitness?.exercises && fitness.exercises.length > 0 && (
          <div className="border border-emerald-200 dark:border-emerald-900/40 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 overflow-hidden">
            <button
              onClick={() => setShowExercises(!showExercises)}
              className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-sm text-emerald-900 dark:text-emerald-300 hover:bg-emerald-100/50 dark:hover:bg-emerald-900/30 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                {showExercises ? "Hide Exercise Breakdown" : `View Exercise Breakdown (${fitness.exercises.length} movements)`}
              </span>
              {showExercises ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showExercises && (
              <div className="p-4 sm:p-5 border-t border-emerald-200/60 dark:border-emerald-900/40 space-y-3 animate-in fade-in duration-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-950 dark:text-emerald-300">
                  Programming Protocol
                </h4>
                <div className="space-y-2">
                  {fitness.exercises.map((ex, idx) => {
                    const isDone = !!completedSets[idx];
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleSet(idx)}
                        className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                          isDone
                            ? "bg-emerald-500/20 border-emerald-500/40"
                            : "bg-card border-border hover:border-emerald-400"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <CheckCircle2
                            className={`w-5 h-5 ${isDone ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}
                          />
                          <div>
                            <p className={`font-semibold text-sm ${isDone ? "line-through text-muted-foreground" : "text-foreground"}`}>
                              {ex.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {ex.sets} • {ex.reps} • Rest: {ex.rest}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          {isDone ? "Done" : "Tap to complete"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Engagement Actions */}
      <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-t border-border bg-card/60 text-muted-foreground text-sm">
        <div className="flex items-center gap-6">
          <button
            onClick={handleLikeClick}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
              isLiked ? "text-emerald-600 font-semibold" : "hover:text-emerald-600"
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? "fill-emerald-600 text-emerald-600" : ""}`} />
            <span>{likeCount}</span>
          </button>

          <button
            onClick={() => setCommentOpen(!commentOpen)}
            className="flex items-center gap-1.5 hover:text-emerald-600 transition-colors cursor-pointer"
          >
            <MessageCircle className="w-5 h-5" />
            <span>{commentsList.length}</span>
          </button>

          <button
            onClick={() => onShare && onShare(post)}
            className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        <span className="text-xs text-muted-foreground">
          Fitness World
        </span>
      </div>

      {/* Comments Thread */}
      {commentOpen && (
        <div className="p-4 sm:p-5 border-t border-border bg-secondary/40">
          <div className="space-y-3 mb-4 max-h-56 overflow-y-auto pr-1">
            {commentsList.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-2">
                No training logs yet. Share your workout time or ask the coach!
              </p>
            ) : (
              commentsList.map((c, i) => (
                <div key={c._id || i} className="flex gap-2.5 text-sm">
                  <img
                    src={c.author.photo || "https://api.dicebear.com/7.x/adventurer/svg?seed=Athlete"}
                    alt={c.author.username}
                    className="w-7 h-7 rounded-full object-cover shrink-0"
                  />
                  <div className="flex-1 bg-card p-2.5 rounded-xl border border-border shadow-xs">
                    <span className="font-semibold text-foreground mr-2 text-xs">
                      {c.author.username}
                    </span>
                    <span className="text-muted-foreground text-xs sm:text-sm">
                      {c.text}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleCommentSubmit} className="flex gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Post a comment or share your completed reps..."
              className="flex-1 text-sm bg-card border border-border rounded-full px-4 py-2 text-foreground outline-none focus:border-emerald-600"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Post
            </button>
          </form>
        </div>
      )}
    </article>
  );
};

export default FitnessCard;
