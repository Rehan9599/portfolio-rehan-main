import React, { createContext, useContext, useEffect, useRef, useState, Children } from 'react';

const MobilePagerContext = createContext(null);
export function useMobilePager() {
  return useContext(MobilePagerContext);
}

const SWIPE_ADVANCE_PX = 70; // how far you must keep pulling past the edge to trigger a page change
const TRANSITION_MS = 450;   // must match .mobile-pager-track's CSS transition duration

function MobilePage({ children, onAdvance, onRetreat, lockedRef }) {
  const scrollRef = useRef(null);
  const state = useRef({ startY: 0, mode: null, overscroll: 0 });

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onStart = (e) => {
      state.current.startY = e.touches[0].clientY;
      state.current.mode = null;
      state.current.overscroll = 0;
    };

    const onMove = (e) => {
      if (lockedRef.current) return;
      const y = e.touches[0].clientY;
      const deltaY = state.current.startY - y; // positive = finger moving up = wants to scroll further down

      const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight <= 1;
      const atTop = el.scrollTop <= 1;

      if (deltaY > 0 && atBottom) {
        state.current.mode = 'advance';
        state.current.overscroll = deltaY;
        e.preventDefault(); // stop native bounce, take over the gesture ourselves
      } else if (deltaY < 0 && atTop) {
        state.current.mode = 'retreat';
        state.current.overscroll = -deltaY;
        e.preventDefault();
      } else {
        state.current.mode = null; // normal scroll — let the browser handle it
      }
    };

    const onEnd = () => {
      if (state.current.overscroll > SWIPE_ADVANCE_PX) {
        if (state.current.mode === 'advance') onAdvance();
        if (state.current.mode === 'retreat') onRetreat();
      }
      state.current.overscroll = 0;
      state.current.mode = null;
    };

    // Attached natively (not via JSX props) with passive:false — required so
    // e.preventDefault() reliably works; some React versions default touch
    // listeners to passive:true, which would silently ignore preventDefault.
    el.addEventListener('touchstart', onStart, { passive: true });
    el.addEventListener('touchmove', onMove, { passive: false });
    el.addEventListener('touchend', onEnd, { passive: true });

    return () => {
      el.removeEventListener('touchstart', onStart);
      el.removeEventListener('touchmove', onMove);
      el.removeEventListener('touchend', onEnd);
    };
  }, [onAdvance, onRetreat, lockedRef]);

  return (
    <div ref={scrollRef} className="mobile-pager-page">
      {children}
    </div>
  );
}

export default function MobileSectionPager({ children, sectionIds }) {
  const pages = Children.toArray(children);
  const [index, setIndex] = useState(0);
  const lockedRef = useRef(false);

  const goTo = (next) => {
    const clamped = Math.max(0, Math.min(pages.length - 1, next));
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
    <MobilePagerContext.Provider value={{ activeId: sectionIds[index], goToId }}>
      <div className="mobile-pager-viewport">
        <div className="mobile-pager-track" style={{ transform: `translateX(-${index * 100}%)` }}>
          {pages.map((page, i) => (
            <MobilePage
              key={i}
              onAdvance={() => goTo(i + 1)}
              onRetreat={() => goTo(i - 1)}
              lockedRef={lockedRef}
            >
              {page}
            </MobilePage>
          ))}
        </div>
      </div>
    </MobilePagerContext.Provider>
  );
}