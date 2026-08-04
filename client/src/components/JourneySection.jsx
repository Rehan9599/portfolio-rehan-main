import React from 'react';
import { motion } from 'framer-motion';

const AXIS_X = { start: 10, end: 980, y: 520 };
const AXIS_Y = { start: 40, end: 520, x: 10 };

const CURVE_PATH =
  'M150 480 C243 480,242 380,345 380 C448 380,447 280,550 280 C653 280,652 180,755 180 C858 180,857 80,960 80';

const MILESTONES = [
  {
    year: '2021',
    title: 'First lines of code',
    desc: 'Started with SoloLearn — HTML, CSS, and JavaScript, out of pure curiosity.',
    x: 150, y: 480,
  },
  {
    year: '2022',
    title: 'JEE + the CS fundamentals',
    desc: 'JEE prep alongside Python and SQL as a school subject — basics to intermediate.',
    x: 345, y: 380,
  },
  {
    year: '2024',
    title: 'Computer Engineering begins',
    desc: 'Started my B.Tech in Computer Engineering, set up GitHub, LinkedIn, and the rest.',
    x: 550, y: 280,
  },
  {
    year: '2025',
    title: 'DSA + MERN',
    desc: 'Deep into DSA on LeetCode, and building full-stack apps with the MERN stack.',
    x: 755, y: 180,
  },
  {
    year: '2026',
    title: 'Python + Machine Learning',
    desc: 'Shifting focus toward Python, ML, and shipping real projects.',
    x: 960, y: 80,
  },
];

const AXIS_DURATION = 0.6;
const CURVE_START_DELAY = AXIS_DURATION * 2; // y-axis, then x-axis, then curve begins
const CURVE_DURATION = 2;

export default function JourneySection({ journey}) {
  return (
    <section className="journey-section" id="journey">
      <div className="app-container">
        <div className="journey-route-wrap">
          <svg viewBox="0 0 1000 600" className="journey-route-svg" preserveAspectRatio="none">
            {/* Axis titles */}
            <text x={AXIS_X.start - 20} y={(AXIS_Y.start + AXIS_Y.end) / 2} className="journey-axis-title" transform={`rotate(-90, ${AXIS_X.start - 20}, ${(AXIS_Y.start + AXIS_Y.end) / 2})`}>
              EXPERIENCE →
            </text>
            <text x={(AXIS_X.start + AXIS_X.end) / 2} y={580} className="journey-axis-title" textAnchor="middle">
              TIMELINE →
            </text>

            {/* Y axis draws first */}
            <motion.line
              x1={AXIS_Y.x} y1={AXIS_Y.end} x2={AXIS_Y.x} y2={AXIS_Y.start}
              className="journey-axis-line"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: AXIS_DURATION, ease: 'easeOut' }}
            />

            {/* X axis draws second */}
            <motion.line
              x1={AXIS_X.start} y1={AXIS_X.y} x2={AXIS_X.end} y2={AXIS_X.y}
              className="journey-axis-line"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: AXIS_DURATION, ease: 'easeOut', delay: AXIS_DURATION }}
            />

            {/* Tick marks on x-axis */}
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

            {/* Growth curve draws last, after both axes */}
            <motion.path
              d={CURVE_PATH}
              className="journey-curve-line"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: CURVE_DURATION, ease: 'easeInOut', delay: CURVE_START_DELAY }}
            />
          </svg>

          {/* Points + callouts pop in progressively, timed to when the curve "reaches" them */}
          {journey.map((m, index) => {
            const pointDelay = CURVE_START_DELAY + (index / (journey.length - 1)) * CURVE_DURATION;
            return (
              <motion.div
                key={m.year}
                className="journey-milestone"
                style={{ left: `${(m.x / 1000) * 100}%`, top: `${(m.y / 600) * 100}%` }}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.35, delay: pointDelay }}
              >
                <div className="journey-milestone-dot" />
                <div className={`journey-milestone-label journey-milestone-label--upper-left`}>
                  <div className="journey-milestone-year">{m.year}</div>
                  <div className="journey-milestone-title">{m.title}</div>
                  <p className="journey-milestone-desc">{m.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}