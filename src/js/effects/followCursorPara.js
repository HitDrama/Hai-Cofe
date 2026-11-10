import { registerRafTask } from '../core/raf.js';
import { scrollState } from '../core/scroll.js';

/**
 * Inverse horizontal parallax ribbon movement following cursor offset from viewport center.
 */
export function followCursorPara(obj, section) {
  if (!obj || !section) return () => {};

  let targetX = 0;
  let valX = 0;
  const lerpFactor = 0.1;

  const stopRaf = registerRafTask(section, () => {
    if (scrollState.winW <= 768) return;
    valX += (targetX - valX) * lerpFactor;
    obj.style.transform = `translate3d(${valX.toFixed(1)}px, 0, 0)`;
  });

  const onMove = (e) => {
    if (scrollState.winW <= 768) return;
    targetX = (window.innerWidth / 2 - e.clientX) / 10;
  };

  const onLeave = () => {
    targetX = 0;
  };

  section.addEventListener('mousemove', onMove);
  section.addEventListener('mouseleave', onLeave);

  return () => {
    stopRaf();
    section.removeEventListener('mousemove', onMove);
    section.removeEventListener('mouseleave', onLeave);
  };
}

