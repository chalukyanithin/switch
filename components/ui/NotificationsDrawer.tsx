"use client";
import React, { useState } from "react";
import { X, Bell, Heart, MessageCircle, Star, Sparkles, Check, CheckCheck } from "lucide-react";

interface NotificationItem {
  id: string;
  world: string;
  author: {
    name: string;
    photo: string;
  };
  action: string;
  target: string;
  time: string;
  read: boolean;
  type: "like" | "comment" | "star" | "mention";
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "n1",
    world: "Cooking",
    author: {
      name: "Elena_Vance",
      photo: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=300&h=300&q=80"
    },
    action: "saved your recipe to their Cookbook",
    target: "Handmade Sourdough Focaccia",
    time: "12m ago",
    read: false,
    type: "star"
  },
  {
    id: "n2",
    world: "Art",
    author: {
      name: "Maya_Lin",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=300&q=80"
    },
    action: "commented on your color study",
    target: "Atmospheric Reverie #12",
    time: "45m ago",
    read: false,
    type: "comment"
  },
  {
    id: "n3",
    world: "Technology",
    author: {
      name: "Sarah_Chen",
      photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&h=300&q=80"
    },
    action: "starred your open source repository",
    target: "SolarCache v0.8 (Rust)",
    time: "2h ago",
    read: true,
    type: "star"
  },
  {
    id: "n4",
    world: "Music",
    author: {
      name: "Jordan_Vance",
      photo: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&h=300&q=80"
    },
    action: "liked your analog tape jam",
    target: "Midnight Echoes Session",
    time: "4h ago",
    read: true,
    type: "like"
  },
  {
    id: "n5",
    world: "Fitness",
    author: {
      name: "Coach_Marcus",
      photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&h=300&q=80"
    },
    action: "completed your calisthenics circuit",
    target: "Upper Body Tension Routine",
    time: "6h ago",
    read: true,
    type: "mention"
  }
];

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  if (!isOpen) return null;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const filtered = notifications.filter((n) => (filter === "unread" ? !n.read : true));
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md h-full bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 shadow-2xl flex flex-col slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-[#506ffc]">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-lg">Notifications</h3>
              <p className="text-xs text-gray-500">
                {unreadCount > 0 ? `${unreadCount} unread world updates` : "All caught up"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs font-semibold text-[#506ffc] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex border-b border-gray-100 dark:border-gray-800 px-5 gap-4 text-xs font-semibold">
          <button
            onClick={() => setFilter("all")}
            className={`py-3 border-b-2 transition-all cursor-pointer ${
              filter === "all"
                ? "border-[#506ffc] text-[#506ffc]"
                : "border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
            }`}
          >
            All Activity
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`py-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              filter === "unread"
                ? "border-[#506ffc] text-[#506ffc]"
                : "border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
            }`}
          >
            <span>Unread</span>
            {unreadCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#506ffc] text-white text-[10px] flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800/80">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center text-gray-400 space-y-2">
              <Sparkles className="w-10 h-10 stroke-1 text-gray-300 dark:text-gray-600" />
              <p className="font-medium text-sm">No notifications right now</p>
              <p className="text-xs">Explore worlds and engage with creators to see activity here.</p>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => markAsRead(item.id)}
                className={`p-4 flex gap-3.5 items-start transition-colors cursor-pointer ${
                  !item.read
                    ? "bg-blue-50/40 dark:bg-blue-950/20 hover:bg-blue-50/70 dark:hover:bg-blue-950/30"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800/40"
                }`}
              >
                <div className="relative">
                  <img
                    src={item.author.photo}
                    alt={item.author.name}
                    className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                  />
                  <div
                    className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] shadow-xs ${
                      item.type === "like"
                        ? "bg-red-500"
                        : item.type === "comment"
                        ? "bg-blue-500"
                        : item.type === "star"
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                    }`}
                  >
                    {item.type === "like" && <Heart className="w-2.5 h-2.5 fill-white" />}
                    {item.type === "comment" && <MessageCircle className="w-2.5 h-2.5 fill-white" />}
                    {item.type === "star" && <Star className="w-2.5 h-2.5 fill-white" />}
                    {item.type === "mention" && <Check className="w-2.5 h-2.5" />}
                  </div>
                </div>

                <div className="flex-1 text-xs space-y-1">
                  <p className="text-gray-800 dark:text-gray-200 leading-snug">
                    <span className="font-bold text-gray-900 dark:text-white">{item.author.name}</span>{" "}
                    {item.action}{" "}
                    <span className="font-semibold text-[#506ffc]">&quot;{item.target}&quot;</span>
                  </p>
                  <div className="flex items-center gap-2 text-gray-400">
                    <span className="font-medium text-[11px] text-gray-500 dark:text-gray-400">
                      {item.world} World
                    </span>
                    <span>•</span>
                    <span>{item.time}</span>
                  </div>
                </div>

                {!item.read && (
                  <span className="w-2 h-2 rounded-full bg-[#506ffc] flex-shrink-0 mt-2" />
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 text-center text-xs text-gray-400">
          Switch updates you on activity from your saved worlds
        </div>
      </div>
    </div>
  );
};

export default NotificationsDrawer;

