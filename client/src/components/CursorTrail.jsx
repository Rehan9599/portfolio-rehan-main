import React, { useEffect, useRef } from 'react';

const HEAD_SIZE = 15;
const SPAWN_MS = 18;
const LIFE_MS = 2000;

export default function CursorTrail() {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: -100, y: -100 });

  useEffect(() => {
    // Nothing to trail on a touch device, and reduced-motion users have asked
    // not to be given this. Both cases previously still ran a 60fps canvas
    // loop for the entire visit.
    if (window.matchMedia('(hover: none), (prefers-reduced-motion: reduce)').matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId = null;
    let lastSpawn = 0;
    let hasMoved = false;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const tick = (t) => {
      if (t - lastSpawn > SPAWN_MS && hasMoved) {
        particlesRef.current.push({ x: mouseRef.current.x, y: mouseRef.current.y, born: t });
        lastSpawn = t;
      }

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
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

      // Idle out once the last particle has faded instead of burning a frame
      // budget forever on an empty canvas.
      if (particlesRef.current.length === 0) {
        animId = null;
        return;
      }
      animId = requestAnimationFrame(tick);
    };

    const start = () => {
      if (animId === null && !document.hidden) animId = requestAnimationFrame(tick);
    };

    const handleMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      hasMoved = true;
      start();
    };

    const handleVisibility = () => {
      if (document.hidden && animId !== null) {
        cancelAnimationFrame(animId);
        animId = null;
      }
    };

    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', handleMove);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      if (animId !== null) cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handleMove);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 9999 }}
    />
  );
}
