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

    // 1. Deep Universe Twinkling Starfield
    const starCount = Math.min(160, Math.floor((width * height) / 8000));
    const starColors = ["#FFFFFF", "#FDE68A", "#38BDF8", "#C084FC", "#93C5FD"];
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
        size: Math.random() * 1.8 + 0.4,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        baseAlpha: Math.random() * 0.6 + 0.2,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.04 + 0.015,
      });
    }

    // 2. Cosmic Constellation Graph Nodes
    const nodeCount = Math.min(45, Math.floor(width / 34));
    const nodeColors = ["#F59E0B", "#0D9488", "#6366F1", "#38BDF8", "#10B981"];
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
        size: Math.random() * 2.2 + 1.2,
        color: nodeColors[Math.floor(Math.random() * nodeColors.length)],
        alpha: Math.random() * 0.5 + 0.3,
      });
    }

    // 3. Meteor / Shooting Star System
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
      const angle = (Math.PI / 4) + (Math.random() - 0.5) * 0.2; // 45 degree angle
      shootingStar = {
        x: Math.random() * width * 0.8,
        y: Math.random() * height * 0.4,
        length: Math.random() * 110 + 70,
        speed: Math.random() * 12 + 8,
        angle,
        alpha: 1,
        active: true,
      };
    };

    let tick = 0;

    const render = () => {
      tick += 1;

      // Smooth parallax mouse transition
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;
      const offsetX = (mouseX - width / 2) * 0.02;
      const offsetY = (mouseY - height / 2) * 0.02;

      ctx.clearRect(0, 0, width, height);

      // Render Layer 1: Twinkling Deep Space Stars
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.twinklePhase += star.twinkleSpeed;
        const currentAlpha = star.baseAlpha + Math.sin(star.twinklePhase) * 0.3;

        ctx.beginPath();
        ctx.arc(star.x + offsetX * (star.size * 0.5), star.y + offsetY * (star.size * 0.5), Math.max(0.2, star.size), 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = Math.max(0.05, Math.min(1, currentAlpha));
        ctx.fill();
      }

      // Render Layer 2: Constellation Vector Nodes & Stardust Beams
      for (let i = 0; i < nodes.length; i++) {
        const p1 = nodes[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < 0 || p1.x > width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > height) p1.vy *= -1;

        const renderX = p1.x + offsetX;
        const renderY = p1.y + offsetY;

        // Draw node star core
        ctx.beginPath();
        ctx.arc(renderX, renderY, p1.size, 0, Math.PI * 2);
        ctx.fillStyle = p1.color;
        ctx.globalAlpha = p1.alpha;
        ctx.fill();

        // Connect nearby constellation nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const p2 = nodes[j];
          const renderX2 = p2.x + offsetX;
          const renderY2 = p2.y + offsetY;

          const dx = renderX - renderX2;
          const dy = renderY - renderY2;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(renderX, renderY);
            ctx.lineTo(renderX2, renderY2);
            ctx.strokeStyle = p1.color === "#F59E0B" ? "rgba(245, 158, 11, 0.28)" : "rgba(56, 189, 248, 0.22)";
            ctx.globalAlpha = (1 - dist / 150) * 0.22;
            ctx.lineWidth = 0.9;
            ctx.stroke();
          }
        }
      }

      // Render Layer 3: Cosmic Shooting Star / Meteor
      if (!shootingStar && Date.now() > nextShootingStarTime) {
        spawnShootingStar();
      }

      if (shootingStar && shootingStar.active) {
        const tailX = shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.length;
        const tailY = shootingStar.y - Math.sin(shootingStar.angle) * shootingStar.length;

        const gradient = ctx.createLinearGradient(
          shootingStar.x,
          shootingStar.y,
          tailX,
          tailY
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${shootingStar.alpha})`);
        gradient.addColorStop(0.4, `rgba(245, 158, 11, ${shootingStar.alpha * 0.8})`);
        gradient.addColorStop(1, "rgba(99, 102, 241, 0)");

        ctx.beginPath();
        ctx.moveTo(shootingStar.x, shootingStar.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.8;
        ctx.globalAlpha = shootingStar.alpha;
        ctx.stroke();

        // Advance shooting star head
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
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden print:hidden">
      {/* Deep Cosmic Universe Midnight Canvas Base */}
      <div className="absolute inset-0 bg-[#060B1E]" />

      {/* Dynamic Floating Cosmic Nebulae Clouds */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[850px] h-[600px] bg-gradient-to-r from-indigo-900/25 via-purple-900/20 to-teal-900/20 rounded-full blur-[160px] animate-cosmic-nebula" />
      <div className="absolute top-1/3 -left-44 w-[600px] h-[500px] bg-gradient-to-br from-amber-600/15 to-indigo-900/20 rounded-full blur-[140px] animate-pulse-glow" />
      <div className="absolute bottom-10 right-0 w-[700px] h-[550px] bg-gradient-to-tr from-cyan-900/20 via-indigo-950/25 to-amber-500/10 rounded-full blur-[170px]" />

      {/* Subtle Academic Citation Paper Grid */}
      <div className="absolute inset-0 academic-grid opacity-60" />

      {/* Interactive Universe Canvas with Starfield & Meteors */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-85" />
    </div>
  );
}
