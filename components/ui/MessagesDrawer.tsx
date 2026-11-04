"use client";
import React, { useState } from "react";
import { X, MessageSquare, Send, CheckCheck, ArrowLeft, Circle } from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "creator" | "you";
  text: string;
  time: string;
}

interface Conversation {
  id: string;
  creator: {
    name: string;
    photo: string;
    world: string;
    online: boolean;
  };
  lastMessage: string;
  lastTime: string;
  unread: boolean;
  messages: ChatMessage[];
}

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-elena",
    creator: {
      name: "Elena_Vance",
      photo: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=300&h=300&q=80",
      world: "Cooking",
      online: true,
    },
    lastMessage: "Did you try the 36-hour cold ferment on the focaccia?",
    lastTime: "10m ago",
    unread: true,
    messages: [
      { id: "m1", sender: "creator", text: "Hello! Saw your comment on the focaccia crumb structure.", time: "11:20 AM" },
      { id: "m2", sender: "you", text: "Yes! The blistered crust looks incredible. How much olive oil in the pan?", time: "11:22 AM" },
      { id: "m3", sender: "creator", text: "Did you try the 36-hour cold ferment on the focaccia? About 40ml in the pan gives that fried bottom texture!", time: "11:24 AM" }
    ]
  },
  {
    id: "conv-sarah",
    creator: {
      name: "Sarah_Chen",
      photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&h=300&q=80",
      world: "Technology",
      online: true,
    },
    lastMessage: "Just merged the lock-free epoch reclamation PR!",
    lastTime: "1h ago",
    unread: false,
    messages: [
      { id: "m4", sender: "creator", text: "Hey! Benchmarks on SolarCache are looking great.", time: "10:15 AM" },
      { id: "m5", sender: "creator", text: "Just merged the lock-free epoch reclamation PR! Check the repo when you get a chance.", time: "10:16 AM" }
    ]
  },
  {
    id: "conv-maya",
    creator: {
      name: "Maya_Lin",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=300&q=80",
      world: "Art",
      online: false,
    },
    lastMessage: "The gallery exhibition opens this Thursday in Stockholm.",
    lastTime: "Yesterday",
    unread: false,
    messages: [
      { id: "m6", sender: "creator", text: "The gallery exhibition opens this Thursday in Stockholm. Hope you can view the live stream!", time: "Yesterday" }
    ]
  }
];

interface MessagesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MessagesDrawer: React.FC<MessagesDrawerProps> = ({ isOpen, onClose }) => {
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");

  if (!isOpen) return null;

  const activeConv = conversations.find((c) => c.id === activeConvId);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConvId) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "you",
      text: inputText.trim(),
      time: "Just now"
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConvId) {
          return {
            ...c,
            lastMessage: userMsg.text,
            lastTime: "Just now",
            messages: [...c.messages, userMsg]
          };
        }
        return c;
      })
    );

    const sentText = inputText.trim();
    setInputText("");

    // Simulate a friendly creator reply after 1.2 seconds
    setTimeout(() => {
      const creatorReplies: Record<string, string> = {
        "conv-elena": "Sounds delicious! Let me know how the dough rises. Always happy to talk baking science!",
        "conv-sarah": "Awesome! Feel free to open an issue or PR on GitHub if you hit any edge cases under high load.",
        "conv-maya": "Thank you! Light and mist have always been my greatest inspirations in oil."
      };

      const replyText = creatorReplies[activeConvId] || "Thanks for reaching out! Excited to connect on Switch.";

      const replyMsg: ChatMessage = {
        id: `reply-${Date.now()}`,
        sender: "creator",
        text: replyText,
        time: "Just now"
      };

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === activeConvId) {
            return {
              ...c,
              lastMessage: replyText,
              lastTime: "Just now",
              messages: [...c.messages, replyMsg]
            };
          }
          return c;
        })
      );
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md h-full bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 shadow-2xl flex flex-col slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {activeConv && (
              <button
                onClick={() => setActiveConvId(null)}
                className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 mr-1 cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-[#506ffc]">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                {activeConv ? activeConv.creator.name : "Messages"}
              </h3>
              <p className="text-xs text-gray-500">
                {activeConv ? `${activeConv.creator.world} World Creator` : "Direct discussions across worlds"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body: Thread or Conversations list */}
        {!activeConv ? (
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800/80">
            {conversations.map((c) => (
              <div
                key={c.id}
                onClick={() => {
                  setActiveConvId(c.id);
                  setConversations((prev) =>
                    prev.map((item) => (item.id === c.id ? { ...item, unread: false } : item))
                  );
                }}
                className={`p-4 flex gap-3.5 items-center transition-colors cursor-pointer ${
                  c.unread
                    ? "bg-blue-50/30 dark:bg-blue-950/20 hover:bg-blue-50/60"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800/40"
                }`}
              >
                <div className="relative">
                  <img
                    src={c.creator.photo}
                    alt={c.creator.name}
                    className="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                  />
                  {c.creator.online && (
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-gray-900" />
                  )}
                </div>

                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-gray-900 dark:text-gray-100 truncate">
                      {c.creator.name}
                    </span>
                    <span className="text-[11px] text-gray-400">{c.lastTime}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#506ffc]">
                    {c.creator.world} World
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                    {c.lastMessage}
                  </p>
                </div>

                {c.unread && (
                  <span className="w-2.5 h-2.5 rounded-full bg-[#506ffc] flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Messages Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
              {activeConv.messages.map((m) => {
                const isYou = m.sender === "you";
                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isYou ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[82%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        isYou
                          ? "bg-[#506ffc] text-white rounded-br-xs"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-xs"
                      }`}
                    >
                      {m.text}
                    </div>
                    <span className="text-[10px] text-gray-400 mt-1 px-1">
                      {m.time}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Input Composer */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-100 dark:border-gray-800 flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Message ${activeConv.creator.name}...`}
                className="flex-1 text-sm bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 text-gray-900 dark:text-white outline-none focus:border-[#506ffc]"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="w-9 h-9 rounded-full bg-[#506ffc] hover:bg-blue-600 disabled:opacity-40 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesDrawer;

