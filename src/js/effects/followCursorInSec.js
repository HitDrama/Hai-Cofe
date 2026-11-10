import { registerRafTask } from '../core/raf.js';
import { scrollState } from '../core/scroll.js';

/**
 * Smoothly lerps `obj` toward the cursor coordinates relative to `section` (lerp factor 0.1).
 */
export function followCursorInSec(obj, section) {
  if (!obj || !section) return () => {};

  let mouseIn = false;
  let rect = section.getBoundingClientRect();
  let centerX = rect.width / 2;
  let centerY = rect.height / 2;

  let targetX = centerX;
  let targetY = centerY;
  let valX = centerX;
  let valY = centerY;
  const lerpFactor = 0.1;

  obj.style.transform = `translate3d(${centerX}px, ${centerY}px, 0)`;

  const stopRaf = registerRafTask(section, () => {
    if (scrollState.winW <= 768) return;
    valX += (targetX - valX) * lerpFactor;
    valY += (targetY - valY) * lerpFactor;
    obj.style.transform = `translate3d(${valX.toFixed(1)}px, ${valY.toFixed(1)}px, 0)`;
  });

  const onEnter = () => {
    if (scrollState.winW <= 768) return;
    rect = section.getBoundingClientRect();
    centerX = rect.width / 2;
    centerY = rect.height / 2;
    mouseIn = true;
    section.classList.add('hover');
  };

  const onMove = (e) => {
    if (!mouseIn || scrollState.winW <= 768) return;
    const curRect = section.getBoundingClientRect();
    targetX = e.clientX - curRect.left;
    targetY = e.clientY - curRect.top;
  };

  const onLeave = () => {
    mouseIn = false;
    section.classList.remove('hover');
    targetX = centerX;
    targetY = centerY;
  };

  section.addEventListener('mouseenter', onEnter);
  section.addEventListener('mousemove', onMove);
  section.addEventListener('mouseleave', onLeave);

  return () => {
    stopRaf();
    section.removeEventListener('mouseenter', onEnter);
    section.removeEventListener('mousemove', onMove);
    section.removeEventListener('mouseleave', onLeave);
  };
}

