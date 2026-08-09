import React, { createContext, useContext, useRef, useState, useEffect, Children } from 'react';
import Lenis from 'lenis';

const MobilePagerContext = createContext(null);
export function useMobilePager() {
  return useContext(MobilePagerContext);
}

const SWIPE_THRESHOLD_PX = 40;
const TRANSITION_MS = 450;
const EDGE_EPSILON = 0.02;

export function MobilePagerProvider({ children, sectionIds }) {
  const [index, setIndex] = useState(0);
  const lockedRef = useRef(false);

  const goTo = (next) => {
    const clamped = Math.max(0, Math.min(sectionIds.length - 1, next));
    if (clamped === index || lockedRef.current) return;
    lockedRef.current = true;
    setIndex(clamped);
    setTimeout(() => { lockedRef.current = false; }, TRANSITION_MS);
  };

  const goToId = (id) => {
    const i = sectionIds.indexOf(id);
    if (i !== -1) goTo(i);
  };

  return (
    <MobilePagerContext.Provider value={{ activeId: sectionIds[index], index, goTo, goToId, lockedRef }}>
      {children}
    </MobilePagerContext.Provider>
  );
}

function MobilePage({ children, active, onAdvance, onRetreat, lockedRef }) {
  const scrollRef = useRef(null);
  const progressRef = useRef(0);
  const touchStartY = useRef(null);

  useEffect(() => {
    if (!active || !scrollRef.current) return;

    const lenis = new Lenis({
      wrapper: scrollRef.current,
      content: scrollRef.current.firstElementChild,
      duration: 1.0,
      touchMultiplier: 1,
    });

    lenis.on('scroll', ({ progress }) => { progressRef.current = progress; });

    let rafId;
    const raf = (time) => { lenis.raf(time); rafId = requestAnimationFrame(raf); };
    rafId = requestAnimationFrame(raf);

    return () => { cancelAnimationFrame(rafId); lenis.destroy(); };
  }, [active]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !active) return;

    const onStart = (e) => { touchStartY.current = e.touches[0].clientY; };

    const onEnd = (e) => {
      if (lockedRef.current || touchStartY.current === null) return;
      const deltaY = touchStartY.current - e.changedTouches[0].clientY;
      touchStartY.current = null;
      if (Math.abs(deltaY) < SWIPE_THRESHOLD_PX) return;

      const atBottom = progressRef.current >= 1 - EDGE_EPSILON;
      const atTop = progressRef.current <= EDGE_EPSILON;

      if (deltaY > 0 && atBottom) onAdvance();
      else if (deltaY < 0 && atTop) onRetreat();
    };

    el.addEventListener('touchstart', onStart, { passive: true });
    el.addEventListener('touchend', onEnd, { passive: true });
    return () => {
      el.removeEventListener('touchstart', onStart);
      el.removeEventListener('touchend', onEnd);
    };
  }, [active, onAdvance, onRetreat, lockedRef]);

  return (
    <div ref={scrollRef} className="mobile-pager-page">
      <div className="mobile-pager-page-inner">{children}</div>
    </div>
  );
}

export function MobilePagerTrack({ children }) {
  const ctx = useMobilePager();
  if (!ctx) throw new Error('MobilePagerTrack must be used within MobilePagerProvider');
  const { index, goTo, lockedRef } = ctx;
  const pages = Children.toArray(children);

  return (
    <div className="mobile-pager-viewport">
      <div className="mobile-pager-track" style={{ transform: `translateX(-${index * 100}%)` }}>
        {pages.map((page, i) => (
          <MobilePage key={i} active={i === index} onAdvance={() => goTo(i + 1)} onRetreat={() => goTo(i - 1)} lockedRef={lockedRef}>
            {page}
          </MobilePage>
        ))}
      </div>
    </div>
  );
}