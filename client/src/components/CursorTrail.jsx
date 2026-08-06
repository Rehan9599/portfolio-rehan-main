import React, { useEffect, useRef } from 'react';

export default function CursorTrail() {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;
    let lastSpawn = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const handleMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('pointermove', handleMove);

// CursorTrail.jsx — only the constants + draw math change
const HEAD_SIZE = 15;   // was 6 — the head is now noticeably bigger
const SPAWN_MS = 18;
const LIFE_MS = 2000;

const tick = (t) => {
  if (t - lastSpawn > SPAWN_MS) {
    particlesRef.current.push({ x: mouseRef.current.x, y: mouseRef.current.y, born: t });
    lastSpawn = t;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particlesRef.current = particlesRef.current.filter((p) => t - p.born < LIFE_MS);

  particlesRef.current.forEach((p) => {
    const age = (t - p.born) / LIFE_MS;
    const eased = Math.pow(1 - age, 1.8); // steep falloff — big head, fast-shrinking tail
    const size = HEAD_SIZE * eased;
    const alpha = eased * 0.85;

    if (size < 0.5) return;
    ctx.fillStyle = `rgba(255, 122, 0, ${alpha})`;
    ctx.fillRect(p.x - size / 2, p.y - size / 2, size, size);
  });

  animId = requestAnimationFrame(tick);
};
    animId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handleMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 9999 }}
    />
  );
}