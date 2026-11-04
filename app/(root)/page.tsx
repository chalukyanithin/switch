import React from "react";
import HomeFeed from "@/components/feed/HomeFeed";
import { fetchThoughts } from "@/lib/actions/thought.actions";

export const dynamic = "force-dynamic";

export default async function SwitchHome() {
  const thoughts = await fetchThoughts();

  return (
    <div className="w-full">
      <HomeFeed initialThoughts={thoughts} />
    </div>
  );
}
