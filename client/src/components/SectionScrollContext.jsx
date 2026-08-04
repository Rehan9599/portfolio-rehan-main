import React, { createContext, useContext, useEffect, useState, Children } from 'react';

const SectionScrollContext = createContext(null);

export function SectionScrollProvider({ children, sectionIds }) {
  const [activeId, setActiveId] = useState(sectionIds[0]);

  useEffect(() => {
    const handleScroll = () => {
      const triggerLine = window.innerHeight * 0.4;
      let current = sectionIds[0];

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= triggerLine) current = id;
      }

      setActiveId(current);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionIds]);

// SectionScrollContext.jsx — only goToId changes
const goToId = (id) => {
  const el = document.getElementById(id);
  if (!el) return;

  const wrapper = el.closest('.stack-wrapper') || el;
  const targetY = wrapper.getBoundingClientRect().top + window.scrollY;

  window.scrollTo({ top: targetY, behavior: 'smooth' });
  el.scrollTop = 0; // defensive: clears any leftover internal overflow-scroll on the section itself
};

  return (
    <SectionScrollContext.Provider value={{ activeId, goToId }}>
      {children}
    </SectionScrollContext.Provider>
  );
}

export function SectionTrack({ children }) {
  const items = Children.toArray(children);
  const total = items.length;

  return (
    <>
      {items.map((child, index) => {
        const isLast = index === total - 1;
        const zIndex = total - index; // earlier sections stay on top while departing — covers what's next

        return (
          <div className="stack-wrapper" style={{ height: isLast ? '100vh' : '200vh' }} key={index}>
            <div className="stack-section" style={{ zIndex }}>
              {child}
            </div>
          </div>
        );
      })}
    </>
  );
}

export function useSectionScroll() {
  const ctx = useContext(SectionScrollContext);
  if (!ctx) throw new Error('useSectionScroll must be used within SectionScrollProvider');
  return ctx;
}