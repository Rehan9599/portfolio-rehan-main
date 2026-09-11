import React, { useCallback, useEffect, useState } from 'react';

const COMMAND = 'whoami';
const TYPE_SPEED = 90;        // ms per character
const OUTPUT_DELAY = 400;     // pause after typing finishes, before output prints
const HOLD_AFTER_OUTPUT = 700; // how long the output stays visible before handing off
const SEEN_KEY = 'rehan.dev:booted';

// A returning visitor in the same tab session has already watched this, and a
// reduced-motion visitor has asked not to. Both go straight to the site.
export function shouldPlayBoot() {
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    return sessionStorage.getItem(SEEN_KEY) !== '1';
  } catch {
    return true;
  }
}

export default function TerminalBoot({ username = 'rehan-fazal', onComplete }) {
  const [typed, setTyped] = useState('');
  const [showOutput, setShowOutput] = useState(false);
  const [exiting, setExiting] = useState(false);

  const finish = useCallback(() => {
    try {
      sessionStorage.setItem(SEEN_KEY, '1');
    } catch {
      // Blocked storage just means the intro replays next visit.
    }
    onComplete();
  }, [onComplete]);

  const skip = useCallback(() => {
    setExiting(true);
    setTimeout(finish, 200);
  }, [finish]);

  useEffect(() => {
    let i = 0;
    const typeTimer = setInterval(() => {
      i += 1;
      setTyped(COMMAND.slice(0, i));
      if (i === COMMAND.length) {
        clearInterval(typeTimer);
        setTimeout(() => setShowOutput(true), OUTPUT_DELAY);
      }
    }, TYPE_SPEED);

    return () => clearInterval(typeTimer);
  }, []);

  useEffect(() => {
    if (!showOutput) return;
    const holdTimer = setTimeout(() => {
      setExiting(true);
      setTimeout(finish, 400); // must match .terminal-boot's CSS transition duration
    }, HOLD_AFTER_OUTPUT);
    return () => clearTimeout(holdTimer);
  }, [showOutput, finish]);

  // Any key or click gets past the intro immediately.
  useEffect(() => {
    window.addEventListener('keydown', skip);
    window.addEventListener('pointerdown', skip);
    return () => {
      window.removeEventListener('keydown', skip);
      window.removeEventListener('pointerdown', skip);
    };
  }, [skip]);

  return (
    <div className={`terminal-boot ${exiting ? 'is-exiting' : ''}`} role="status" aria-live="polite">
      <div className="terminal-boot-window">
        <div className="terminal-boot-titlebar">
          <span className="terminal-dot terminal-dot-red" />
          <span className="terminal-dot terminal-dot-yellow" />
          <span className="terminal-dot terminal-dot-green" />
        </div>
        <div className="terminal-boot-body">
          <div className="terminal-line">
            <span className="terminal-prompt">~/rehan-fazal $</span> {typed}
            {!showOutput && <span className="terminal-cursor">|</span>}
          </div>
          {showOutput && <div className="terminal-line terminal-output">{username}</div>}
        </div>
      </div>
      <button type="button" className="terminal-boot-skip" onClick={skip}>
        skip intro →
      </button>
    </div>
  );
}
