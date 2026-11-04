"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./SideBar";
import MobileNav from "./MobileNav";
import RightBar from "./RightBar";
import NotificationsDrawer from "./NotificationsDrawer";
import MessagesDrawer from "./MessagesDrawer";
import { ActiveWorldProvider } from "../ActiveWorldContext";

export const AppLayoutShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [messagesOpen, setMessagesOpen] = useState(false);

  if (isAuthPage) {
    return <main className="min-h-screen w-full bg-background text-foreground">{children}</main>;
  }

  return (
    <ActiveWorldProvider>
      <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors duration-200">
        {/* Mobile Top Header & Bottom Nav */}
        <MobileNav
          onOpenNotifications={() => setNotificationsOpen(true)}
          onOpenMessages={() => setMessagesOpen(true)}
          unreadNotificationsCount={2}
        />

        <div className="flex-1 flex w-full max-w-7xl mx-auto justify-center">
          {/* Fixed Left Desktop Sidebar */}
          <div className="hidden md:block fixed left-0 top-0 h-screen w-64 z-30">
            <Sidebar />
          </div>

          {/* Central Content Area */}
          <main className="flex-1 w-full max-w-2xl px-4 sm:px-6 py-6 pb-24 md:pb-12 md:ml-64 xl:mr-80 min-h-screen">
            {children}
          </main>

          {/* Fixed Right Column for Discovery & Trending */}
          <aside className="hidden xl:block fixed right-0 top-0 h-screen w-80 border-l border-border bg-card/60 backdrop-blur-md z-20">
            <RightBar />
          </aside>
        </div>

        {/* Global Drawers for Notifications & Messages */}
        <NotificationsDrawer isOpen={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
        <MessagesDrawer isOpen={messagesOpen} onClose={() => setMessagesOpen(false)} />
      </div>
    </ActiveWorldProvider>
  );
};

export default AppLayoutShell;
