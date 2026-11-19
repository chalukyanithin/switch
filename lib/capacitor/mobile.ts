// ==============================================================================
// SWITCH SOCIAL PLATFORM - CAPACITOR NATIVE BRIDGE
// File: lib/capacitor/mobile.ts
// Universal native bridge that works in Android and safely falls back on web
// ==============================================================================

import { Capacitor } from "@capacitor/core";
import { Share } from "@capacitor/share";
import { Network } from "@capacitor/network";

/**
 * Returns true if running inside native Android or iOS Capacitor container.
 */
export const isNativeApp = (): boolean => {
  return Capacitor.isNativePlatform();
};

/**
 * Trigger native Android Share Sheet or fallback to Web Share / Clipboard
 */
export async function nativeShare(options: {
  title?: string;
  text?: string;
  url?: string;
  dialogTitle?: string;
}): Promise<boolean> {
  const shareData = {
    title: options.title || "Switch Post",
    text: options.text || "",
    url: options.url || (typeof window !== "undefined" ? window.location.href : ""),
    dialogTitle: options.dialogTitle || "Share Switch Post",
  };

  try {
    if (Capacitor.isNativePlatform()) {
      await Share.share(shareData);
      return true;
    } else if (typeof navigator !== "undefined" && navigator.share) {
      await navigator.share(shareData);
      return true;
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(shareData.url);
      alert("Link copied to clipboard!");
      return true;
    }
  } catch (err: any) {
    if (err?.name !== "AbortError") {
      console.warn("Share failed:", err);
    }
  }
  return false;
}

/**
 * Check device network connectivity
 */
export async function getNetworkStatus() {
  if (Capacitor.isNativePlatform()) {
    return await Network.getStatus();
  }
  return {
    connected: typeof navigator !== "undefined" ? navigator.onLine : true,
    connectionType: "unknown" as const,
  };
}
