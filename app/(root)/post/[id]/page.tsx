import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";
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
        <div className="p-12 text-center bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-4">
          <h2 className="text-xl font-bold">Post Not Found</h2>
          <p className="text-sm text-gray-500">This thought might have been moved or archived.</p>
          <Link href="/" className="inline-block px-5 py-2 rounded-full bg-[#506ffc] text-white text-xs font-bold">
            Back to Home Feed
          </Link>
        </div>
      );
    }
  }

  const currentPost = post;
  const allPosts = await fetchThoughts(currentPost.world);
  const relatedPosts = allPosts.filter((p) => p._id !== currentPost._id).slice(0, 3);

  return (
    <div className="w-full space-y-6">
      {/* Back button */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Feed</span>
        </Link>
      </div>

      {/* Main Post Card with specialized world layout */}
      <Card thought={currentPost} />

      {/* Related in this World */}
      {relatedPosts.length > 0 && (
        <div className="pt-6 border-t border-gray-200 dark:border-gray-800 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#506ffc]" />
            <h3 className="font-bold text-sm uppercase tracking-wider text-gray-800 dark:text-gray-200">
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

