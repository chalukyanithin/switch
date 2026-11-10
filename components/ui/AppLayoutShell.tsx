"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Search, Bell, Code2, Home } from "lucide-react";
import Sidebar from "./SideBar";
import MobileNav from "./MobileNav";
import RightBar from "./RightBar";
import NotificationsDrawer from "./NotificationsDrawer";
import MessagesDrawer from "./MessagesDrawer";
import DarkSwitch from "./DarkSwitch";
import { ActiveWorldProvider } from "../ActiveWorldContext";

export const AppLayoutShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAuthPage = pathname === "/login" || pathname === "/signup";
  const isTechWorld = pathname?.startsWith("/world/tech");
  const isMemeWorld = pathname?.startsWith("/world/meme");
  const hasCustomTopBar = isTechWorld || isMemeWorld;

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [messagesOpen, setMessagesOpen] = useState(false);

  if (isAuthPage) {
    return <main className="min-h-screen w-full bg-background text-foreground">{children}</main>;
  }

  const user = session?.user;
  const userPhoto =
    user?.image && !user.image.includes("userr.jpg") && !user.image.includes("ui-avatars.com")
      ? user.image
      : `https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.name || "Explorer"}`;

  return (
    <ActiveWorldProvider>
      <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors duration-200">
        {/* Mobile Top Header & Bottom Nav */}
        <MobileNav
          onOpenNotifications={() => setNotificationsOpen(true)}
          onOpenMessages={() => setMessagesOpen(true)}
          unreadNotificationsCount={2}
        />

        {/* Tech World Desktop Top Navigation Bar */}
        {isTechWorld && (
          <header className="hidden md:flex sticky top-0 z-40 w-full bg-white dark:bg-card border-b border-[#E2E8F0] dark:border-border h-14 px-6 items-center justify-between">
            {/* Left: Brand + World Tag */}
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-1 group">
                <span className="font-extrabold text-xl tracking-tight text-[#17243A] dark:text-white">
                  switch<span className="text-[#2463D3]">.</span>
                </span>
              </Link>
              <div className="flex items-center gap-2 text-xs font-bold text-[#17243A] dark:text-white">
                <div className="w-5 h-5 rounded bg-blue-50 dark:bg-blue-950/60 text-[#2463D3] flex items-center justify-center">
                  <Code2 className="w-3.5 h-3.5" />
                </div>
                <span>Tech World</span>
              </div>
            </div>

            {/* Center: Search Bar */}
            <div className="flex-1 max-w-lg mx-8 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder='Search Tech World... (e.g. "Linux process", "how does Docker work?")'
                className="w-full bg-[#F8FAFC] dark:bg-secondary/40 border border-[#E2E8F0] dark:border-border rounded-lg pl-9 pr-14 py-1.5 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-[#2463D3] transition-colors"
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white dark:bg-card border border-[#E2E8F0] dark:border-border text-[10px] font-mono text-muted-foreground shadow-xs">
                <span>⌘ K</span>
              </div>
            </div>

            {/* Right: Theme Toggle, Notifications & Avatar */}
            <div className="flex items-center gap-3">
              <div className="scale-85 origin-center">
                <DarkSwitch />
              </div>

              <button
                onClick={() => setNotificationsOpen(true)}
                className="relative p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-slate-50 dark:hover:bg-secondary transition-colors cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#2463D3]" />
              </button>

              <Link href="/profile">
                <img
                  src={userPhoto}
                  alt={user?.name || "User"}
                  className="w-8 h-8 rounded-full object-cover border border-[#E2E8F0] dark:border-border"
                />
              </Link>
            </div>
          </header>
        )}

        {/* Meme World Desktop Top Navigation Bar (Pixel-Matched to Screenshot) */}
        {isMemeWorld && (
          <header className="hidden md:flex sticky top-0 z-40 w-full bg-white dark:bg-card border-b border-[#E2E8F0] dark:border-border h-14 px-6 items-center justify-between">
            {/* Left: [S] Switch Logo + Nav Links (Home, Worlds, Explore) */}
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-8 h-8 rounded-xl bg-[#2463D3] text-white font-black flex items-center justify-center text-lg shadow-xs">
                  S
                </div>
                <span className="font-extrabold text-xl tracking-tight text-[#17243A] dark:text-white">
                  Switch
                </span>
              </Link>

              <div className="flex items-center gap-2 text-xs font-bold">
                <Link
                  href="/"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-slate-50 dark:hover:bg-secondary/40 transition-colors"
                >
                  <Home className="w-3.5 h-3.5 text-[#2463D3]" />
                  <span>Home</span>
                </Link>

                <Link
                  href="/world/meme"
                  className="px-3.5 py-1.5 rounded-xl bg-[#2463D3] text-white shadow-xs font-bold"
                >
                  Worlds
                </Link>

                <Link
                  href="/explore"
                  className="px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-slate-50 dark:hover:bg-secondary/40 transition-colors"
                >
                  Explore
                </Link>
              </div>
            </div>

            {/* Center: Search Input */}
            <div className="flex-1 max-w-md mx-8 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search memes, templates, creators..."
                className="w-full bg-[#F8FAFC] dark:bg-secondary/40 border border-[#E2E8F0] dark:border-border rounded-full pl-9 pr-4 py-1.5 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-[#2463D3] transition-colors"
              />
            </div>

            {/* Right: Theme Toggle, Notifications & Profile */}
            <div className="flex items-center gap-3">
              <div className="scale-85 origin-center">
                <DarkSwitch />
              </div>

              <button
                onClick={() => setNotificationsOpen(true)}
                className="relative p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-slate-50 dark:hover:bg-secondary transition-colors cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#2463D3]" />
              </button>

              <Link href="/profile">
                <img
                  src={userPhoto}
                  alt={user?.name || "User"}
                  className="w-8 h-8 rounded-full object-cover border border-[#E2E8F0] dark:border-border"
                />
              </Link>
            </div>
          </header>
        )}

        <div className="flex-1 flex w-full max-w-7xl mx-auto justify-center">
          {/* Fixed Left Desktop Sidebar */}
          <div className={`hidden md:block fixed left-0 ${hasCustomTopBar ? 'top-14 h-[calc(100vh-3.5rem)]' : 'top-0 h-screen'} w-64 z-30`}>
            <Sidebar />
          </div>

          {/* Central Content Area (Scaled for Meme World so cover photo spans feed + right bar, but cards remain normal width) */}
          <main className={`flex-1 w-full ${isMemeWorld ? 'max-w-[960px] px-4 sm:px-6 py-4 pb-24 md:pb-12 md:ml-64' : 'max-w-2xl px-4 sm:px-6 py-6 pb-24 md:pb-12 md:ml-64 xl:mr-80'} min-h-screen`}>
            {children}
          </main>

          {/* Fixed Right Column for Discovery & Trending (Except in Meme World where it flows below the cover photo) */}
          {!isMemeWorld && (
            <aside className={`hidden xl:block fixed right-0 ${hasCustomTopBar ? 'top-14 h-[calc(100vh-3.5rem)]' : 'top-0 h-screen'} w-80 border-l border-border bg-card z-20`}>
              <RightBar />
            </aside>
          )}
        </div>

        {/* Global Drawers for Notifications & Messages */}
        <NotificationsDrawer isOpen={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
        <MessagesDrawer isOpen={messagesOpen} onClose={() => setMessagesOpen(false)} />
      </div>
    </ActiveWorldProvider>
  );
};

export default AppLayoutShell;
