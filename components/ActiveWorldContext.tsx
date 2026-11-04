"use client";
import React, { createContext, useContext, useState } from "react";

interface ActiveWorldContextType {
  activeWorld: string;
  setActiveWorld: (world: string) => void;
}

const ActiveWorldContext = createContext<ActiveWorldContextType>({
  activeWorld: "All",
  setActiveWorld: () => {},
});

export const ActiveWorldProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeWorld, setActiveWorld] = useState<string>("All");

  return (
    <ActiveWorldContext.Provider value={{ activeWorld, setActiveWorld }}>
      {children}
    </ActiveWorldContext.Provider>
  );
};

export const useActiveWorld = () => useContext(ActiveWorldContext);
export default ActiveWorldContext;

