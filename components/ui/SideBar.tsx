"use client";
import React, { useState } from "react";
import { Home, Search, Plus, Compass, User, Bell, MessageSquare, LogOut, LogIn, Globe2, Code2, Sparkles, Trophy, Bookmark, Users, Clock, Hash, Brain, BookOpen, ArrowLeft, ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import DarkSwitch from "./DarkSwitch";
import NotificationsDrawer from "./NotificationsDrawer";
import MessagesDrawer from "./MessagesDrawer";
import { useActiveWorld } from "../ActiveWorldContext";

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
}

const sidebarItems: SidebarItem[] = [
  { id: "home", label: "Home", icon: Home, path: "/" },
  { id: "explore", label: "Explore", icon: Compass, path: "/explore" },
  { id: "create", label: "Create Post", icon: Plus, path: "/create" },
  { id: "search", label: "Search", icon: Search, path: "/search" },
  { id: "profile", label: "Profile", icon: User, path: "/profile" },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { activeWorld } = useActiveWorld();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [messagesOpen, setMessagesOpen] = useState(false);

  // Hide sidebar completely on auth pages
  if (pathname === "/login" || pathname === "/signup") {
    return null;
  }

  const user = session?.user;
  const userPhoto =
    user?.image && !user.image.includes("userr.jpg") && !user.image.includes("ui-avatars.com")
      ? user.image
      : `https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.name || "Explorer"}`;

  const isTechWorld = pathname?.startsWith("/world/tech");

  if (isTechWorld) {
    return (
      <>
        <aside className="hidden md:flex flex-col h-full w-64 bg-white dark:bg-card border-r border-[#E2E8F0] dark:border-border p-4 justify-between transition-colors z-30 overflow-y-auto overflow-x-hidden custom-scrollbar overscroll-contain world-tech">
          <div className="space-y-4 flex-1 pb-4">
            {/* Tech World Header Badge Card matching screenshot */}
            <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-secondary/40 border border-[#E2E8F0] dark:border-border flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#2463D3] flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-900/40">
                <Code2 className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h2 className="font-bold text-sm text-[#17243A] dark:text-white leading-tight">
                  Tech World
                </h2>
                <p className="text-[10px] text-muted-foreground truncate font-medium">
                  Discuss • Learn • Build
                </p>
              </div>
            </div>

            {/* Main Navigation Links */}
            <nav className="space-y-1">
              {[
                { label: "Discover", icon: Compass, href: "/world/tech" },
                { label: "Discussions", icon: MessageSquare, href: "/world/tech?tab=discussions" },
                { label: "Daily Tech Quiz", icon: Trophy, href: "/world/tech?tab=quiz" },
                { label: "Projects", icon: Code2, href: "/world/tech?tab=projects" },
                { label: "Learn", icon: BookOpen, href: "/world/tech?tab=learn" },
              ].map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    idx === 0
                      ? "bg-[#2463D3]/10 text-[#2463D3] dark:bg-blue-950/40 dark:text-blue-300 font-bold"
                      : "text-muted-foreground hover:text-[#17243A] dark:hover:text-white hover:bg-[#F8FAFC] dark:hover:bg-secondary/40"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* Section: My Tech World */}
            <div className="space-y-1.5 pt-2 border-t border-[#E2E8F0] dark:border-border">
              <span className="px-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                My Tech World
              </span>
              <nav className="space-y-0.5">
                <Link
                  href="/profile"
                  className="flex items-center gap-3 px-3 py-1.5 rounded-md text-xs font-medium text-muted-foreground hover:text-[#17243A] dark:hover:text-white hover:bg-[#F8FAFC] dark:hover:bg-secondary/40 transition-colors"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Saved</span>
                </Link>
                <Link
                  href="/world/tech"
                  className="flex items-center gap-3 px-3 py-1.5 rounded-md text-xs font-medium text-muted-foreground hover:text-[#17243A] dark:hover:text-white hover:bg-[#F8FAFC] dark:hover:bg-secondary/40 transition-colors"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Following</span>
                </Link>
                <Link
                  href="/world/tech"
                  className="flex items-center gap-3 px-3 py-1.5 rounded-md text-xs font-medium text-muted-foreground hover:text-[#17243A] dark:hover:text-white hover:bg-[#F8FAFC] dark:hover:bg-secondary/40 transition-colors"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>History</span>
                </Link>
              </nav>
            </div>

            {/* Section: Popular Topics */}
            <div className="space-y-1.5 pt-2 border-t border-[#E2E8F0] dark:border-border">
              <span className="px-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Popular Topics
              </span>
              <div className="space-y-1 px-1">
                {[
                  "Linux",
                  "Operating Systems",
                  "System Design",
                  "AI / ML",
                  "Web Development",
                ].map((topic) => (
                  <Link
                    key={topic}
                    href={`/world/tech?topic=${encodeURIComponent(topic)}`}
                    className="flex items-center gap-2 px-2.5 py-1 rounded text-xs font-medium text-muted-foreground hover:text-[#2463D3] transition-colors"
                  >
                    <Hash className="w-3 h-3 text-muted-foreground/70" />
                    <span>{topic}</span>
                  </Link>
                ))}
                <button
                  type="button"
                  className="flex items-center gap-1 px-2.5 pt-1 text-[11px] font-semibold text-muted-foreground hover:text-[#2463D3] transition-colors cursor-pointer"
                >
                  <span>See more</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom user profile card */}
          <div className="pt-3 border-t border-[#E2E8F0] dark:border-border flex items-center justify-between">
            <Link href="/profile" className="flex items-center gap-2.5 overflow-hidden group">
              <img
                src={userPhoto}
                alt={user?.name || "Profile"}
                className="w-8 h-8 rounded-full object-cover border border-border shrink-0"
              />
              <div className="overflow-hidden">
                <p className="font-bold text-xs text-[#17243A] dark:text-white truncate group-hover:text-[#2463D3] transition-colors">
                  {user?.name || "You"}
                </p>
                <p className="text-[10px] text-muted-foreground truncate font-mono">
                  {user?.email || "@developer"}
                </p>
              </div>
            </Link>
            <DarkSwitch />
          </div>
        </aside>
      </>
    );
  }

  return (
    <>
      <aside className="hidden md:flex flex-col h-full w-64 bg-sidebar border-r border-sidebar-border p-4 justify-between transition-colors z-30 overflow-y-auto overflow-x-hidden custom-scrollbar overscroll-contain">
        {/* Top: Logo & Main Navigation */}
        <div className="space-y-6 flex-1 pb-4">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-3 px-3 py-2 group">
            <img
              src="/switch-logo-blue.png"
              alt="Switch Logo"
              className="w-9 h-9 rounded-lg border border-border group-hover:scale-105 transition-transform"
            />
            <div>
              <span className="font-extrabold text-lg tracking-tight text-foreground">
                SWITCH
              </span>
              <p className="text-[11px] font-medium text-muted-foreground">
                Three Interest Worlds
              </p>
            </div>
          </Link>

          {/* Active World Badge in Navigation */}
          {activeWorld !== "All" && (
            <div className="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-xs font-semibold text-primary flex items-center justify-between">
              <span>World: {activeWorld}</span>
              <span className="w-2 h-2 rounded-full bg-primary" />
            </div>
          )}

          {/* Navigation Links */}
          <nav>
            <ul className="space-y-1">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;

                return (
                  <li key={item.id}>
                    <Link
                      href={item.path}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors duration-150 group ${
                        isActive
                          ? "bg-primary text-primary-foreground font-bold"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-sidebar-foreground"}`} />
                        <span>{item.label}</span>
                      </div>
                      {isActive && (
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />
                      )}
                    </Link>
                  </li>
                );
              })}

              {/* Specialized Worlds Direct Entry */}
              <li className="pt-4 pb-1">
                <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Worlds
                </span>
              </li>
              <li>
                <Link
                  href="/world/tech"
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    pathname === "/world/tech"
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-900/40 font-bold"
                      : "text-sidebar-foreground hover:bg-sidebar-accent"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Code2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>Technology</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono">CODE</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/world/cricket"
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    pathname === "/world/cricket"
                      ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/40 font-bold"
                      : "text-sidebar-foreground hover:bg-sidebar-accent"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Trophy className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Cricket</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono">MATCH</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/world/meme"
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    pathname === "/world/meme"
                      ? "bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-900/40 font-bold"
                      : "text-sidebar-foreground hover:bg-sidebar-accent"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>Memes</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono">REMIX</span>
                </Link>
              </li>

              {/* Quick Drawers Triggers */}
              <li>
                <button
                  onClick={() => setNotificationsOpen(true)}
                  className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5">
                    <Bell className="w-5 h-5 text-muted-foreground group-hover:text-sidebar-foreground" />
                    <span>Notifications</span>
                  </div>
                  <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[11px] font-bold flex items-center justify-center">
                    2
                  </span>
                </button>
              </li>

              <li>
                <button
                  onClick={() => setMessagesOpen(true)}
                  className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5">
                    <MessageSquare className="w-5 h-5 text-muted-foreground group-hover:text-sidebar-foreground" />
                    <span>Messages</span>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {/* Bottom Section: Theme & Profile Status */}
        <div className="space-y-4 pt-4 border-t border-sidebar-border shrink-0 mt-auto">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-semibold text-muted-foreground">Appearance</span>
            <div className="scale-75 origin-right">
              <DarkSwitch />
            </div>
          </div>

          {session ? (
            <div className="p-2.5 rounded-xl bg-sidebar-accent border border-sidebar-border flex items-center justify-between">
              <Link href="/profile" className="flex items-center gap-2.5 overflow-hidden group">
                <img
                  src={userPhoto}
                  alt={user?.name || "Profile"}
                  className="w-9 h-9 rounded-full object-cover border border-sidebar-border shrink-0"
                />
                <div className="overflow-hidden">
                  <p className="font-bold text-xs text-sidebar-foreground truncate group-hover:text-primary transition-colors">
                    {user?.name || "You"}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {user?.email || "@explorer"}
                  </p>
                </div>
              </Link>
              <button
                onClick={() => signOut()}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-secondary border border-border text-center space-y-2">
              <p className="text-xs font-semibold text-foreground">
                Unlock full experience
              </p>
              <Link
                href="/login"
                className="w-full py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-primary/90 transition-colors shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
            </div>
          )}
        </div>
      </aside>

      {/* Drawers */}
      <NotificationsDrawer isOpen={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
      <MessagesDrawer isOpen={messagesOpen} onClose={() => setMessagesOpen(false)} />
    </>
  );
};

export default Sidebar;
