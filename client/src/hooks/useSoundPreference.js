import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'rehan.dev:sound';

// Sound starts OFF. Browsers suspend the AudioContext until the first user
// gesture anyway, so an on-by-default beep fires inconsistently, and an
// unrequested tone on every hover is the fastest way to lose a visitor.
// Flip this to true to restore the old behaviour.
const DEFAULT_ENABLED = false;

function read() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === null ? DEFAULT_ENABLED : stored === 'on';
  } catch {
    return DEFAULT_ENABLED;
  }
}

// Module-level so every consumer sees the same value without a provider.
let enabled = read();
const listeners = new Set();

export function isSoundEnabled() {
  return enabled;
}

export function useSoundPreference() {
  const [value, setValue] = useState(enabled);

  useEffect(() => {
    listeners.add(setValue);
    return () => listeners.delete(setValue);
  }, []);

  const toggle = useCallback(() => {
    enabled = !enabled;
    try {
      localStorage.setItem(STORAGE_KEY, enabled ? 'on' : 'off');
    } catch {
      // Private mode / blocked storage: the toggle still works for this visit.
    }
    listeners.forEach((fn) => fn(enabled));
  }, []);

  return [value, toggle];
}
