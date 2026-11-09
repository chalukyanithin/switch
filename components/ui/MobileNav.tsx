"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Plus, Search, User, Bell, MessageSquare } from "lucide-react";
import DarkSwitch from "./DarkSwitch";

interface MobileNavProps {
  onOpenNotifications: () => void;
  onOpenMessages: () => void;
  unreadNotificationsCount?: number;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  onOpenNotifications,
  onOpenMessages,
  unreadNotificationsCount = 2,
}) => {
  const pathname = usePathname();

  // Hide on auth pages
  if (pathname === "/login" || pathname === "/signup") return null;

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Explore", href: "/explore", icon: Compass },
    { label: "Create", href: "/create", icon: Plus, isAction: true },
    { label: "Search", href: "/search", icon: Search },
    { label: "Profile", href: "/profile", icon: User },
  ];

  return (
    <>
      {/* Mobile Top Header */}
      <header className="md:hidden sticky top-0 z-40 w-full bg-card border-b border-border px-4 py-2.5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <img src="/switch-logo-blue.png" alt="Switch" className="w-8 h-8 rounded-md border border-border" />
          <span className="font-extrabold text-lg tracking-tight text-foreground">
            SWITCH
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenNotifications}
            className="p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground relative cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
            )}
          </button>

          <button
            onClick={onOpenMessages}
            className="p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer"
            title="Messages"
          >
            <MessageSquare className="w-5 h-5" />
          </button>

          <div className="scale-75 origin-right">
            <DarkSwitch />
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border px-2 py-1.5 flex items-center justify-around shadow-sm">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          if (item.isAction) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="w-10 h-10 -mt-3 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-transform"
                title="Create Post"
              >
                <Plus className="w-5 h-5 stroke-[2.5]" />
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-1 px-3 rounded-xl transition-colors ${
                isActive
                  ? "text-primary font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
};

export default MobileNav;
