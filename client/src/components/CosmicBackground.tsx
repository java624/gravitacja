import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  color: string;
}

export default function CosmicBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let isMobile = window.innerWidth < 768 || 'ontouchstart' in window;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles: Particle[] = [];
    const colors = ['#06b6d4', '#a855f7', '#ec4899', '#3b82f6'];
    const count = isMobile ? 30 : 90;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * (isMobile ? 1.8 : 2.5) + 0.5,
        vx: (Math.random() - 0.5) * (isMobile ? 0.4 : 0.7),
        vy: (Math.random() - 0.5) * (isMobile ? 0.4 : 0.7),
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const mouse = { x: -1000, y: -1000, radius: 120 };

    const handleMouseMove = (e: MouseEvent) => {
      if (isMobile) return;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleResize = () => {
      isMobile = window.innerWidth < 768 || 'ontouchstart' in window;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    let isVisible = true;
    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const render = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        if (!isMobile && mouse.x > 0) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.hypot(dx, dy);

          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            const angle = Math.atan2(dy, dx);
            p.x -= Math.cos(angle) * force * 3;
            p.y -= Math.sin(angle) * force * 3;
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;

        // shadowBlur is extremely heavy on mobile GPUs — only apply on desktop
        if (!isMobile) {
          ctx.shadowBlur = 8;
          ctx.shadowColor = p.color;
        }

        ctx.fill();

        // Connect nearby particles only on desktop
        if (!isMobile) {
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dist2 = Math.hypot(p.x - p2.x, p.y - p2.y);
            if (dist2 < 90) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `rgba(6, 182, 212, ${0.4 * (1 - dist2 / 90)})`;
              ctx.lineWidth = 0.4;
              ctx.stroke();
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
}