import React from "react";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="relative flex items-center justify-center">
        <img src="/switch-logo-blue.png" alt="Switch" className="w-12 h-12 rounded-xl shadow-md" />
        <Loader2 className="w-16 h-16 animate-spin text-[#506ffc] absolute -inset-2" />
      </div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest animate-pulse">
        Switching Worlds...
      </p>
    </div>
  );
}
