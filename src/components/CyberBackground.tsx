import React, { useEffect, useRef, useState } from "react";
import { Sparkles, Sliders, Feather, Eye, EyeOff } from "lucide-react";

declare global {
  interface Window {
    THREE?: any;
    VANTA?: {
      BIRDS: (options: any) => {
        destroy: () => void;
        setOptions?: (options: any) => void;
      };
    };
  }
}

export interface VantaThemeOption {
  name: string;
  color1: number;
  color2: number;
  color1Hex: string;
  color2Hex: string;
}

export const VANTA_THEMES: Record<string, VantaThemeOption> = {
  amber_cyan: {
    name: "Amber & Cyan (Default)",
    color1: 0xf59e0b,
    color2: 0x38bdf8,
    color1Hex: "#F59E0B",
    color2Hex: "#38BDF8",
  },
  emerald_teal: {
    name: "Emerald & Teal",
    color1: 0x10b981,
    color2: 0x14b8a6,
    color1Hex: "#10B981",
    color2Hex: "#14B8A6",
  },
  violet_indigo: {
    name: "Violet & Indigo",
    color1: 0x8b5cf6,
    color2: 0x6366f1,
    color1Hex: "#8B5CF6",
    color2Hex: "#6366F1",
  },
  gold_crimson: {
    name: "Gold & Crimson",
    color1: 0xf59e0b,
    color2: 0xef4444,
    color1Hex: "#F59E0B",
    color2Hex: "#EF4444",
  },
};

export default function AcademicBackground() {
  const vantaContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const vantaEffectRef = useRef<any>(null);

  const [bgMode, setBgMode] = useState<"vanta" | "hybrid" | "stars">("hybrid");
  const [selectedThemeKey, setSelectedThemeKey] = useState<string>("amber_cyan");
  const [quantity, setQuantity] = useState<number>(3.5);
  const [birdSize, setBirdSize] = useState<number>(1.25);
  const [speedLimit, setSpeedLimit] = useState<number>(4.5);
  const [showControls, setShowControls] = useState<boolean>(false);
  const [vantaLoaded, setVantaLoaded] = useState<boolean>(false);

  // Initialize & update Vanta.js BIRDS Effect
  useEffect(() => {
    let isMounted = true;

    const initVanta = () => {
      if (!isMounted) return;
      if (bgMode === "stars") {
        if (vantaEffectRef.current) {
          vantaEffectRef.current.destroy();
          vantaEffectRef.current = null;
        }
        return;
      }

      if (window.VANTA && window.VANTA.BIRDS && vantaContainerRef.current) {
        // Destroy existing effect before re-creating
        if (vantaEffectRef.current) {
          vantaEffectRef.current.destroy();
          vantaEffectRef.current = null;
        }

        const theme = VANTA_THEMES[selectedThemeKey] || VANTA_THEMES.amber_cyan;

        try {
          vantaEffectRef.current = window.VANTA.BIRDS({
            el: vantaContainerRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.0,
            minWidth: 200.0,
            scale: 1.0,
            scaleMobile: 1.0,
            backgroundColor: 0x060b1e, // Deep cosmic background matching theme #060B1E
            color1: theme.color1,
            color2: theme.color2,
            colorMode: "variance",
            birdSize: birdSize,
            wingSpan: 24.0,
            speedLimit: speedLimit,
            separation: 35.0,
            alignment: 22.0,
            cohesion: 22.0,
            quantity: quantity,
          });
          setVantaLoaded(true);
        } catch (err) {
          console.warn("Failed to initialize Vanta.js BIRDS:", err);
          setVantaLoaded(false);
        }
      }
    };

    // If VANTA is loaded, init immediately. Otherwise, check or poll briefly.
    if (window.VANTA && window.VANTA.BIRDS) {
      initVanta();
    } else {
      const interval = setInterval(() => {
        if (window.VANTA && window.VANTA.BIRDS) {
          clearInterval(interval);
          initVanta();
        }
      }, 200);

      return () => clearInterval(interval);
    }

    return () => {
      isMounted = false;
      if (vantaEffectRef.current) {
        vantaEffectRef.current.destroy();
        vantaEffectRef.current = null;
      }
    };
  }, [bgMode, selectedThemeKey, quantity, birdSize, speedLimit]);

  // Starfield & Meteor Canvas Animation (Runs when in stars or hybrid mode)
  useEffect(() => {
    if (bgMode === "vanta") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = width / 2;
    let targetMouseY = height / 2;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    // Deep Universe Twinkling Starfield
    const starCount = Math.min(120, Math.floor((width * height) / 9000));
    const themeObj = VANTA_THEMES[selectedThemeKey] || VANTA_THEMES.amber_cyan;
    const starColors = ["#FFFFFF", themeObj.color1Hex, themeObj.color2Hex, "#93C5FD"];
    const stars: Array<{
      x: number;
      y: number;
      size: number;
      color: string;
      baseAlpha: number;
      twinklePhase: number;
      twinkleSpeed: number;
    }> = [];

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.6 + 0.4,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        baseAlpha: Math.random() * 0.5 + 0.2,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.04 + 0.015,
      });
    }

    // Constellation Graph Nodes
    const nodeCount = Math.min(30, Math.floor(width / 45));
    const nodes: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
    }> = [];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2.0 + 1.0,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        alpha: Math.random() * 0.4 + 0.2,
      });
    }

    // Meteor / Shooting Star System
    interface ShootingStar {
      x: number;
      y: number;
      length: number;
      speed: number;
      angle: number;
      alpha: number;
      active: boolean;
    }

    let shootingStar: ShootingStar | null = null;
    let nextShootingStarTime = Date.now() + Math.random() * 3000 + 2000;

    const spawnShootingStar = () => {
      const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.2;
      shootingStar = {
        x: Math.random() * width * 0.8,
        y: Math.random() * height * 0.4,
        length: Math.random() * 100 + 60,
        speed: Math.random() * 12 + 8,
        angle,
        alpha: 1,
        active: true,
      };
    };

    const render = () => {
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;
      const offsetX = (mouseX - width / 2) * 0.02;
      const offsetY = (mouseY - height / 2) * 0.02;

      ctx.clearRect(0, 0, width, height);

      // Render Stars
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.twinklePhase += star.twinkleSpeed;
        const currentAlpha = star.baseAlpha + Math.sin(star.twinklePhase) * 0.3;

        ctx.beginPath();
        ctx.arc(
          star.x + offsetX * (star.size * 0.5),
          star.y + offsetY * (star.size * 0.5),
          Math.max(0.2, star.size),
          0,
          Math.PI * 2
        );
        ctx.fillStyle = star.color;
        ctx.globalAlpha = Math.max(0.05, Math.min(1, currentAlpha));
        ctx.fill();
      }

      // Render Constellation Nodes
      for (let i = 0; i < nodes.length; i++) {
        const p1 = nodes[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < 0 || p1.x > width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > height) p1.vy *= -1;

        const renderX = p1.x + offsetX;
        const renderY = p1.y + offsetY;

        ctx.beginPath();
        ctx.arc(renderX, renderY, p1.size, 0, Math.PI * 2);
        ctx.fillStyle = p1.color;
        ctx.globalAlpha = p1.alpha * (bgMode === "hybrid" ? 0.6 : 1.0);
        ctx.fill();

        for (let j = i + 1; j < nodes.length; j++) {
          const p2 = nodes[j];
          const renderX2 = p2.x + offsetX;
          const renderY2 = p2.y + offsetY;

          const dx = renderX - renderX2;
          const dy = renderY - renderY2;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(renderX, renderY);
            ctx.lineTo(renderX2, renderY2);
            ctx.strokeStyle = p1.color;
            ctx.globalAlpha = (1 - dist / 140) * (bgMode === "hybrid" ? 0.15 : 0.25);
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Render Shooting Star
      if (!shootingStar && Date.now() > nextShootingStarTime) {
        spawnShootingStar();
      }

      if (shootingStar && shootingStar.active) {
        const tailX = shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.length;
        const tailY = shootingStar.y - Math.sin(shootingStar.angle) * shootingStar.length;

        const gradient = ctx.createLinearGradient(shootingStar.x, shootingStar.y, tailX, tailY);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${shootingStar.alpha})`);
        gradient.addColorStop(0.4, `${themeObj.color1Hex}`);
        gradient.addColorStop(1, "rgba(99, 102, 241, 0)");

        ctx.beginPath();
        ctx.moveTo(shootingStar.x, shootingStar.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.8;
        ctx.globalAlpha = shootingStar.alpha;
        ctx.stroke();

        shootingStar.x += Math.cos(shootingStar.angle) * shootingStar.speed;
        shootingStar.y += Math.sin(shootingStar.angle) * shootingStar.speed;
        shootingStar.alpha -= 0.018;

        if (shootingStar.alpha <= 0 || shootingStar.x > width || shootingStar.y > height) {
          shootingStar = null;
          nextShootingStarTime = Date.now() + Math.random() * 4000 + 3000;
        }
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [bgMode, selectedThemeKey]);

  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden print:hidden">
        {/* Deep Cosmic Midnight Base */}
        <div className="absolute inset-0 bg-[#060B1E]" />

        {/* Vanta.js BIRDS 3D Container Layer */}
        {bgMode !== "stars" && (
          <div
            ref={vantaContainerRef}
            className={`absolute inset-0 transition-opacity duration-700 ${
              bgMode === "hybrid" ? "opacity-75" : "opacity-90"
            }`}
          />
        )}

        {/* Dynamic Floating Ambient Nebulae Clouds */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[850px] h-[600px] bg-gradient-to-r from-indigo-900/25 via-purple-900/20 to-teal-900/20 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute top-1/3 -left-44 w-[600px] h-[500px] bg-gradient-to-br from-amber-600/15 to-indigo-900/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-0 w-[700px] h-[550px] bg-gradient-to-tr from-cyan-900/20 via-indigo-950/25 to-amber-500/10 rounded-full blur-[170px] pointer-events-none" />

        {/* Academic Citation Grid */}
        <div className="absolute inset-0 academic-grid opacity-50 pointer-events-none" />

        {/* Constellations & Starfield Overlay Canvas */}
        {bgMode !== "vanta" && (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full opacity-80 pointer-events-none"
          />
        )}
      </div>

      {/* Floating Vanta BIRDS Customizer Control Badge (Fixed at bottom right) */}
      <div className="fixed bottom-5 right-5 z-40 print:hidden">
        {showControls ? (
          <div className="w-80 rounded-2xl border border-amber-500/40 bg-slate-950/90 p-4 shadow-2xl backdrop-blur-xl text-xs space-y-3 font-sans animate-in fade-in slide-in-from-bottom-3 duration-200">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-2.5">
              <div className="flex items-center space-x-2 text-amber-400 font-mono font-bold">
                <Feather className="w-4 h-4 text-amber-400 animate-bounce" />
                <span>VANTA 3D BIRDS CONTROLLER</span>
              </div>
              <button
                type="button"
                onClick={() => setShowControls(false)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1 rounded-md hover:bg-slate-800"
                aria-label="Close controls"
              >
                <EyeOff className="w-4 h-4" />
              </button>
            </div>

            {/* Background Mode Switcher */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-300 font-semibold block">
                BACKGROUND ENGINE
              </label>
              <div className="grid grid-cols-3 gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setBgMode("vanta")}
                  className={`py-1.5 px-2 rounded-lg font-mono text-[10px] font-bold transition-all cursor-pointer ${
                    bgMode === "vanta"
                      ? "bg-amber-500 text-slate-950 shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  3D BIRDS
                </button>
                <button
                  type="button"
                  onClick={() => setBgMode("hybrid")}
                  className={`py-1.5 px-2 rounded-lg font-mono text-[10px] font-bold transition-all cursor-pointer ${
                    bgMode === "hybrid"
                      ? "bg-teal-500 text-slate-950 shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  HYBRID
                </button>
                <button
                  type="button"
                  onClick={() => setBgMode("stars")}
                  className={`py-1.5 px-2 rounded-lg font-mono text-[10px] font-bold transition-all cursor-pointer ${
                    bgMode === "stars"
                      ? "bg-indigo-500 text-white shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  STARS
                </button>
              </div>
            </div>

            {/* Color Palette Selector */}
            {bgMode !== "stars" && (
              <>
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-300 font-semibold block">
                    BIRD THEME COLORS
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {Object.entries(VANTA_THEMES).map(([key, theme]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setSelectedThemeKey(key)}
                        className={`flex items-center space-x-2 p-1.5 rounded-lg border text-[11px] font-sans font-medium transition-all cursor-pointer ${
                          selectedThemeKey === key
                            ? "border-amber-400 bg-amber-500/10 text-white font-bold"
                            : "border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex -space-x-1 shrink-0">
                          <span
                            className="w-3 h-3 rounded-full border border-black/40"
                            style={{ backgroundColor: theme.color1Hex }}
                          />
                          <span
                            className="w-3 h-3 rounded-full border border-black/40"
                            style={{ backgroundColor: theme.color2Hex }}
                          />
                        </div>
                        <span className="truncate text-[10px]">{theme.name.split(" ")[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Flock Quantity Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono text-slate-300">
                    <span>FLOCK DENSITY</span>
                    <span className="text-amber-400 font-bold">{quantity.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="6.0"
                    step="0.5"
                    value={quantity}
                    onChange={(e) => setQuantity(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                  />
                </div>

                {/* Bird Size Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono text-slate-300">
                    <span>BIRD SIZE</span>
                    <span className="text-amber-400 font-bold">{birdSize.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.75"
                    max="2.2"
                    step="0.15"
                    value={birdSize}
                    onChange={(e) => setBirdSize(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                  />
                </div>

                {/* Flight Speed Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono text-slate-300">
                    <span>FLIGHT SPEED</span>
                    <span className="text-amber-400 font-bold">{speedLimit.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="2.0"
                    max="8.0"
                    step="0.5"
                    value={speedLimit}
                    onChange={(e) => setSpeedLimit(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                  />
                </div>
              </>
            )}

            <div className="pt-1 border-t border-slate-800 text-[10px] font-mono text-slate-400 flex items-center justify-between">
              <span>https://www.vantajs.com</span>
              <span className="text-amber-400 font-semibold">3D WebGL Birds</span>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowControls(true)}
            className="group flex items-center space-x-2 rounded-full border border-amber-500/40 bg-slate-950/90 px-3.5 py-2 text-xs font-mono font-semibold text-amber-300 shadow-xl backdrop-blur-md hover:bg-slate-900 hover:border-amber-400 transition-all cursor-pointer"
          >
            <Feather className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
            <span>3D Birds Theme</span>
            <Sliders className="w-3.5 h-3.5 text-amber-400/70 ml-1" />
          </button>
        )}
      </div>
    </>
  );
}
