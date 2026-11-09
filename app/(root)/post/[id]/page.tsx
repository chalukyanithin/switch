import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Sparkles, ChevronRight, Code2, MessageSquareCode } from "lucide-react";
import { fetchThoughtById, fetchThoughts } from "@/lib/actions/thought.actions";
import Card from "@/components/ui/Card";

export const dynamic = "force-dynamic";

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await fetchThoughtById(id);

  if (!post) {
    // If not found, fetch standard thoughts or return not found
    const all = await fetchThoughts();
    const fallback = all.find((p) => p._id === id);
    if (!fallback) {
      return (
        <div className="p-12 text-center bg-card rounded-2xl border border-border space-y-4">
          <h2 className="text-xl font-bold text-foreground">Post Not Found</h2>
          <p className="text-sm text-muted-foreground">This thought might have been moved or archived.</p>
          <Link href="/" className="inline-block px-5 py-2 rounded-full bg-primary text-primary-foreground text-xs font-bold">
            Back to Home Feed
          </Link>
        </div>
      );
    }
  }

  const currentPost = post;
  const allPosts = await fetchThoughts(currentPost.world);
  const relatedPosts = allPosts.filter((p) => p._id !== currentPost._id).slice(0, 3);

  const worldClass =
    currentPost.world === "Technology"
      ? "world-tech"
      : currentPost.world === "Meme"
      ? "world-meme"
      : currentPost.world === "Cricket"
      ? "world-cricket"
      : "";

  const worldHref =
    currentPost.world === "Technology"
      ? "/world/tech"
      : currentPost.world === "Meme"
      ? "/world/meme"
      : currentPost.world === "Cricket"
      ? "/world/cricket"
      : "/";

  const primaryTopic = currentPost.tech?.topics?.[0] || currentPost.tech?.techStack?.[0];

  return (
    <div className={`w-full space-y-5 ${worldClass}`}>
      {/* Topic Breadcrumbs & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-muted-foreground font-mono">
          <Link href="/" className="hover:text-foreground transition-colors">
            Switch
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60" />
          <Link href={worldHref} className="hover:text-foreground text-primary font-bold transition-colors">
            {currentPost.world}
          </Link>
          {primaryTopic && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60" />
              <span className="text-foreground font-semibold">#{primaryTopic}</span>
            </>
          )}
        </div>

        <Link
          href={worldHref}
          className="inline-flex items-center gap-1.5 font-bold text-muted-foreground hover:text-foreground transition-colors self-start sm:self-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {currentPost.world} World</span>
        </Link>
      </div>

      {/* Constructive Tech Discussion Prompt (Only for Tech Posts) */}
      {currentPost.world === "Technology" && (
        <div className="p-3.5 rounded-lg bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 flex items-start gap-3 text-xs">
          <MessageSquareCode className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-foreground">Technical Discussion Guidelines</span>
            <p className="text-muted-foreground leading-relaxed">
              Have architectural critique, performance insights, or code questions? Leave a constructive reply below or record a 30s voice walkthrough.
            </p>
          </div>
        </div>
      )}

      {/* Main Post Card with specialized world layout */}
      <Card thought={currentPost} />

      {/* Related in this World */}
      {relatedPosts.length > 0 && (
        <div className="pt-6 border-t border-border space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-sm uppercase tracking-wider text-foreground">
              More from {currentPost.world} World
            </h3>
          </div>
          <div className="space-y-6">
            {relatedPosts.map((related) => (
              <Card key={related._id} thought={related} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

