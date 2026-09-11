import React, { useEffect, useRef, useState } from 'react';
import { Mail, Sparkles, Menu, X, Volume2, VolumeX } from 'lucide-react';
import { useSectionScroll } from './SectionScrollContext';
import { useMobilePager } from './MobileSectionPager';
import { useIsMobile } from '../hooks/useIsMobile';
import { useSoundPreference } from '../hooks/useSoundPreference';

export default function Navbar({ personalInfo }) {
   const isMobile = useIsMobile(900);
  const desktopCtx = useSectionScroll();
  const mobileCtx = useMobilePager();
  const { activeId, goToId } = isMobile && mobileCtx ? mobileCtx : desktopCtx;
  const navRef = useRef(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [soundOn, toggleSound] = useSoundPreference();

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
          className="nav-sound-toggle"
          onClick={toggleSound}
          aria-label={soundOn ? 'Mute interface sounds' : 'Enable interface sounds'}
          aria-pressed={soundOn}
          title={soundOn ? 'Sound on' : 'Sound off'}
        >
          {soundOn ? <Volume2 size={17} /> : <VolumeX size={17} />}
        </button>

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