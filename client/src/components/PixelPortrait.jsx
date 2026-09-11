import React, { useEffect, useRef } from 'react';

// Rec. 709 luminance — a flat (r+g+b)/3 average reads warm skin tones as
// darker than they look, which flattens facial detail.
const LUMA_R = 0.2126;
const LUMA_G = 0.7152;
const LUMA_B = 0.0722;

const ALPHA_CUTOFF = 0.35; // ignore the soft anti-aliased fringe of a cut-out

// Module-level so its identity is stable across renders — an inline array
// literal as the default prop value would be a new object every render,
// which would retrigger the effect (and restart the assembly animation)
// on every unrelated parent re-render, e.g. the hero's typewriter tick.
const DEFAULT_TINT = [232, 228, 220];

function percentile(sorted, p) {
  if (sorted.length === 0) return 0;
  const i = Math.min(sorted.length - 1, Math.max(0, Math.round((p / 100) * (sorted.length - 1))));
  return sorted[i];
}

export default function PixelPortrait({
  src,
  width = 340,
  height = 420,
  cell = 3,              // smaller = crisper/denser
  alt = '',
  duration = 2200,
  contrast = 1.55,       // S-curve strength around the midtone
  minDotFraction = 0.18, // smallest dot, as a fraction of a cell
  maxDotFraction = 0.76, // largest dot — below 1 so dots never merge into flat white
  minOpacity = 0.46,     // darkest dot's opacity against the page background
  maxOpacity = 0.80,     // brightest dot's opacity — kept off full white so it doesn't glare
  tint = DEFAULT_TINT, // warm off-white instead of pure #fff — softer on a dark bg
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

      // Pass 1 — average every pixel inside a cell rather than sampling its
      // top-left corner. Point sampling threw away 15/16 of the source and
      // made edges noisy.
      const cells = [];
      const visible = [];

      for (let y = 0; y + cell <= height; y += cell) {
        for (let x = 0; x + cell <= width; x += cell) {
          let luma = 0;
          let alpha = 0;

          for (let dy = 0; dy < cell; dy++) {
            for (let dx = 0; dx < cell; dx++) {
              const i = ((y + dy) * width + (x + dx)) * 4;
              luma += (LUMA_R * data[i] + LUMA_G * data[i + 1] + LUMA_B * data[i + 2]) / 255;
              alpha += data[i + 3] / 255;
            }
          }

          const n = cell * cell;
          luma /= n;
          alpha /= n;

          if (alpha < ALPHA_CUTOFF) continue;
          cells.push({ tx: x, ty: y, luma, srcAlpha: alpha });
          visible.push(luma);
        }
      }

      if (cells.length === 0) return;

      // Pass 2 — auto-levels. Stretch the photo's real 2nd..98th percentile
      // brightness across the full dot-size range, so swapping in a photo with
      // different lighting still produces a readable portrait instead of one
      // where most of the face collapses onto the minimum dot size.
      visible.sort((a, b) => a - b);
      const lo = percentile(visible, 2);
      const hi = percentile(visible, 98);
      const span = Math.max(hi - lo, 1e-6);

      const sizeSpan = maxDotFraction - minDotFraction;

      const pixels = cells.map((c) => {
        const levelled = Math.min(1, Math.max(0, (c.luma - lo) / span));

        // Contrast around the midpoint, then smoothstep. The old
        // Math.pow(b, contrast) only ever darkened — every value below 1 gets
        // smaller when raised to a power above 1 — so it pushed most of the
        // portrait under the minimum-dot floor instead of adding contrast.
        const pushed = Math.min(1, Math.max(0, (levelled - 0.5) * contrast + 0.5));
        const value = pushed * pushed * (3 - 2 * pushed);

        return {
          tx: c.tx,
          ty: c.ty,
          srcAlpha: c.srcAlpha,
          brightness: value,
          size: (minDotFraction + value * sizeSpan) * cell,
        };
      });

      // Scatter start positions — a wide dust field, not just the frame
      const pad = 60;
      pixels.forEach((p) => {
        p.startX = Math.random() * (width + pad * 2) - pad;
        p.startY = Math.random() * (height + pad * 2) - pad;
        p.rank = Math.random(); // random assembly order
      });

      const STAGGER_WINDOW = 0.7;
      const PER_PIXEL_MOVE = 900;
      const half = cell / 2;
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
          // Centre each dot in its cell so the grid stays even as dots grow.
          const x = p.startX + (p.tx + half - p.startX) * eased;
          const y = p.startY + (p.ty + half - p.startY) * eased;
          const size = p.size * eased;
          // Dark dots keep most of their opacity — shrinking them *and*
          // fading them erased shadow detail twice over. Capped below full
          // white (maxOpacity) so the brightest dots don't glare against a
          // dark page background.
          const alpha = (minOpacity + p.brightness * (maxOpacity - minOpacity)) * eased * p.srcAlpha;

          if (size < 0.3) return;
          ctx.fillStyle = `rgba(${tint[0]},${tint[1]},${tint[2]},${alpha})`;
          ctx.fillRect(x - size / 2, y - size / 2, size, size);
        });

        if (stillAnimating) animId = requestAnimationFrame(draw);
      };

      animId = requestAnimationFrame(draw);
    };

    return () => cancelAnimationFrame(animId);
  }, [src, width, height, cell, duration, contrast, minDotFraction, maxDotFraction, minOpacity, maxOpacity, tint]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={alt}
      style={{ display: 'block' }}
    />
  );
}
