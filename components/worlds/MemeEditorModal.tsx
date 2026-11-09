"use client";
import React, { useState, useRef, useEffect } from "react";
import { X, Sparkles, Type, Sliders, Check, Download, RefreshCw } from "lucide-react";
import { SwitchPost, MemeMetadata, MemeLayer } from "@/lib/data/worldsData";

interface MemeEditorModalProps {
  templatePost: SwitchPost;
  isOpen: boolean;
  onClose: () => void;
  onPublished?: (newPost: any) => void;
}

export const MemeEditorModal: React.FC<MemeEditorModalProps> = ({
  templatePost,
  isOpen,
  onClose,
  onPublished,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [topText, setTopText] = useState(
    templatePost.meme?.layers?.[0]?.text || "WHEN YOU RUN YOUR CODE"
  );
  const [bottomText, setBottomText] = useState(
    templatePost.meme?.layers?.[1]?.text || "AND IT ACTUALLY WORKS FIRST TRY"
  );
  const [fontSize, setFontSize] = useState<number>(32);
  const [fontFamily, setFontFamily] = useState<string>("Impact");
  const [fillColor, setFillColor] = useState<string>("#ffffff");
  const [strokeColor, setStrokeColor] = useState<string>("#000000");
  const [strokeWidth, setStrokeWidth] = useState<number>(3);
  const [isAllCaps, setIsAllCaps] = useState<boolean>(true);
  const [caption, setCaption] = useState<string>("Custom variant remixed on Switch");
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  const templateImageSrc =
    templatePost.meme?.templateImageUrl ||
    templatePost.image ||
    "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80";

  // Re-render canvas whenever text or styling properties change
  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = templateImageSrc;

    img.onload = () => {
      setImageLoaded(true);
      // Set canvas dimension based on image aspect ratio, capped at 600px width
      const targetWidth = 600;
      const scale = targetWidth / img.width;
      const targetHeight = Math.round(img.height * scale);

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      // Draw background image
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      // Draw text helper
      const drawMemeText = (text: string, yPos: number) => {
        if (!text.trim()) return;
        const displayText = isAllCaps ? text.toUpperCase() : text;

        ctx.font = `900 ${fontSize}px ${fontFamily}, sans-serif`;
        ctx.textAlign = "center";
        ctx.fillStyle = fillColor;
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = strokeWidth * 2;
        ctx.lineJoin = "round";

        // Word wrap if long
        const words = displayText.split(" ");
        let line = "";
        const lines: string[] = [];
        const maxWidth = targetWidth - 40;

        for (let i = 0; i < words.length; i++) {
          const testLine = line + words[i] + " ";
          const metrics = ctx.measureText(testLine);
          if (metrics.width > maxWidth && i > 0) {
            lines.push(line);
            line = words[i] + " ";
          } else {
            line = testLine;
          }
        }
        lines.push(line);

        lines.forEach((l, index) => {
          const currentY = yPos + index * (fontSize + 6);
          ctx.strokeText(l.trim(), targetWidth / 2, currentY);
          ctx.fillText(l.trim(), targetWidth / 2, currentY);
        });
      };

      // Draw Top Text
      drawMemeText(topText, fontSize + 20);

      // Draw Bottom Text
      drawMemeText(bottomText, targetHeight - (fontSize * 1.5 + 20));
    };
  }, [isOpen, topText, bottomText, fontSize, fontFamily, fillColor, strokeColor, strokeWidth, isAllCaps, templateImageSrc]);

  if (!isOpen) return null;

  const handlePublishRemix = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsPublishing(true);
    try {
      const renderedImageUrl = canvas.toDataURL("image/jpeg", 0.9);

      const layers: MemeLayer[] = [
        {
          id: "top-layer",
          text: topText,
          x: 300,
          y: fontSize + 20,
          fontSize,
          fontFamily,
          fillColor,
          strokeColor,
          strokeWidth,
          rotation: 0,
          isAllCaps,
        },
        {
          id: "bottom-layer",
          text: bottomText,
          x: 300,
          y: 350,
          fontSize,
          fontFamily,
          fillColor,
          strokeColor,
          strokeWidth,
          rotation: 0,
          isAllCaps,
        },
      ];

      const res = await fetch("/api/v1/worlds/meme/remix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parentMemePostId: templatePost._id,
          renderedImageUrl,
          caption: caption || `Remixed from @${templatePost.author.username}`,
          canvasState: {
            canvasWidth: canvas.width,
            canvasHeight: canvas.height,
            textLayers: layers,
          },
        }),
      });

      const data = await res.json();
      if (onPublished) onPublished(data.post);
      onClose();
    } catch (err) {
      console.error("Remix publishing failed:", err);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 animate-in fade-in duration-150 world-meme">
      <div className="bg-card w-full max-w-2xl rounded-lg border border-border shadow-xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-card">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-md bg-primary/10 text-primary border border-primary/20">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-bold text-foreground text-sm sm:text-base">
                Mini Meme Editor & Remix Studio
              </h3>
              <p className="text-xs text-muted-foreground">
                Remixing template by @{templatePost.author.username}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Canvas Preview */}
          <div className="rounded-md overflow-hidden border border-border bg-black/30 flex items-center justify-center p-2">
            <canvas
              ref={canvasRef}
              className="max-h-72 sm:max-h-80 w-auto rounded object-contain"
            />
          </div>

          {/* Text Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Top Text
              </label>
              <input
                type="text"
                value={topText}
                onChange={(e) => setTopText(e.target.value)}
                placeholder="TOP CAPTION..."
                className="w-full bg-secondary border border-border rounded-md px-3 py-1.5 text-xs text-foreground outline-none focus:border-primary font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Bottom Text
              </label>
              <input
                type="text"
                value={bottomText}
                onChange={(e) => setBottomText(e.target.value)}
                placeholder="BOTTOM CAPTION..."
                className="w-full bg-secondary border border-border rounded-md px-3 py-1.5 text-xs text-foreground outline-none focus:border-primary font-mono"
              />
            </div>
          </div>

          {/* Style Controls */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-md bg-secondary/50 border border-border">
            <div>
              <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                Font Size ({fontSize}px)
              </label>
              <input
                type="range"
                min="18"
                max="54"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                Font Family
              </label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="w-full bg-card border border-border rounded px-2 py-1 text-xs text-foreground outline-none cursor-pointer"
              >
                <option value="Impact">Impact (Classic)</option>
                <option value="Arial">Arial (Modern)</option>
                <option value="Courier New">Courier (Coder)</option>
                <option value="Comic Sans MS">Comic Sans (Chaotic)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                Text Color
              </label>
              <div className="flex items-center gap-1.5">
                {["#ffffff", "#facc15", "#38bdf8", "#4ade80", "#f87171"].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setFillColor(c)}
                    className={`w-4 h-4 rounded-full border transition-transform ${
                      fillColor === c ? "ring-2 ring-primary scale-110" : ""
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-end">
              <button
                type="button"
                onClick={() => setIsAllCaps(!isAllCaps)}
                className={`px-2.5 py-1 rounded border text-[11px] font-medium transition-colors cursor-pointer ${
                  isAllCaps
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-muted-foreground border-border"
                }`}
              >
                {isAllCaps ? "ALL CAPS ON" : "Mixed Case"}
              </button>
            </div>
          </div>

          {/* Post Caption */}
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Post Caption for Meme World Feed
            </label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Add your punchline or context..."
              className="w-full bg-secondary border border-border rounded-md px-3 py-1.5 text-xs text-foreground outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-card">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
          >
            Discard
          </button>

          <button
            onClick={handlePublishRemix}
            disabled={isPublishing}
            className="px-4 py-1.5 rounded-md bg-primary hover:opacity-95 disabled:opacity-50 text-primary-foreground font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {isPublishing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Publishing to Meme World...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 fill-current" />
                <span>Publish Remix</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemeEditorModal;

