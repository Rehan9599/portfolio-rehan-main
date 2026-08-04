import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Mail, GraduationCap, ArrowUpRight, Brain, Cpu } from 'lucide-react';
import PixelPortrait from '../components/PixelPortrait';
import rehanPhoto from '../assets/rehan.png';

const GithubIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const TECH_TRAIL_ICONS = [
  { slug: 'react', name: 'React' },
  { slug: 'nodedotjs', name: 'Node.js' },
  { slug: 'express', name: 'Express' },
  { slug: 'mongodb', name: 'MongoDB' },
  { slug: 'python', name: 'Python' },
  { slug: 'cplusplus', name: 'C++' },
  { slug: 'git', name: 'Git' },
  { slug: 'postgresql', name: 'PostgreSQL' },
];

function useTypewriter(words, { typingSpeed = 75, deletingSpeed = 40, pauseTime = 1400 } = {}) {
  const [text, setText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex % words.length];
    let timeout;

    if (!deleting && text.length < currentWord.length) {
      timeout = setTimeout(() => setText(currentWord.slice(0, text.length + 1)), typingSpeed);
    } else if (!deleting && text.length === currentWord.length) {
      timeout = setTimeout(() => setDeleting(true), pauseTime);
    } else if (deleting && text.length > 0) {
      timeout = setTimeout(() => setText(currentWord.slice(0, text.length - 1)), deletingSpeed);
    } else if (deleting && text.length === 0) {
      setDeleting(false);
      setWordIndex((i) => i + 1);
    }

    return () => clearTimeout(timeout);
  }, [text, deleting, wordIndex, words, typingSpeed, deletingSpeed, pauseTime]);

  return text;
}

function BioText({ text }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bio-wrapper" onMouseEnter={() => setExpanded(true)} onMouseLeave={() => setExpanded(false)}>
      <p className="bio-text">{text}</p>
      {expanded && (
        <div className="bio-expanded">
          <p>{text}</p>
        </div>
      )}
    </div>
  );
}

const bentoContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const bentoItemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export default function HeroBento({ personalInfo, projects = [] }) {
  const roles = personalInfo.roles || ['MERN Developer', 'DSA Enthusiast', 'AI/ML Explorer', 'Web Design Lover'];
  const typedRole = useTypewriter(roles);

  const featuredProject = useMemo(
    () => projects.find((p) => p.featured) || projects[0] || null,
    [projects]
  );

  const githubUsername = useMemo(() => {
    if (!personalInfo.github) return null;
    const match = personalInfo.github.match(/github\.com\/([^/]+)/i);
    return match ? match[1] : null;
  }, [personalInfo.github]);

  return (
    <section className="hero-section" id="about">
      <div className="app-container hero-layout-v2">

        <div className="hero-left-col">
          <motion.blockquote
            className="hero-quote-big"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {personalInfo.quote}
          </motion.blockquote>

          <motion.div
            className="hero-portrait-block"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <PixelPortrait
              src={rehanPhoto}
              width={280}
              height={340}
              cell={4}
              duration={2200}
              contrast={1.6}
              minDotFraction={0.22}
              alt="Portrait of Rehan Fazal"
            />
          </motion.div>

          <motion.div
            className="hero-identity-block"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <span className="hero-eyebrow">Hi, I am</span>
            <h1 className="hero-name-big">{personalInfo.name}</h1>
            <div className="typewriter-role">
              {typedRole}
              <span className="typewriter-cursor">|</span>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="hero-bento-grid"
          variants={bentoContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Row 1, col 1: about/bio */}
          <motion.div variants={bentoItemVariants} className="bento-cell bento-about">
            <BioText text={personalInfo.role} />
            <div className="hero-actions">
              <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                <GithubIcon size={16} /> GitHub <ArrowUpRight size={12} opacity={0.6} />
              </a>
              <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                <LinkedinIcon size={16} /> LinkedIn <ArrowUpRight size={12} opacity={0.6} />
              </a>
              <a href="#contact" className="btn btn-primary">
                <Mail size={16} /> Say hi <ArrowUpRight size={12} opacity={0.6} />
              </a>
            </div>
          </motion.div>

          {/* Row 1, col 2: featured project */}
          <motion.div variants={bentoItemVariants} className="bento-cell bento-featured">
            {featuredProject ? (
              <>
                <div className="featured-label">Featured project</div>
                {featuredProject.image ? (
                  <img
                    src={featuredProject.image}
                    alt={`${featuredProject.title} preview`}
                    className="featured-thumb"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                ) : (
                  <div className="featured-thumb featured-thumb--placeholder" />
                )}
                <div className="featured-title">{featuredProject.title}</div>
                <div className="featured-tags">{featuredProject.tags?.slice(0, 3).join(' · ')}</div>
              </>
            ) : (
              <div className="featured-label">Add a project to feature it here</div>
            )}
          </motion.div>

          <motion.div variants={bentoItemVariants} className="bento-cell bento-edu">
            <div className="bento-edu-icon">
              <GraduationCap size={30} />
            </div>
            <div className="bento-edu-text">
              <div className="bento-edu-university">{personalInfo.university}</div>
              <span className="bento-edu-degree">B.Tech Computer Engineering</span>
            </div>
          </motion.div>

          {/* Row 2, col 1: current focus */}
          <motion.div variants={bentoItemVariants} className="bento-cell bento-focus">
            <div className="focus-icons">
              <Brain size={20} />
              <Cpu size={20} />
            </div>
            <div className="focus-text">
              {personalInfo.currentFocus || 'Diving deep into Machine Learning & Data Structures — personalize this line'}
            </div>
          </motion.div>

          {/* Row 2, col 2: skills trail (looping marquee) */}
          <motion.div variants={bentoItemVariants} className="bento-cell bento-trail">
            <div className="skills-trail-track">
              {[...TECH_TRAIL_ICONS, ...TECH_TRAIL_ICONS].map((tech, i) => (
                <div key={`${tech.slug}-${i}`} className="tech-stack-icon" title={tech.name}>
                  <img
                    src={`https://cdn.simpleicons.org/${tech.slug}/ffffff`}
                    alt={tech.name}
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Row 3: GitHub activity, full width */}
          <motion.div variants={bentoItemVariants} className="bento-cell bento-github">
            <div className="bento-github-label">GitHub activity</div>
            {githubUsername ? (
              <img
                src={`https://ghchart.rshah.org/FF7A00/${githubUsername}`}
                alt={`${githubUsername}'s GitHub contribution graph`}
                className="github-activity-graph"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            ) : (
              <span className="bento-stat-label">Add your GitHub link to show activity</span>
            )}
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}