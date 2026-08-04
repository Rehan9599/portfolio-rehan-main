import React, { useEffect, useRef } from 'react';
import { Mail, Sparkles } from 'lucide-react';
import { useSectionScroll } from './SectionScrollContext';

export default function Navbar({ personalInfo }) {
  const { activeId, goToId } = useSectionScroll();
  const navRef = useRef(null);

  useEffect(() => {
    const setHeightVar = () => {
      if (navRef.current) {
        document.documentElement.style.setProperty('--navbar-height', `${navRef.current.offsetHeight}px`);
      }
    };
    setHeightVar();
    const observer = new ResizeObserver(setHeightVar);
    if (navRef.current) observer.observe(navRef.current);
    return () => observer.disconnect();
  }, []);

  const link = (id, label) => (
    <button
      className={`nav-btn ${activeId === id ? 'is-active' : ''}`}
      onClick={() => goToId(id)}
    >
      {label}
    </button>
  );

  return (
    <header className="navbar" ref={navRef}>
      <div className="navbar-inner">
        <button className="brand-logo" onClick={() => goToId('about')}>
          <Sparkles size={18} color="var(--accent)" />
          rehan<span className="brand-dot">.dev</span>
        </button>

        <nav className="nav-links">
          {link('about', 'The Me')}
          {link('projects', 'Projects')}
          {link('skills', 'Skills')}
          {link('certificates', 'Certificates')}
          {link('journey', 'Journey')}
          <button className="nav-btn nav-btn-cta" onClick={() => goToId('contact')}>
            <Mail size={14} /> Contact
          </button>
        </nav>
      </div>
    </header>
  );
}