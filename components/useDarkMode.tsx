// useDarkMode.ts
import { useEffect, useState } from "react";

const STORAGE_KEY = "theme"; // 'dark' | 'light'

function getPreferredDark() {
  if (typeof window === "undefined") return false;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "dark") return true;
  if (stored === "light") return false;
  return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? false;
}

export function useDarkMode() {
  const [isDark, setIsDark] = useState<boolean>(getPreferredDark);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", isDark);
    localStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light");
  }, [isDark]);

  // Optional: sync with OS if no explicit choice stored
  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;
    const mql = window.matchMedia?.("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mql?.addEventListener?.("change", onChange);
    return () => mql?.removeEventListener?.("change", onChange);
  }, []);

  return { isDark, toggle: () => setIsDark((d) => !d) };
}
