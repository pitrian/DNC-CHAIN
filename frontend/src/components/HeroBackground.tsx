import { useEffect, useRef } from 'react';

export default function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const orbs = [
      { x: 0.2, y: 0.3, r: 180, color: '59,130,246', dx: 0.0003, dy: 0.0002, dr: 0.2 },
      { x: 0.8, y: 0.5, r: 220, color: '139,92,246', dx: -0.0002, dy: 0.0004, dr: -0.15 },
      { x: 0.5, y: 0.7, r: 160, color: '6,182,212', dx: 0.0004, dy: -0.0003, dr: 0.1 },
    ];

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 1;

      orbs.forEach((o) => {
        const cx = canvas.width * (o.x + Math.sin(t * o.dx) * 0.08);
        const cy = canvas.height * (o.y + Math.cos(t * o.dy) * 0.08);
        const radius = o.r + Math.sin(t * o.dr) * 20;

        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        gradient.addColorStop(0, `rgba(${o.color},0.12)`);
        gradient.addColorStop(0.5, `rgba(${o.color},0.06)`);
        gradient.addColorStop(1, `rgba(${o.color},0)`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      });

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-white/80" />
    </div>
  );
}
