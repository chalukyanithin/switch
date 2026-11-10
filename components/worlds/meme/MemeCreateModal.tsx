"use client";
import React, { useState, useRef, useEffect } from "react";
import { X, Sparkles, Image as ImageIcon, Type, Download, Check, RefreshCw } from "lucide-react";
import { SwitchPost } from "@/lib/data/worldsData";
import { MEME_TEMPLATES_LIST, MemeTemplateItem } from "./MemeTemplatesSection";

interface MemeCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublished?: (newPost: SwitchPost) => void;
  initialTemplate?: MemeTemplateItem | null;
  initialCategory?: string;
}

const MEME_CATEGORIES = [
  "Relatable",
  "Office",
  "College",
  "Indian",
  "Tech",
  "Gaming",
  "Dark Humor",
  "Everyday Chaos",
];

export const MemeCreateModal: React.FC<MemeCreateModalProps> = ({
  isOpen,
  onClose,
  onPublished,
  initialTemplate,
  initialCategory = "Office",
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [selectedTemplate, setSelectedTemplate] = useState<MemeTemplateItem>(
    initialTemplate || MEME_TEMPLATES_LIST[0]
  );
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [topText, setTopText] = useState(initialTemplate?.defaultTopText || "WHEN YOUR MANAGER SAYS");
  const [bottomText, setBottomText] = useState(initialTemplate?.defaultBottomText || "IT'S A QUICK FIX AT 5:45 PM");
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState(initialCategory || "Office");
  const [fontSize, setFontSize] = useState(30);
  const [isAllCaps, setIsAllCaps] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    if (initialTemplate) {
      setSelectedTemplate(initialTemplate);
      if (initialTemplate.defaultTopText) setTopText(initialTemplate.defaultTopText);
      if (initialTemplate.defaultBottomText) setBottomText(initialTemplate.defaultBottomText);
      if (initialTemplate.category) setCategory(initialTemplate.category);
    }
  }, [initialTemplate]);

  const activeImageSrc = customImage || selectedTemplate.imageUrl;

  // Re-draw canvas on state changes
  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = activeImageSrc;

    img.onload = () => {
      const targetWidth = 600;
      const scale = targetWidth / img.width;
      const targetHeight = Math.round(img.height * scale);

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      // Draw image
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      // Helper to render impact text
      const drawText = (text: string, yPos: number) => {
        if (!text.trim()) return;
        const displayText = isAllCaps ? text.toUpperCase() : text;

        ctx.font = `900 ${fontSize}px Impact, sans-serif`;
        ctx.textAlign = "center";
        ctx.fillStyle = "#ffffff";
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = Math.max(3, fontSize / 8);
        ctx.lineJoin = "round";

        const words = displayText.split(" ");
        let line = "";
        const lines: string[] = [];

        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + " ";
          const metrics = ctx.measureText(testLine);
          if (metrics.width > targetWidth - 40 && n > 0) {
            lines.push(line.trim());
            line = words[n] + " ";
          } else {
            line = testLine;
          }
        }
        lines.push(line.trim());

        const lineHeight = fontSize * 1.15;
        const startY = yPos - ((lines.length - 1) * lineHeight) / 2;

        lines.forEach((l, i) => {
          const curY = startY + i * lineHeight;
          ctx.strokeText(l, targetWidth / 2, curY);
          ctx.fillText(l, targetWidth / 2, curY);
        });
      };

      // Top & Bottom text
      if (topText) drawText(topText, fontSize + 20);
      if (bottomText) drawText(bottomText, targetHeight - 30);
    };
  }, [isOpen, activeImageSrc, topText, bottomText, fontSize, isAllCaps]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCustomImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `switch-meme-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const handlePublish = () => {
    setIsPublishing(true);
    const canvas = canvasRef.current;
    const generatedDataUrl = canvas ? canvas.toDataURL("image/png") : activeImageSrc;

    const newMemePost: SwitchPost = {
      _id: `meme-user-${Date.now()}`,
      world: "Meme",
      author: {
        _id: "current-user",
        username: "You",
        photo: "https://api.dicebear.com/7.x/bottts/svg?seed=YouMemer",
        bio: "Certified Shitposter 🚀",
        verified: true,
      },
      content: caption.trim() || `${topText} — ${bottomText}`,
      image: generatedDataUrl,
      createdAt: new Date().toISOString(),
      likes: ["current-user"],
      sharesCount: 0,
      comments: [],
      meme: {
        isTemplate: true,
        category,
        tags: [category, "OriginalRemix"],
        upvotes: 1,
        downvotes: 0,
        reactions: { banger: 1 },
        templateImageUrl: activeImageSrc,
        layers: [
          {
            id: "l1",
            text: topText,
            x: 300,
            y: 40,
            fontSize,
            fontFamily: "Impact",
            fillColor: "#ffffff",
            strokeColor: "#000000",
            strokeWidth: 3,
            rotation: 0,
            isAllCaps,
          },
          {
            id: "l2",
            text: bottomText,
            x: 300,
            y: 350,
            fontSize,
            fontFamily: "Impact",
            fillColor: "#ffffff",
            strokeColor: "#000000",
            strokeWidth: 3,
            rotation: 0,
            isAllCaps,
          },
        ],
      },
    };

    setTimeout(() => {
      setIsPublishing(false);
      if (onPublished) onPublished(newMemePost);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-3xl rounded-2xl bg-white dark:bg-card border border-[#E2E8F0] dark:border-border shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#E2E8F0] dark:border-border">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#2463D3]">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h2 className="font-extrabold text-base sm:text-lg text-[#17243A] dark:text-white leading-tight">
                Create a Meme
              </h2>
              <p className="text-[11px] text-muted-foreground font-mono">
                Your creativity is buffering. Start with a template.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-secondary cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body 2-Column: Left Canvas Preview, Right Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 sm:p-6 max-h-[75vh] overflow-y-auto no-scrollbar">
          {/* Left Canvas Preview */}
          <div className="space-y-3 flex flex-col items-center">
            <div className="w-full rounded-xl overflow-hidden border border-[#E2E8F0] dark:border-border bg-slate-900 shadow-inner flex items-center justify-center p-2">
              <canvas
                ref={canvasRef}
                className="w-full h-auto max-h-[340px] object-contain rounded-lg"
              />
            </div>

            <div className="flex items-center justify-between w-full">
              <button
                type="button"
                onClick={handleDownload}
                className="px-3 py-1.5 rounded-lg border border-[#E2E8F0] dark:border-border hover:bg-slate-50 dark:hover:bg-secondary text-xs font-semibold flex items-center gap-1.5 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save Image</span>
              </button>

              <label className="px-3 py-1.5 rounded-lg border border-dashed border-[#2463D3] hover:bg-blue-50/50 dark:hover:bg-blue-950/20 text-xs font-semibold text-[#2463D3] flex items-center gap-1.5 cursor-pointer">
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Upload Custom Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Right Controls */}
          <div className="space-y-4 text-xs">
            {/* Pick from template strip */}
            <div className="space-y-1.5">
              <span className="font-bold text-[#17243A] dark:text-white uppercase tracking-wider text-[10px]">
                Choose Template
              </span>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {MEME_TEMPLATES_LIST.map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => {
                      setSelectedTemplate(tpl);
                      setCustomImage(null);
                      if (tpl.defaultTopText) setTopText(tpl.defaultTopText);
                      if (tpl.defaultBottomText) setBottomText(tpl.defaultBottomText);
                    }}
                    className={`shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      selectedTemplate.id === tpl.id && !customImage
                        ? "border-[#2463D3] ring-2 ring-[#2463D3]/30"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={tpl.imageUrl} alt={tpl.name} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Top Text Input */}
            <div className="space-y-1">
              <label className="font-bold text-[#17243A] dark:text-white">
                Top Text
              </label>
              <input
                type="text"
                value={topText}
                onChange={(e) => setTopText(e.target.value)}
                placeholder="TOP TEXT..."
                className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] dark:border-border bg-[#F8FAFC] dark:bg-secondary/40 text-foreground text-xs font-mono font-bold outline-none focus:border-[#2463D3]"
              />
            </div>

            {/* Bottom Text Input */}
            <div className="space-y-1">
              <label className="font-bold text-[#17243A] dark:text-white">
                Bottom Text
              </label>
              <input
                type="text"
                value={bottomText}
                onChange={(e) => setBottomText(e.target.value)}
                placeholder="BOTTOM TEXT..."
                className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] dark:border-border bg-[#F8FAFC] dark:bg-secondary/40 text-foreground text-xs font-mono font-bold outline-none focus:border-[#2463D3]"
              />
            </div>

            {/* Caption */}
            <div className="space-y-1">
              <label className="font-bold text-[#17243A] dark:text-white">
                Caption
              </label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Add context or a witty one-liner..."
                className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] dark:border-border bg-[#F8FAFC] dark:bg-secondary/40 text-foreground text-xs outline-none focus:border-[#2463D3]"
              />
            </div>

            {/* Category Select */}
            <div className="space-y-1">
              <label className="font-bold text-[#17243A] dark:text-white">
                Category
              </label>
              <div className="flex flex-wrap gap-1.5">
                {MEME_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                      category === cat
                        ? "bg-[#2463D3] text-white"
                        : "bg-[#F1F5F9] dark:bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    #{cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Size & Caps */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-muted-foreground font-semibold">Size:</span>
                <input
                  type="range"
                  min={18}
                  max={48}
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-24 accent-[#2463D3]"
                />
              </div>

              <label className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAllCaps}
                  onChange={(e) => setIsAllCaps(e.target.checked)}
                  className="rounded text-[#2463D3]"
                />
                <span>ALL CAPS</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-t border-[#E2E8F0] dark:border-border bg-[#F8FAFC] dark:bg-secondary/20">
          <span className="text-xs text-muted-foreground font-mono italic">
            *Certified bangers only.
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-secondary cursor-pointer"
            >
              Cancel
            </button>

            <button
              onClick={handlePublish}
              disabled={isPublishing}
              className="px-5 py-2 rounded-xl bg-[#2463D3] hover:bg-[#2463D3]/90 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {isPublishing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Publish Meme</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemeCreateModal;

