import React, { useEffect, useRef, useState } from 'react';
import { Mail, Sparkles, Menu, X } from 'lucide-react';
import { useSectionScroll } from './SectionScrollContext';

export default function Navbar({ personalInfo }) {
  const { activeId, goToId } = useSectionScroll();
  const navRef = useRef(null);
  const [mobileOpen, setMobileOpen] = useState(false);

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

  const handleNav = (id) => {
    goToId(id);
    setMobileOpen(false);
  };

  const link = (id, label) => (
    <button className={`nav-btn ${activeId === id ? 'is-active' : ''}`} onClick={() => handleNav(id)}>
      {label}
    </button>
  );

  return (
    <header className="navbar" ref={navRef}>
      <div className="navbar-inner">
        <button className="brand-logo" onClick={() => handleNav('about')}>
          <Sparkles size={18} color="var(--accent)" />
          rehan<span className="brand-dot">.dev</span>
        </button>

        <nav className={`nav-links ${mobileOpen ? 'is-open' : ''}`}>
          {link('about', 'The Me')}
          {link('projects', 'Projects')}
          {link('skills', 'Skills')}
          {link('certificates', 'Certificates')}
          {link('journey', 'Journey')}
          <button className="nav-btn nav-btn-cta" onClick={() => handleNav('contact')}>
            <Mail size={14} /> Contact
          </button>
        </nav>

        <button
          className="nav-hamburger"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  );
}