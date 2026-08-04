import { useEffect } from 'react';
import { useHoverTapSound } from '../hooks/useHoverTapSound';

const INTERACTIVE_SELECTOR = 'button, a, .toolstack-key';

export default function GlobalInteractionSound() {
  const playTap = useHoverTapSound();

  useEffect(() => {
    let lastHovered = null;

    const handleMouseOver = (e) => {
      const target = e.target.closest(INTERACTIVE_SELECTOR);
      if (!target || target === lastHovered) return; // don't re-fire while moving within the same element's children
      lastHovered = target;
      playTap();
    };

    const handleMouseOut = (e) => {
      const target = e.target.closest(INTERACTIVE_SELECTOR);
      const related = e.relatedTarget && e.relatedTarget.closest
        ? e.relatedTarget.closest(INTERACTIVE_SELECTOR)
        : null;
      if (target && target !== related) lastHovered = null;
    };

    const handleClick = (e) => {
      const target = e.target.closest(INTERACTIVE_SELECTOR);
      if (target) playTap();
    };

    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOut);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
      window.removeEventListener('click', handleClick);
    };
  }, [playTap]);

  return null; // renders nothing — purely a behavior component
}