"use client";
import React, { useState } from "react";
import { Home, Search, Plus, Compass, User, Bell, MessageSquare, LogOut, LogIn, Globe2 } from "lucide-react";
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

  return (
    <>
      <aside className="hidden md:flex flex-col h-screen w-64 bg-sidebar border-r border-sidebar-border p-4 justify-between transition-colors z-30">
        {/* Top: Logo & Main Navigation */}
        <div className="space-y-6">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-3 px-3 py-2 group">
            <img
              src="/switch-logo-blue.png"
              alt="Switch Logo"
              className="w-10 h-10 rounded-xl shadow-md group-hover:scale-105 transition-transform"
            />
            <div>
              <span className="font-black text-xl tracking-tight bg-gradient-to-r from-primary to-blue-700 bg-clip-text text-transparent">
                SWITCH
              </span>
              <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                Multi-World Platform
              </p>
            </div>
          </Link>

          {/* Active World Badge in Navigation */}
          {activeWorld !== "All" && (
            <div className="px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-xs font-semibold text-primary flex items-center justify-between">
              <span>World: {activeWorld}</span>
              <span className="w-2 h-2 rounded-full bg-primary" />
            </div>
          )}

          {/* Navigation Links */}
          <nav>
            <ul className="space-y-1.5">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;

                return (
                  <li key={item.id}>
                    <Link
                      href={item.path}
                      className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <Icon className={`w-5 h-5 ${isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-sidebar-foreground"}`} />
                        <span>{item.label}</span>
                      </div>
                      {isActive && (
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />
                      )}
                    </Link>
                  </li>
                );
              })}

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
        <div className="space-y-4 pt-4 border-t border-sidebar-border">
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
