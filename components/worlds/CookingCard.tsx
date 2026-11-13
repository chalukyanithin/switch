"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Utensils, Clock, Flame, Users, Bookmark, Heart, MessageCircle, Share2, ChevronDown, ChevronUp, Check } from "lucide-react";
import { SwitchPost } from "@/lib/data/worldsData";

interface CookingCardProps {
  post: SwitchPost;
  currentUserId?: string;
  onLike?: (id: string) => void;
  onComment?: (id: string, text: string) => void;
  onShare?: (post: SwitchPost) => void;
}

export const CookingCard: React.FC<CookingCardProps> = ({
  post,
  currentUserId,
  onLike,
  onComment,
  onShare,
}) => {
  const [showRecipe, setShowRecipe] = useState(false);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({});
  const [isSaved, setIsSaved] = useState(post.saved || false);
  const [isLiked, setIsLiked] = useState(currentUserId ? post.likes.includes(currentUserId) : false);
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [commentOpen, setCommentOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentsList, setCommentsList] = useState(post.comments || []);
  const [saveToast, setSaveToast] = useState(false);

  const cooking = post.cooking;

  const toggleIngredient = (idx: number) => {
    setCheckedIngredients((prev) => ({ ...prev, [idx]: !prev[idx] }));
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
              src={post.author.photo || "https://api.dicebear.com/7.x/adventurer/svg?seed=Chef"}
              alt={post.author.username}
              className="w-11 h-11 rounded-full object-cover border border-border hover:ring-2 hover:ring-orange-500/50 transition-all"
            />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <Link href={`/profile/${post.author._id}`} className="font-semibold text-foreground hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                {post.author.username}
              </Link>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                <Utensils className="w-3 h-3" />
                Cooking World
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {post.author.bio ? `${post.author.bio} • ` : ""}Recipe Creator
            </p>
          </div>
        </div>

        <button
          onClick={handleSaveClick}
          className={`p-2 rounded-xl transition-all cursor-pointer ${
            isSaved
              ? "bg-orange-500 text-white shadow-xs shadow-orange-500/30"
              : "text-muted-foreground hover:text-orange-500 hover:bg-secondary"
          }`}
          title={isSaved ? "Saved to Cookbook" : "Save to Cookbook"}
        >
          <Bookmark className={`w-5 h-5 ${isSaved ? "fill-white" : ""}`} />
        </button>
      </div>

      {/* Save Notification Toast */}
      {saveToast && (
        <div className="bg-orange-500 text-white text-xs px-4 py-2 text-center font-medium transition-all">
          {isSaved ? "✓ Added to your personal Cookbook" : "Removed from Cookbook"}
        </div>
      )}

      {/* Hero Image */}
      {post.image && (
        <div className="relative aspect-16/10 w-full overflow-hidden bg-secondary">
          <img
            src={post.image}
            alt="Recipe preview"
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.02]"
          />
          {cooking && (
            <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2">
              <span className="bg-black/75 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-orange-400" />
                Prep: {cooking.prepTime} • Cook: {cooking.cookTime}
              </span>
              <span className="bg-black/75 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                {cooking.difficulty}
              </span>
              <span className="bg-black/75 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium">
                <Users className="w-3.5 h-3.5 text-orange-400" />
                {cooking.servings}
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

        {/* Specialized Recipe Drawer */}
        {cooking && (
          <div className="border border-orange-200 dark:border-orange-900/40 rounded-xl bg-orange-50/40 dark:bg-orange-950/20 overflow-hidden">
            <button
              onClick={() => setShowRecipe(!showRecipe)}
              className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-sm text-orange-800 dark:text-orange-300 hover:bg-orange-100/50 dark:hover:bg-orange-900/30 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Utensils className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                {showRecipe ? "Hide Recipe & Method" : `View Full Recipe (${cooking.ingredients.length} ingredients)`}
              </span>
              {showRecipe ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showRecipe && (
              <div className="p-4 sm:p-5 border-t border-orange-200/60 dark:border-orange-900/40 space-y-5 animate-in fade-in duration-200">
                {/* Ingredients with checklist */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-orange-900 dark:text-orange-300 mb-2.5">
                    Ingredients Checklist ({Object.values(checkedIngredients).filter(Boolean).length}/{cooking.ingredients.length} ready)
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    {cooking.ingredients.map((ing, i) => {
                      const isChecked = !!checkedIngredients[i];
                      return (
                        <li
                          key={i}
                          onClick={() => toggleIngredient(i)}
                          className={`flex items-center gap-2.5 p-2 rounded-lg cursor-pointer transition-colors ${
                            isChecked
                              ? "bg-orange-200/50 dark:bg-orange-900/30 line-through text-muted-foreground"
                              : "hover:bg-card text-foreground"
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                              isChecked
                                ? "bg-orange-500 border-orange-500 text-white"
                                : "border-border"
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span>{ing}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Instructions */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-orange-900 dark:text-orange-300 mb-2.5">
                    Step-by-Step Method
                  </h4>
                  <ol className="space-y-2.5 text-sm">
                    {cooking.instructions.map((step, idx) => (
                      <li key={idx} className="flex gap-3 text-foreground">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed pt-0.5">{step}</span>
                      </li>
                    ))}
                  </ol>
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
              isLiked ? "text-red-500 font-semibold" : "hover:text-red-500"
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
            <span>{likeCount}</span>
          </button>

          <button
            onClick={() => setCommentOpen(!commentOpen)}
            className="flex items-center gap-1.5 hover:text-orange-500 transition-colors cursor-pointer"
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
          Cooking World Recipe
        </span>
      </div>

      {/* Comments Thread */}
      {commentOpen && (
        <div className="p-4 sm:p-5 border-t border-border bg-secondary/40">
          <div className="space-y-3 mb-4 max-h-56 overflow-y-auto pr-1">
            {commentsList.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-2">
                No chef notes or comments yet. Ask a question or share your results!
              </p>
            ) : (
              commentsList.map((c, i) => (
                <div key={c._id || i} className="flex gap-2.5 text-sm">
                  <img
                    src={c.author.photo || "https://api.dicebear.com/7.x/adventurer/svg?seed=Commenter"}
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
              placeholder="Add your note or question for the chef..."
              className="flex-1 text-sm bg-card border border-border rounded-full px-4 py-2 text-foreground outline-none focus:border-orange-500"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="px-4 py-2 rounded-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Post
            </button>
          </form>
        </div>
      )}
    </article>
  );
};

export default CookingCard;
