import React, { useEffect, useRef } from 'react';

export default function PixelPortrait({
  src,
  width = 340,
  height = 420,
  cell = 3,              // smaller = crisper/denser
  alt = '',
  duration = 2200,
  contrast = 1.6,
  minDotFraction = 0.22, // floor so dark hair/shadow still shows
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = src;
    let animId;

    // Retina sharpness: render at device pixel ratio, scale down via CSS
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    img.onload = () => {
      const off = document.createElement('canvas');
      off.width = width;
      off.height = height;
      const offCtx = off.getContext('2d');

      const scale = Math.max(width / img.width, height / img.height);
      const drawW = img.width * scale;
      const drawH = img.height * scale;
      offCtx.drawImage(img, (width - drawW) / 2, (height - drawH) / 2, drawW, drawH);

      const { data } = offCtx.getImageData(0, 0, width, height);

      const pixels = [];
      for (let y = 0; y < height; y += cell) {
        for (let x = 0; x < width; x += cell) {
          const i = (y * width + x) * 4;
          const srcAlpha = data[i + 3] / 255;
          if (srcAlpha < 0.1) continue;

          let brightness = (data[i] + data[i + 1] + data[i + 2]) / 3 / 255;
          brightness = Math.pow(brightness, contrast);

          const size = Math.max(brightness, minDotFraction) * cell * 0.95;
          if (size < 0.5) continue;

          pixels.push({ tx: x, ty: y, size, brightness, srcAlpha });
        }
      }

      // Scatter start positions — a wide dust field, not just the frame
      const pad = 60;
      pixels.forEach((p) => {
        p.startX = Math.random() * (width + pad * 2) - pad;
        p.startY = Math.random() * (height + pad * 2) - pad;
        p.rank = Math.random(); // random assembly order
      });

      const STAGGER_WINDOW = 0.7;
      const PER_PIXEL_MOVE = 900;
      let start = null;

      const draw = (t) => {
        if (start === null) start = t;
        const elapsed = t - start;

        ctx.clearRect(0, 0, width, height); // transparent — no fill

        let stillAnimating = false;

        pixels.forEach((p) => {
          const pStart = p.rank * duration * STAGGER_WINDOW;
          const local = elapsed - pStart;
          if (local <= 0) { stillAnimating = true; return; }

          const progress = Math.min(local / PER_PIXEL_MOVE, 1);
          if (progress < 1) stillAnimating = true;

          const eased = 1 - Math.pow(1 - progress, 3);
          const x = p.startX + (p.tx - p.startX) * eased;
          const y = p.startY + (p.ty - p.startY) * eased;
          const size = p.size * eased;
          const alpha = (0.35 + p.brightness * 0.75) * eased * p.srcAlpha;

          if (size < 0.3) return;
          ctx.fillStyle = `rgba(255,255,255,${alpha})`;
          ctx.fillRect(x - size / 2, y - size / 2, size, size);
        });

        if (stillAnimating) animId = requestAnimationFrame(draw);
      };

      animId = requestAnimationFrame(draw);
    };

    return () => cancelAnimationFrame(animId);
  }, [src, width, height, cell, duration, contrast, minDotFraction]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={alt}
      style={{ display: 'block' }}
    />
  );
}