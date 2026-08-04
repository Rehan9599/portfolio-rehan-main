import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Shuffle } from 'lucide-react';
const Github = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);
const HAND_SIZE = 4;
const SHUFFLE_CARD_COUNT = 5;
const SHUFFLE_DURATION = 900;
const MOVE_DURATION = 500;
const COLLECT_DURATION = 400;

function shufflePool(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function fanTransform(index, total) {
  const spread = 14;
  const offsetX = 46;
  const mid = (total - 1) / 2;
  const diff = index - mid;
  return { rotate: diff * spread, x: diff * offsetX, y: Math.abs(diff) * 10 };
}

function ProjectDetailCard({ proj }) {
  const projId = proj.projectId || proj.id;
  return (
    <>
      {proj.image ? (
        <img src={proj.image} alt={`${proj.title} preview`} className="project-card-v3-image" />
      ) : (
        <div className="project-card-v3-image project-card-v3-image--placeholder" />
      )}
      <div className="project-card-v3-body">
        <div className="project-card-v3-top">
          <h3 className="project-card-v3-title">{proj.title}</h3>
          <div className="project-card-v3-links">
            {proj.github && (
              <a href={proj.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub repository">
                <Github size={14} />
              </a>
            )}
            {proj.link && (
              <a href={proj.link} target="_blank" rel="noopener noreferrer" aria-label="Live project">
                <ExternalLink size={14} />
              </a>
            )}
          </div>
        </div>
        <p className="project-card-v3-description">{proj.description}</p>
        <div className="project-card-tags">
          {proj.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="project-tag-pill">{tag}</span>
          ))}
        </div>
      </div>
    </>
  );
}

export default function ProjectsSection({ projects }) {
  const [pool, setPool] = useState(projects);
  const [hand, setHand] = useState([]);
  const [leftover, setLeftover] = useState([]);
  const [phase, setPhase] = useState('idle');
  const [hoveredLeftover, setHoveredLeftover] = useState(null);
  const hasStarted = useRef(false);

  const dealFrom = (sourcePool) => {
    setHand(sourcePool.slice(0, HAND_SIZE));
    setLeftover(sourcePool.slice(HAND_SIZE));
  };

  const runSequence = (sourcePool) => {
    setPhase('shuffling');
    setTimeout(() => {
      setPhase('moving');
      setTimeout(() => {
        const reshuffled = shufflePool(sourcePool);
        setPool(reshuffled);
        dealFrom(reshuffled);
        setPhase('dealt');
      }, MOVE_DURATION);
    }, SHUFFLE_DURATION);
  };

  const handleViewportEnter = () => {
    if (hasStarted.current) return;
    hasStarted.current = true;
    runSequence(pool);
  };

  const handleShuffleClick = () => {
    setPhase('collecting');
    setHand([]);
    setLeftover([]);
    setHoveredLeftover(null);
    setTimeout(() => runSequence(projects), COLLECT_DURATION);
  };

  const overlayActive = phase === 'shuffling' || phase === 'moving' || phase === 'collecting';
  const overlayDocked = phase === 'moving' || phase === 'dealt' || phase === 'collecting';

  return (
    <section className="projects-section" id="projects">
      <div className="app-container projects-inner">
        <div className="projects-header">
          <div>
            <h2 className="section-heading" style={{ marginBottom: 0 }}>Things I've built</h2>
          </div>
          <button onClick={handleShuffleClick} className="shuffle-arrow-btn" title="Shuffle projects">
            <Shuffle size={18} />
          </button>
        </div>

        <motion.div
          className="projects-layout"
          onViewportEnter={handleViewportEnter}
          viewport={{ once: true, amount: 0.4 }}
        >
          {overlayActive && (
            <div className={`shuffle-overlay ${overlayDocked ? 'shuffle-overlay--docked' : ''}`}>
              {Array.from({ length: SHUFFLE_CARD_COUNT }).map((_, i) => (
                <motion.div
                  key={i}
                  className="deck-card-back"
                  style={{ '--stack-i': i, zIndex: SHUFFLE_CARD_COUNT - i }}
                  animate={
                    phase === 'shuffling'
                      ? {
                          x: [0, i % 2 === 0 ? -22 : 22, 0, i % 2 === 0 ? 14 : -14, 0],
                          rotate: [0, i % 2 === 0 ? -9 : 9, 0, i % 2 === 0 ? 5 : -5, 0],
                        }
                      : { x: 0, rotate: 0 }
                  }
                  transition={{ duration: SHUFFLE_DURATION / 1000, ease: 'easeInOut' }}
                />
              ))}
            </div>
          )}

          <div className="projects-deck-col">
            <div className="deck-pile-static">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="deck-card-back" style={{ '--stack-i': i }} />
              ))}
            </div>

            {phase === 'dealt' && leftover.length > 0 && (
              <div className="hand-fan-left">
                <AnimatePresence>
                  {leftover.map((proj, index) => {
                    const projId = proj.projectId || proj.id;
                    const { rotate, x, y } = fanTransform(index, leftover.length);
                    return (
                      <motion.div
                        key={proj.title}
                        className="fan-card-left"
                        initial={{ opacity: 0, y: -160, rotate: 0, scale: 0.7 }}
                        animate={{ opacity: 1, x, y, rotate, scale: 1 }}
                        transition={{ duration: 0.4, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                        onMouseEnter={() => setHoveredLeftover(proj)}
                        onMouseLeave={() => setHoveredLeftover(null)}
                      >
                        {proj.image ? (
                          <img src={proj.image} alt={`${proj.title} preview`} className="project-card-v3-image" />
                        ) : (
                          <div className="project-card-v3-image project-card-v3-image--placeholder" />
                        )}
                        <h4 className="fan-card-title">{proj.title}</h4>
                        <div className="project-card-tags">
                          {proj.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className="project-tag-pill">{tag}</span>
                          ))}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}

            <AnimatePresence>
              {hoveredLeftover && (
                <motion.div
                  key={hoveredLeftover.title}
                  className="project-card-v3 leftover-preview-popup"
                  initial={{ opacity: 0, scale: 0.92, x: -10 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.92, x: -10 }}
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  onMouseEnter={() => setHoveredLeftover(hoveredLeftover)}
                  onMouseLeave={() => setHoveredLeftover(null)}
                >
                  <ProjectDetailCard proj={hoveredLeftover} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="projects-hand-col">
            <AnimatePresence>
              {phase === 'dealt' && hand.map((proj, index) => (
                <motion.div
                  key={proj.title}
                  className="project-card-v3"
                  initial={{ opacity: 0, x: -140, scale: 0.85 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -140, scale: 0.85 }}
                  transition={{ duration: 0.45, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -4, scale: 1.015 }}
                >
                  <ProjectDetailCard proj={proj} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}