import React, { useEffect, useRef } from "react";

export default function AcademicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Scholarly Research & Semantic Graph Nodes
    const particleCount = Math.min(48, Math.floor(width / 32));
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
    }> = [];

    // Academic Scholar Palette: Amber Gold, Teal, Emerald, Indigo Blue
    const colors = ["#F59E0B", "#0D9488", "#10B981", "#6366F1", "#38BDF8"];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        size: Math.random() * 2.2 + 1.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.45 + 0.25,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle citation network connections
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < 0 || p1.x > width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > height) p1.vy *= -1;

        // Draw node
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.size, 0, Math.PI * 2);
        ctx.fillStyle = p1.color;
        ctx.globalAlpha = p1.alpha;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = p1.color === "#F59E0B" ? "rgba(245, 158, 11, 0.25)" : "rgba(13, 148, 136, 0.2)";
            ctx.globalAlpha = (1 - dist / 140) * 0.16;
            ctx.lineWidth = 0.9;
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden print:hidden">
      {/* Deep Academic Midnight Slate Base */}
      <div className="absolute inset-0 bg-[#0B132B]" />

      {/* Academic Citation Paper Grid */}
      <div className="absolute inset-0 academic-grid opacity-75" />

      {/* Ambient Moving Radial Glows */}
      <div className="absolute -top-36 left-1/2 -translate-x-1/2 w-[750px] h-[520px] bg-[#0D9488]/12 rounded-full blur-[150px] animate-pulse-glow" />
      <div className="absolute top-1/3 -left-36 w-[550px] h-[450px] bg-[#F59E0B]/10 rounded-full blur-[130px]" />
      <div className="absolute bottom-10 right-0 w-[650px] h-[520px] bg-[#6366F1]/10 rounded-full blur-[160px]" />

      {/* Canvas for interactive particle matrix */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-75" />
    </div>
  );
}
