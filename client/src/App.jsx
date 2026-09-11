import { useState } from 'react';
import TerminalBoot, { shouldPlayBoot } from './components/TerminalBoot';
import CursorTrail from './components/CursorTrail';
import GlobalInteractionSound from './components/GlobalInteractionSound';
import ContactDock from './components/ContactDock';
import Navbar from './components/Navbar';
import { SectionScrollProvider, SectionTrack } from './components/SectionScrollContext';
import {MobilePagerProvider, MobilePagerTrack } from './components/MobileSectionPager';
import HeroBento from './components/HeroBento';
import ProjectsSection from './components/ProjectsSection';
import SkillsSection from './components/SkillsSection';
import CertificatesSection from './components/CertificatesSection';
import JourneySection from './components/JourneySection';
import ContactSection from './components/ContactSection';
import usePortfolioData from './hooks/usePortfolioData';
import { useIsMobile } from './hooks/useIsMobile';
import AnimatedBackground from './components/AnimatedBackground';

const SECTION_IDS = ['about', 'projects', 'skills', 'certificates', 'journey', 'contact'];

export default function App() {
  const { data } = usePortfolioData();
  const [bootDone, setBootDone] = useState(() => !shouldPlayBoot());
  const isMobile = useIsMobile(900);

  if (!bootDone) {
    return <TerminalBoot onComplete={() => setBootDone(true)} />;
  }

  const { personalInfo, projects, skills, certificates, journey } = data;

  // Plain array, NOT a Fragment (<>...</>) — Children.toArray, used inside
  // both SectionTrack and MobileSectionPager, does not flatten Fragments.
  // An array of 6 elements gives both a real count of 6; a Fragment gave
  // them a count of 1, which was the root cause of both the desktop
  // stuck-on-Hero bug and the mobile no-horizontal-slide bug.
  const sections = [
    <HeroBento key="about" personalInfo={personalInfo} projects={projects} />,
    <ProjectsSection key="projects" projects={projects} />,
    <SkillsSection key="skills" skills={skills} />,
    <CertificatesSection key="certificates" certificates={certificates} />,
    <JourneySection key="journey" journey={journey} />,
    <ContactSection key="contact" personalInfo={personalInfo} />,
  ];

  return (
     <SectionScrollProvider sectionIds={SECTION_IDS}>
      <MobilePagerProvider sectionIds={SECTION_IDS}>
        <div className="portfolio-app">
          <CursorTrail />
          {/* <AnimatedBackground /> */}
          <GlobalInteractionSound />
          <ContactDock personalInfo={personalInfo} />
          <Navbar personalInfo={personalInfo} />
          <a className="skip-to-content" href="#main-content">Skip to content</a>
          <main id="main-content">
            {isMobile
              ? <MobilePagerTrack>{sections}</MobilePagerTrack>
              : <SectionTrack>{sections}</SectionTrack>}
          </main>
        </div>
      </MobilePagerProvider>
    </SectionScrollProvider>
  );
}