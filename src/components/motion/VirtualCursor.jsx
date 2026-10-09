import { useEffect } from 'react';
import { useMotion, MOTION_STATE } from '../../context/MotionContext.jsx';

/**
 * VirtualCursor - DOM-level cursor overlay
 * Uses an imperative div for best performance (avoids React re-renders on every cursor move)
 */
export function VirtualCursor() {
  const { cursorX, cursorY, cursorActive, motionState } = useMotion();

  useEffect(() => {
    let el = document.getElementById('motion-cursor');
    if (!el) {
      el = document.createElement('div');
      el.id = 'motion-cursor';
      document.body.appendChild(el);
    }
    return () => {
      const cursor = document.getElementById('motion-cursor');
      if (cursor) cursor.remove();
    };
  }, []);

  useEffect(() => {
    const el = document.getElementById('motion-cursor');
    if (!el) return;

    const isVisible = cursorActive && motionState === MOTION_STATE.ACTIVE;
    el.classList.toggle('active', isVisible);

    if (isVisible) {
      el.style.left = `${cursorX}px`;
      el.style.top = `${cursorY}px`;
    }
  }, [cursorX, cursorY, cursorActive, motionState]);

  return null;
}
