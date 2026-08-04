import React from 'react';
import { motion } from 'framer-motion';

export default function AnimatedBackground() {
  return (
    <div 
      className="animated-bg-container"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        overflow: 'hidden',
        pointerEvents: 'none',
        backgroundColor: 'transparent'
      }}
    >
      {/* Subtle Cyber Grid */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0.03) 0%, transparent 70%),
            linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 48px 48px, 48px 48px',
          maskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, black 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, black 40%, transparent 100%)'
        }}
      />

      {/* Floating Glowing Orb 1 - Emerald Glow Top Left */}
      <motion.div
        animate={{
          x: [0, 80, -40, 0],
          y: [0, -60, 50, 0],
          scale: [1, 1.25, 0.9, 1]
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut'
        }}
        style={{
          position: 'absolute',
          top: '-10%',
          left: '10%',
          width: '550px',
          height: '550px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(244, 114, 182, 0.15) 0%, rgba(244, 114, 182, 0.05) 50%, transparent 70%)',
          filter: 'blur(70px)',
          opacity: 0.85
        }}
      />

      {/* Floating Glowing Orb 2 - Cyan Accent Top Right */}
      <motion.div
        animate={{
          x: [0, -70, 50, 0],
          y: [0, 80, -40, 0],
          scale: [1, 1.15, 0.95, 1]
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut'
        }}
        style={{
          position: 'absolute',
          top: '5%',
          right: '5%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(251, 191, 36, 0.12) 0%, rgba(251, 191, 36, 0.04) 50%, transparent 70%)',
          filter: 'blur(80px)',
          opacity: 0.75
        }}
      />

      {/* Floating Glowing Orb 3 - Deep Purple/Indigo Glow Bottom Center */}
      <motion.div
        animate={{
          x: [0, 60, -60, 0],
          y: [0, -50, -90, 0],
          scale: [1, 1.3, 0.85, 1]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut'
        }}
        style={{
          position: 'absolute',
          bottom: '10%',
          left: '30%',
          width: '650px',
          height: '650px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.14) 0%, rgba(168, 85, 247, 0.04) 50%, transparent 70%)',
          filter: 'blur(90px)',
          opacity: 0.7
        }}
      />

      {/* Floating Geometric Particle 1 */}
      <motion.div
        animate={{
          y: [0, -30, 0],
          rotate: [0, 180, 360],
          opacity: [0.3, 0.7, 0.3]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        style={{
          position: 'absolute',
          top: '25%',
          left: '15%',
          width: '40px',
          height: '40px',
          border: '1px solid rgba(34, 197, 94, 0.25)',
          borderRadius: '8px',
          backdropFilter: 'blur(4px)',
          transform: 'rotate(45deg)'
        }}
      />

      {/* Floating Geometric Particle 2 */}
      <motion.div
        animate={{
          y: [0, 40, 0],
          x: [0, -20, 0],
          rotate: [0, -180, -360],
          opacity: [0.2, 0.6, 0.2]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        style={{
          position: 'absolute',
          top: '65%',
          right: '18%',
          width: '50px',
          height: '50px',
          border: '1px dashed rgba(6, 182, 212, 0.3)',
          borderRadius: '50%',
          backdropFilter: 'blur(4px)'
        }}
      />

      {/* Floating Geometric Particle 3 - Ring */}
      <motion.div
        animate={{
          y: [0, -45, 0],
          scale: [0.9, 1.1, 0.9],
          opacity: [0.25, 0.5, 0.25]
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        style={{
          position: 'absolute',
          top: '80%',
          left: '8%',
          width: '60px',
          height: '60px',
          border: '1px solid rgba(139, 92, 246, 0.25)',
          borderRadius: '16px'
        }}
      />
    </div>
  );
}
