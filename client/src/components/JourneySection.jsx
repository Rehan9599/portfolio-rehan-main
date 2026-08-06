import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '../hooks/useIsMobile';

const AXIS_X = { start: 10, end: 980, y: 520 };
const AXIS_Y = { start: 40, end: 520, x: 10 };

const CURVE_PATH =
  'M150 480 C243 480,242 380,345 380 C448 380,447 280,550 280 C653 280,652 180,755 180 C858 180,857 80,960 80';

const AXIS_DURATION = 0.6;
const CURVE_START_DELAY = AXIS_DURATION * 2;
const CURVE_DURATION = 2;

const MOBILE_HOLD_MS = 2200;
const MOBILE_GAP_MS = 500;

export default function JourneySection({ journey }) {
  const isMobile = useIsMobile(900);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!isMobile) return;
    let timer;
    let idx = 0;
    let showing = true;

    const tick = () => {
      if (showing) {
        timer = setTimeout(() => {
          showing = false;
          setActiveIndex(-1);
          tick();
        }, MOBILE_HOLD_MS);
      } else {
        timer = setTimeout(() => {
          idx = (idx + 1) % journey.length;
          showing = true;
          setActiveIndex(idx);
          tick();
        }, MOBILE_GAP_MS);
      }
    };

    setActiveIndex(0);
    tick();
    return () => clearTimeout(timer);
  }, [isMobile, journey.length]);

  return (
    <section className="journey-section" id="journey">
      <div className="app-container">
        <div className="journey-route-wrap">
          <svg viewBox="0 0 1000 600" className="journey-route-svg" preserveAspectRatio="none">
            <text x={AXIS_X.start - 20} y={(AXIS_Y.start + AXIS_Y.end) / 2} className="journey-axis-title" transform={`rotate(-90, ${AXIS_X.start - 20}, ${(AXIS_Y.start + AXIS_Y.end) / 2})`}>
              EXPERIENCE →
            </text>
            <text x={(AXIS_X.start + AXIS_X.end) / 2} y={580} className="journey-axis-title" textAnchor="middle">
              TIMELINE →
            </text>

            <motion.line
              x1={AXIS_Y.x} y1={AXIS_Y.end} x2={AXIS_Y.x} y2={AXIS_Y.start}
              className="journey-axis-line"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: AXIS_DURATION, ease: 'easeOut' }}
            />

            <motion.line
              x1={AXIS_X.start} y1={AXIS_X.y} x2={AXIS_X.end} y2={AXIS_X.y}
              className="journey-axis-line"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: AXIS_DURATION, ease: 'easeOut', delay: AXIS_DURATION }}
            />

            {journey.map((m, i) => (
              <motion.g
                key={`tick-${m.year}`}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.3, delay: AXIS_DURATION * 2 + i * 0.05 }}
              >
                <line x1={m.x} y1={AXIS_X.y} x2={m.x} y2={AXIS_X.y + 8} className="journey-tick-line" />
                <text x={m.x} y={AXIS_X.y + 26} className="journey-tick-label" textAnchor="middle">
                  {m.year}
                </text>
              </motion.g>
            ))}

            <motion.path
              d={CURVE_PATH}
              className="journey-curve-line"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: CURVE_DURATION, ease: 'easeInOut', delay: CURVE_START_DELAY }}
            />
          </svg>

          {journey.map((m, index) => {
            const pointDelay = CURVE_START_DELAY + (index / (journey.length - 1)) * CURVE_DURATION;
            const isActive = isMobile ? activeIndex === index : true;

            return (
              <motion.div
                key={m.year}
                className="journey-milestone"
                style={{ left: `${(m.x / 1000) * 100}%`, top: `${(m.y / 600) * 100}%` }}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.35, delay: isMobile ? 0 : pointDelay }}
              >
                <motion.div
                  className="journey-milestone-dot"
                  animate={isMobile ? { scale: isActive ? 1.3 : 1 } : {}}
                  transition={{ duration: 0.3 }}
                />
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      className="journey-milestone-label journey-milestone-label--upper-left"
                      initial={{ opacity: 0, y: isMobile ? 6 : 0 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: isMobile ? 6 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="journey-milestone-year">{m.year}</div>
                      <div className="journey-milestone-title">{m.title}</div>
                      <p className="journey-milestone-desc">{m.desc}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}