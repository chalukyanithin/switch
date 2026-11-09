"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

interface ActiveWorldContextType {
  activeWorld: string;
  setActiveWorld: (world: string) => void;
}

const ActiveWorldContext = createContext<ActiveWorldContextType>({
  activeWorld: "All",
  setActiveWorld: () => {},
});

export const ActiveWorldProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const [activeWorld, setActiveWorld] = useState<string>("All");

  // Automatically synchronize active world state with route pathname
  useEffect(() => {
    if (!pathname) return;
    if (pathname.startsWith("/world/tech") || pathname.includes("world=Technology")) {
      setActiveWorld("Technology");
    } else if (pathname.startsWith("/world/meme") || pathname.includes("world=Meme")) {
      setActiveWorld("Meme");
    } else if (pathname.startsWith("/world/cricket") || pathname.includes("world=Cricket")) {
      setActiveWorld("Cricket");
    } else if (pathname === "/" || pathname === "/explore") {
      // Keep existing activeWorld unless user explicitly navigates
    }
  }, [pathname]);

  return (
    <ActiveWorldContext.Provider value={{ activeWorld, setActiveWorld }}>
      {children}
    </ActiveWorldContext.Provider>
  );
};

export const useActiveWorld = () => useContext(ActiveWorldContext);
export default ActiveWorldContext;

