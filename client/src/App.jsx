import React from 'react';
import usePortfolioData from './hooks/usePortfolioData';
import AnimatedBackground from './components/AnimatedBackground';
import Navbar from './components/Navbar';
import HeroBento from './components/HeroBento';
import ProjectsSection from './components/ProjectsSection';
import SkillsSection from './components/SkillsSection';
import CertificatesSection from './components/CertificatesSection';
import JourneySection from './components/JourneySection';
import ContactSection from './components/ContactSection';
import ContactDock from './components/ContactDock';
import GlobalInteractionSound from './components/GlobalInteractionSound';
import CursorTrail from './components/CursorTrail';
import TerminalBoot from './components/TerminalBoot';
import { useState } from 'react';
import { SectionScrollProvider, SectionTrack } from './components/SectionScrollContext';

const SECTION_IDS = ['about', 'projects', 'skills', 'certificates', 'journey', 'contact'];




function LoadingScreen() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-color)',
      gap: '1.5rem'
    }}>
      <div style={{
        width: '52px',
        height: '52px',
        border: '3px solid rgba(255,255,255,0.1)',
        borderTopColor: 'var(--primary-accent)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.95rem',
        color: 'var(--text-muted)'
      }}>
        Initializing portfolio...
      </span>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function ErrorScreen({ message }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-color)',
      gap: '1.25rem',
      padding: '0 1.5rem'
    }}>
      <div style={{
        width: '60px',
        height: '60px',
        borderRadius: '1.25rem',
        background: 'rgba(239, 68, 68, 0.12)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        color: '#ef4444',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.75rem',
        fontWeight: 'bold'
      }}>!</div>
      <h2 style={{ color: '#ffffff', fontSize: '1.4rem' }}>Connection Notice</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '450px', textAlign: 'center', lineHeight: '1.6' }}>
        {message || 'Unable to fetch data from the server. Please check your backend connection.'}
      </p>
      <button
        onClick={() => window.location.reload()}
        style={{
          marginTop: '0.5rem',
          padding: '0.75rem 1.75rem',
          borderRadius: '0.75rem',
          background: 'var(--surface-color)',
          border: '1px solid var(--border-color)',
          color: 'var(--primary-accent)',
          cursor: 'pointer',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.9rem',
          fontWeight: '600',
          transition: 'all 0.2s ease'
        }}
      >
        Reload Page
      </button>
    </div>
  );
}

export default function App() {
  const { data, loading, error } = usePortfolioData();
  const [bootDone, setBootDone] = useState(false);
  
    if (!bootDone) {
      return <TerminalBoot onComplete={() => setBootDone(true)} />;
    }

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen message={error} />;

  const { personalInfo, projects, skills, certificates, journey, journeyText } = data;

  return (
    <SectionScrollProvider sectionIds={SECTION_IDS}>
      <div className="portfolio-app">
        <CursorTrail />
        <GlobalInteractionSound />
        <AnimatedBackground />
        <ContactDock personalInfo={personalInfo} />
        <Navbar personalInfo={personalInfo} />
        <main>
          <SectionTrack>
            <HeroBento personalInfo={personalInfo} projects={projects}/>
            <ProjectsSection projects={projects} />
            <SkillsSection skills={skills} />
            <CertificatesSection certificates={certificates} />
            <JourneySection journey={journey} />
            <ContactSection personalInfo={personalInfo} />
          </SectionTrack>
        </main>
      </div>
    </SectionScrollProvider>
  );
}
