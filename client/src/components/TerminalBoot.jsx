import React, { useEffect, useState } from 'react';

const COMMAND = 'whoami';
const TYPE_SPEED = 90;        // ms per character
const OUTPUT_DELAY = 400;     // pause after typing finishes, before output prints
const HOLD_AFTER_OUTPUT = 700; // how long the output stays visible before handing off

export default function TerminalBoot({ username = 'rehan-fazal', onComplete }) {
  const [typed, setTyped] = useState('');
  const [showOutput, setShowOutput] = useState(false);
  const [exiting, setExiting] = useState(false);

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
      setTimeout(onComplete, 400); // must match .terminal-boot's CSS transition duration
    }, HOLD_AFTER_OUTPUT);
    return () => clearTimeout(holdTimer);
  }, [showOutput, onComplete]);

  return (
    <div className={`terminal-boot ${exiting ? 'is-exiting' : ''}`}>
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
    </div>
  );
}